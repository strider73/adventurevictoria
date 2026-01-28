#!/usr/bin/env python3
"""
YouTube Video Finder for Korea Adventure Sites

Finds relevant YouTube videos for Korean adventure sites (hiking, camping,
fishing, valleys, national parks) and writes them to the local
korea-community-videos.json file.

Usage:
    python scripts/korea-video-finder.py --api-key YOUR_KEY --limit 10 --dry-run
    python scripts/korea-video-finder.py --api-key YOUR_KEY --limit 50
"""

import argparse
import json
import os
import time
from datetime import date
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_DIR, "data")
SITES_FILE = os.path.join(DATA_DIR, "korea-adventure-sites.json")
EXISTING_VIDEOS_FILE = os.path.join(DATA_DIR, "korea-community-videos.json")

# Category-specific Korean search terms
CATEGORY_SEARCH_TERMS = {
    "Mountain": ["등산", "하이킹", "산행"],
    "National Park": ["국립공원", "등산", "트레킹"],
    "Hiking": ["등산", "하이킹", "트레킹"],
    "Camping": ["캠핑", "야영", "캠핑장"],
    "Glamping": ["글램핑", "캠핑"],
    "Fishing": ["낚시", "낚시터", "fishing"],
    "Valley": ["계곡", "물놀이", "계곡캠핑"],
    "Beach": ["해변", "바다", "해수욕장"],
    "Temple": ["사찰", "템플스테이", "절"],
    "Nature": ["자연", "여행", "힐링"],
    "Urban": ["도심", "서울여행", "도보여행"],
    "Cultural": ["문화", "역사", "관광"],
    "Garden": ["정원", "수목원", "공원"],
    "Waterfall": ["폭포", "계곡"],
    "Trail": ["둘레길", "트레킹", "걷기여행"],
    "Scenic Drive": ["드라이브", "드라이브코스"],
}


def get_output_file():
    """Get today's output file path."""
    today = date.today().isoformat()
    return os.path.join(DATA_DIR, f"korea-community-videos-{today}.json")


def load_sites():
    """Load adventure sites from local JSON file."""
    with open(SITES_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["adventureSites"]


def load_existing_video_ids():
    """Collect all site IDs that already have videos (from existing file + all daily files)."""
    existing_ids = set()

    # From the main korea-community-videos.json
    if os.path.exists(EXISTING_VIDEOS_FILE):
        with open(EXISTING_VIDEOS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        for entry in data.get("communityVideos", []):
            existing_ids.add(entry["campingSiteId"])

    # From any previous daily files
    for filename in os.listdir(DATA_DIR):
        if filename.startswith("korea-community-videos-") and filename.endswith(".json"):
            filepath = os.path.join(DATA_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
            for entry in data.get("communityVideos", []):
                existing_ids.add(entry["campingSiteId"])

    return existing_ids


def load_today_file():
    """Load today's output file if it exists (for appending within same day)."""
    output_file = get_output_file()
    if os.path.exists(output_file):
        with open(output_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"communityVideos": [], "metadata": {"date": date.today().isoformat(), "source": "YouTube Data API"}}


def save_today_file(data):
    """Save results to today's dated file."""
    output_file = get_output_file()
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    return output_file


def search_youtube(youtube, query, max_results=10, region_code="KR", relevance_language="ko"):
    """Search YouTube and return filtered video results."""
    try:
        response = youtube.search().list(
            q=query,
            part="snippet",
            type="video",
            maxResults=max_results,
            relevanceLanguage=relevance_language,
            regionCode=region_code,
            videoDuration="medium",  # Filters out shorts (<4min) and very long (>20min)
        ).execute()
    except HttpError as e:
        if e.resp.status == 403:
            print(f"  [ERROR] 403: {e.error_details}")
            return None  # Signal quota exhaustion
        raise

    # Filter to only video results (exclude channels/playlists that don't have videoId)
    video_ids = [item["id"]["videoId"] for item in response.get("items", []) if "videoId" in item.get("id", {})]
    if not video_ids:
        return []

    # Get video statistics to filter by view count
    try:
        stats_response = youtube.videos().list(
            part="statistics",
            id=",".join(video_ids),
        ).execute()
    except HttpError as e:
        if e.resp.status == 403:
            print("  [ERROR] YouTube API quota exceeded. Stopping.")
            return None
        raise

    stats_map = {}
    for item in stats_response.get("items", []):
        view_count = int(item["statistics"].get("viewCount", 0))
        stats_map[item["id"]] = view_count

    results = []
    for item in response.get("items", []):
        # Skip non-video results (channels/playlists)
        if "videoId" not in item.get("id", {}):
            continue
        video_id = item["id"]["videoId"]
        views = stats_map.get(video_id, 0)

        # Skip videos with very low views (lower threshold for Korean content)
        if views < 50:
            continue

        results.append({
            "videoId": video_id,
            "title": item["snippet"]["title"],
            "channelName": item["snippet"]["channelTitle"],
            "source": "youtube",
            "views": views,
        })

    # Sort by views descending, take top 5
    results.sort(key=lambda x: x["views"], reverse=True)
    return results[:5]


def find_videos_for_site(youtube, site, excluded_channel="OutboundScape"):
    """Search YouTube for videos related to an adventure site."""
    title = site["title"]
    location = site.get("location", "")
    category = site.get("category", "")

    # Get category-specific search terms
    search_terms = CATEGORY_SEARCH_TERMS.get(category, ["여행", "관광"])

    all_results = []

    # Primary search: title + first Korean term
    primary_query = f"{title} {search_terms[0]}"
    results = search_youtube(youtube, primary_query)

    if results is None:
        return None  # Quota exhausted

    # Filter out the original channel (OutboundScape)
    results = [r for r in results if excluded_channel.lower() not in r["channelName"].lower()]
    all_results.extend(results)

    # If not enough results, try with location
    if len(all_results) < 3 and location:
        fallback_query = f"{location} {title} {search_terms[0]}"
        fallback_results = search_youtube(youtube, fallback_query)
        if fallback_results is None:
            return None  # Quota exhausted

        # Filter and merge
        fallback_results = [r for r in fallback_results if excluded_channel.lower() not in r["channelName"].lower()]
        existing_ids = {r["videoId"] for r in all_results}
        for r in fallback_results:
            if r["videoId"] not in existing_ids:
                all_results.append(r)

    # If still not enough, try English search
    if len(all_results) < 3:
        english_query = f"{title} {location} travel vlog"
        english_results = search_youtube(youtube, english_query, region_code="KR", relevance_language="en")
        if english_results is None:
            return None  # Quota exhausted

        # Filter and merge
        english_results = [r for r in english_results if excluded_channel.lower() not in r["channelName"].lower()]
        existing_ids = {r["videoId"] for r in all_results}
        for r in english_results:
            if r["videoId"] not in existing_ids:
                all_results.append(r)

    # Sort by views and take top 5
    all_results.sort(key=lambda x: x["views"], reverse=True)
    return all_results[:5]


def main():
    parser = argparse.ArgumentParser(description="Find YouTube videos for Korea adventure sites")
    parser.add_argument("--api-key", required=True, help="YouTube Data API key")
    parser.add_argument("--limit", type=int, default=50, help="Max sites to process per run (default: 50)")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing to file")
    parser.add_argument("--skip-with-video", action="store_true", default=True,
                        help="Skip sites that already have an OutboundScape video (default: True)")
    args = parser.parse_args()

    # Load local data
    print("Loading local data files...")
    sites = load_sites()
    existing_ids = load_existing_video_ids()
    today_data = load_today_file()
    print(f"  Loaded {len(sites)} adventure sites")
    print(f"  {len(existing_ids)} sites already have community videos")
    print(f"  Today's file has {len(today_data['communityVideos'])} entries so far")

    # Find sites without community videos
    sites_without = [s for s in sites if s["id"] not in existing_ids]
    print(f"  {len(sites_without)} sites still need community videos.\n")

    if not sites_without:
        print("All sites already have community videos. Nothing to do.")
        return

    sites_to_process = sites_without[:args.limit]
    print(f"Processing {len(sites_to_process)} sites (limit: {args.limit})...")

    if args.dry_run:
        print("[DRY RUN] No data will be written to file.\n")

    # Build YouTube API client
    youtube = build("youtube", "v3", developerKey=args.api_key)

    # Process each site
    new_entries = []
    not_enough = []
    processed = 0

    for i, site in enumerate(sites_to_process, 1):
        site_id = site["id"]
        title = site["title"]
        location = site.get("location", "")
        category = site.get("category", "")

        # Rate limit: wait 2 seconds between sites
        if i > 1:
            time.sleep(2)

        print(f"[{i}/{len(sites_to_process)}] {title} ({location}) [{category}]")
        processed = i

        videos = find_videos_for_site(youtube, site)

        if videos is None:
            print("\nQuota exhausted. Stopping early.")
            break

        if not videos:
            print(f"  No suitable videos found.")
            not_enough.append({"siteId": site_id, "title": title, "count": 0})
            continue

        status = "OK" if len(videos) >= 5 else "NOT ENOUGH"
        print(f"  Found {len(videos)} videos: [{status}]")
        for v in videos:
            print(f"    - {v['title'][:50]}{'...' if len(v['title']) > 50 else ''} ({v['views']:,} views) [{v['videoId']}]")

        new_entries.append({
            "campingSiteId": site_id,
            "locationName": f"{title}, {location}",
            "videos": videos,
        })

        if len(videos) < 5:
            not_enough.append({"siteId": site_id, "title": title, "count": len(videos)})

    # Write results to today's file
    output_file = None
    if new_entries and not args.dry_run:
        today_data["communityVideos"].extend(new_entries)
        today_data["metadata"]["totalLocations"] = len(today_data["communityVideos"])
        output_file = save_today_file(today_data)

    # Write "not enough" list
    not_enough_file = os.path.join(DATA_DIR, "korea-sites-need-more-videos.json")
    if not_enough:
        # Load existing list and merge
        existing_not_enough = []
        if os.path.exists(not_enough_file):
            with open(not_enough_file, "r", encoding="utf-8") as f:
                existing_not_enough = json.load(f)
        existing_site_ids = set(e["siteId"] for e in existing_not_enough)
        for entry in not_enough:
            if entry["siteId"] not in existing_site_ids:
                existing_not_enough.append(entry)
        if not args.dry_run:
            with open(not_enough_file, "w", encoding="utf-8") as f:
                json.dump(existing_not_enough, f, indent=2, ensure_ascii=False)

    # Summary
    total_videos = sum(len(e["videos"]) for e in new_entries)
    print(f"\n{'=' * 50}")
    print(f"Summary:")
    print(f"  Sites processed: {processed}")
    print(f"  Sites with 5+ videos: {len(new_entries) - len([n for n in not_enough if n['count'] > 0])}")
    print(f"  Sites with <5 videos (not enough): {len([n for n in not_enough if n['count'] > 0])}")
    print(f"  Sites with 0 videos: {len([n for n in not_enough if n['count'] == 0])}")
    print(f"  Total videos found: {total_videos}")
    if args.dry_run:
        print(f"  [DRY RUN] No data was written.")
    elif output_file:
        print(f"  Written to: {output_file}")
        print(f"  Total entries in today's file: {len(today_data['communityVideos'])}")
        print(f"  'Not enough' list: {not_enough_file}")


if __name__ == "__main__":
    main()

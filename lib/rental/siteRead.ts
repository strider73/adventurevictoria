// Verbatim query from Rental-Watch/rental-search-tools/db/site_read.sql.
export const SITE_READ_SQL = String.raw`WITH client AS (
    SELECT *
    FROM rental_clients
    WHERE id = 1
), stored_photos AS (
    SELECT
        house_key,
        split_part(min(stored_path), '/', 2) AS photo_folder,
        jsonb_agg(to_jsonb(regexp_replace(stored_path, '^.*/', '')) ORDER BY position) AS photos
    FROM rental_photos
    WHERE stored_path IS NOT NULL
    GROUP BY house_key
), watch_photos AS (
    SELECT
        house_key,
        jsonb_agg(to_jsonb(url) ORDER BY position) AS photos
    FROM rental_photos
    WHERE stored_path IS NULL AND url IS NOT NULL
    GROUP BY house_key
), inspection_times AS (
    SELECT
        house_key,
        jsonb_agg(to_jsonb(to_char(starts_at, 'YYYY-MM-DD"T"HH24:MI')) ORDER BY starts_at) AS inspections
    FROM rental_inspections
    GROUP BY house_key
), history_by_house AS (
    SELECT
        house_key,
        jsonb_agg(
            jsonb_build_object(
                'date', to_char(event_date, 'YYYY-MM-DD'),
                'rent_pw', rent_pw,
                'event', event
            ) ORDER BY event_date, id
        ) AS history
    FROM rental_rent_history
    GROUP BY house_key
), current_target AS (
    SELECT jsonb_build_object(
        'type', COALESCE(feature_type, 'Feature'),
        'properties', COALESCE(properties, '{}'::jsonb),
        'geometry', geometry
    ) AS feature
    FROM rental_target_areas
    WHERE client_id = 1 AND is_current
    ORDER BY id DESC
    LIMIT 1
), source_rows AS (
    SELECT
        h.*,
        ch.area,
        ch.edge_m,
        ch.stars,
        ch.inspected_on,
        ch.living,
        ch.living_score,
        ch.study_4_desks,
        ch.backyard,
        ch.yard_size,
        ch.red_flags,
        ch.confidence,
        ch.note,
        ch.review_source,
        ch.reviewed_at,
        ch.review_attempts,
        ch.rank,
        ch.in_my_list,
        ch.reviewed_by,
        ch.rating_updated_at,
        ch.days_listed,
        ch.inspection_note,
        ch.legacy_score,
        ch.listing_living,
        ch.listing_backyard,
        ch.listing_note,
        ch.review_note,
        sp.photo_folder,
        COALESCE(sp.photos, '[]'::jsonb) AS ranked_photos,
        COALESCE(wp.photos, '[]'::jsonb) AS later_photos,
        COALESCE(it.inspections, '[]'::jsonb) AS inspections,
        COALESCE(hh.history, '[]'::jsonb) AS house_history,
        CASE
            WHEN ch.area = 'outside' OR h.status = 'unconfirmed' THEN 'out_of_area'
            ELSE h.status
        END AS watch_status,
        CASE
            WHEN h.sites[1] = 'domain' THEN COALESCE(h.domain_url, h.rea_url)
            WHEN h.sites[1] = 'realestate.com.au' THEN COALESCE(h.rea_url, h.domain_url)
            ELSE COALESCE(h.domain_url, h.rea_url)
        END AS source_url
    FROM rental_houses h
    JOIN rental_client_houses ch ON ch.house_key = h.key AND ch.client_id = 1
    LEFT JOIN stored_photos sp ON sp.house_key = h.key
    LEFT JOIN watch_photos wp ON wp.house_key = h.key
    LEFT JOIN inspection_times it ON it.house_key = h.key
    LEFT JOIN history_by_house hh ON hh.house_key = h.key
), ranked_rows AS (
    SELECT jsonb_agg(
        jsonb_build_object(
            'rank', rank,
            'address', address,
            'rent_pw', rent_pw,
            'bed_bath_car', concat_ws('/', bed, bath, car),
            'drive_km', drive_km,
            'drive_min', drive_min,
            'days_listed', days_listed,
            'listed_date', to_char(listed_date, 'YYYY-MM-DD'),
            'inspection', COALESCE(inspection_note, ''),
            'living_areas', listing_living,
            'living_score', living_score,
            'yard_size', yard_size,
            'backyard', COALESCE(listing_backyard, ''),
            'notes', COALESCE(listing_note, ''),
            'score', legacy_score,
            'domain_url', domain_url,
            'rea_url', rea_url,
            'rea_rent_pw', rea_rent_pw,
            'price_differs', price_differs,
            'sites', to_jsonb(COALESCE(sites, ARRAY[]::text[])),
            'photo_folder', photo_folder,
            'photos', ranked_photos,
            'agency', CASE
                WHEN agency_name IS NULL AND COALESCE(array_length(agency_phones, 1), 0) = 0 THEN NULL
                ELSE jsonb_build_object(
                    'name', agency_name,
                    'phones', to_jsonb(COALESCE(agency_phones, ARRAY[]::text[]))
                )
            END,
            'rent_history', house_history
        ) ORDER BY rank
    ) AS rows
    FROM source_rows
    WHERE rank IS NOT NULL
), watch_rows AS (
    SELECT jsonb_agg(
        jsonb_build_object(
            'key', key,
            'address', address,
            'rent_pw', rent_pw,
            'status', watch_status,
            'in_my_list', in_my_list,
            'rank', COALESCE(rank, 0),
            'sites', array_to_string(sites, ','),
            'url', source_url,
            'first_seen', to_char(first_seen, 'YYYY-MM-DD'),
            'last_seen', to_char(last_seen, 'YYYY-MM-DD'),
            'last_change', COALESCE(last_change, ''),
            'lat', lat,
            'lon', lon,
            'area', area,
            'edge_m', edge_m,
            'geo', located_by,
            'bed', bed,
            'bath', bath,
            'car', car,
            'inspections', inspections,
            'flags', to_jsonb(COALESCE(flags, ARRAY[]::text[])),
            'photos', later_photos,
            'register', CASE
                WHEN register_state IS NULL
                 AND register_system IS NULL
                 AND register_quote IS NULL
                 AND register_source IS NULL
                 AND register_checked IS NULL THEN NULL
                ELSE jsonb_build_object(
                    'state', register_state,
                    'system', register_system,
                    'quote', register_quote,
                    'source', register_source,
                    'checked', to_char(register_checked, 'YYYY-MM-DD')
                )
            END,
            'auto_review', CASE WHEN review_source = 'auto' THEN jsonb_build_object(
                'living', living,
                'study_4_desks', study_4_desks,
                'backyard', backyard,
                'red_flags', to_jsonb(COALESCE(red_flags, ARRAY[]::text[])),
                'confidence', confidence,
                'note', COALESCE(review_note, note, ''),
                'source', reviewed_by,
                'reviewed_at', to_char(reviewed_at, 'YYYY-MM-DD HH24:MI'),
                'attempts', review_attempts
            ) ELSE NULL END
        ) ORDER BY rank NULLS LAST, key
    ) AS rows
    FROM source_rows
), human_reviews AS (
    SELECT COALESCE(
        jsonb_object_agg(
            key,
            jsonb_build_object(
                'living', living,
                'study_4_desks', study_4_desks,
                'backyard', backyard,
                'red_flags', to_jsonb(COALESCE(red_flags, ARRAY[]::text[])),
                'reviewed_at', to_char(reviewed_at, 'YYYY-MM-DD'),
                'reviewed_by', reviewed_by,
                'note', COALESCE(review_note, '')
            )
        ),
        '{}'::jsonb
    ) AS reviews
    FROM source_rows
    WHERE review_source = 'human'
), watch_history AS (
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'key', house_key,
                'date', to_char(event_date, 'YYYY-MM-DD'),
                'rent_pw', rent_pw,
                'event', event
            ) ORDER BY id
        ),
        '[]'::jsonb
    ) AS rows
    FROM rental_rent_history
), watch_runs AS (
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'date', to_char(run_at, 'YYYY-MM-DD HH24:MI'),
                'changed', COALESCE(changed, 0),
                'removed', COALESCE(removed, 0),
                'added', COALESCE(added, 0),
                'added_outside', COALESCE(added_outside, 0),
                'out_rows', COALESCE(out_rows, 0),
                'all_pages_ok', COALESCE(all_pages_ok, false),
                'report', COALESCE(report, '')
            ) ORDER BY id
        ),
        '[]'::jsonb
    ) AS rows
    FROM rental_runs
), ratings AS (
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'key', house_key,
                'stars', COALESCE(stars, 0),
                'inspected', COALESCE(to_char(inspected_on, 'YYYY-MM-DD'), ''),
                'updated', to_char(rating_updated_at AT TIME ZONE 'Australia/Melbourne', 'YYYY-MM-DD HH24:MI')
            ) ORDER BY rating_updated_at, house_key
        ),
        '[]'::jsonb
    ) AS rows
    FROM rental_client_houses
    WHERE client_id = 1 AND rating_updated_at IS NOT NULL
), listings AS (
    SELECT jsonb_build_object(
        'updated', c.search_conditions->>'snapshot_updated',
        'home', c.home_address,
        'current_rent_pw', c.current_rent_pw,
        'search', c.search_conditions->'search',
        'family_needs', c.search_conditions->'family_needs',
        'backyard_rating_key', c.search_conditions->'backyard_rating_key',
        'priority_area_1', c.search_conditions->'priority_area_1',
        'counts', c.search_conditions->'source_counts',
        'ranked', COALESCE((SELECT rows FROM ranked_rows), '[]'::jsonb),
        'target_area', (SELECT feature FROM current_target),
        'watch', jsonb_build_object(
            -- The latest run decides updated and last_report (the loaded snapshot values are only a fallback)
            'updated', COALESCE((SELECT to_char(run_at, 'YYYY-MM-DD HH24:MI') FROM rental_runs ORDER BY run_at DESC, id DESC LIMIT 1), c.search_conditions->>'watch_updated'),
            'note', c.search_conditions->>'watch_note',
            'last_report', COALESCE((SELECT report FROM rental_runs ORDER BY run_at DESC, id DESC LIMIT 1), c.search_conditions->>'last_report'),
            'rows', COALESCE((SELECT rows FROM watch_rows), '[]'::jsonb),
            'history', (SELECT rows FROM watch_history),
            'runs', (SELECT rows FROM watch_runs),
            'outside', '{}'::jsonb
        ),
        'conditions', jsonb_build_object(
            'best_match', c.best_match,
            'updated', c.search_conditions->>'conditions_updated'
        ),
        'review', (SELECT reviews FROM human_reviews)
    ) AS data
    FROM client c
)
SELECT jsonb_build_object(
    'listings', (SELECT data FROM listings),
    'ratings', (SELECT rows FROM ratings)
) AS data;`;

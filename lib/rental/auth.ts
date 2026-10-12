import { createHash, timingSafeEqual } from "node:crypto";

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function rentalKeyMatches(candidate: string | null, expected: string | undefined): boolean {
  const matches = timingSafeEqual(digest(candidate || ""), digest(expected || ""));
  return Boolean(candidate && expected) && matches;
}

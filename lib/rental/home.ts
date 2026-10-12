export type RentalHome = [number, number] | null;

export function rentalHomeFromEnv(
  latitude = process.env.RENTAL_HOME_LAT,
  longitude = process.env.RENTAL_HOME_LON,
): RentalHome {
  if (!latitude || !longitude) return null;
  const lat = Number(latitude);
  const lon = Number(longitude);
  return Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null;
}

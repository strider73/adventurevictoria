import { Pool } from "pg";

declare global {
  var _rentalPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.RENTAL_DATABASE_URL;
  if (!connectionString) {
    throw new Error("RENTAL_DATABASE_URL environment variable is not defined");
  }
  return new Pool({ connectionString, max: 5, ssl: false });
}

export function getRentalPool(): Pool {
  if (!global._rentalPool) {
    global._rentalPool = createPool();
  }
  return global._rentalPool;
}

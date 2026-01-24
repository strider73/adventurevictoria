import { MongoClient, Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  if (process.env.NODE_ENV === "development") {
    // In development, use a global variable to preserve the client across HMR
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }

  // In production, create a new client
  return new MongoClient(uri).connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise();
  return client.db("adventuretube");
}

export default getClientPromise;

import { config } from 'dotenv';
import { MongoClient, Db } from 'mongodb';

config();

interface ICachedDb {
  db: Db;
}

let cachedDb: ICachedDb | null = null;
const MONGO_URI = process.env.MONGO_URI || '';

async function connectToDatabase(databaseUrl = MONGO_URI): Promise<Db> {
  console.log('=> connect to database');

  if (cachedDb) {
    console.log('=> using cached database instance');
    return cachedDb.db;
  }

  const client = await MongoClient.connect(databaseUrl);
  cachedDb = {
    db: client.db('test')
  };
  return cachedDb.db;
}

export default connectToDatabase;

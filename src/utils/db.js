import { MongoClient } from 'mongodb';
import { mongoDBUri, mongoDBName } from '../configs/index.js';

const mongoClient = new MongoClient(mongoDBUri);

let client;
let db;

export const connectMongoDB = async () => {
  if (!client) {
    try {
      client = await mongoClient.connect();
      console.log('MongoDB Connection established');
      return db;
    } catch (err) {
      console.log(err);
      console.log(`Retrying to reconnect...`);
      connectMongoDB();
    }
  }
};

export const getDB = async () => {
  if (!client) {
    client = await connectMongoDB();
  }

  if (!db) {
    db = client.db(mongoDBName);
  }

  return db;
};

export const closeMongoDB = async () => mongoClient.close();

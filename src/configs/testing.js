import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoDBName = process.env.MONGO_DB_NAME || 'admin';
const mongoPort = process.env.MONGO_PORT || 27017;

const mongoServer = await MongoMemoryServer.create({
  instance: {
    dbName: mongoDBName,
    port: mongoPort,
  },
});

const mongoDBUri = mongoServer.getUri();

export const envConfig = {
  mongoDBName,
  mongoDBUri,
  mongoPort,
};

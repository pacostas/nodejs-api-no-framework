const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_URL;
const mongoPort = process.env.MONGO_PORT;
const mongoDBName = process.env.MONGO_DB_NAME;
const mongoDBUri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}`;

export const envConfig = {
  mongoUser,
  mongoPassword,
  mongoHost,
  mongoPort,
  mongoDBName,
  mongoDBUri,
};

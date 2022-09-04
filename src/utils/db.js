import { MongoClient } from 'mongodb';

const mongoUser = process.env.MONGO_USER || 'root';
const mongoPassword = process.env.MONGO_PASSWORD || 'password';
const mongoHost = process.env.MONGO_URL || '127.0.0.1';
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoDBName = process.env.MONGO_DB_NAME || 'todoList';

const mongoDBUri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}`;
const mongoClient = new MongoClient(mongoDBUri);

export let db;
export let todoCollection;

async function run() {
  try {
    await mongoClient.connect();
    db = mongoClient.db(mongoDBName);
    todoCollection = db.collection('todo');
    console.log('Connected successfully to database');
  } catch (err) {
    const retrySeconds = 3000;
    console.log('Oh, there is an error connecting to database');
    console.log(err);
    console.log(`Retrying reconnecting in ${retrySeconds} seconds.`);
    setTimeout(function () {
      run();
    }, retrySeconds * 1000);
  }
}

run();

import { createServer } from 'http';
import { MongoClient, ObjectId } from 'mongodb';

const PORT = process.env.PORT || 8080;
const mongoUser = process.env.MONGO_USER || 'root';
const mongoPassword = process.env.MONGO_PASSWORD || 'password';
const mongoHost = process.env.MONGO_URL || '127.0.0.1';
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoDBName = process.env.MONGO_DB_NAME || 'todoList';

const mongoDBUri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}`;

const mongoClient = new MongoClient(mongoDBUri);

let db;

async function run() {
  try {
    await mongoClient.connect();
    db = mongoClient.db(mongoDBName);
    console.log('Connected successfully to database');
  } catch (err) {
    const retrySeconds = 3000;
    console.log('Oh, there is an error in connecting to database');
    console.log(err);
    console.log(`Retrying in reconnecting in ${retrySeconds} seconds.`);
    setTimeout(function () {
      run();
    }, retrySeconds * 1000);
  }
}

run();

const server = createServer((req, res) => {
  if (req.url.match(/\/api\/todo\/\w+/) && req.method === 'GET') {
    const id = req.url
      .split('/')
      .filter(pathParams => pathParams !== '/')
      .pop();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: {
          id: id,
          title: 'This is the title',
          content: 'This is the content',
          createdBy: 'Bob',
          dateCreated: '2022-01-01T14:48:00.000Z',
        },
      }),
    );
  } else if (req.url.match(/\/api\/todo/) && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: [
          {
            id: 'hello',
            title: 'This is the title',
            content: 'This is the content',
            createdBy: 'Bob',
            dateCreated: '2022-01-01T14:48:00.000Z',
          },
        ],
      }),
    );
  } else if (req.url.match(/\/api\/todo/) && req.method === 'POST') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      const doc = JSON.parse(data);
      const todoCollection = db.collection('todo');
      todoCollection.insertOne(doc, function (error, result) {
        if (!error) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ _id: result.insertedId }));
        } else {
          console.log(`An error occurred: ${error}`);
          res.statusCode = 400;
          res.end();
        }
      });
    });
  } else if (req.url.match(/\/api\/todo\/\w+/) && req.method === 'PUT') {
    const _id = req.url
      .split('/')
      .filter(pathParams => pathParams !== '/')
      .pop();

    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      const todoCollection = db.collection('todo');
      const filter = {
        _id: ObjectId(_id),
      };

      const doc = JSON.parse(data);
      const updateDoc = {
        $set: doc,
      };

      todoCollection.updateOne(filter, updateDoc, function (error, result) {
        if (!error) {
          if (result.matchedCount === 1) {
            res.statusCode = 200;
          } else {
            res.statusCode = 400;
          }
          res.end();
        } else {
          console.log(`An error occurred: ${error}`);
          res.statusCode = 400;
          res.end();
        }
      });
    });
  } else if (req.url.match(/\/api\/todo\/\w+/) && req.method === 'DELETE') {
    const _id = req.url
      .split('/')
      .filter(pathParams => pathParams !== '/')
      .pop();

    const todoCollection = db.collection('todo');

    const doc = { _id: ObjectId(_id) };

    todoCollection.deleteOne(doc, function (error, result) {
      if (!error) {
        if (result.deletedCount === 1) {
          res.statusCode = 200;
        } else {
          res.statusCode = 400;
        }
        res.end();
      } else {
        console.log(`An error occurred: ${error}`);
        res.statusCode = 400;
        res.end();
      }
    });
  } else if (req.url.match(/\/health\//) && req.method === 'GET') {
    res.statusCode = 200;
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

server.listen(PORT, () => console.log(`Server running on port:  ${PORT}`));

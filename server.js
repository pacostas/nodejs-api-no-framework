import { createServer } from 'http';
import { MongoClient } from 'mongodb';

const PORT = process.env.PORT || 3000;
const mongoUser = process.env.MONGO_USER || 'root';
const mongoPassword = process.env.MONGO_PASSWORD || 'password';
const mongoHost = process.env.MONGO_URL || '127.0.0.1';
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoDBName = process.env.MONGO_DB_NAME || 'myAwesomeBlog';

const mongoDBUri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}`;

const mongoClient = new MongoClient(mongoDBUri);

async function run() {
  try {
    // Establish and verify connection
    await mongoClient.connect();
    await mongoClient.db(mongoDBName).command({ ping: 1 });
    console.log('Connected successfully to server');
  } catch (err) {
    console.log(err);
    console.log('Trying to reconnect...');
    await run();
  }
}

run();

const server = createServer((req, res) => {
  if (req.url.match(/\/api\/post\/\w+/) && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: {
          title: 'This is the title',
          content: 'This is the content',
          createdBy: 'Bob',
          dateCreated: '2022-01-01T14:48:00.000Z',
        },
      }),
    );
  } else if (req.url.match(/\/api\/post/) && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: [
          {
            title: 'This is the title',
            content: 'This is the content',
            createdBy: 'Bob',
            dateCreated: '2022-01-01T14:48:00.000Z',
          },
        ],
      }),
    );
  } else if (req.url.match(/\/api\/post/) && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: {
          title: 'This is the title',
          content: 'This is the content',
          createdBy: 'Bob',
          dateCreated: '2022-01-01T14:48:00.000Z',
        },
      }),
    );
  } else if (req.url.match(/\/api\/post\/\w+/) && req.method === 'PUT') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: {
          title: 'This is the title',
          content: 'This is the content',
          createdBy: 'Bob',
          dateCreated: '2022-01-01T14:48:00.000Z',
        },
      }),
    );
  } else if (req.url.match(/\/api\/post\/\w+/) && req.method === 'DELETE') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: {
          title: 'This is the title',
          content: 'This is the content',
          createdBy: 'Bob',
          dateCreated: '2022-01-01T14:48:00.000Z',
        },
      }),
    );
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

server.listen(PORT, () => console.log(`Server running on port:  ${PORT}`));

import test from 'node:test';
import assert from 'assert';

// import {server} from '../server.js';

console.log('hiiii');
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = await MongoMemoryServer.create({
  instance: {
    dbName: 'test-db',
  },
});

test('get one by id', t => {
  t.test('synchronous passing test', t => {
    const uri = mongod.getUri();
    assert.strictEqual(1, 1);
  });
});

await mongod.stop();

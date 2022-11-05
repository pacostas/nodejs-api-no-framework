import { describe, it, before, after } from 'node:test';

import { closeMongoDB, getDB } from '../utils/db.js';

import assert from 'assert';

import { start, close } from '../server.js';

import { serverPort } from './../configs/index.js';


await start();

const serverBaseUrl = `http://localhost:${serverPort}`;

describe('CRUD Operations', async () => {
  let db;
  let todoCollection;
  before(async () => {
    db = getDB();
    todoCollection = db.collection('todo');
    await todoCollection.deleteMany();
  });

  describe('getOne', async () => {
    it('Returns a todo doc', async () => {
      const todoItem = {
        title: 'Toothpaste',
        content: 'Buy toothpaste.',
      };
      const { insertedId } = await todoCollection.insertOne(todoItem);
      const response = await fetch(`${serverBaseUrl}/api/todo/${insertedId}`);
      const { data: responseData } = await response.json();
      assert.strictEqual(response.status, 200);
      assert.strictEqual(responseData._id, insertedId.toString());
    });
  });


  after(async () => {
    await closeMongoDB();
    close();
  });
});


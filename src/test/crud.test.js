import { describe, it, before, after } from 'node:test';

import { closeMongoDB, getDB } from '../utils/db.js';

import assert from 'assert';

import { start, close } from '../server.js';

import { serverPort } from './../configs/index.js';

import { ObjectId } from 'mongodb';

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

  describe('createOne', () => {
    it('Creates a new todo doc', async () => {
      const todoDoc = {
        title: 'clean the bike .',
        content: 'dont forget to buy soap and chain oil.',
      };
      const response = await fetch(`${serverBaseUrl}/api/todo`, {
        body: JSON.stringify(todoDoc),
        method: 'POST',
      });

      const { _id } = await response.json();

      assert.strictEqual(response.status, 201);
      assert.ok(ObjectId.isValid(_id));
    });
  });

  describe('updateOne', async () => {
    it('Creates a new todo doc', async () => {
      const { insertedId } = await todoCollection.insertOne({
        title: 'Speaker',
        content: 'Buy a spesdasefseaker',
      });

      const updateDoc = {
        title: 'Speaker',
        content: 'Buy a speaker',
      };
      const response = await fetch(`${serverBaseUrl}/api/todo/${insertedId}`, {
        body: JSON.stringify(updateDoc),
        method: 'PUT',
      });

      assert.strictEqual(response.status, 200);
    });
  });

  after(async () => {
    await closeMongoDB();
    close();
  });
});


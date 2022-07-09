import { ObjectId } from 'mongodb';
import { todoCollection } from '../../utils/db.js';
import { Todo } from './todo.model.js';

export function getOne(req, res) {
  const _id = req.url
    .split('/')
    .filter(pathParams => pathParams !== '/')
    .pop();

  if (!ObjectId.isValid(_id)) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'wrong id format' }));
  }

  todoCollection.findOne({ _id: ObjectId(_id) }, {}, function (error, result) {
    if (!error) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: result }));
    } else {
      console.log(`An error occurred: ${error}`);
      res.statusCode = 500;
      res.end(JSON.stringify(result));
    }
  });
}

export function getAll(req, res) {
  const myCursor = todoCollection.find({});

  myCursor.toArray(function (error, result) {
    if (!error) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: result }));
    } else {
      console.log(`An error occurred: ${error}`);
      res.statusCode = 500;
      res.end();
    }
  });
}

export function createOne(req, res) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    const doc = JSON.parse(data);
    const { error, value } = Todo.validate(doc);
    if (error) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error }));
    }
    todoCollection.insertOne(value, function (error, result) {
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
}

export function updateOne(req, res) {
  const _id = req.url
    .split('/')
    .filter(pathParams => pathParams !== '/')
    .pop();

  if (!ObjectId.isValid(_id)) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'wrong id format' }));
  }

  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    const doc = JSON.parse(data);
    const { error, value } = Todo.validate(doc);
    if (error) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error }));
    }

    const filter = {
      _id: ObjectId(_id),
    };

    const updateDoc = {
      $set: value,
    };

    todoCollection.updateOne(filter, updateDoc, function (error, result) {
      if (!error) {
        if (result.matchedCount === 1) {
          console.log(result);
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
}

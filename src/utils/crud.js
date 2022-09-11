import { ObjectId } from 'mongodb';
import { getDB } from '../utils/db.js';

export const getOne = model => async (req, res) => {
  const db = await getDB();
  console.log(model.collection);
  const collection = db.collection(model.collection);

  const _id = req.url
    .split('/')
    .filter(pathParams => pathParams !== '/')
    .pop();

  if (!ObjectId.isValid(_id)) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'wrong id format' }));
  }

  collection.findOne({ _id: ObjectId(_id) }, {}, function (error, result) {
    if (!error) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: result }));
    } else {
      console.log(`An error occurred: ${error}`);
      res.statusCode = 500;
      res.end(JSON.stringify(result));
    }
  });
};

export const getAll = model => async (req, res) => {
  const db = await getDB();
  const collection = db.collection(model.collection);

  const myCursor = collection.find({});

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
};

export const createOne = model => async (req, res) => {
  const db = await getDB();

  const collection = db.collection(model.collection);
  const validator = model.validator;
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    const doc = JSON.parse(data);
    const { error, value } = validator.validate(doc);
    if (error) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error }));
    }
    collection.insertOne(value, function (error, result) {
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
};

export const updateOne = model => async (req, res) => {
  const db = await getDB();

  console.log(model.collection);
  const collection = db.collection(model.collection);
  const validator = model.validator;

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
    const { error, value } = validator.validate(doc);
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

    collection.updateOne(filter, updateDoc, function (error, result) {
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
};

export const deleteOne = model => async (req, res) => {
  const db = await getDB();

  const collection = db.collection(model.collection);

  const _id = req.url
    .split('/')
    .filter(pathParams => pathParams !== '/')
    .pop();

  if (!ObjectId.isValid(_id)) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'wrong id format' }));
  }

  const doc = { _id: ObjectId(_id) };

  collection.deleteOne(doc, function (error, result) {
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
};

export const crudControllers = model => ({
  deleteOne: deleteOne(model),
  updateOne: updateOne(model),
  getAll: getAll(model),
  getOne: getOne(model),
  createOne: createOne(model),
});

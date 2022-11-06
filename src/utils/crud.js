import { ObjectId } from 'mongodb';
import { getDB } from '../utils/db.js';

export const getOne = model => async (req, res) => {
  try {
    const db = await getDB();
    const collection = db.collection(model.collection);

    const _id = req.url
      .split('/')
      .filter(pathParams => pathParams !== '/')
      .pop();

    res.on('error', err => {
      console.error(err);
    });

    if (!ObjectId.isValid(_id)) {
      return res
        .writeHead(400, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ error: 'wrong id format' }));
    }

    const result = await collection.findOne({ _id: ObjectId(_id) }, {});

    if (!result) {
      return res
        .writeHead(400, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ error: 'object not found' }));
    }

    return res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ data: result }));
  } catch (err) {
    console.log(err);
    return res.writeHead(500).end();
  }
};

export const getAll = model => async (req, res) => {
  try {
    const db = await getDB();
    const collection = db.collection(model.collection);

    const result = await collection.find({}).toArray();

    res.on('error', err => {
      console.error(err);
    });

    return res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ data: result }));
  } catch (err) {
    console.log(err);
    return res.writeHead(500).end();
  }
};

export const createOne = model => async (req, res) => {
  const db = await getDB();
  const collection = db.collection(model.collection);
  const validator = model.validator;
  let data = '';
  req
    .on('data', chunk => {
      data += chunk;
    })
    .on('end', () => {
      const doc = JSON.parse(data);
      const { error, value } = validator.validate(doc);
      if (error) {
        return res
          .writeHead(200, { 'Content-Type': 'application/json' })
          .end(JSON.stringify({ error }));
      }
      collection.insertOne(value, function (error, result) {
        res.on('error', err => {
          console.error(err);
        });
        if (!error) {
          return res
            .writeHead(201, { 'Content-Type': 'application/json' })
            .end(JSON.stringify({ _id: result.insertedId }));
        } else {
          console.log(`An error occurred: ${error}`);
          return res.writeHead(400).end();
        }
      });
    })
    .on('error', error => {
      console.log(`An error occurred: ${error}`);
      return res.writeHead(500).end();
    });
};

export const updateOne = model => async (req, res) => {
  const db = await getDB();
  const collection = db.collection(model.collection);
  const validator = model.validator;

  const _id = req.url
    .split('/')
    .filter(pathParams => pathParams !== '/')
    .pop();

  if (!ObjectId.isValid(_id)) {
    return res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ error: 'wrong id format' }));
  }

  let data = '';
  req
    .on('data', chunk => {
      data += chunk;
    })
    .on('end', () => {
      const doc = JSON.parse(data);
      const { error, value } = validator.validate(doc);
      if (error) {
        return res
          .writeHead(200, { 'Content-Type': 'application/json' })
          .end(JSON.stringify({ error }));
      }

      const filter = {
        _id: ObjectId(_id),
      };

      const updateDoc = {
        $set: value,
      };

      collection.updateOne(filter, updateDoc, function (error, result) {
        if (!error) {
          res.on('error', err => {
            console.error(err);
          });
          if (result.matchedCount === 1) {
            return res
              .writeHead(200, { 'Content-Type': 'application/json' })
              .end(JSON.stringify({ result }));
          } else {
            return res.writeHead(400);
          }
        } else {
          console.log(`An error occurred: ${error}`);
          return res.writeHead(400).end();
        }
      });
    })
    .on('error', error => {
      console.log(`An error occurred: ${error}`);
      return res.writeHead(500).end();
    });
};

export const deleteOne = model => async (req, res) => {
  try {
    const db = await getDB();

    const collection = db.collection(model.collection);

    const _id = req.url
      .split('/')
      .filter(pathParams => pathParams !== '/')
      .pop();

    if (!ObjectId.isValid(_id)) {
      return res
        .writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ error: 'wrong id format' }));
    }

    const doc = { _id: ObjectId(_id) };

    const result = await collection.deleteOne(doc);

    res.on('error', err => {
      console.error(err);
    });
    if (result.deletedCount === 1) {
      return res
        .writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ _id }));
    } else {
      return res.writeHead(400).end();
    }
  } catch (err) {
    console.log(err);
    return res.writeHead(500).end();
  }
};

export const crudControllers = model => ({
  deleteOne: deleteOne(model),
  updateOne: updateOne(model),
  getAll: getAll(model),
  getOne: getOne(model),
  createOne: createOne(model),
});

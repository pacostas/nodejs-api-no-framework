import { createServer } from 'http';
import todoCrudControllers from './resources/todo/todo.controller.js';

const { getOne, getAll, createOne, deleteOne, updateOne } = todoCrudControllers;
import { connectMongoDB, closeMongoDB } from './utils/db.js';

import { getIsMethodType } from './utils/route.js';

const PORT = process.env.PORT || 8080;

export const server = createServer((req, res) => {
  const { GET, POST, PUT, DELETE } = getIsMethodType(req);

  //Use if statements to do the routing
  if (GET && req.url.match(/\/api\/todo\/\w+/)) {
    return getOne(req, res);
  } else if (GET && req.url.match(/\/api\/todo/)) {
    return getAll(req, res);
  } else if (POST && req.url.match(/\/api\/todo/)) {
    return createOne(req, res);
  } else if (PUT && req.url.match(/\/api\/todo\/\w+/)) {
    return updateOne(req, res);
  } else if (DELETE && req.url.match(/\/api\/todo\/\w+/)) {
    return deleteOne(req, res);
  } else if (GET && req.url.match(/\/health\//)) {
    return res.writeHead(200).end();
  } else {
    return res
      .writeHead(404, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Not found' }));
  }
});

export const start = async () => {
  try {
    connectMongoDB();
    server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  } catch (e) {
    console.error(e);
  }
};

export const close = async () => {
  try {
    closeMongoDB();
    process.exit();
  } catch (e) {
    console.error(e);
  }
};

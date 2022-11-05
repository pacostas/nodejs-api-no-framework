import { createServer } from 'http';
import todoCrudControllers from './resources/todo/todo.controller.js';
const { getOne, getAll, createOne, deleteOne, updateOne } = todoCrudControllers;
import { connectMongoDB, closeMongoDB } from './utils/db.js';
import { getIsMethodType } from './utils/route.js';
import { serverPort } from './configs/index.js';


export const requestHandler = (req, res) => {
  console.log(req.method, req.url);

  const { GET, POST, PUT, DELETE } = getIsMethodType(req);

  if (GET && req.url.match(/\/api\/todo\/\w+/)) {
    return getOne(req, res);
  }

  if (GET && req.url.match(/\/api\/todo/)) {
    return getAll(req, res);
  }

  if (POST && req.url.match(/\/api\/todo/)) {
    return createOne(req, res);
  }

  if (PUT && req.url.match(/\/api\/todo\/\w+/)) {
    return updateOne(req, res);
  }

  if (DELETE && req.url.match(/\/api\/todo\/\w+/)) {
    return deleteOne(req, res);
  }

  if (GET && req.url.match(/\/health\//)) {
    return res.writeHead(200).end();
  }

  return res
    .writeHead(404, { 'Content-Type': 'application/json' })
    .end(JSON.stringify({ message: 'Not found' }));
};

export const server = createServer(requestHandler);

export const start = async () => {
  try {
    await connectMongoDB();
    server.listen(serverPort, () => console.log(`Server running on port: ${serverPort}`));
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

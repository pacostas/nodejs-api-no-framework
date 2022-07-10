import { createServer } from 'http';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './src/resources/todo/todo.controller.js';

import { getIsMethodType } from './src/utils/route.js';
const PORT = process.env.PORT || 8080;

const server = createServer((req, res) => {
  const { GET, POST, PUT, DELETE } = getIsMethodType(req);

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
    res.statusCode = 200;
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

server.listen(PORT, () => console.log(`Server running on port:  ${PORT}`));

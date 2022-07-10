import { createServer } from 'http';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './src/resources/todo/todo.controller.js';

const PORT = process.env.PORT || 8080;

const server = createServer((req, res) => {
  if (req.url.match(/\/api\/todo\/\w+/) && req.method === 'GET') {
    return getOne(req, res);
  } else if (req.url.match(/\/api\/todo/) && req.method === 'GET') {
    return getAll(req, res);
  } else if (req.url.match(/\/api\/todo/) && req.method === 'POST') {
    return createOne(req, res);
  } else if (req.url.match(/\/api\/todo\/\w+/) && req.method === 'PUT') {
    return updateOne(req, res);
  } else if (req.url.match(/\/api\/todo\/\w+/) && req.method === 'DELETE') {
    return deleteOne(req, res);
  } else if (req.url.match(/\/health\//) && req.method === 'GET') {
    res.statusCode = 200;
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

server.listen(PORT, () => console.log(`Server running on port:  ${PORT}`));

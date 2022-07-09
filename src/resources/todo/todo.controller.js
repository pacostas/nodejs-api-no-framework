import { ObjectId } from 'mongodb';
import { todoCollection } from '../../utils/db.js';
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

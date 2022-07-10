export const getIsMethodType = req => ({
  GET: req.method === 'GET',
  POST: req.method === 'POST',
  PUT: req.method === 'PUT',
  DELETE: req.method === 'DELETE',
});

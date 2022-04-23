import { createServer } from 'http';

const PORT = process.env.PORT || 3000;

const server = createServer((req, res) => {
  if (req.url.match(/\/api\/post\/\w+/) && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: {
          title: 'This is the title',
          content: 'This is the content',
          createdBy: 'Bob',
          dateCreated: '2022-01-01T14:48:00.000Z',
        },
      }),
    );
  } else if (req.url.match(/\/api\/todo/) && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: [
          {
            title: 'This is the title',
            content: 'This is the content',
            createdBy: 'Bob',
            dateCreated: '2022-01-01T14:48:00.000Z',
          },
        ],
      }),
    );
  } else if (req.url.match(/\/api\/todo/) && req.method === 'POST') {

    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      console.log(JSON.parse(data));
      res.end();
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });

    res.end(
      JSON.stringify({
        data: {
          title: 'This is the title',
          content: 'This is the content',
          createdBy: 'Bob',
          dateCreated: '2022-01-01T14:48:00.000Z',
        },
      }),
    );
  } else if (req.url.match(/\/api\/todo\/\w+/) && req.method === 'PUT') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: {
          title: 'This is the title',
          content: 'This is the content',
          createdBy: 'Bob',
          dateCreated: '2022-01-01T14:48:00.000Z',
        },
      }),
    );
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

server.listen(PORT, () => console.log(`Server running on port:  ${PORT}`));

const express = require('express');
const server = require("./server.js");

///////////////////////////////////////////////////////////////////EXPRESS///////////////////////////////////////////////////////////////////////////

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
  server.store_offers();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
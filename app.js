const express = require('express');
const app = express();
const { getTopics } = require('./controllers/app.controllers');

app.get('/api/topics', getTopics);

//404 - path not found
app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'path not found' });
});

module.exports = app;

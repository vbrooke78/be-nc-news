const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');
const { getArticlesById } = require('./controllers/articles.controller');
const {
  handleCustomErrors,
  handlePsqlErrors,
} = require('./controllers/errors.controller');

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticlesById);

//404 - id not found
app.use(handleCustomErrors);

app.use(handlePsqlErrors);

//404 - path not found
app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'path not found' });
});

module.exports = app;

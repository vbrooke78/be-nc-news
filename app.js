const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');
const { getArticlesById } = require('./controllers/articles.controller');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./controllers/errors.controller');

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticlesById);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'path not found' });
});

app.use(handleServerErrors);

module.exports = app;

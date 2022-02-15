const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');
const { getArticlesById } = require('./controllers/articles.controller');
const { getUsers } = require('./controllers/users.controller');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./controllers/errors.controller');

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/users', getUsers);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'path not found' });
});

app.use(handleServerErrors);

module.exports = app;

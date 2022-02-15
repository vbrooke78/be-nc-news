const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');
const { getUsers } = require('./controllers/users.controller');
const {
  getArticlesById,
  patchArticleById,
} = require('./controllers/articles.controller');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./controllers/errors.controller');
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/users', getUsers);
app.patch('/api/articles/:article_id', patchArticleById);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'path not found' });
});

app.use(handleServerErrors);

module.exports = app;

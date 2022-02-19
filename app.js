const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');
const { getUsers } = require('./controllers/users.controller');
const {
  getArticlesById,
  patchArticleById,
  getArticles,
} = require('./controllers/articles.controller');
const {
  getComments,
  postComment,
  deleteCommentByCommentId,
} = require('./controllers/comments.controller');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./controllers/errors.controller');
const { getApi } = require('./controllers/api.controller');

app.use(express.json());
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticlesById);
app.patch('/api/articles/:article_id', patchArticleById);
app.get('/api/users', getUsers);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getComments);
app.post('/api/articles/:article_id/comments', postComment);
app.delete('/api/comments/:comment_id', deleteCommentByCommentId);
app.get('/api', getApi);

//Error handling
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'path not found' });
});
app.use(handleServerErrors);

module.exports = app;

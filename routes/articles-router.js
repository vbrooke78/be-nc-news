const {
  getArticles,
  getArticlesById,
  patchArticleById,
} = require('../controllers/articles.controller');
const {
  getComments,
  postComment,
} = require('../controllers/comments.controller');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticlesById)
  .patch(patchArticleById);

articlesRouter
  .route('/:article_id/comments')
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;

const {
  getArticles,
  getArticlesById,
  patchArticleById,
  postArticle,
  deleteArticleById,
} = require('../controllers/articles.controller');
const {
  getComments,
  postComment,
} = require('../controllers/comments.controller');

const articlesRouter = require('express').Router();

articlesRouter.route('/').get(getArticles).post(postArticle);

articlesRouter
  .route('/:article_id')
  .get(getArticlesById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

articlesRouter
  .route('/:article_id/comments')
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;

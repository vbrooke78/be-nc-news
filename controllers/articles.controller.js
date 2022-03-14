const {
  fetchArticlesById,
  updateArticleById,
  fetchArticles,
  createArticle,
  removeArticleById,
} = require('../models/articles.model');
const { checkItemExists } = require('../models/util.functions');

exports.getArticlesById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticlesById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id: articleId } = req.params;
  const newVote = req.body;
  updateArticleById(articleId, newVote)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  createArticle(newArticle)
    .then((newArticle) => {
      res.status(201).send({ newArticle });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id: articleId } = req.params;

  Promise.all([
    checkItemExists('articles', 'article_id', articleId),
    removeArticleById(articleId),
  ])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

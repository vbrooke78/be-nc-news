const { fetchComments } = require('../models/comments.models');
const { checkArticleExists } = require('../models/articles.model');

exports.getComments = (req, res, next) => {
  const { article_id: articleId } = req.params;

  Promise.all([fetchComments(articleId), checkArticleExists(articleId)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

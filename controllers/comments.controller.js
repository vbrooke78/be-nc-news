const { fetchComments } = require('../models/comments.models');

exports.getComments = (req, res, next) => {
  const { article_id: articleId } = req.params;
  fetchComments(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

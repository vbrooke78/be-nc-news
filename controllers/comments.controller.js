const { fetchComments, insertComment } = require('../models/comments.models');
const { checkUserExists } = require('../models/util.functions');

exports.getComments = (req, res, next) => {
  const { article_id: articleId } = req.params;
  fetchComments(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id: articleID } = req.params;
  const comment = req.body;
  const username = req.body.username;

  insertComment(comment, articleID)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

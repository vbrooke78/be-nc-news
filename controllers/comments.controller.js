const {
  fetchComments,
  insertComment,
  removeCommentByCommentId,
} = require('../models/comments.models');
const {
  checkUserExists,
  checkCommentExists,
} = require('../models/util.functions');

const { checkArticleExists } = require('../models/articles.model');

exports.getComments = (req, res, next) => {
  const { article_id: articleId } = req.params;

  Promise.all([fetchComments(articleId), checkArticleExists(articleId)])
    .then(([comments]) => {
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

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id: commentId } = req.params;

  Promise.all([
    checkCommentExists(commentId),
    removeCommentByCommentId(commentId),
  ])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

const {
  fetchComments,
  insertComment,
  removeCommentByCommentId,
  updateCommentByCommentId,
} = require('../models/comments.models');
const { checkItemExists } = require('../models/util.functions');

exports.getComments = (req, res, next) => {
  const { article_id: articleId } = req.params;

  Promise.all([
    fetchComments(articleId),
    checkItemExists('articles', 'article_id', articleId),
  ])
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
    checkItemExists('comments', 'comment_id', commentId),
    removeCommentByCommentId(commentId),
  ])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentByCommentId = (req, res, next) => {
  const { comment_id: commentId } = req.params;
  const newVote = req.body;
  updateCommentByCommentId(commentId, newVote)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};

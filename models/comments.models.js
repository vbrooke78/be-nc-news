const db = require('../db/connection');
const { checkItemExists } = require('../models/util.functions');

exports.fetchComments = (articleId) => {
  return db
    .query(
      'SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments WHERE article_id = $1;',
      [articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (comment, articleID) => {
  const { username, body } = comment;

  if (comment.hasOwnProperty('username') && comment.hasOwnProperty('body')) {
    return checkItemExists('users', 'username', comment.username).then(() => {
      return db
        .query(
          'INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;',
          [username, body, articleID]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
  } else {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
};

exports.removeCommentByCommentId = (commentId) => {
  return db.query('DELETE FROM comments WHERE comment_id = $1;', [commentId]);
};

exports.updateCommentByCommentId = (commentId, newVote) => {
  const { inc_votes } = newVote;
  if (Object.values(newVote).length > 0) {
    return db
      .query(
        'UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *;',
        [commentId, inc_votes]
      )
      .then(({ rows }) => {
        const comment = rows[0];
        return comment;
      });
  } else {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
};

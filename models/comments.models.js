const db = require('../db/connection');
const { checkUserExists } = require('../models/util.functions');

exports.fetchComments = (articleId) => {
  return db
    .query('SELECT * FROM comments WHERE article_id = $1;', [articleId])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No such article_id: ${articleId}`,
        });
      } else {
        return rows;
      }
    });
};

exports.insertComment = (comment, articleID) => {
  // return checkUserExists(comment.username).then(() => {
  const { username, body } = comment;
  if (comment.hasOwnProperty('username') && comment.hasOwnProperty('body')) {
    return checkUserExists(comment.username).then(() => {
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

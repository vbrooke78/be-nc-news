const format = require('pg-format');
const db = require('../db/connection');

exports.checkUserExists = (username) => {
  return db
    .query('SELECT username FROM users WHERE username = $1;', [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No such username: ${username}`,
        });
      }
    });
};

exports.checkCommentExists = (commentId) => {
  return db
    .query('SELECT comment_id FROM comments WHERE comment_id = $1;', [
      commentId,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${commentId}`,
        });
      }
    });
};

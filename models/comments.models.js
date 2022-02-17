const db = require('../db/connection');

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

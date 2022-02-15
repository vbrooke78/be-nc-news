const db = require('../db/connection');

exports.fetchArticlesById = (id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${id}`,
        });
      } else {
        return article;
      }
    });
};

exports.updateArticleById = (articleId, newVote) => {
  const { inc_votes } = newVote;
  if (Object.values(newVote).length > 0) {
    return db
      .query(
        'UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;',
        [articleId, inc_votes]
      )
      .then(({ rows }) => {
        const article = rows[0];
        return article;
      });
  } else {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
};

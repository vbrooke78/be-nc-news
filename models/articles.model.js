const db = require('../db/connection');
const { checkItemExists } = require('./util.functions');

exports.fetchArticlesById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id)::int 
        AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [id]
    )
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

exports.fetchArticles = async (
  sort_by = 'created_at',
  order = 'desc',
  topic
) => {
  const validSortBys = ['title', 'author', 'votes', 'article_id', 'created_at'];
  const validOrders = ['asc', 'desc'];
  const queryValues = [];
  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id)::int 
  AS comment_count
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort_by query' });
  }
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }

  if (topic) {
    queryValues.push(topic);
    queryStr += ` WHERE topic = $1`;
  }

  queryStr += ` GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order};`;

  const { rows } = await db.query(queryStr, queryValues);
  if (rows.length === 0) {
    await checkItemExists('topics', 'slug', topic);
  }

  return rows;
};

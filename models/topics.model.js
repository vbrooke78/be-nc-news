const db = require('../db/connection');

exports.fetchTopics = () => {
  return db.query('SELECT * FROM topics;').then(({ rows }) => {
    return rows;
  });
};

exports.createTopic = (newTopic) => {
  const { slug, description } = newTopic;

  if (
    newTopic.hasOwnProperty('slug') &&
    newTopic.hasOwnProperty('description')
  ) {
    return db
      .query(
        'INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;',
        [slug, description]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  } else {
    return Promise.reject({ status: 400, msg: 'Required information missing' });
  }
};

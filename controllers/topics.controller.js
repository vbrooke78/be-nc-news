const { fetchTopics } = require('../models/topics.model');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch(next);
};

// exports.getArticlesById = (req, res, next) => {
//   const id = req.params.article_id;
//   fetchArticlesById(id)
//     .then((article) => {
//       res.status(200).send(article);
//     })
//     .catch(next);
// };

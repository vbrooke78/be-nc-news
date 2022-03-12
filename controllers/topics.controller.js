const { fetchTopics, createTopic } = require('../models/topics.model');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const newTopic = req.body;

  createTopic(newTopic)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

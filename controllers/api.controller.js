const api = require('../endpoints.json');

exports.getApi = (req, res, next) => {
  const stringifiedApi = JSON.stringify(api);
  res.status(200).send(JSON.stringify(stringifiedApi));
};

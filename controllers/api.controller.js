const api = require('../endpoints.json');

exports.getApi = (req, res, next) => {
  const stringifiedApi = JSON.stringify(api);
  console.log(stringifiedApi);
  res.status(200).send(stringifiedApi);
};

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./controllers/errors.controller');

const apiRouter = require('./routes/api-router');

app.use(express.json());

app.use('/api', apiRouter);

//Error handling
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'path not found' });
});
app.use(handleServerErrors);

module.exports = app;

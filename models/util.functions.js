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

// exports.checkUserExists = (table, column, value) => {
//   const queryStr = format(`SELECT FROM %I WHERE %I = $1;`, [table, column]);

//   return db.query(queryStr, [value]).then(({ rows }) => {
//     if (rows.length === 0) {
//       return Promise.reject({ status: 400, msg: `User not found` });
//     }
//   });
// };

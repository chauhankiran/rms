const postgres = require("postgres");

const sql = postgres({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  debug: console.log,
  types: {
    date: {
      to: 1184,
      from: [1082, 1083, 1114, 1184],
      serialize: (x) => x,
      parse: (x) => x,
    },
  },
});

module.exports = sql;

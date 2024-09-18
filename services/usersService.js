const sql = require("../sql");

module.exports = {
  find: async () => {
    return await sql`
      SELECT
        id,
        email
      FROM
        users
    `;
  },
};

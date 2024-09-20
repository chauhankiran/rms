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

  create: async (userObj) => {
    const { email, password } = userObj;

    return await sql`
      INSERT INTO users (
        email,
        password
      ) VALUES (
        ${email},
        ${password}
      ) returning id
    `;
  },
};

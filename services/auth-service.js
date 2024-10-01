const sql = require("../db/sql");

module.exports = {
  login: async (authOptions) => {
    const { email, password } = authOptions;

    return await sql`
    SELECT
      id,
      email,
      "isRequiredToChangePassword",
      "isActive"
    FROM
      users
    WHERE
      email = ${email} and
      password = ${password}
  `.then(([x]) => x);
  },

  register: async (authOptions) => {
    const { email, password } = authOptions;

    return await sql`
    INSERT INTO users (
      email,
      password
    ) VALUES (
      ${email},
      ${password}
    ) returning id
  `.then(([x]) => x);
  },

  reset: async (authObj) => {
    const { password, updatedBy, id } = authObj;

    return await sql`
      UPDATE
        users
      SET
        password = ${password},
        "isRequiredToChangePassword" = false,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },
};

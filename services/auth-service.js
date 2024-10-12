const sql = require("../db/sql");

module.exports = {
  login: async (authOptions) => {
    const { email } = authOptions;

    return await sql`
    SELECT
      id,
      email,
      password,
      "isRequiredToChangePassword",
      "isActive",
      type
    FROM
      users
    WHERE
      email = ${email}
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

const sql = require("../sql");

const login = async (authOptions) => {
  const { email, password } = authOptions;

  return await sql`
    SELECT
      id,
      email
    FROM
      users
    WHERE
      email = ${email} and
      password = ${password}
  `.then(([x]) => x);
};

const register = async (authOptions) => {
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
};

module.exports = {
  login,
  register,
};

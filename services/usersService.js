const sql = require("../sql");

module.exports = {
  find: async (optionsObj) => {
    const { skip, limit, search, orderBy, orderDir } = optionsObj;

    const whereClause = search
      ? sql` WHERE email iLIKE ${"%" + search + "%"}`
      : sql``;

    return await sql`
      SELECT
        id,
        email,
        "createdAt",
        "updatedAt"
      FROM
        users
      ${whereClause}
      ORDER BY
        ${sql(orderBy)}
        ${orderDir === "ASC" ? sql`ASC` : sql`DESC`}
      LIMIT
        ${limit}
      OFFSET
        ${skip}
    `;
  },

  count: async (optionsObj) => {
    const { search } = optionsObj;

    const whereClause = search
      ? sql` WHERE email iLIKE ${"%" + search + "%"}`
      : sql``;

    return await sql`
      SELECT
        COUNT(id)
      FROM
        users
      ${whereClause}
    `.then(([x]) => x);
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

  findOne: async (id) => {
    return await sql`
      SELECT
        id,
        email
      FROM
        users
      WHERE
        id = ${id}
    `.then(([x]) => x);
  },

  update: async (userObj) => {
    const { id, email, password } = userObj;

    return await sql`
      UPDATE
        users
      SET
        email = ${email},
        password = ${password},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  destroy: async (id) => {
    return await sql`
      DELETE FROM
        users
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },
};

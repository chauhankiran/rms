const sql = require("../sql");

module.exports = {
  find: async (optionsObj) => {
    const { skip, limit, search, orderBy, orderDir } = optionsObj;

    const whereClause = search
      ? sql` WHERE email iLIKE ${"%" + search + "%"}`
      : sql``;

    return await sql`
      SELECT
        u.id,
        u.email,
        u."createdAt",
        u."updatedAt",
        u."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        users u
      LEFT JOIN
        users creator ON u."createdBy" = creator.id
      LEFT JOIN
        users updater ON u."updatedBy" = updater.id
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
    const { email, password, createdBy } = userObj;

    return await sql`
      INSERT INTO users (
        email,
        password,
        "createdBy"
      ) VALUES (
        ${email},
        ${password},
        ${createdBy}
      ) returning id
    `;
  },

  findOne: async (id) => {
    return await sql`
      SELECT
        id,
        email,
        "isActive"
      FROM
        users
      WHERE
        id = ${id}
    `.then(([x]) => x);
  },

  update: async (userObj) => {
    const { id, email, password, updatedBy } = userObj;

    return await sql`
      UPDATE
        users
      SET
        email = ${email},
        password = ${password},
        "updatedBy" = ${updatedBy},
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

  archive: async (userObj) => {
    const { id, newUserStatus } = userObj;

    return await sql`
      UPDATE
        users
      SET
        "isActive" = ${newUserStatus}
      WHERE
        id = ${id}
    `.then(([x]) => x);
  },
};

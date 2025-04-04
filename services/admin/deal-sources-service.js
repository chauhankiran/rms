const sql = require("../../db/sql");

module.exports = {
  find: async (optionsObj) => {
    const { skip, limit, search, orderBy, orderDir } = optionsObj;

    const whereClause = search
      ? sql` WHERE name iLIKE ${"%" + search + "%"}`
      : sql``;

    return await sql`
      SELECT
        d.id,
        d.name,
        d."createdAt",
        d."updatedAt",
        d."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "dealSources" d
      LEFT JOIN
        users creator ON d."createdBy" = creator.id
      LEFT JOIN
        users updater ON d."updatedBy" = updater.id
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
      ? sql` WHERE name iLIKE ${"%" + search + "%"}`
      : sql``;

    return await sql`
      SELECT
        COUNT(id)
      FROM
        "dealSources"
      ${whereClause}
    `.then(([x]) => x);
  },

  create: async (dealSourceObj) => {
    const { name, createdBy } = dealSourceObj;

    return await sql`
        INSERT INTO "dealSources" (
          name,
          "createdBy"
        ) VALUES (
          ${name},
          ${createdBy}
        ) returning id
      `;
  },

  findOne: async (id) => {
    return await sql`
      SELECT
        c.id,
        c.name,
        c."createdAt",
        c."updatedAt",
        c."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "dealSources" c
      LEFT JOIN
        users creator ON c."createdBy" = creator.id
      LEFT JOIN
        users updater ON c."updatedBy" = updater.id
      WHERE
        c.id = ${id}
    `.then(([x]) => x);
  },

  update: async (dealSourceObj) => {
    const { id, name, updatedBy } = dealSourceObj;

    return await sql`
      UPDATE
        "dealSources"
      SET
        name = ${name},
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
        "dealSources"
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  archive: async (dealSourceObj) => {
    const { id, updatedBy } = dealSourceObj;

    return await sql`
      UPDATE
        "dealSources"
      SET
        "isActive" = false,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  active: async (dealSourceObj) => {
    const { id, updatedBy } = dealSourceObj;

    return await sql`
      UPDATE
        "dealSources"
      SET
        "isActive" = true,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  pluck: async (columns) => {
    return await sql`
      SELECT
        ${sql(columns)}
      FROM
        "dealSources"
    `;
  },
};

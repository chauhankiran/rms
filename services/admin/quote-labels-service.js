const sql = require("../../db/sql");

module.exports = {
  find: async (optionsObj) => {
    const { skip, limit, search, orderBy, orderDir } = optionsObj;

    const whereClause = search
      ? sql` WHERE name iLIKE ${"%" + search + "%"}`
      : sql``;

    return await sql`
      SELECT
        qf.id,
        qf.name,
        qf."displayName",
        qf."createdAt",
        qf."updatedAt",
        qf."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "quoteLabels" qf
      LEFT JOIN
        users creator ON qf."createdBy" = creator.id
      LEFT JOIN
        users updater ON qf."updatedBy" = updater.id
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
        "quoteLabels"
      ${whereClause}
    `.then(([x]) => x);
  },

  findOne: async (id) => {
    return await sql`
      SELECT
        qf.id,
        qf.name,
        qf."displayName",
        qf."createdAt",
        qf."updatedAt",
        qf."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "quoteLabels" qf
      LEFT JOIN
        users creator ON qf."createdBy" = creator.id
      LEFT JOIN
        users updater ON qf."updatedBy" = updater.id
      WHERE
        qf.id = ${id}
    `.then(([x]) => x);
  },

  update: async (quoteLabelObj) => {
    const { id, displayName, updatedBy } = quoteLabelObj;

    return await sql`
      UPDATE
        "quoteLabels"
      SET
        "displayName" = ${displayName},
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  archive: async (quoteLabelObj) => {
    const { id, updatedBy } = quoteLabelObj;

    return await sql`
      UPDATE
        "quoteLabels"
      SET
        "isActive" = false,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  active: async (quoteLabelObj) => {
    const { id, updatedBy } = quoteLabelObj;

    return await sql`
      UPDATE
        "quoteLabels"
      SET
        "isActive" = true,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  findActive: async () => {
    return await sql`
      SELECT
        name,
        "displayName"
      FROM
        "quoteLabels"
      WHERE
        "isActive" = true
    `;
  },

  pluck: async (columns) => {
    return await sql`
      SELECT
        ${sql(columns)}
      FROM
        "quoteLabels"
    `;
  },
};

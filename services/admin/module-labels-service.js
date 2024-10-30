const sql = require("../../db/sql");

module.exports = {
  find: async (optionsObj) => {
    const { skip, limit, search, orderBy, orderDir } = optionsObj;

    const whereClause = search
      ? sql` WHERE name iLIKE ${"%" + search + "%"}`
      : sql``;

    return await sql`
      SELECT
        ml.id,
        ml.name,
        ml."displayName",
        ml."createdAt",
        ml."updatedAt",
        ml."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "moduleLabels" ml
      LEFT JOIN
        users creator ON ml."createdBy" = creator.id
      LEFT JOIN
        users updater ON ml."updatedBy" = updater.id
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
        "moduleLabels"
      ${whereClause}
    `.then(([x]) => x);
  },

  findOne: async (id) => {
    return await sql`
      SELECT
        ml.id,
        ml.name,
        ml."displayName",
        ml."createdAt",
        ml."updatedAt",
        ml."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "moduleLabels" ml
      LEFT JOIN
        users creator ON ml."createdBy" = creator.id
      LEFT JOIN
        users updater ON ml."updatedBy" = updater.id
      WHERE
        ml.id = ${id}
    `.then(([x]) => x);
  },

  update: async (moduleLabelObj) => {
    const { id, displayName, updatedBy } = moduleLabelObj;

    return await sql`
      UPDATE
        "moduleLabels"
      SET
        "displayName" = ${displayName},
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  archive: async (moduleLabelObj) => {
    const { id, updatedBy } = moduleLabelObj;

    return await sql`
      UPDATE
        "moduleLabels"
      SET
        "isActive" = false,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  active: async (moduleLabelObj) => {
    const { id, updatedBy } = moduleLabelObj;

    return await sql`
      UPDATE
        "moduleLabels"
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
        "moduleLabels"
      WHERE
        "isActive" = true
    `;
  },

  pluck: async (columns) => {
    return await sql`
      SELECT
        ${sql(columns)}
      FROM
        "moduleLabels"
    `;
  },
};

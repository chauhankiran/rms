const sql = require("../../db/sql");

module.exports = {
  find: async (optionsObj) => {
    const { skip, limit, search, orderBy, orderDir } = optionsObj;

    const whereClause = search
      ? sql` WHERE name iLIKE ${"%" + search + "%"}`
      : sql``;

    return await sql`
      SELECT
        tf.id,
        tf.name,
        tf."displayName",
        tf."createdAt",
        tf."updatedAt",
        tf."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "taskFields" tf
      LEFT JOIN
        users creator ON tf."createdBy" = creator.id
      LEFT JOIN
        users updater ON tf."updatedBy" = updater.id
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
        "taskFields"
      ${whereClause}
    `.then(([x]) => x);
  },

  findOne: async (id) => {
    return await sql`
      SELECT
        tf.id,
        tf.name,
        tf."displayName",
        tf."createdAt",
        tf."updatedAt",
        tf."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "taskFields" tf
      LEFT JOIN
        users creator ON tf."createdBy" = creator.id
      LEFT JOIN
        users updater ON tf."updatedBy" = updater.id
      WHERE
        tf.id = ${id}
    `.then(([x]) => x);
  },

  update: async (taskLabelObj) => {
    const { id, displayName, updatedBy } = taskLabelObj;

    return await sql`
      UPDATE
        "taskFields"
      SET
        "displayName" = ${displayName},
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  archive: async (taskLabelObj) => {
    const { id, updatedBy } = taskLabelObj;

    return await sql`
      UPDATE
        "taskFields"
      SET
        "isActive" = false,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  active: async (taskLabelObj) => {
    const { id, updatedBy } = taskLabelObj;

    return await sql`
      UPDATE
        "taskFields"
      SET
        "isActive" = true,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },
};

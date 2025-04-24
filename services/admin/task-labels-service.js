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
        "taskLabels" tf
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
        "taskLabels"
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
        "taskLabels" tf
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
        "taskLabels"
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
        "taskLabels"
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
        "taskLabels"
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
        "taskLabels"
      WHERE
        "isActive" = true
    `;
    },

    pluck: async (columns) => {
        return await sql`
      SELECT
        ${sql(columns)}
      FROM
        "taskLabels"
      WHERE
        "isActive" = true
    `;
    },
};

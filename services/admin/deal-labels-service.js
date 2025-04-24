const sql = require("../../db/sql");

module.exports = {
    find: async (optionsObj) => {
        const { skip, limit, search, orderBy, orderDir } = optionsObj;

        const whereClause = search
            ? sql` WHERE name iLIKE ${"%" + search + "%"}`
            : sql``;

        return await sql`
      SELECT
        df.id,
        df.name,
        df."displayName",
        df."createdAt",
        df."updatedAt",
        df."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "dealLabels" df
      LEFT JOIN
        users creator ON df."createdBy" = creator.id
      LEFT JOIN
        users updater ON df."updatedBy" = updater.id
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
        "dealLabels"
      ${whereClause}
    `.then(([x]) => x);
    },

    findOne: async (id) => {
        return await sql`
      SELECT
        df.id,
        df.name,
        df."displayName",
        df."createdAt",
        df."updatedAt",
        df."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "dealLabels" df
      LEFT JOIN
        users creator ON df."createdBy" = creator.id
      LEFT JOIN
        users updater ON df."updatedBy" = updater.id
      WHERE
        df.id = ${id}
    `.then(([x]) => x);
    },

    update: async (dealLabelObj) => {
        const { id, displayName, updatedBy } = dealLabelObj;

        return await sql`
      UPDATE
        "dealLabels"
      SET
        "displayName" = ${displayName},
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
    },

    archive: async (dealLabelObj) => {
        const { id, updatedBy } = dealLabelObj;

        return await sql`
      UPDATE
        "dealLabels"
      SET
        "isActive" = false,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
    },

    active: async (dealLabelObj) => {
        const { id, updatedBy } = dealLabelObj;

        return await sql`
      UPDATE
        "dealLabels"
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
        "dealLabels"
      WHERE
        "isActive" = true
    `;
    },

    pluck: async (columns) => {
        return await sql`
      SELECT
        ${sql(columns)}
      FROM
        "dealLabels"
      WHERE
        "isActive" = true
    `;
    },
};

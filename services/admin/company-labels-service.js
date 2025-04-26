const sql = require("../../db/sql");

module.exports = {
    find: async (optionsObj) => {
        const { skip, limit, search, orderBy, orderDir, module } = optionsObj;

        const whereClauses = [];

        if (search) {
            whereClauses.push(sql` name iLIKE ${"%" + search + "%"}`);
        }

        if (module) {
            whereClauses.push(sql` "module" = ${module}`);
        }

        const whereClause = whereClauses.flatMap((x, i) =>
            i ? [sql`and`, x] : x
        );

        return await sql`
            SELECT
                lb.id,
                lb.name,
                lb."label",
                lb."module",
                lb."createdAt",
                lb."updatedAt",
                lb."isActive",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                "labels" lb
            LEFT JOIN
                users creator ON lb."createdBy" = creator.id
            LEFT JOIN
                users updater ON lb."updatedBy" = updater.id
            ${whereClause.length > 0 ? sql`WHERE ${whereClause}` : sql``}
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
        const { search, module } = optionsObj;

        const whereClauses = [];

        if (search) {
            whereClauses.push(sql` name iLIKE ${"%" + search + "%"}`);
        }

        if (module) {
            whereClauses.push(sql` "module" = ${module}`);
        }

        const whereClause = whereClauses.flatMap((x, i) =>
            i ? [sql`and`, x] : x
        );

        return await sql`
            SELECT
                COUNT(id)
            FROM
                "labels"
            ${whereClause.length > 0 ? sql`WHERE ${whereClause}` : sql``}
        `.then(([x]) => x);
    },

    findOne: async (id) => {
        return await sql`
      SELECT
        cf.id,
        cf.name,
        cf."displayName",
        cf."createdAt",
        cf."updatedAt",
        cf."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "companyLabels" cf
      LEFT JOIN
        users creator ON cf."createdBy" = creator.id
      LEFT JOIN
        users updater ON cf."updatedBy" = updater.id
      WHERE
        cf.id = ${id}
    `.then(([x]) => x);
    },

    update: async (companyLabelObj) => {
        const { id, displayName, updatedBy } = companyLabelObj;

        return await sql`
      UPDATE
        "companyLabels"
      SET
        "displayName" = ${displayName},
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
    },

    archive: async (companyLabelObj) => {
        const { id, updatedBy } = companyLabelObj;

        return await sql`
      UPDATE
        "companyLabels"
      SET
        "isActive" = false,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
    },

    active: async (companyLabelObj) => {
        const { id, updatedBy } = companyLabelObj;

        return await sql`
      UPDATE
        "companyLabels"
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
        "companyLabels"
      WHERE
        "isActive" = true
    `;
    },

    pluck: async (columns) => {
        return await sql`
            SELECT
                ${sql(columns)}
            FROM
                "companyLabels"
            WHERE
                "isActive" = true
        `;
    },
};

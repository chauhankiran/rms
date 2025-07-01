const sql = require("../../db/sql");

module.exports = {
    find: async (table, optionsObj) => {
        const { skip, limit, search, orderBy, orderDir } = optionsObj;

        const whereClause = search ? sql` WHERE name iLIKE ${"%" + search + "%"}` : sql``;

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
                ${sql(table)} cf
            LEFT JOIN
                users creator ON cf."createdBy" = creator.id
            LEFT JOIN
                users updater ON cf."updatedBy" = updater.id
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

    count: async (table, optionsObj) => {
        const { search } = optionsObj;

        const whereClause = search ? sql` WHERE name iLIKE ${"%" + search + "%"}` : sql``;

        return await sql`
            SELECT
                COUNT(id)
            FROM
                ${sql(table)}
            ${whereClause}
        `.then(([x]) => x);
    },

    findOne: async (table, id) => {
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
                ${sql(table)} cf
            LEFT JOIN
                users creator ON cf."createdBy" = creator.id
            LEFT JOIN
                users updater ON cf."updatedBy" = updater.id
            WHERE
                cf.id = ${id}
        `.then(([x]) => x);
    },

    update: async (table, optionsObj) => {
        const { id, displayName, updatedBy } = optionsObj;

        return await sql`
            UPDATE
                ${sql(table)}
            SET
                "displayName" = ${displayName},
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id, name
        `.then(([x]) => x);
    },

    archive: async (table, optionsObj) => {
        const obj = { ...optionsObj, isActive: false };
        return await updateStatus(table, obj);
    },

    active: async (table, optionsObj) => {
        const obj = { ...optionsObj, isActive: true };
        return await updateStatus(table, obj);
    },

    pluck: async (table, columns) => {
        return await sql`
            SELECT
                ${sql(columns)}
            FROM
                ${sql(table)}
            WHERE
                "isActive" = true
        `;
    },
};

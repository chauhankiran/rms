const sql = require("../../db/sql");

module.exports = {
    find: async (table, optionsObj) => {
        const { skip, limit, search, orderBy, orderDir } = optionsObj;

        const whereClause = search
            ? sql` WHERE name iLIKE ${"%" + search + "%"}`
            : sql``;

        return await sql`
            SELECT
                tt.id,
                tt.name,
                tt."createdAt",
                tt."updatedAt",
                tt."isActive",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                ${sql(table)} tt
            LEFT JOIN
                users creator ON tt."createdBy" = creator.id
            LEFT JOIN
                users updater ON tt."updatedBy" = updater.id
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

        const whereClause = search
            ? sql` WHERE name iLIKE ${"%" + search + "%"}`
            : sql``;

        return await sql`
            SELECT
                COUNT(id)
            FROM
                ${sql(table)}
            ${whereClause}
        `.then(([x]) => x);
    },

    create: async (table, optionsObj) => {
        const { name, createdBy } = optionsObj;

        return await sql`
            INSERT INTO ${sql(table)} (
                name,
                "createdBy"
            ) VALUES (
                ${name},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (table, id) => {
        return await sql`
            SELECT
                tt.id,
                tt.name,
                tt."createdAt",
                tt."updatedAt",
                tt."isActive",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                ${sql(table)} tt
            LEFT JOIN
                users creator ON tt."createdBy" = creator.id
            LEFT JOIN
                users updater ON tt."updatedBy" = updater.id
            WHERE
                tt.id = ${id}
        `.then(([x]) => x);
    },

    update: async (table, optionsObj) => {
        const { id, name, updatedBy } = optionsObj;

        return await sql`
            UPDATE
                ${sql(table)}
            SET
                name = ${name},
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    destroy: async (table, id) => {
        return await sql`
            DELETE FROM
                ${sql(table)}
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    archive: async (table, optionsObj) => {
        const { id, updatedBy } = optionsObj;

        return await sql`
            UPDATE
                ${sql(table)}
            SET
                "isActive" = false,
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    active: async (table, optionsObj) => {
        const { id, updatedBy } = optionsObj;

        return await sql`
            UPDATE
                ${sql(table)}
            SET
                "isActive" = true,
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    pluck: async (table, columns) => {
        return await sql`
            SELECT
                ${sql(columns)}
            FROM
                ${sql(table)}
        `;
    },
};

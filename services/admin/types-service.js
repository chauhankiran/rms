const sql = require("../../db/sql");

module.exports = {
    find: async (optionsObj) => {
        const { skip, limit, search, orderBy, orderDir } = optionsObj;

        const whereClause = search
            ? sql` WHERE name iLIKE ${"%" + search + "%"}`
            : sql``;

        return await sql`
            SELECT
                t.id,
                t.name,
                t."createdAt",
                t."updatedAt",
                t."isActive",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                types t
            LEFT JOIN
                users creator ON t."createdBy" = creator.id
            LEFT JOIN
                users updater ON t."updatedBy" = updater.id
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
                types
            ${whereClause}
        `.then(([x]) => x);
    },

    create: async (typeObj) => {
        const { name, createdBy } = typeObj;

        return await sql`
            INSERT INTO types (
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
                t.id,
                t.name,
                t."createdAt",
                t."updatedAt",
                t."isActive",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                types t
            LEFT JOIN
                users creator ON t."createdBy" = creator.id
            LEFT JOIN
                users updater ON t."updatedBy" = updater.id
            WHERE
                t.id = ${id}
        `.then(([x]) => x);
    },

    update: async (userObj) => {
        const { id, name, updatedBy } = userObj;

        return await sql`
            UPDATE
                types
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
                types
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    archive: async (typeObj) => {
        const { id, updatedBy } = typeObj;

        return await sql`
            UPDATE
                types
            SET
                "isActive" = false,
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },
    active: async (typeObj) => {
        const { id, updatedBy } = typeObj;

        return await sql`
            UPDATE
                types
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
                types
            WHERE
                "isActive" = true
        `;
    },
};

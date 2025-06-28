const sql = require("../../db/sql");

module.exports = {
    find: async (optionsObj) => {
        const { skip, limit, search, orderBy, orderDir } = optionsObj;

        const whereClause = search
            ? sql` WHERE name iLIKE ${"%" + search + "%"}`
            : sql``;

        return await sql`
            SELECT
                i.id,
                i.name,
                i."createdAt",
                i."updatedAt",
                i."isActive",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                "industries" i
            LEFT JOIN
                users creator ON i."createdBy" = creator.id
            LEFT JOIN
                users updater ON i."updatedBy" = updater.id
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
                "industries"
            ${whereClause}
        `.then(([x]) => x);
    },

    create: async (industryObj) => {
        const { name, createdBy } = industryObj;

        return await sql`
            INSERT INTO "industries"
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
                i.id,
                i.name,
                i."createdAt",
                i."updatedAt",
                i."isActive",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                "industries" i
            LEFT JOIN
                users creator ON i."createdBy" = creator.id
            LEFT JOIN
                users updater ON i."updatedBy" = updater.id
            WHERE
                i.id = ${id}
        `.then(([x]) => x);
    },

    update: async (userObj) => {
        const { id, name, updatedBy } = userObj;

        return await sql`
            UPDATE
                "industries"
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
                "industries"
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    archive: async (industryObj) => {
        const { id, updatedBy } = industryObj;

        return await sql`
            UPDATE
                "industries"
            SET
                "isActive" = false,
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },
    active: async (industryObj) => {
        const { id, updatedBy } = industryObj;

        return await sql`
            UPDATE
                "industries"
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
                "industries"
            WHERE
                "isActive" = true
        `;
    },
};

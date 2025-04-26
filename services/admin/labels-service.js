const sql = require("../../db/sql");

module.exports = {
    find: async (optionsObj) => {
        const { skip, limit, search, orderBy, orderDir } = optionsObj;

        const whereClause = search
            ? sql` WHERE label iLIKE ${"%" + search + "%"}`
            : sql``;

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
            ? sql` WHERE label iLIKE ${"%" + search + "%"}`
            : sql``;

        return await sql`
            SELECT
                COUNT(id)
            FROM
                "labels"
            ${whereClause}
        `.then(([x]) => x);
    },

    findOne: async (id) => {
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
            WHERE
                lb.id = ${id}
        `.then(([x]) => x);
    },

    update: async (labelObj) => {
        const { id, label, isActive, updatedBy } = labelObj;

        return await sql`
            UPDATE
                "labels"
            SET
                "label" = ${label},
                "isActive" = ${isActive === "t"},
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
                labels
            WHERE
                "isActive" = true
        `;
    },
};

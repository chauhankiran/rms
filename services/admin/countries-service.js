const sql = require("../../db/sql");
const updateStatus = require("../_base/update-status");

module.exports = {
    find: async (optionsObj) => {
        const { skip, limit, search, orderBy, orderDir } = optionsObj;

        const whereClause = search
            ? sql` WHERE name iLIKE ${"%" + search + "%"}`
            : sql``;

        return await sql`
            SELECT
                c.id,
                c.name,
                c."createdAt",
                c."updatedAt",
                c."isActive",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                "countries" c
            LEFT JOIN
                users creator ON c."createdBy" = creator.id
            LEFT JOIN
                users updater ON c."updatedBy" = updater.id
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
                "countries"
            ${whereClause}
        `.then(([x]) => x);
    },

    create: async (countryObj) => {
        const { name, createdBy } = countryObj;

        return await sql`
            INSERT INTO "countries" (
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
                c.id,
                c.name,
                c."createdAt",
                c."updatedAt",
                c."isActive",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                "countries" c
            LEFT JOIN
                users creator ON c."createdBy" = creator.id
            LEFT JOIN
                users updater ON c."updatedBy" = updater.id
            WHERE
                c.id = ${id}
        `.then(([x]) => x);
    },

    update: async (userObj) => {
        const { id, name, updatedBy } = userObj;

        return await sql`
            UPDATE
                "countries"
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
                "countries"
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    archive: async (countryObj) => {
        const obj = { ...countryObj, isActive: false };
        return await updateStatus("countries", obj);
    },
    active: async (countryObj) => {
        const obj = { ...countryObj, isActive: true };
        return await updateStatus("countries", obj);
    },

    pluck: async (columns) => {
        return await sql`
            SELECT
                ${sql(columns)}
            FROM
                "countries"
            WHERE
                "isActive" = true
        `;
    },
};

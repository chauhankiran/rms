const sql = require("../db/sql");

module.exports = {
    find: async (optionsObj) => {
        const {
            skip,
            limit,
            search,
            orderBy,
            orderDir,
            columns,
            companyId,
            contactId,
        } = optionsObj;

        const whereClause = search
            ? sql` WHERE d."name" iLIKE ${"%" + search + "%"}`
            : sql``;

        const whereClause2 = companyId
            ? sql` WHERE "companyId" = ${companyId}`
            : sql``;

        const whereClause3 = contactId
            ? sql` WHERE "contactId" = ${contactId}`
            : sql``;

        return await sql`
            SELECT
                ${sql.unsafe(columns)}
            FROM
                deals d
            LEFT JOIN
                users creator ON d."createdBy" = creator.id
            LEFT JOIN
                users updater ON d."updatedBy" = updater.id
            LEFT JOIN
                "dealSources" ds ON d."dealSourceId" = ds.id
            ${whereClause}
            ${whereClause2}
            ${whereClause3} 
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
            ? sql` WHERE "name" iLIKE ${"%" + search + "%"}`
            : sql``;

        return await sql`
            SELECT
                COUNT(id)
            FROM
                deals
            ${whereClause}
        `.then(([x]) => x);
    },

    create: async (dealObj) => {
        const {
            name,
            total,
            description,
            dealSourceId,
            companyId,
            contactId,
            createdBy,
        } = dealObj;

        return await sql`
            INSERT INTO deals (
                name,
                total,
                description,
                "dealSourceId",
                "companyId",
                "contactId",
                "createdBy"
            ) VALUES (
                ${name},
                ${total},
                ${description},
                ${dealSourceId},
                ${companyId},
                ${contactId},
                ${createdBy}
            ) returning id, name
        `.then(([x]) => x);
    },

    findOne: async (id) => {
        return await sql`
            SELECT
                d.id,
                d.name,
                d.total,
                d.description,
                d."isActive",
                d."dealSourceId",
                ds."name" AS "dealSource",
                d."createdAt",
                d."updatedAt",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                deals d
            LEFT JOIN
                users creator ON d."createdBy" = creator.id
            LEFT JOIN
                users updater ON d."updatedBy" = updater.id
            LEFT JOIN
                "dealSources" ds ON d."dealSourceId" = ds.id
            WHERE
                d.id = ${id}
        `.then(([x]) => x);
    },

    update: async (dealObj) => {
        const { id, name, total, description, dealSourceId, updatedBy } =
            dealObj;

        return await sql`
            UPDATE
                deals
            SET
                name = ${name},
                total = ${total},
                description = ${description},
                "dealSourceId" = ${dealSourceId},
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
                deals
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    archive: async (dealObj) => {
        const { id, updatedBy } = dealObj;

        return await sql`
            UPDATE
                deals
            SET
                "isActive" = false,
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    active: async (dealObj) => {
        const { id, updatedBy } = dealObj;

        return await sql`
            UPDATE
                deals
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

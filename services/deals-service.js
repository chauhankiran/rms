const sql = require("../db/sql");
const updateStatus = require("./_base/update-status");

module.exports = {
    find: async (optionsObj) => {
        const {
            skip,
            limit,
            search,
            orderBy,
            orderDir,
            query,
            companyId,
            contactId,
            isActiveOnly,
        } = optionsObj;

        const whereClauses = [];

        if (search) {
            whereClauses.push(sql`d."name" iLIKE ${"%" + search + "%"}`);
        }

        if (companyId) {
            whereClauses.push(sql`"companyId" = ${companyId}`);
        }

        if (contactId) {
            whereClauses.push(sql`"contactId" = ${contactId}`);
        }

        if (isActiveOnly) {
            whereClauses.push(sql`d."isActive" = TRUE`);
        }

        const whereClause = whereClauses.flatMap((x, i) =>
            i ? [sql`and`, x] : x
        );

        return await sql`
            SELECT
                ${sql.unsafe(query)}
            FROM
                deals d
            LEFT JOIN
                users creator ON d."createdBy" = creator.id
            LEFT JOIN
                users updater ON d."updatedBy" = updater.id
            LEFT JOIN
                "dealSources" ds ON d."dealSourceId" = ds.id
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
        const { search, isActiveOnly } = optionsObj;

        const whereClauses = [];

        if (search) {
            whereClauses.push(sql`d."name" iLIKE ${"%" + search + "%"}`);
        }

        if (isActiveOnly) {
            whereClauses.push(sql`d."isActive" = TRUE`);
        }

        const whereClause = whereClauses.flatMap((x, i) =>
            i ? [sql`and`, x] : x
        );

        return await sql`
            SELECT
                COUNT(id)
            FROM
                deals d
            ${whereClause.length > 0 ? sql`WHERE ${whereClause}` : sql``}
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
            returning id, name
        `.then(([x]) => x);
    },

    destroy: async (id) => {
        return await sql`
            DELETE FROM
                deals
            WHERE
                id = ${id}
            returning id, name
        `.then(([x]) => x);
    },

    archive: async (dealObj) => {
        const obj = { ...dealObj, isActive: false };
        return await updateStatus("deals", obj);
    },

    active: async (dealObj) => {
        const obj = { ...dealObj, isActive: true };
        return await updateStatus("deals", obj);
    },
};

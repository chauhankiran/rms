const sql = require("../db/sql");
const updateStatus = require("./_base/update-status");
const destroy = require("./_base/destroy");

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
            dealId,
            isActiveOnly,
        } = optionsObj;

        const whereClauses = [];

        if (search) {
            whereClauses.push(sql`t."name" iLIKE ${"%" + search + "%"}`);
        }

        if (companyId) {
            whereClauses.push(sql`"companyId" = ${companyId}`);
        }

        if (contactId) {
            whereClauses.push(sql`"contactId" = ${contactId}`);
        }

        if (dealId) {
            whereClauses.push(sql`"dealId" = ${dealId}`);
        }

        if (isActiveOnly) {
            whereClauses.push(sql`t."isActive" = TRUE`);
        }

        const whereClause = whereClauses.flatMap((x, i) =>
            i ? [sql`and`, x] : x
        );

        return await sql`
            SELECT
                ${sql.unsafe(query)}
            FROM
                tickets t
            LEFT JOIN
                users creator ON t."createdBy" = creator.id
            LEFT JOIN
                users updater ON t."updatedBy" = updater.id
            LEFT JOIN
                "ticketTypes" tt ON t."ticketTypeId" = tt.id
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
            whereClauses.push(sql`t."name" iLIKE ${"%" + search + "%"}`);
        }

        if (isActiveOnly) {
            whereClauses.push(sql`t."isActive" = TRUE`);
        }

        const whereClause = whereClauses.flatMap((x, i) =>
            i ? [sql`and`, x] : x
        );

        return await sql`
            SELECT
                COUNT(id)
            FROM
                tickets t
            ${whereClause.length > 0 ? sql`WHERE ${whereClause}` : sql``}
        `.then(([x]) => x);
    },

    create: async (ticketObj) => {
        const {
            name,
            description,
            ticketTypeId,
            companyId,
            contactId,
            dealId,
            createdBy,
        } = ticketObj;

        return await sql`
            INSERT INTO tickets (
                name,
                description,
                "ticketTypeId",
                "companyId",
                "contactId",
                "dealId",
                "createdBy"
            ) VALUES (
                ${name},
                ${description},
                ${ticketTypeId},
                ${companyId},
                ${contactId},
                ${dealId},
                ${createdBy}
            ) returning id, name
        `.then(([x]) => x);
    },

    findOne: async (id) => {
        return await sql`
            SELECT
                t.id,
                t.name,
                t.description,
                t."isActive",
                t."ticketTypeId",
                tt."name" AS "ticketType",
                t."createdAt",
                t."updatedAt",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                tickets t
            LEFT JOIN
                users creator ON t."createdBy" = creator.id
            LEFT JOIN
                users updater ON t."updatedBy" = updater.id
            LEFT JOIN
                "ticketTypes" tt ON t."ticketTypeId" = tt.id
            WHERE
                t.id = ${id}
        `.then(([x]) => x);
    },

    update: async (ticketObj) => {
        const { id, name, description, ticketTypeId, updatedBy } = ticketObj;

        return await sql`
            UPDATE
                tickets
            SET
                name = ${name},
                description = ${description},
                "ticketTypeId" = ${ticketTypeId},
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id
            `.then(([x]) => x);
    },

    destroy: async (id) => {
        return await destroy("tickets", id);
    },

    archive: async (ticketObj) => {
        const obj = { ...ticketObj, isActive: false };
        return await updateStatus("tickets", obj);
    },

    active: async (ticketObj) => {
        const obj = { ...ticketObj, isActive: true };
        return await updateStatus("tickets", obj);
    },
};

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
            quoteId,
            ticketId,
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

        if (quoteId) {
            whereClauses.push(sql`"quoteId" = ${quoteId}`);
        }

        if (ticketId) {
            whereClauses.push(sql`"ticketId" = ${ticketId}`);
        }

        if (isActiveOnly) {
            whereClauses.push(sql`t."isActive" = TRUE`);
        }

        const whereClause = whereClauses.flatMap((x, i) => (i ? [sql`and`, x] : x));

        return await sql`
            SELECT
                ${sql.unsafe(query)}
            FROM
                tasks t
            LEFT JOIN
                users creator ON t."createdBy" = creator.id
            LEFT JOIN
                users updater ON t."updatedBy" = updater.id
            LEFT JOIN
                "taskTypes" tt ON t."taskTypeId" = tt.id
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

        const whereClause = whereClauses.flatMap((x, i) => (i ? [sql`and`, x] : x));

        return await sql`
            SELECT
                COUNT(id)
            FROM
                tasks t
            ${whereClause.length > 0 ? sql`WHERE ${whereClause}` : sql``}
        `.then(([x]) => x);
    },

    create: async (taskObj) => {
        const {
            name,
            phone,
            location,
            description,
            taskTypeId,
            typeId,
            when,
            duration,
            isCompleted,
            companyId,
            contactId,
            dealId,
            quoteId,
            ticketId,
            createdBy,
        } = taskObj;

        return await sql`
            INSERT INTO tasks (
                name,
                phone,
                location,
                description,
                "taskTypeId",
                "typeId",
                "when",
                "duration",
                "isCompleted",
                "companyId",
                "contactId",
                "dealId",
                "quoteId",
                "ticketId",
                "createdBy"
            ) VALUES (
                ${name},
                ${phone},
                ${location},
                ${description},
                ${taskTypeId},
                ${typeId},
                ${when},
                ${duration},
                ${isCompleted},
                ${companyId},
                ${contactId},
                ${dealId},
                ${quoteId},
                ${ticketId},
                ${createdBy}
            ) returning id, name
        `.then(([x]) => x);
    },

    findOne: async (id) => {
        return await sql`
            SELECT
                t.id,
                t.name,
                t.phone,
                t.location,
                t.description,
                t."isActive",
                t."taskTypeId",
                tt."name" AS "taskType",
                t."createdAt",
                t."updatedAt",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                tasks t
            LEFT JOIN
                users creator ON t."createdBy" = creator.id
            LEFT JOIN
                users updater ON t."updatedBy" = updater.id
            LEFT JOIN
                "taskTypes" tt ON t."taskTypeId" = tt.id
            WHERE
                t.id = ${id}
        `.then(([x]) => x);
    },

    update: async (taskObj) => {
        const {
            id,
            name,
            phone,
            location,
            description,
            taskTypeId,
            typeId,
            when,
            duration,
            isCompleted,
            updatedBy,
        } = taskObj;

        return await sql`
            UPDATE
                tasks
            SET
                name = ${name},
                phone = ${phone},
                location = ${location},
                description = ${description},
                "taskTypeId" = ${taskTypeId},
                "typeId" = ${typeId},
                "when" = ${when},
                "duration" = ${duration},
                "isCompleted" = ${isCompleted},
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id, name
        `.then(([x]) => x);
    },

    destroy: async (id) => {
        return await destroy("tasks", id);
    },

    archive: async (taskObj) => {
        const obj = { ...taskObj, isActive: false };
        return await updateStatus("tasks", obj);
    },

    active: async (taskObj) => {
        const obj = { ...taskObj, isActive: true };
        return await updateStatus("tasks", obj);
    },
};

const sql = require("../db/sql");
const updateStatus = require("./_base/update-status");
const destroy = require("./_base/destroy");

module.exports = {
    find: async (optionsObj) => {
        const { skip, limit, search, orderBy, orderDir, query, companyId, contactId, dealId } =
            optionsObj;

        const whereClause = search ? sql` WHERE "name" iLIKE ${"%" + search + "%"}` : sql``;

        const whereClause2 = companyId ? sql` WHERE "companyId" = ${companyId}` : sql``;

        const whereClause3 = contactId ? sql` WHERE "contactId" = ${contactId}` : sql``;

        const whereClause4 = dealId ? sql` WHERE "dealId" = ${dealId}` : sql``;

        return await sql`
            SELECT
                ${sql.unsafe(query)}
            FROM
                quotes q
            LEFT JOIN
                users creator ON q."createdBy" = creator.id
            LEFT JOIN
                users updater ON q."updatedBy" = updater.id
            ${whereClause}
            ${whereClause2}
            ${whereClause3} 
            ${whereClause4}
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

        const whereClause = search ? sql` WHERE "name" iLIKE ${"%" + search + "%"}` : sql``;

        return await sql`
            SELECT
                COUNT(id)
            FROM
                quotes
            ${whereClause}
        `.then(([x]) => x);
    },

    create: async (quoteObj) => {
        const {
            name,
            total,
            description,
            companyId,
            contactId,
            dealId,
            sourceId,
            stageId,
            statusId,
            discount,
            tax,
            probabilityId,
            assigneeId,
            templateId,
            expireOn,
            createdBy,
        } = quoteObj;

        return await sql`
            INSERT INTO quotes (
                name,
                total,
                description,
                "sourceId",
                "stageId",
                "statusId",
                discount,
                tax,
                "probabilityId",
                "assigneeId",
                "templateId",
                "expireOn",
                "companyId",
                "contactId",
                "dealId",
                "createdBy"
            ) VALUES (
                ${name},
                ${total},
                ${description},
                ${sourceId},
                ${stageId},
                ${statusId},
                ${discount},
                ${tax},
                ${probabilityId},
                ${assigneeId},
                ${templateId},
                ${expireOn},
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
                q.id,
                q.name,
                q.total,
                q.description,
                q."isActive",
                q."createdAt",
                q."updatedAt",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                quotes q
            LEFT JOIN
                users creator ON q."createdBy" = creator.id
            LEFT JOIN
                users updater ON q."updatedBy" = updater.id
            WHERE
                q.id = ${id}
        `.then(([x]) => x);
    },

    update: async (quoteObj) => {
        const {
            id,
            name,
            total,
            description,
            sourceId,
            stageId,
            statusId,
            discount,
            tax,
            probabilityId,
            assigneeId,
            templateId,
            expireOn,
            updatedBy,
        } = quoteObj;

        return await sql`
            UPDATE
                quotes
            SET
                name = ${name},
                total = ${total},
                description = ${description},
                "sourceId" = ${sourceId},
                "stageId" = ${stageId},
                "statusId" = ${statusId},
                discount = ${discount},
                tax = ${tax},
                "probabilityId" = ${probabilityId},
                "assigneeId" = ${assigneeId},
                "templateId" = ${templateId},
                "expireOn" = ${expireOn},
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id, name
            `.then(([x]) => x);
    },

    destroy: async (id) => {
        return await destroy("quotes", id);
    },

    archive: async (quoteObj) => {
        const obj = { ...quoteObj, isActive: false };
        return await updateStatus("quotes", obj);
    },

    active: async (quoteObj) => {
        const obj = { ...quoteObj, isActive: true };
        return await updateStatus("quotes", obj);
    },
};

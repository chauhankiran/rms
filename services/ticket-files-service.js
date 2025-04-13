const sql = require("../db/sql");

module.exports = {
    create: async (ticketFileObj) => {
        const { name, displayName, ticketId, createdBy } = ticketFileObj;

        return await sql`
            INSERT INTO "ticketFiles" (
                name,
                "displayName",
                "ticketId",
                "createdBy"
            ) VALUES (
                ${name},
                ${displayName},
                ${ticketId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (ticketId) => {
        return await sql`
            SELECT
                tc.id,
                tc.name,
                tc."displayName",
                tc."isActive",
                tc."createdAt",
                tc."updatedAt",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                "ticketFiles" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."ticketId" = ${ticketId}
        `;
    },

    findOneById: async (id) => {
        return await sql`
            SELECT
                tc.id,
                tc.name,
                tc."displayName",
                tc."isActive",
                tc."createdAt",
                tc."updatedAt",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                "ticketFiles" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."id" = ${id}
        `.then(([x]) => x);
    },

    destroy: async (fileId) => {
        return await sql`
            DELETE FROM 
                "ticketFiles"
            WHERE 
                id = ${fileId}
            returning id
        `.then(([x]) => x);
    },
};

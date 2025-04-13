const sql = require("../db/sql");

module.exports = {
    create: async (contactFileObj) => {
        const { name, displayName, contactId, createdBy } = contactFileObj;

        return await sql`
            INSERT INTO "contactFiles" (
                name,
                "displayName",
                "contactId",
                "createdBy"
            ) VALUES (
                ${name},
                ${displayName},
                ${contactId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (contactId) => {
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
                "contactFiles" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."contactId" = ${contactId}
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
                "contactFiles" tc
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
                "contactFiles"
            WHERE 
                id = ${fileId}
            returning id
        `.then(([x]) => x);
    },
};

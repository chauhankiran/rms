const sql = require("../db/sql");
const destroy = require("./_base/destroy");

module.exports = {
    create: async (quoteFileObj) => {
        const { name, displayName, quoteId, createdBy } = quoteFileObj;

        return await sql`
            INSERT INTO "quoteFiles" (
                name,
                "displayName",
                "quoteId",
                "createdBy"
            ) VALUES (
                ${name},
                ${displayName},
                ${quoteId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (quoteId) => {
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
                "quoteFiles" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."quoteId" = ${quoteId}
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
                "quoteFiles" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."id" = ${id}
        `.then(([x]) => x);
    },

    destroy: async (fileId) => {
        return await destroy("quoteFiles", fileId);
    },
};

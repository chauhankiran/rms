const sql = require("../db/sql");
const destroy = require("./_base/destroy");

module.exports = {
    create: async (dealFileObj) => {
        const { name, displayName, dealId, createdBy } = dealFileObj;

        return await sql`
            INSERT INTO "dealFiles" (
                name,
                "displayName",
                "dealId",
                "createdBy"
            ) VALUES (
                ${name},
                ${displayName},
                ${dealId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (dealId) => {
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
                "dealFiles" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."dealId" = ${dealId}
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
                "dealFiles" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."id" = ${id}
        `.then(([x]) => x);
    },

    destroy: async (fileId) => {
        return await destroy("dealFiles", fileId);
    },
};

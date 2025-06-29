const sql = require("../db/sql");
const destroy = require("./_base/destroy");

module.exports = {
    create: async (companyFileObj) => {
        const { name, displayName, companyId, createdBy } = companyFileObj;

        return await sql`
            INSERT INTO "companyFiles" (
                name,
                "displayName",
                "companyId",
                "createdBy"
            ) VALUES (
                ${name},
                ${displayName},
                ${companyId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (companyId) => {
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
                "companyFiles" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."companyId" = ${companyId}
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
                "companyFiles" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."id" = ${id}
        `.then(([x]) => x);
    },

    destroy: async (fileId) => {
        return await destroy("companyFiles", fileId);
    },
};

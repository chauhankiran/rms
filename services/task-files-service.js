const sql = require("../db/sql");

module.exports = {
    create: async (taskFileObj) => {
        const { name, displayName, taskId, createdBy } = taskFileObj;

        return await sql`
            INSERT INTO "taskFiles" (
                name,
                "displayName",
                "taskId",
                "createdBy"
            ) VALUES (
                ${name},
                ${displayName},
                ${taskId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (taskId) => {
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
                "taskFiles" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."taskId" = ${taskId}
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
                "taskFiles" tc
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
                "taskFiles"
            WHERE 
                id = ${fileId}
            returning id
        `.then(([x]) => x);
    },
};

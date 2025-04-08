const sql = require("../db/sql");

module.exports = {
    create: async (taskCommentObj) => {
        const { comment, taskId, createdBy } = taskCommentObj;

        return await sql`
            INSERT INTO "taskComments" (
                comment,
                "taskId",
                "createdBy"
            ) VALUES (
                ${comment},
                ${taskId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (taskId) => {
        return await sql`
            SELECT
                tc.id,
                tc.comment,
                tc."isActive",
                tc."createdAt",
                tc."updatedAt",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                "taskComments" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."taskId" = ${taskId}
        `;
    },

    destroy: async (commentId) => {
        return await sql`
            DELETE FROM 
                "taskComments"
            WHERE 
                id = ${commentId}
            returning id
        `.then(([x]) => x);
    },
};

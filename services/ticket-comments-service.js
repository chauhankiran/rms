const sql = require("../db/sql");

module.exports = {
    create: async (ticketCommentObj) => {
        const { comment, ticketId, createdBy } = ticketCommentObj;

        return await sql`
            INSERT INTO "ticketComments" (
                comment,
                "ticketId",
                "createdBy"
            ) VALUES (
                ${comment},
                ${ticketId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (ticketId) => {
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
                "ticketComments" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."ticketId" = ${ticketId}
        `;
    },

    destroy: async (commentId) => {
        return await sql`
            DELETE FROM 
                "ticketComments"
            WHERE 
                id = ${commentId}
            returning id
        `.then(([x]) => x);
    },
};

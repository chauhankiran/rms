const sql = require("../db/sql");

module.exports = {
    create: async (quoteCommentObj) => {
        const { comment, quoteId, createdBy } = quoteCommentObj;

        return await sql`
            INSERT INTO "quoteComments" (
                comment,
                "quoteId",
                "createdBy"
            ) VALUES (
                ${comment},
                ${quoteId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (quoteId) => {
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
                "quoteComments" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."quoteId" = ${quoteId}
        `;
    },

    destroy: async (commentId) => {
        return await sql`
            DELETE FROM 
                "quoteComments"
            WHERE 
                id = ${commentId}
            returning id
        `.then(([x]) => x);
    },
};

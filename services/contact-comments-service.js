const sql = require("../db/sql");

module.exports = {
    create: async (contactCommentObj) => {
        const { comment, contactId, createdBy } = contactCommentObj;

        return await sql`
            INSERT INTO "contactComments" (
                comment,
                "contactId",
                "createdBy"
            ) VALUES (
                ${comment},
                ${contactId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (contactId) => {
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
                "contactComments" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."contactId" = ${contactId}
        `;
    },

    destroy: async (commentId) => {
        return await sql`
            DELETE FROM 
                "contactComments"
            WHERE 
                id = ${commentId}
            returning id
        `.then(([x]) => x);
    },
};

const sql = require("../db/sql");

module.exports = {
    create: async (dealCommentObj) => {
        const { comment, dealId, createdBy } = dealCommentObj;

        return await sql`
            INSERT INTO "dealComments" (
                comment,
                "dealId",
                "createdBy"
            ) VALUES (
                ${comment},
                ${dealId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (dealId) => {
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
                "dealComments" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."dealId" = ${dealId}
        `;
    },

    destroy: async (commentId) => {
        return await sql`
            DELETE FROM 
                "dealComments"
            WHERE 
                id = ${commentId}
            returning id
        `.then(([x]) => x);
    },
};

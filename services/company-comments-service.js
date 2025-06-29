const sql = require("../db/sql");
const destroy = require("./_base/destroy");

module.exports = {
    create: async (companyCommentObj) => {
        const { comment, companyId, createdBy } = companyCommentObj;

        return await sql`
            INSERT INTO "companyComments" (
                comment,
                "companyId",
                "createdBy"
            ) VALUES (
                ${comment},
                ${companyId},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (companyId) => {
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
                "companyComments" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."companyId" = ${companyId}
        `;
    },

    destroy: async (commentId) => {
        return await destroy("companyComments", commentId);
    },
};

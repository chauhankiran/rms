const sql = require("../db/sql");

module.exports = {
    find: async (userId) => {
        return await sql`
            SELECT
                id,
                name
            FROM
                "companyViews"
            WHERE
                "userId" = ${userId}
            ORDER BY
                seq ASC
        `;
    },
    create: async ({ userId, field, seq }) => {
        return await sql`
            INSERT INTO "companyViews" (
                "userId", 
                "name", 
                "seq"
            ) VALUES (
                ${userId}, 
                ${field}, 
                ${seq}
            )
        `;
    },
    destroy: async (userId) => {
        return await sql`
            DELETE FROM
                "companyViews"
            WHERE
                "userId" = ${userId}
        `;
    },
    pluck: async (columns) => {
        return await sql`
            SELECT
                ${sql(columns)}
            FROM
                "companyViews"
        `;
    },
};

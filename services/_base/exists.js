const sql = require("../../db/sql");

const exists = async (table, id) => {
    return await sql`
        SELECT
            1
        FROM 
            ${sql(table)}
        WHERE
            id = ${id}
    `.then(([x]) => x);
};

module.exports = exists;

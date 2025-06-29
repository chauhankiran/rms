const sql = require("../../db/sql");

module.exports = async (table, id) => {
    // If the table is "contacts", return id, firstName, and lastName.
    // Else return id and name.
    const returning =
        table === "contacts" ? sql`id, "firstName", "lastName"` : sql`id, name`;

    return await sql`
        DELETE FROM
            ${sql(table)}
        WHERE
            id = ${id}
        returning ${returning}
    `.then(([x]) => x);
};

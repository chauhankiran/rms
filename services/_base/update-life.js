const sql = require("../../db/sql");

const updateLife = async (table, opt) => {
    const { id, updatedBy, life } = opt;

    // If the table is "contacts", return id, firstName, and lastName.
    // If the table name contains "labels", return id and displayName.
    // Else return id and name.
    let returning;
    if (table === "contacts") {
        returning = sql`id, "firstName", "lastName"`;
    } else if (table.includes("Labels")) {
        returning = sql`id, "displayName"`;
    } else {
        returning = sql`id, name`;
    }

    return await sql`
        UPDATE
            ${sql(table)}
        SET
            "life" = ${life},
            "updatedBy" = ${updatedBy},
            "updatedAt" = ${sql`now()`}
        WHERE
            id = ${id}
        returning ${returning}
    `.then(([x]) => x);
}

module.exports = updateLife;
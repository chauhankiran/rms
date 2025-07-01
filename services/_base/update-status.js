const sql = require("../../db/sql");

const updateStatus = async (table, obj) => {
    const { id, updatedBy, isActive } = obj;

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
            "isActive" = ${isActive},
            "updatedBy" = ${updatedBy},
            "updatedAt" = ${sql`now()`}
        WHERE
            id = ${id}
        returning ${returning}
    `.then(([x]) => x);
};

module.exports = updateStatus;

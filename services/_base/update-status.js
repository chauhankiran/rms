const sql = require("../../db/sql");

const updateStatus = async (table, obj) => {
    const { id, updatedBy, isActive } = obj;

    // If the table is "contacts", return id, firstName, and lastName.
    // Else return id and name.
    const returning = table === "contacts" ? sql`id, "firstName", "lastName"` : sql`id, name`;

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

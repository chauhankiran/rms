const sql = require("../../db/sql");

const updateStatus = async (tableName, obj) => {
    const { id, updatedBy, isActive } = obj;

    // If the table is "contacts", return id, firstName, and lastName.
    // If the table is one of the known tables, return id and name.
    // Otherwise, return just id.
    const returning =
        tableName === "contacts"
            ? sql`id, "firstName", "lastName"`
            : ["companies", "deals", "quotes", "tickets", "tasks"].includes(
                    tableName
                )
              ? sql`id, name`
              : sql`id`;

    return await sql`
        UPDATE
            ${sql(tableName)}
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

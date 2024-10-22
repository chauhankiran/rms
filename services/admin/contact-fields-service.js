const sql = require("../../db/sql");

module.exports = {
  addContactFieldsInSession: async () => {
    return await sql`
      SELECT
        name,
        "displayName"
      FROM
        "contactFields"
      WHERE
        "isActive" = true
    `;
  },
};

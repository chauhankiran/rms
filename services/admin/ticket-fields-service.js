const sql = require("../../db/sql");

module.exports = {
  addTicketFieldsInSession: async () => {
    return await sql`
      SELECT
        name,
        "displayName"
      FROM
        "ticketFields"
      WHERE
        "isActive" = true
    `;
  },
};

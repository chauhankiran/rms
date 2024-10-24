const sql = require("../../db/sql");

module.exports = {
  addTicketFieldsInSession: async () => {
    return await sql`
      SELECT
        name,
        "displayName"
      FROM
        "ticketLabels"
      WHERE
        "isActive" = true
    `;
  },
};

const sql = require("../../db/sql");

module.exports = {
  addQuoteFieldsInSession: async () => {
    return await sql`
      SELECT
        name,
        "displayName"
      FROM
        "quoteLabels"
      WHERE
        "isActive" = true
    `;
  },
};

const sql = require("../../db/sql");

module.exports = {
  addDealFieldsInSession: async () => {
    return await sql`
      SELECT
        name,
        "displayName"
      FROM
        "dealLabels"
      WHERE
        "isActive" = true
    `;
  },
};

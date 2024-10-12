const sql = require("../../db/sql");

module.exports = {
  addCompanyFieldsInSession: async () => {
    return await sql`
      SELECT
        name,
        "displayName"
      FROM
        "companyFields"
    `;
  },
};

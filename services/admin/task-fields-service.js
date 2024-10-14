const sql = require("../../db/sql");

module.exports = {
  addTaskFieldsInSession: async () => {
    return await sql`
      SELECT
        name,
        "displayName"
      FROM
        "taskFields"
    `;
  },
};

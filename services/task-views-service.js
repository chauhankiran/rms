const sql = require("../db/sql");

module.exports = {
  pluck: async (columns) => {
    return await sql`
      SELECT
        ${sql(columns)}
      FROM
        "taskViews"
    `;
  },
};

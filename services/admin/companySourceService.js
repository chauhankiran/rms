const sql = require("../../sql");

module.exports = {
  find: async (optionsObj) => {
    const { skip, limit, search, orderBy, orderDir } = optionsObj;

    const whereClause = search
      ? sql` WHERE name iLIKE ${"%" + search + "%"}`
      : sql``;

    return await sql`
      SELECT
        c.id,
        c.name,
        c."createdAt",
        c."updatedAt",
        c."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        "companySources" c
      LEFT JOIN
        users creator ON c."createdBy" = creator.id
      LEFT JOIN
        users updater ON c."updatedBy" = updater.id
      ${whereClause}
      ORDER BY
        ${sql(orderBy)}
        ${orderDir === "ASC" ? sql`ASC` : sql`DESC`}
      LIMIT
        ${limit}
      OFFSET
        ${skip}
    `;
  },
  count: async (optionsObj) => {
    const { search } = optionsObj;

    const whereClause = search
      ? sql` WHERE name iLIKE ${"%" + search + "%"}`
      : sql``;

    return await sql`
      SELECT
        COUNT(id)
      FROM
        "companySources"
      ${whereClause}
    `.then(([x]) => x);
  },
  create: async (companySourceObj) => {
    const { name, createdBy } = companySourceObj;

    return await sql`
        INSERT INTO "companySources" (
          name,
          "createdBy"
        ) VALUES (
          ${name},
          ${createdBy}
        ) returning id
      `;
  },
  findOne: async () => {},
  update: async () => {},
  destroy: async () => {},
};

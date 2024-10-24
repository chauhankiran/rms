const sql = require("../db/sql");

module.exports = {
  find: async (optionsObj) => {
    const {
      skip,
      limit,
      search,
      orderBy,
      orderDir,
      columns,
      companyId,
      contactId,
      dealId,
    } = optionsObj;

    const whereClause = search
      ? sql` WHERE "name" iLIKE ${"%" + search + "%"}`
      : sql``;

    const whereClause2 = companyId
      ? sql` WHERE "companyId" = ${companyId}`
      : sql``;

    const whereClause3 = contactId
      ? sql` WHERE "contactId" = ${contactId}`
      : sql``;

    const whereClause4 = dealId ? sql` WHERE "dealId" = ${dealId}` : sql``;

    return await sql`
      SELECT
        ${sql.unsafe(columns)}
      FROM
        quotes q
      LEFT JOIN
        users creator ON q."createdBy" = creator.id
      LEFT JOIN
        users updater ON q."updatedBy" = updater.id
      ${whereClause}
      ${whereClause2}
      ${whereClause3} 
      ${whereClause4}
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
      ? sql` WHERE "name" iLIKE ${"%" + search + "%"}`
      : sql``;

    return await sql`
      SELECT
        COUNT(id)
      FROM
        quotes
      ${whereClause}
    `.then(([x]) => x);
  },

  create: async (quoteObj) => {
    const {
      name,
      total,
      description,
      companyId,
      contactId,
      dealId,
      createdBy,
    } = quoteObj;

    return await sql`
      INSERT INTO quotes (
        name,
        total,
        description,
        "companyId",
        "contactId",
        "dealId",
        "createdBy"
      ) VALUES (
        ${name},
        ${total},
        ${description},
        ${companyId},
        ${contactId},
        ${dealId},
        ${createdBy}
      ) returning id
    `;
  },

  findOne: async (id) => {
    return await sql`
      SELECT
        q.id,
        q.name,
        q.total,
        q.description,
        q."isActive",
        q."createdAt",
        q."updatedAt",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        quotes q
      LEFT JOIN
        users creator ON q."createdBy" = creator.id
      LEFT JOIN
        users updater ON q."updatedBy" = updater.id
      WHERE
        q.id = ${id}
    `.then(([x]) => x);
  },

  update: async (quoteObj) => {
    const { id, name, total, description, updatedBy } = quoteObj;

    return await sql`
      UPDATE
        quotes
      SET
        name = ${name},
        total = ${total},
        description = ${description},
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  destroy: async (id) => {
    return await sql`
      DELETE FROM
        quotes
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  archive: async (quoteObj) => {
    const { id, updatedBy } = quoteObj;

    return await sql`
      UPDATE
        quotes
      SET
        "isActive" = false,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  active: async (quoteObj) => {
    const { id, updatedBy } = quoteObj;

    return await sql`
      UPDATE
        quotes
      SET
        "isActive" = true,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },
};

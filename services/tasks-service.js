const sql = require("../db/sql");

const updateTaskStatus = async (taskObj, status) => {
  const { id, updatedBy } = taskObj;

  return await sql`
    UPDATE
      tasks
    SET
      "isActive" = ${status},
      "updatedBy" = ${updatedBy},
      "updatedAt" = ${sql`now()`}
    WHERE
      id = ${id}
    returning id
  `.then(([x]) => x);
};

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
      quoteId,
      ticketId,
    } = optionsObj;

    const whereClause = search
      ? sql` WHERE t."name" iLIKE ${"%" + search + "%"}`
      : sql``;

    const whereClause2 = companyId
      ? sql` WHERE "companyId" = ${companyId}`
      : sql``;

    const whereClause3 = contactId
      ? sql` WHERE "contactId" = ${contactId}`
      : sql``;

    const whereClause4 = dealId ? sql` WHERE "dealId" = ${dealId}` : sql``;

    const whereClause5 = quoteId ? sql` WHERE "quoteId" = ${quoteId}` : sql``;

    const whereClause6 = ticketId
      ? sql` WHERE "ticketId" = ${ticketId}`
      : sql``;

    return await sql`
      SELECT
        ${sql.unsafe(columns)}
      FROM
        tasks t
      LEFT JOIN
        users creator ON t."createdBy" = creator.id
      LEFT JOIN
        users updater ON t."updatedBy" = updater.id
      LEFT JOIN
        "taskTypes" tt ON t."taskTypeId" = tt.id
      ${whereClause}
      ${whereClause2}
      ${whereClause3} 
      ${whereClause4}
      ${whereClause5}
      ${whereClause6}
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
        tasks
      ${whereClause}
    `.then(([x]) => x);
  },

  create: async (taskObj) => {
    const {
      name,
      description,
      taskTypeId,
      companyId,
      contactId,
      dealId,
      quoteId,
      ticketId,
      createdBy,
    } = taskObj;

    return await sql`
      INSERT INTO tasks (
        name,
        description,
        "taskTypeId",
        "companyId",
        "contactId",
        "dealId",
        "quoteId",
        "ticketId",
        "createdBy"
      ) VALUES (
        ${name},
        ${description},
        ${taskTypeId},
        ${companyId},
        ${contactId},
        ${dealId},
        ${quoteId},
        ${ticketId},
        ${createdBy}
      ) returning id
    `;
  },

  findOne: async (id) => {
    return await sql`
      SELECT
        t.id,
        t.name,
        t.description,
        t."isActive",
        t."taskTypeId",
        tt."name" AS "taskType",
        t."createdAt",
        t."updatedAt",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        tasks t
      LEFT JOIN
        users creator ON t."createdBy" = creator.id
      LEFT JOIN
        users updater ON t."updatedBy" = updater.id
      LEFT JOIN
        "taskTypes" tt ON t."taskTypeId" = tt.id
      WHERE
        t.id = ${id}
    `.then(([x]) => x);
  },

  update: async (taskObj) => {
    const { id, name, description, taskTypeId, updatedBy } = taskObj;

    return await sql`
      UPDATE
        tasks
      SET
        name = ${name},
        description = ${description},
        "taskTypeId" = ${taskTypeId},
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
        tasks
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
  },

  archive: async (taskObj) => {
    return await updateTaskStatus(taskObj, false);
  },

  active: async (taskObj) => {
    return await updateTaskStatus(taskObj, true);
  },
};

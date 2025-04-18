const sql = require("../db/sql");

module.exports = {
    find: async (optionsObj) => {
        const {
            skip,
            limit,
            search,
            orderBy,
            orderDir,
            query,
            companyId,
            contactId,
            dealId,
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

        return await sql`
      SELECT
        ${sql.unsafe(query)}
      FROM
        tickets t
      LEFT JOIN
        users creator ON t."createdBy" = creator.id
      LEFT JOIN
        users updater ON t."updatedBy" = updater.id
      LEFT JOIN
        "ticketTypes" tt ON t."ticketTypeId" = tt.id
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
        tickets
      ${whereClause}
    `.then(([x]) => x);
    },

    create: async (ticketObj) => {
        const {
            name,
            description,
            ticketTypeId,
            companyId,
            contactId,
            dealId,
            createdBy,
        } = ticketObj;

        return await sql`
            INSERT INTO tickets (
                name,
                description,
                "ticketTypeId",
                "companyId",
                "contactId",
                "dealId",
                "createdBy"
            ) VALUES (
                ${name},
                ${description},
                ${ticketTypeId},
                ${companyId},
                ${contactId},
                ${dealId},
                ${createdBy}
            ) returning id, name
        `.then(([x]) => x);
    },

    findOne: async (id) => {
        return await sql`
      SELECT
        t.id,
        t.name,
        t.description,
        t."isActive",
        t."ticketTypeId",
        tt."name" AS "ticketType",
        t."createdAt",
        t."updatedAt",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        tickets t
      LEFT JOIN
        users creator ON t."createdBy" = creator.id
      LEFT JOIN
        users updater ON t."updatedBy" = updater.id
      LEFT JOIN
        "ticketTypes" tt ON t."ticketTypeId" = tt.id
      WHERE
        t.id = ${id}
    `.then(([x]) => x);
    },

    update: async (ticketObj) => {
        const { id, name, description, ticketTypeId, updatedBy } = ticketObj;

        return await sql`
      UPDATE
        tickets
      SET
        name = ${name},
        description = ${description},
        "ticketTypeId" = ${ticketTypeId},
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
        tickets
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
    },

    archive: async (ticketObj) => {
        const { id, updatedBy } = ticketObj;

        return await sql`
      UPDATE
        tickets
      SET
        "isActive" = false,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
    },

    active: async (ticketObj) => {
        const { id, updatedBy } = ticketObj;

        return await sql`
      UPDATE
        tickets
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

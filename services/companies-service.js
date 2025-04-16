const sql = require("../db/sql");

module.exports = {
    find: async (optionsObj) => {
        const { skip, limit, search, orderBy, orderDir, query } = optionsObj;

        const whereClause = search
            ? sql` WHERE c.name iLIKE ${"%" + search + "%"}`
            : sql``;

        return await sql`
            SELECT
                ${sql.unsafe(query)}
            FROM
                companies c
            LEFT JOIN
                users creator ON c."createdBy" = creator.id
            LEFT JOIN
                users updater ON c."updatedBy" = updater.id
            LEFT JOIN
                "companySources" cs ON c."companySourceId" = cs.id
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
        companies
      ${whereClause}
    `.then(([x]) => x);
    },

    create: async (companyObj) => {
        const { name, employeeSize, description, companySourceId, createdBy } =
            companyObj;

        return await sql`
            INSERT INTO companies (
                name,
                "employeeSize",
                description,
                "companySourceId",
                "createdBy"
            ) VALUES (
                ${name},
                ${employeeSize},
                ${description},
                ${companySourceId},
                ${createdBy}
            ) returning id, name
        `.then(([x]) => x);
    },

    findOne: async (id) => {
        return await sql`
      SELECT
        c.id,
        c.name,
        c."employeeSize",
        c.description,
        c."isActive",
        c."companySourceId",
        cs."name" AS "companySource",
        c."createdAt",
        c."updatedAt",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        companies c
      LEFT JOIN
        users creator ON c."createdBy" = creator.id
      LEFT JOIN
        users updater ON c."updatedBy" = updater.id
      LEFT JOIN
        "companySources" cs ON c."companySourceId" = cs.id
      WHERE
        c.id = ${id}
    `.then(([x]) => x);
    },

    update: async (companyObj) => {
        const {
            id,
            name,
            employeeSize,
            description,
            companySourceId,
            updatedBy,
        } = companyObj;

        return await sql`
      UPDATE
        companies
      SET
        name = ${name},
        "employeeSize" = ${employeeSize},
        description = ${description},
        "companySourceId" = ${companySourceId},
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
        companies
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
    },

    archive: async (companyObj) => {
        const { id, updatedBy } = companyObj;

        return await sql`
      UPDATE
        companies
      SET
        "isActive" = false,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
    },

    active: async (companyObj) => {
        const { id, updatedBy } = companyObj;

        return await sql`
      UPDATE
        companies
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

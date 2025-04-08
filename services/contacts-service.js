const sql = require("../db/sql");

module.exports = {
    find: async (optionsObj) => {
        const { skip, limit, search, orderBy, orderDir, columns, companyId } =
            optionsObj;

        const whereClause = search
            ? sql` WHERE "firstName" iLIKE ${"%" + search + "%"} OR "lastName" iLIKE ${"%" + search + "%"}`
            : sql``;

        const whereClause2 = companyId
            ? sql` WHERE "companyId" = ${companyId}`
            : sql``;

        return await sql`
      SELECT
        ${sql.unsafe(columns)}
      FROM
        contacts c
      LEFT JOIN
        users creator ON c."createdBy" = creator.id
      LEFT JOIN
        users updater ON c."updatedBy" = updater.id
      LEFT JOIN
        "contactIndustries" ci ON c."contactIndustryId" = ci.id
      ${whereClause}
      ${whereClause2}
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
            ? sql` WHERE "lastName" iLIKE ${"%" + search + "%"}`
            : sql``;

        return await sql`
      SELECT
        COUNT(id)
      FROM
        contacts
      ${whereClause}
    `.then(([x]) => x);
    },

    create: async (contactObj) => {
        const {
            prefix,
            firstName,
            lastName,
            annualRevenue,
            description,
            contactIndustryId,
            companyId,
            createdBy,
        } = contactObj;

        return await sql`
            INSERT INTO contacts (
                prefix,
                "firstName",
                "lastName",
                "annualRevenue",
                description,
                "contactIndustryId",
                "companyId",
                "createdBy"
            ) VALUES (
                ${prefix},
                ${firstName},
                ${lastName},
                ${annualRevenue},
                ${description},
                ${contactIndustryId},
                ${companyId},
                ${createdBy}
            ) returning id, "firstName", "lastName"
        `.then(([x]) => x);
    },

    findOne: async (id) => {
        return await sql`
      SELECT
        c.id,
        c.prefix,
        c."firstName",
        c."lastName",
        c."annualRevenue",
        c.description,
        c."isActive",
        c."contactIndustryId",
        ci."name" AS "contactIndustry",
        c."createdAt",
        c."updatedAt",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        contacts c
      LEFT JOIN
        users creator ON c."createdBy" = creator.id
      LEFT JOIN
        users updater ON c."updatedBy" = updater.id
      LEFT JOIN
        "contactIndustries" ci ON c."contactIndustryId" = ci.id
      WHERE
        c.id = ${id}
    `.then(([x]) => x);
    },

    update: async (contactObj) => {
        const {
            id,
            prefix,
            firstName,
            lastName,
            annualRevenue,
            description,
            contactIndustryId,
            updatedBy,
        } = contactObj;

        return await sql`
      UPDATE
        contacts
      SET
        prefix = ${prefix},
        "firstName" = ${firstName},
        "lastName" = ${lastName},
        "annualRevenue" = ${annualRevenue},
        description = ${description},
        "contactIndustryId" = ${contactIndustryId},
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
        contacts
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
    },

    archive: async (contactObj) => {
        const { id, updatedBy } = contactObj;

        return await sql`
      UPDATE
        contacts
      SET
        "isActive" = false,
        "updatedBy" = ${updatedBy},
        "updatedAt" = ${sql`now()`}
      WHERE
        id = ${id}
      returning id
    `.then(([x]) => x);
    },

    active: async (contactObj) => {
        const { id, updatedBy } = contactObj;

        return await sql`
      UPDATE
        contacts
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

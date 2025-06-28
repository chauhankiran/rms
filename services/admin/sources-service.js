const sql = require("../../db/sql");
const updateStatus = require("../_base/update-status");

module.exports = {
    find: async (optionsObj) => {
        const { skip, limit, search, orderBy, orderDir } = optionsObj;

        const whereClause = search
            ? sql` WHERE name iLIKE ${"%" + search + "%"}`
            : sql``;

        return await sql`
      SELECT
        s.id,
        s.name,
        s."createdAt",
        s."updatedAt",
        s."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        sources s
      LEFT JOIN
        users creator ON s."createdBy" = creator.id
      LEFT JOIN
        users updater ON s."updatedBy" = updater.id
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
        sources
      ${whereClause}
    `.then(([x]) => x);
    },

    create: async (sourceObj) => {
        const { name, createdBy } = sourceObj;

        return await sql`
            INSERT INTO sources (
                name,
                "createdBy"
            ) VALUES (
                ${name},
                ${createdBy}
            ) returning id
        `;
    },

    findOne: async (id) => {
        return await sql`
      SELECT
        s.id,
        s.name,
        s."createdAt",
        s."updatedAt",
        s."isActive",
        creator.id AS "createdById",
        creator.email AS "createdByEmail",
        updater.id AS "updatedById",
        updater.email AS "updatedByEmail"
      FROM
        sources s
      LEFT JOIN
        users creator ON s."createdBy" = creator.id
      LEFT JOIN
        users updater ON s."updatedBy" = updater.id
      WHERE
        s.id = ${id}
    `.then(([x]) => x);
    },

    update: async (userObj) => {
        const { id, name, updatedBy } = userObj;

        return await sql`
            UPDATE
                sources
            SET
                name = ${name},
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
                sources
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    archive: async (sourceObj) => {
        const obj = { ...sourceObj, isActive: false };
        return await updateStatus("sources", obj);
    },
    active: async (sourceObj) => {
        const obj = { ...sourceObj, isActive: true };
        return await updateStatus("sources", obj);
    },

    pluck: async (columns) => {
        return await sql`
            SELECT
                ${sql(columns)}
            FROM
                sources
            WHERE
                "isActive" = true
        `;
    },
};

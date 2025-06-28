const sql = require("../../db/sql");

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
        stages s
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
                stages
            ${whereClause}
        `.then(([x]) => x);
    },

    create: async (stateObj) => {
        const { name, createdBy } = stateObj;

        return await sql`
            INSERT INTO stages (
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
        stages s
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
                stages
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
                stages
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    archive: async (stateObj) => {
        const { id, updatedBy } = stateObj;

        return await sql`
            UPDATE
                stages
            SET
                "isActive" = false,
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },
    active: async (stateObj) => {
        const { id, updatedBy } = stateObj;

        return await sql`
            UPDATE
                stages
            SET
                "isActive" = true,
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    pluck: async (columns) => {
        return await sql`
            SELECT
                ${sql(columns)}
            FROM
                stages
        `;
    },
};

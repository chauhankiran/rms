const sql = require("../db/sql");
const updateStatus = require("./_base/update-status");

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
            isActiveOnly,
        } = optionsObj;

        const whereClauses = [];

        if (search) {
            whereClauses.push(
                sql`"firstName" iLIKE ${"%" + search + "%"} OR "lastName" iLIKE ${"%" + search + "%"}`
            );
        }

        if (companyId) {
            whereClauses.push(sql`"companyId" = ${companyId}`);
        }

        if (isActiveOnly) {
            whereClauses.push(sql`c."isActive" = TRUE`);
        }

        const whereClause = whereClauses.flatMap((x, i) =>
            i ? [sql`and`, x] : x
        );

        return await sql`
            SELECT
                ${sql.unsafe(query)}
            FROM
                contacts c
            LEFT JOIN
                users creator ON c."createdBy" = creator.id
            LEFT JOIN
                users updater ON c."updatedBy" = updater.id
            LEFT JOIN
                "contactIndustries" ci ON c."contactIndustryId" = ci.id
            ${whereClause.length > 0 ? sql`WHERE ${whereClause}` : sql``}
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
        const { search, isActiveOnly } = optionsObj;

        const whereClauses = [];

        if (search) {
            whereClauses.push(
                sql`"firstName" iLIKE ${"%" + search + "%"} OR "lastName" iLIKE ${"%" + search + "%"}`
            );
        }

        if (isActiveOnly) {
            whereClauses.push(sql`c."isActive" = TRUE`);
        }

        const whereClause = whereClauses.flatMap((x, i) =>
            i ? [sql`and`, x] : x
        );

        return await sql`
            SELECT
                COUNT(id)
            FROM
                contacts c
            ${whereClause.length > 0 ? sql`WHERE ${whereClause}` : sql``}
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
            returning id, "firstName", "lastName"
        `.then(([x]) => x);
    },

    destroy: async (id) => {
        return await sql`
            DELETE FROM
                contacts
            WHERE
                id = ${id}
            returning id, "firstName", "lastName"
        `.then(([x]) => x);
    },

    archive: async (contactObj) => {
        const obj = { ...contactObj, isActive: false };
        return await updateStatus("contacts", obj);
    },

    active: async (contactObj) => {
        const obj = { ...contactObj, isActive: true };
        return await updateStatus("contacts", obj);
    },
};

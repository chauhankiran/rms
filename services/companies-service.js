const sql = require("../db/sql");

// Update the status of company to
//      - isActive = false
//      - isActive = true
const updateCompanyStatus = async (companyObj, status) => {
    const { id, updatedBy } = companyObj;

    return await sql`
        UPDATE
            companies
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
    // Return many companies.
    find: async (optionsObj) => {
        const { skip, limit, search, orderBy, orderDir, query, isActiveOnly } =
            optionsObj;

        const whereClauses = [];

        if (search) {
            whereClauses.push(sql`c."name" iLIKE ${"%" + search + "%"}`);
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
                companies c
            LEFT JOIN
                users creator ON c."createdBy" = creator.id
            LEFT JOIN
                users updater ON c."updatedBy" = updater.id
            LEFT JOIN
                "companySources" cs ON c."companySourceId" = cs.id
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

    // Return many companies count.
    count: async (optionsObj) => {
        const { search, isActiveOnly } = optionsObj;

        const whereClauses = [];

        if (search) {
            whereClauses.push(sql`c."name" iLIKE ${"%" + search + "%"}`);
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
                companies c
            ${whereClause.length > 0 ? sql`WHERE ${whereClause}` : sql``}
        `.then(([x]) => x);
    },

    // Find one by id.
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

    // Create a new company.
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

    // Update an existing company.
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

    // Delete a company by id.
    destroy: async (id) => {
        return await sql`
            DELETE FROM
                companies
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    // Soft-delete an existing company.
    archive: async (companyObj) => {
        return await updateCompanyStatus(companyObj, false);
    },

    // Undo soft-delete an existing company.
    active: async (companyObj) => {
        return await updateCompanyStatus(companyObj, true);
    },

    // Check if the given company is exist or not by id.
    exists: async (id) => {
        return await sql`
            SELECT
                id
            FROM
                companies
            WHERE
                id = ${id}
        `.then(([x]) => x);
    },

    // Find many comments by company id.
    findComments: async (companyId) => {
        return await sql`
            SELECT
                tc.id,
                tc.comment,
                tc."isActive",
                tc."createdAt",
                tc."updatedAt",
                creator.id AS "createdById",
                creator.email AS "createdByEmail",
                updater.id AS "updatedById",
                updater.email AS "updatedByEmail"
            FROM
                "companyComments" tc
            LEFT JOIN
                users creator ON tc."createdBy" = creator.id
            LEFT JOIN
                users updater ON tc."updatedBy" = updater.id
            WHERE
                tc."companyId" = ${companyId}
        `;
    },

    // Create a new commnt.
    createComment: async (commentObj) => {
        const { comment, companyId, createdBy } = commentObj;

        return await sql`
            INSERT INTO "companyComments" (
                comment,
                "companyId",
                "createdBy"
            ) VALUES (
                ${comment},
                ${companyId},
                ${createdBy}
            ) returning id
        `;
    },

    // Delete an existing comment.
    destroyComment: async (id) => {
        return await sql`
            DELETE FROM 
                "companyComments"
            WHERE 
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    // Check if the given company comment is exist or not by id.
    existsComment: async (id) => {
        return await sql`
            SELECT
                id
            FROM
                "companyComments"
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },
};

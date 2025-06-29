const sql = require("../db/sql");
const updateStatus = require("./_base/update-status");
const destroy = require("./_base/destroy");

module.exports = {
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

    create: async (companyObj) => {
        const {
            name,
            employeeSize,
            description,
            website,
            email,
            phone,
            mobile,
            fax,
            address1,
            address2,
            city,
            stateId,
            zip,
            countryId,
            sourceId,
            statusId,
            stageId,
            industryId,
            closeDate,
            closeReason,
            assigneeId,
            revenue,
            typeId,
            companySourceId,
            createdBy,
        } = companyObj;

        return await sql`
            INSERT INTO companies (
                name,
                "employeeSize",
                website,
                email,
                phone,
                mobile,
                fax,
                address1,
                address2,
                city,
                "stateId",
                zip,
                "countryId",
                "sourceId",
                "statusId",
                "stageId",
                "industryId",
                "closeDate",
                "closeReason",
                "assigneeId",
                revenue,
                "typeId",
                description,
                "companySourceId",
                "createdBy"
            ) VALUES (
                ${name},
                ${employeeSize},
                ${website},
                ${email},
                ${phone},
                ${mobile},
                ${fax},
                ${address1},
                ${address2},
                ${city},
                ${stateId},
                ${zip},
                ${countryId},
                ${sourceId},
                ${statusId},
                ${stageId},
                ${industryId},
                ${closeDate},
                ${closeReason},
                ${assigneeId},
                ${revenue},
                ${typeId},
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
                c.website,
                c.email,
                c.phone,
                c.mobile,
                c.fax,
                c.address1,
                c.address2,
                c.city,
                c."stateId",
                c.zip,
                c."countryId",
                c."sourceId",
                c."statusId",
                c."stageId",
                c."industryId",
                c."closeDate",
                c."closeReason",
                c."assigneeId",
                c.revenue,
                c."typeId",
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
            website,
            email,
            phone,
            mobile,
            fax,
            address1,
            address2,
            city,
            stateId,
            zip,
            countryId,
            sourceId,
            statusId,
            stageId,
            industryId,
            closeDate,
            closeReason,
            assigneeId,
            revenue,
            typeId,
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
                website = ${website},
                email = ${email},
                phone = ${phone},
                mobile = ${mobile},
                fax = ${fax},
                address1 = ${address1},
                address2 = ${address2},
                city = ${city},
                "stateId" = ${stateId},
                zip = ${zip},
                "countryId" = ${countryId},
                "sourceId" = ${sourceId},
                "statusId" = ${statusId},
                "stageId" = ${stageId},
                "industryId" = ${industryId},
                "closeDate" = ${closeDate},
                "closeReason" = ${closeReason},
                "assigneeId" = ${assigneeId},
                revenue = ${revenue},
                "typeId" = ${typeId},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id, name
        `.then(([x]) => x);
    },

    destroy: async (id) => {
        return await destroy("companies", id);
    },

    archive: async (companyObj) => {
        const obj = { ...companyObj, isActive: false };
        return await updateStatus("companies", obj);
    },

    active: async (companyObj) => {
        const obj = { ...companyObj, isActive: true };
        return await updateStatus("companies", obj);
    },
};

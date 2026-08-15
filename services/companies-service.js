const sql = require("../db/sql");
const destroy = require("./_base/destroy");
const updateLife = require("./_base/update-life");

module.exports = {
    // Find many companies.
    find: async (opt) => {
        const { skip, limit, search, orderBy, orderDir, query, isActiveOnly } =
            opt;

        const whereClauses = [];

        if (search) {
            whereClauses.push(sql`c."name" iLIKE ${"%" + search + "%"}`);
        }

        if (isActiveOnly) {
            whereClauses.push(sql`c."life" = 1`);
        }

        const whereClause = whereClauses.flatMap((x, i) =>
            i ? [sql`and`, x] : x,
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

    // Count many companies.
    count: async (opt) => {
        const { search, isActiveOnly } = opt;

        const whereClauses = [];

        if (search) {
            whereClauses.push(sql`c."name" iLIKE ${"%" + search + "%"}`);
        }

        if (isActiveOnly) {
            whereClauses.push(sql`c."life" = 1`);
        }

        const whereClause = whereClauses.flatMap((x, i) =>
            i ? [sql`and`, x] : x,
        );

        return await sql`
            SELECT
                COUNT(id)
            FROM
                companies c
            ${whereClause.length > 0 ? sql`WHERE ${whereClause}` : sql``}
        `.then(([x]) => x);
    },

    // Find one company.
    findOne: async (opt) => {
        const { id, orgId } = opt;

        return await sql`
            SELECT
                companies.id as id,
                companies.name as name,
                companies.email as email,
                companies.website as website,
                companies.phone as phone,
                companies.mobile as mobile,
                companies.telephone as telephone,
                companies.fax as fax,
                companies.address1 as address1,
                companies.address2 as address2,
                companies.city as city,
                companies.zip as zip,
                companies.revenue as revenue,
                companies."employeeSize" as "employeeSize",
                companies."createdAt" as "createdAt",
                companies."updatedAt" as "updatedAt",
                companies.life as "life",
                
                states.name as state,
                countries.name as country,
                industries.name as industry,
                sources.name as source,
                statuses.name as status,
                stages.name as stage,

                users."firstName" || ' ' || users."lastName" as "createdByName",
                updatedBy."firstName" || ' ' || updatedBy."lastName" as "updatedByName"
            FROM
                companies
            LEFT JOIN 
                states ON companies."stateId" = states.id
            LEFT JOIN 
                countries ON companies."countryId" = countries.id
            LEFT JOIN 
                industries ON companies."industryId" = industries.id
            LEFT JOIN 
                sources ON companies."sourceId" = sources.id
            LEFT JOIN 
                statuses ON companies."statusId" = statuses.id
            LEFT JOIN 
                stages ON companies."stageId" = stages.id
            
            LEFT JOIN
                users ON companies."createdBy" = users.id
            LEFT JOIN
                users AS updatedBy ON companies."updatedBy" = updatedBy.id

            WHERE
                companies.id = ${id} and
                companies."orgId" = ${orgId}
        `.then(([x]) => x);
    },

    // Create a company.
    create: async (company) => {
        const {
            name,
            email,
            website,
            phone,
            mobile,
            telephone,
            fax,
            address1,
            address2,
            city,
            zip,
            stateId,
            countryId,
            industryId,
            revenue,
            employeeSize,
            sourceId,
            statusId,
            stageId,
            userId,
            orgId,
        } = company;

        return await sql`
            INSERT INTO "companies" (
                name,
                email,
                website,
                phone,
                mobile,
                telephone,
                fax,
                address1,
                address2,
                city,
                zip,
                "stateId",
                "countryId",
                "industryId",
                revenue,
                "employeeSize",
                "sourceId",
                "statusId",
                "stageId",
                "orgId",
                "createdBy"
            ) VALUES (
                ${name},
                ${email},
                ${website},
                ${phone},
                ${mobile},
                ${telephone},
                ${fax},
                ${address1},
                ${address2},
                ${city},
                ${zip},
                ${stateId},
                ${countryId},
                ${industryId},
                ${revenue},
                ${employeeSize},
                ${sourceId},
                ${statusId},
                ${stageId},
                ${orgId},
                ${userId}
            ) returning id, name
        `.then(([x]) => x);
    },

    // Update a company.
    update: async (company) => {
        const {
            id,
            name,
            email,
            website,
            phone,
            mobile,
            telephone,
            fax,
            address1,
            address2,
            city,
            zip,
            stateId,
            countryId,
            industryId,
            revenue,
            employeeSize,
            sourceId,
            statusId,
            stageId,
            updatedBy,
            orgId,
        } = company;

        return await sql`
            UPDATE
                "companies"
            SET
                name = ${name},
                email = ${email},
                website = ${website},
                phone = ${phone},
                mobile = ${mobile},
                telephone = ${telephone},
                fax = ${fax},
                address1 = ${address1},
                address2 = ${address2},
                city = ${city},
                zip = ${zip},
                "stateId" = ${stateId},
                "countryId" = ${countryId},
                "industryId" = ${industryId},
                revenue = ${revenue},
                "employeeSize" = ${employeeSize},
                "sourceId" = ${sourceId},
                "statusId" = ${statusId},
                "stageId" = ${stageId},
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id} AND
                "orgId" = ${orgId}
            RETURNING id, name
        `.then(([x]) => x);
    },

    // Delete a company.
    destroy: async (opt) => {
        const { id } = opt;
        return await destroy("companies", id);
    },

    // Archive a company. life = 0.
    archive: async (opt) => {
        const obj = { ...opt, life: 0 };
        return await updateLife("companies", obj);
    },

    // Active the archived company. life = 1.
    active: async (opt) => {
        const obj = { ...opt, life: 1 };
        return await updateLife("companies", obj);
    },
};

const express = require("express");
const sql = require("../db/sql");
const router = express.Router();

router.get("/", async (req, res, next) => {

  try {
    const companies = await sql`
        SELECT
            *
        FROM
            companies
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;
    
    console.log(companies);

    return res.render("companies/index", {
      title: req.app.locals.helpers.plural(req.session.fields.system.company),
      companies,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/new", async (req, res, next) => {
  try {
    // states
    const states = await sql`
        SELECT
            *
        FROM
            states
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    // countries
    const countries = await sql`
        SELECT
            *
        FROM
            countries
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    // industries
    const industries = await sql`
        SELECT
            *
        FROM
            industries
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    // sources
    const sources = await sql`
        SELECT
            *
        FROM
            sources
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    // statuses
    const statuses = await sql`
        SELECT
            *
        FROM
            statuses
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    // stages
    const stages = await sql`
        SELECT
            *
        FROM
            stages
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    return res.render("companies/new", {
      title: req.session.fields.system.company,
      states,
      countries,
      industries,
      sources,
      statuses,
      stages,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/create", async (req, res, next) => {
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
  } = req.body;

  try {
    const company = await sql`
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
                "createdBy",
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
                ${req.session.orgId},
                ${req.session.userId}
            ) returning id
        `.then(([x]) => x);

    req.flash("info", `Company with #[${company.id}] created.`);
    return res.redirect(`/companies/${company.id}`);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const company = await sql`
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
                companies."orgId" = ${req.session.orgId} and
                companies.life = 1
        `.then(([x]) => x);

    return res.render("companies/show", {
      title: `Show ${req.session.fields.system.company}`,
      company,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/edit", async (req, res, next) => {
  const id = req.params.id;

  try {
    // states
    const states = await sql`
        SELECT
            *
        FROM
            states
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    // countries
    const countries = await sql`
        SELECT
            *
        FROM
            countries
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    // industries
    const industries = await sql`
        SELECT
            *
        FROM
            industries
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    // sources
    const sources = await sql`
        SELECT
            *
        FROM
            sources
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    // statuses
    const statuses = await sql`
        SELECT
            *
        FROM
            statuses
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    // stages
    const stages = await sql`
        SELECT
            *
        FROM
            stages
        WHERE
            "orgId" = ${req.session.orgId} and
            life = 1
    `;

    const company = await sql`
        SELECT
            *
        FROM
            companies
        WHERE
            id = ${id} and
            "orgId" = ${req.session.orgId} and
            life = 1
    `.then(([x]) => x);

    console.log(company);

    return res.render("companies/edit", {
        title: `Edit ${req.session.fields.system.company}`,
        company,
        states,
        countries,
        industries,
        sources,
        statuses,
        stages,
    });
  } catch (err) {
    next(err);
  }
});

router.put("/:id/update", async (req, res, next) => {
  const id = req.params.id;

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
  } = req.body;

  try {
    const company = await sql`
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
                "updatedBy" = ${req.session.userId},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id} AND
                "orgId" = ${req.session.orgId}
            RETURNING id
        `.then(([x]) => x);

    req.flash("info", `Company with #[${company.id}] updated.`);
    return res.redirect(`/companies/${company.id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require("express");
const sql = require("../db/sql");
const router = express.Router();

router.get("/", (req, res) => {
  return res.render("companies/index", {
    title: req.app.locals.helpers.plural(req.session.fields.system.company),
  });
});

router.get("/new", (req, res) => {
  return res.render("companies/new", {
    title: req.session.fields.system.company,
  });
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
                "orgId"
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
                ${req.session.orgId}
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
                *
            FROM
                companies
            WHERE
                id = ${id} and
                "orgId" = ${req.session.orgId} and
                life = 1
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

    return res.render("companies/edit", {
      title: `Edit ${req.session.fields.system.company}`,
      company,
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
                "stageId" = ${stageId}
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

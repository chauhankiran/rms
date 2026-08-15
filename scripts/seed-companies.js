require("dotenv").config({ quiet: true });
const sql = require("../db/sql");

const count = Number(process.argv[2]);
const orgUuid = process.argv[3];

if (!Number.isInteger(count) || count < 1) {
  console.error("Usage: node scripts/seed-companies.js <number> [orgUuid]");
  process.exit(1);
}

const createDummyCompany = async (index, orgId, createdBy) => {
  const name = `Dummy Company ${index}`;
  const email = `company${index}@example.com`;
  const phone = `+1-555-000-${String(index).padStart(3, "0")}`;
  const city = ["New York", "London", "Paris", "Berlin", "Tokyo"][index % 5];
  const revenue = `${100 + index * 25}000`;
  const employeeSize = `${10 + index * 5}`;

  await sql`
    INSERT INTO companies (
      "orgId",
      name,
      email,
      phone,
      city,
      revenue,
      "employeeSize",
      "createdBy"
    ) VALUES (
      ${orgId},
      ${name},
      ${email},
      ${phone},
      ${city},
      ${revenue},
      ${employeeSize},
      ${createdBy}
    )
  `;
};

const main = async () => {
  let org = null;

  if (orgUuid) {
    [org] = await sql`
      SELECT id
      FROM orgs
      WHERE id = ${orgUuid} AND life = 1
      LIMIT 1
    `;
  } else {
    [org] = await sql`
      SELECT id
      FROM orgs
      WHERE life = 1
      ORDER BY "createdAt" ASC
      LIMIT 1
    `;
  }

  const [user] = await sql`
    SELECT id
    FROM users
    WHERE life = 1
    ORDER BY "createdAt" ASC
    LIMIT 1
  `;

  if (!org || !user) {
    throw new Error("No active organization or user found. Seed data requires at least one org and one user.");
  }

  for (let index = 1; index <= count; index += 1) {
    await createDummyCompany(index, org.id, user.id);
  }

  console.log(`Inserted ${count} dummy company records for org ${org.id}.`);
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

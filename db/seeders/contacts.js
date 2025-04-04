const { faker } = require("@faker-js/faker");

const contacts = async (sql) => {
  const result1 = await sql`
    INSERT INTO "contacts" (
      prefix,
      "firstName",
      "lastName",
      "annualRevenue",
      "description",
      "contactIndustryId"
    ) VALUES (
      ${faker.person.prefix()},
      ${faker.person.firstName()},
      ${faker.person.lastName()},
      ${faker.number.int({ min: 10000, max: 10000000 })},
      ${faker.lorem.lines({ min: 1, max: 3 })},
      ${faker.number.int({ min: 1, max: 6 })}
    ) returning "firstName","lastName"`.then(([x]) => x);
  console.log("1: ", result1);

  const result2 = await sql`
    INSERT INTO "contacts" (
      prefix,
      "firstName",
      "lastName",
      "annualRevenue",
      "description",
      "contactIndustryId"
    ) VALUES (
      ${faker.person.prefix()},
      ${faker.person.firstName()},
      ${faker.person.lastName()},
      ${faker.number.int({ min: 10000, max: 10000000 })},
      ${faker.lorem.lines({ min: 1, max: 3 })},
      ${faker.number.int({ min: 1, max: 6 })}
    ) returning "firstName","lastName"`.then(([x]) => x);
  console.log("2: ", result2);

  const result3 = await sql`
    INSERT INTO "contacts" (
      prefix,
      "firstName",
      "lastName",
      "annualRevenue",
      "description",
      "contactIndustryId"
    ) VALUES (
      ${faker.person.prefix()},
      ${faker.person.firstName()},
      ${faker.person.lastName()},
      ${faker.number.int({ min: 10000, max: 10000000 })},
      ${faker.lorem.lines({ min: 1, max: 3 })},
      ${faker.number.int({ min: 1, max: 6 })}
    ) returning "firstName","lastName"`.then(([x]) => x);
  console.log("3: ", result3);

  const result4 = await sql`
    INSERT INTO "contacts" (
      prefix,
      "firstName",
      "lastName",
      "annualRevenue",
      "description",
      "contactIndustryId"
    ) VALUES (
      ${faker.person.prefix()},
      ${faker.person.firstName()},
      ${faker.person.lastName()},
      ${faker.number.int({ min: 10000, max: 10000000 })},
      ${faker.lorem.lines({ min: 1, max: 3 })},
      ${faker.number.int({ min: 1, max: 6 })}
    ) returning "firstName","lastName"`.then(([x]) => x);
  console.log("4: ", result4);
};

module.exports = contacts;

const { faker } = require("@faker-js/faker");

const companies = async (sql) => {
  const result1 = await sql`
    INSERT INTO "companies" (
      name,
      "employeeSize",
      description,
      "companySourceId"
    ) VALUES (
      ${faker.company.name()},
      ${faker.number.int({ min: 10, max: 100 })},
      ${faker.lorem.lines({ min: 1, max: 3 })},
      ${faker.number.int({ min: 1, max: 5 })}
    ) returning name`.then(([x]) => x);
  console.log("1: ", result1);

  const result2 = await sql`
    INSERT INTO "companies" (
      name,
      "employeeSize",
      description,
      "companySourceId"
    ) VALUES (
      ${faker.company.name()},
      ${faker.number.int({ min: 10, max: 100 })},
      ${faker.lorem.lines({ min: 1, max: 3 })},
      ${faker.number.int({ min: 1, max: 5 })}
    ) returning name`.then(([x]) => x);
  console.log("2: ", result2);

  const result3 = await sql`
    INSERT INTO "companies" (
      name,
      "employeeSize",
      description,
      "companySourceId"
    ) VALUES (
      ${faker.company.name()},
      ${faker.number.int({ min: 10, max: 100 })},
      ${faker.lorem.lines({ min: 1, max: 3 })},
      ${faker.number.int({ min: 1, max: 5 })}
    ) returning name`.then(([x]) => x);
  console.log("3: ", result3);
};

module.exports = companies;

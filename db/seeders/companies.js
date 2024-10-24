const { faker } = require("@faker-js/faker");

const companies = async (sql) => {
  for await (const _num of Array.from(Array(33).keys())) {
    const result = await sql`
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
    console.log(result);
  }
};

module.exports = companies;

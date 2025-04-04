const { faker } = require("@faker-js/faker");

const tickets = async (sql) => {
  const result1 = await sql`
    INSERT INTO tickets (
      name,
      "ticketTypeId",
      description
    ) VALUES (
     ${"1-" + faker.commerce.product()},
     ${faker.number.int({ min: 1, max: 5 })},
     ${faker.lorem.lines({ min: 1, max: 3 })}
    ) returning name
  `.then(([x]) => x);
  console.log("1: ", result1);

  const result2 = await sql`
    INSERT INTO tickets (
      name,
      "ticketTypeId",
      description
    ) VALUES (
     ${"2-" + faker.commerce.product()},
     ${faker.number.int({ min: 1, max: 5 })},
     ${faker.lorem.lines({ min: 1, max: 3 })}
    ) returning name
  `.then(([x]) => x);
  console.log("1: ", result2);

  const result3 = await sql`
    INSERT INTO tickets (
      name,
      "ticketTypeId",
      description
    ) VALUES (
     ${"3-" + faker.commerce.product()},
     ${faker.number.int({ min: 1, max: 5 })},
     ${faker.lorem.lines({ min: 1, max: 3 })}
    ) returning name
  `.then(([x]) => x);
  console.log("1: ", result3);
};

module.exports = tickets;

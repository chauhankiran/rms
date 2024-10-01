const { faker } = require("@faker-js/faker");

const users = async (sql) => {
  const result1 = await sql`
    INSERT INTO users (
      email,
      password
    ) VALUES (
      ${faker.internet.email()},
      ${faker.internet.password({ length: 6, pattern: /[0-9]/ })}
    ) returning email, password`.then(([x]) => x);
  console.log("1: ", result1);

  const result2 = await sql`
    INSERT INTO users (
      email,
      password
    ) VALUES (
      ${faker.internet.email()},
      ${faker.internet.password({ length: 6, pattern: /[0-9]/ })}
    ) returning email, password`.then(([x]) => x);
  console.log("2: ", result2);

  const result3 = await sql`
    INSERT INTO users (
      email,
      password
    ) VALUES (
      ${faker.internet.email()},
      ${faker.internet.password({ length: 6, pattern: /[0-9]/ })}
    ) returning email, password`.then(([x]) => x);
  console.log("3: ", result3);
};

module.exports = users;

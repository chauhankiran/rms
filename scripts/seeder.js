require("dotenv").config();
const fs = require("fs");
const join = require("path").join;
const postgres = require("postgres");

const seed = async ({ sql, path, before = null }) => {
  const seeders = fs.readdirSync(path);

  for await (const seeder of seeders) {
    before && before(seeder);

    await require(join(path, seeder))(sql);
  }
};

// SQL
const sql = postgres({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

seed({
  sql,
  path: join(__dirname, "..", "seeders"),
  before: (name) => {
    console.log("Seeding: ", name);
  },
})
  .then(() => {
    console.log("All good.");
    process.exit(1);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

require("dotenv").config();
const fs = require("fs");
const join = require("path").join;
const postgres = require("postgres");

const seed = async ({ sql, path, before = null }) => {
  if (fs.lstatSync(path).isDirectory()) {
    const seeders = fs.readdirSync(path);

    for await (const seeder of seeders) {
      before && before(seeder);

      await require(join(path, seeder))(sql);
    }
  } else {
    before && before(path);
    await require(join(path))(sql);
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

// Check if we are interested to run only given seeder.
let path = join(__dirname, "..", "db", "seeders");
const args = process.argv;
if (args.length === 3) {
  path = join(__dirname, "..", "db", "seeders", args[2]);
}

seed({
  sql,
  path,
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

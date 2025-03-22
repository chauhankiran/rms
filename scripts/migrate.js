require("dotenv").config();
const fs = require("fs");
const join = require("path").join;
const postgres = require("postgres");

// Copied from https://github.com/porsager/postgres-shift.
const shift = async ({
    sql,
    path = join(process.cwd(), "db", "migrations"),
    before = null,
    after = null,
}) => {
    const migrations = fs
        .readdirSync(path)
        .filter(
            (x) =>
                fs.statSync(join(path, x)).isDirectory() &&
                x.match(/^[0-9]{5}-/)
        )
        .sort()
        .map((x) => ({
            path: join(path, x),
            migrationId: parseInt(x.slice(0, 5)),
            name: x.slice(6).replace(/-/g, " "),
        }));

    const latest = migrations[migrations.length - 1];

    if (latest.migrationId !== migrations.length)
        throw new Error("Inconsistency in migration numbering");

    await ensureMigrationsTable();

    const current = await getCurrentMigration();
    const needed = migrations.slice(current ? current.id : 0);

    return sql.begin(next);

    async function next(sql) {
        const current = needed.shift();
        if (!current) return;

        before && before(current);
        await run(sql, current);
        after && after(current);
        await next(sql);
    }

    async function run(sql, { path, migrationId, name }) {
        fs.existsSync(join(path, "index.sql")) &&
        !fs.existsSync(join(path, "index.js"))
            ? await sql.file(join(path, "index.sql"))
            : await import(join(path, "index.js")).then((x) => x.default(sql)); // eslint-disable-line

        await sql`
      insert into migrations (
        "migrationId",
        name
      ) values (
        ${migrationId},
        ${name}
      )
    `;
    }

    function getCurrentMigration() {
        return sql`
      select "migrationId" as id from migrations
      order by "migrationId" desc
      limit 1
    `.then(([x]) => x);
    }

    function ensureMigrationsTable() {
        return sql`
      select 'migrations'::regclass
    `.catch(
            (err) => sql`
      create table migrations (
        "migrationId" serial primary key,
        "createdAt" timestamp with time zone not null default now(),
        name text
      )
    `
        );
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

shift({
    sql,
    path: join(__dirname, "..", "db", "migrations"),
    before: ({ migrationId, name }) => {
        console.log("Migrating ", migrationId, name);
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

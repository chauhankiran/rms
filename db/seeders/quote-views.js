const quoteViews = async (sql) => {
    // id
    const result1 = await sql`
    INSERT INTO "quoteViews" (
      name,
      "userId"
    ) VALUES (
      'id',
      1
    ) returning name`.then(([x]) => x);
    console.log("1:", result1);

    // name
    const result2 = await sql`
    INSERT INTO "quoteViews" (
      name,
      "userId"
    ) VALUES (
      'name',
      1
    ) returning name`.then(([x]) => x);
    console.log("2:", result2);

    // updatedBy
    const result3 = await sql`
    INSERT INTO "quoteViews" (
      name,
      "userId"
    ) VALUES (
      'updatedBy',
      1
    ) returning name`.then(([x]) => x);
    console.log("3:", result3);

    // updatedAt
    const result4 = await sql`
    INSERT INTO "quoteViews" (
      name,
      "userId"
    ) VALUES (
      'updatedAt',
      1
    ) returning name`.then(([x]) => x);
    console.log("4:", result4);
};

module.exports = quoteViews;

const dealViews = async (sql) => {
    // id
    const result1 = await sql`
    INSERT INTO "dealViews" (
      name,
      "userId"
    ) VALUES (
      'id',
      1
    ) returning name`.then(([x]) => x);
    console.log("1:", result1);

    // name
    const result2 = await sql`
    INSERT INTO "dealViews" (
      name,
      "userId"
    ) VALUES (
      'name',
      1
    ) returning name`.then(([x]) => x);
    console.log("2:", result2);

    // dealSourceId
    const result3 = await sql`
    INSERT INTO "dealViews" (
      name,
      "userId"
    ) VALUES (
      'dealSourceId',
      1
    ) returning name`.then(([x]) => x);
    console.log("3:", result3);

    // updatedBy
    const result4 = await sql`
    INSERT INTO "dealViews" (
      name,
      "userId"
    ) VALUES (
      'updatedBy',
      1
    ) returning name`.then(([x]) => x);
    console.log("4:", result4);

    // updatedAt
    const result5 = await sql`
    INSERT INTO "dealViews" (
      name,
      "userId"
    ) VALUES (
      'updatedAt',
      1
    ) returning name`.then(([x]) => x);
    console.log("5:", result5);
};

module.exports = dealViews;

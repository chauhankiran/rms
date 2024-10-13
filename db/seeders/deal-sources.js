const dealSources = async (sql) => {
  // None.
  const result1 = await sql`
    INSERT INTO "dealSources" (
      name
    ) VALUES (
      'None'
    ) returning name`.then(([x]) => x);
  console.log("1: ", result1);

  // Social Media.
  const result2 = await sql`
    INSERT INTO "dealSources" (
      name
    ) VALUES (
      'Social Media'
    ) returning name`.then(([x]) => x);
  console.log("2: ", result2);

  // Campaign.
  const result3 = await sql`
    INSERT INTO "dealSources" (
      name
    ) VALUES (
      'Campaign'
    ) returning name`.then(([x]) => x);
  console.log("3: ", result3);

  // Referral.
  const result4 = await sql`
    INSERT INTO "dealSources" (
      name
    ) VALUES (
      'Referral'
    ) returning name`.then(([x]) => x);
  console.log("4: ", result4);

  // Direct.
  const result5 = await sql`
    INSERT INTO "dealSources" (
      name
    ) VALUES (
      'Direct'
    ) returning name`.then(([x]) => x);
  console.log("5: ", result5);
};

module.exports = dealSources;

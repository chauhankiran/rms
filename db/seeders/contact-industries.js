const contactIndustries = async (sql) => {
  // None.
  const result1 = await sql`
    INSERT INTO "contactIndustries" (
      name
    ) VALUES (
      'None'
    ) returning name`.then(([x]) => x);
  console.log("1: ", result1);

  // Insurance.
  const result2 = await sql`
    INSERT INTO "contactIndustries" (
      name
    ) VALUES (
      'Insurance'
    ) returning name`.then(([x]) => x);
  console.log("2: ", result2);

  // Healthcare.
  const result3 = await sql`
    INSERT INTO "contactIndustries" (
      name
    ) VALUES (
      'Healthcare'
    ) returning name`.then(([x]) => x);
  console.log("3: ", result3);

  // Mortgage & Debt.
  const result4 = await sql`
    INSERT INTO "contactIndustries" (
      name
    ) VALUES (
      'Mortgage & Debt'
    ) returning name`.then(([x]) => x);
  console.log("4: ", result4);

  // Education.
  const result5 = await sql`
    INSERT INTO "contactIndustries" (
      name
    ) VALUES (
      'Education'
    ) returning name`.then(([x]) => x);
  console.log("5: ", result5);

  // Call Centers.
  const result6 = await sql`
    INSERT INTO "contactIndustries" (
      name
    ) VALUES (
      'Call Centers'
    ) returning name`.then(([x]) => x);
  console.log("6: ", result6);
};

module.exports = contactIndustries;

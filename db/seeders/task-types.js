const taskTypes = async (sql) => {
  // None.
  const result1 = await sql`
    INSERT INTO "taskTypes" (
      name
    ) VALUES (
      'None'
    ) returning name`.then(([x]) => x);
  console.log("1: ", result1);

  // Followup.
  const result2 = await sql`
    INSERT INTO "taskTypes" (
      name
    ) VALUES (
      'Followup'
    ) returning name`.then(([x]) => x);
  console.log("2: ", result2);

  // Demo.
  const result3 = await sql`
    INSERT INTO "taskTypes" (
      name
    ) VALUES (
      'Demo'
    ) returning name`.then(([x]) => x);
  console.log("3: ", result3);

  // Exit.
  const result4 = await sql`
    INSERT INTO "taskTypes" (
      name
    ) VALUES (
      'Exit'
    ) returning name`.then(([x]) => x);
  console.log("4: ", result4);

  // Further update.
  const result5 = await sql`
    INSERT INTO "taskTypes" (
      name
    ) VALUES (
      'Further update'
    ) returning name`.then(([x]) => x);
  console.log("5: ", result5);
};

module.exports = taskTypes;

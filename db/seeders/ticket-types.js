const ticketTypes = async (sql) => {
  // None.
  const result1 = await sql`
    INSERT INTO "ticketTypes" (
      name
    ) VALUES (
      'None'
    ) returning name`.then(([x]) => x);
  console.log("1: ", result1);

  // Bug.
  const result2 = await sql`
    INSERT INTO "ticketTypes" (
      name
    ) VALUES (
      'Bug'
    ) returning name`.then(([x]) => x);
  console.log("2: ", result2);

  // Question.
  const result3 = await sql`
    INSERT INTO "ticketTypes" (
      name
    ) VALUES (
      'Question'
    ) returning name`.then(([x]) => x);
  console.log("3: ", result3);

  // Support.
  const result4 = await sql`
    INSERT INTO "ticketTypes" (
      name
    ) VALUES (
      'Support'
    ) returning name`.then(([x]) => x);
  console.log("4: ", result4);

  // Enhancement.
  const result5 = await sql`
    INSERT INTO "ticketTypes" (
      name
    ) VALUES (
      'Enhancement'
    ) returning name`.then(([x]) => x);
  console.log("5: ", result5);
};

module.exports = ticketTypes;

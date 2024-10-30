const modules = async (sql) => {
  // company.
  const company = await sql`
    INSERT INTO "modules" (
      name
    ) VALUES (
      'companies'
    ) returning name`.then(([x]) => x);
  console.log("module:", company);

  // contact.
  const contact = await sql`
    INSERT INTO "modules" (
      name
    ) VALUES (
      'contacts'
    ) returning name`.then(([x]) => x);
  console.log("module:", contact);

  // deal.
  const deal = await sql`
    INSERT INTO "modules" (
      name
    ) VALUES (
      'deals'
    ) returning name`.then(([x]) => x);
  console.log("module:", deal);

  // quote.
  const quote = await sql`
    INSERT INTO "modules" (
      name
    ) VALUES (
      'quotes'
    ) returning name`.then(([x]) => x);
  console.log("module:", quote);

  // ticket.
  const ticket = await sql`
    INSERT INTO "modules" (
      name
    ) VALUES (
      'tickets'
    ) returning name`.then(([x]) => x);
  console.log("module:", ticket);

  // task.
  const task = await sql`
    INSERT INTO "modules" (
      name
    ) VALUES (
      'tasks'
    ) returning name`.then(([x]) => x);
  console.log("module:", task);
};

module.exports = modules;

const moduleLabels = async (sql) => {
  // company.
  const company = await sql`
    INSERT INTO "moduleLabels" (
      name,
      "displayName"
    ) VALUES (
      'company',
      'companies'
    ) returning name`.then(([x]) => x);
  console.log("label:", company);

  // contact.
  const contact = await sql`
    INSERT INTO "moduleLabels" (
      name,
      "displayName"
    ) VALUES (
      'contact',
      'contacts'
    ) returning name`.then(([x]) => x);
  console.log("label:", contact);

  // deal.
  const deal = await sql`
    INSERT INTO "moduleLabels" (
      name,
      "displayName"
    ) VALUES (
      'deal',
      'deals'
    ) returning name`.then(([x]) => x);
  console.log("label:", deal);

  // quote.
  const quote = await sql`
    INSERT INTO "moduleLabels" (
      name,
      "displayName"
    ) VALUES (
      'quote',
      'quotes'
    ) returning name`.then(([x]) => x);
  console.log("label:", quote);

  // ticket.
  const ticket = await sql`
    INSERT INTO "moduleLabels" (
      name,
      "displayName"
    ) VALUES (
      'ticket',
      'tickets'
    ) returning name`.then(([x]) => x);
  console.log("label:", ticket);

  // task.
  const task = await sql`
    INSERT INTO "moduleLabels" (
      name,
      "displayName"
    ) VALUES (
      'task',
      'tasks'
    ) returning name`.then(([x]) => x);
  console.log("label:", task);
};

module.exports = moduleLabels;

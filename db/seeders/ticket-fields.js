const ticketFields = async (sql) => {
  // id
  const result1 = await sql`
    INSERT INTO "ticketFields" (
      name, 
      "displayName"
    ) VALUES (
      'id', 
      'Id'
    ) returning "displayName"`.then(([x]) => x);
  console.log("id:", result1);

  // name
  const result2 = await sql`
    INSERT INTO "ticketFields" (
      name, 
      "displayName"
    ) VALUES (
      'name', 
      'Name'
    ) returning "displayName"`.then(([x]) => x);
  console.log("name:", result2);

  // description
  const result3 = await sql`
    INSERT INTO "ticketFields" (
      name, 
      "displayName"
    ) VALUES (
      'description', 
      'Description'
    ) returning "displayName"`.then(([x]) => x);
  console.log("description:", result3);

  // ticketTypeId
  const result4 = await sql`
    INSERT INTO "ticketFields" (
      name, 
      "displayName"
    ) VALUES (
      'ticketTypeId', 
      'Ticket type'
    ) returning "displayName"`.then(([x]) => x);
  console.log("ticketTypeId:", result4);

  // isActive
  const result5 = await sql`
    INSERT INTO "ticketFields" (
      name, 
      "displayName"
    ) VALUES (
      'isActive', 
      'Is active'
    ) returning "displayName"`.then(([x]) => x);
  console.log("isActive:", result5);

  // createdBy
  const result6 = await sql`
    INSERT INTO "ticketFields" (
      name, 
      "displayName"
    ) VALUES (
     'createdBy', 
     'Created by'
  ) returning "displayName"`.then(([x]) => x);
  console.log("createdBy:", result6);

  // updatedBy
  const result7 = await sql`
    INSERT INTO "ticketFields" (
      name, 
      "displayName"
    ) VALUES (
      'updatedBy', 
      'Updated by'
    ) returning "displayName"`.then(([x]) => x);
  console.log("updatedBy:", result7);

  // createdAt
  const result8 = await sql`
    INSERT INTO "ticketFields" (
    name, 
    "displayName"
    ) VALUES (
      'createdAt', 
      'Created at'
    ) returning "displayName"`.then(([x]) => x);
  console.log("createdAt:", result8);

  // updatedAt
  const result9 = await sql`
    INSERT INTO "ticketFields" (
      name, 
      "displayName"
    ) VALUES (
      'updatedAt', 
      'Updated at'
    ) returning "displayName"`.then(([x]) => x);
  console.log("updatedAt:", result9);
};

module.exports = ticketFields;
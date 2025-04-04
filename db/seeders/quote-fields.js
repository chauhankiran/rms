const quoteLabels = async (sql) => {
  // id
  const result1 = await sql`
    INSERT INTO "quoteLabels" (
      name, 
      "displayName"
    ) VALUES (
      'id', 
      'Id'
    ) returning "displayName"`.then(([x]) => x);
  console.log("id:", result1);

  // name
  const result2 = await sql`
    INSERT INTO "quoteLabels" (
      name, 
      "displayName"
    ) VALUES (
      'name', 
      'Name'
    ) returning "displayName"`.then(([x]) => x);
  console.log("name:", result2);

  // description
  const result3 = await sql`
    INSERT INTO "quoteLabels" (
      name, 
      "displayName"
    ) VALUES (
      'description', 
      'Description'
    ) returning "displayName"`.then(([x]) => x);
  console.log("description:", result3);

  // total
  const result12 = await sql`
    INSERT INTO "quoteLabels" (
      name, 
      "displayName"
    ) VALUES (
      'total', 
      'Total'
    ) returning "displayName"`.then(([x]) => x);
  console.log("name:", result12);

  // isActive
  const result4 = await sql`
    INSERT INTO "quoteLabels" (
      name, 
      "displayName"
    ) VALUES (
      'isActive', 
      'Is active'
    ) returning "displayName"`.then(([x]) => x);
  console.log("isActive:", result4);

  // createdBy
  const result5 = await sql`
    INSERT INTO "quoteLabels" (
      name, 
      "displayName"
    ) VALUES (
     'createdBy', 
     'Created by'
  ) returning "displayName"`.then(([x]) => x);
  console.log("createdBy:", result5);

  // updatedBy
  const result6 = await sql`
    INSERT INTO "quoteLabels" (
      name, 
      "displayName"
    ) VALUES (
      'updatedBy', 
      'Updated by'
    ) returning "displayName"`.then(([x]) => x);
  console.log("updatedBy:", result6);

  // createdAt
  const result7 = await sql`
    INSERT INTO "quoteLabels" (
    name, 
    "displayName"
    ) VALUES (
      'createdAt', 
      'Created at'
    ) returning "displayName"`.then(([x]) => x);
  console.log("createdAt:", result7);

  // updatedAt
  const result8 = await sql`
    INSERT INTO "quoteLabels" (
      name, 
      "displayName"
    ) VALUES (
      'updatedAt', 
      'Updated at'
    ) returning "displayName"`.then(([x]) => x);
  console.log("updatedAt:", result8);
};

module.exports = quoteLabels;

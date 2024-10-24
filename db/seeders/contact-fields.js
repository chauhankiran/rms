const contactLabels = async (sql) => {
  // id
  const result1 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'id', 
      'Id'
    ) returning "displayName"`.then(([x]) => x);
  console.log("id:", result1);

  // prefix
  const result2 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'prefix', 
      'Prefix'
    ) returning "displayName"`.then(([x]) => x);
  console.log("prefix:", result2);

  // firstName
  const result3 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'firstName', 
      'First name'
    ) returning "displayName"`.then(([x]) => x);
  console.log("firstName:", result3);

  // lastName
  const result4 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'lastName', 
      'Last name'
    ) returning "displayName"`.then(([x]) => x);
  console.log("lastName:", result4);

  // virtual field: name
  const resultV1 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'name',
      'Name'
    ) returning "displayName"`.then(([x]) => x);
  console.log("name:", resultV1);

  // annualRevenue
  const result5 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'annualRevenue', 
      'Annual revenue'
    ) returning "displayName"`.then(([x]) => x);
  console.log("annualRevenue:", result5);

  // description
  const result6 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'description', 
      'Description'
    ) returning "displayName"`.then(([x]) => x);
  console.log("description:", result6);

  // contactIndustryId
  const result7 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'contactIndustryId', 
      'Contact industry'
    ) returning "displayName"`.then(([x]) => x);
  console.log("contactIndustryId:", result7);

  // companyId
  const result8 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'companyId', 
      'Company id'
    ) returning "displayName"`.then(([x]) => x);
  console.log("companyId:", result8);

  const result9 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'isActive', 
      'Is active'
    ) returning "displayName"`.then(([x]) => x);
  console.log("isActive:", result9);

  // createdBy
  const result10 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'createdBy', 
      'Created by'
    ) returning "displayName"`.then(([x]) => x);
  console.log("createdBy:", result10);

  // updatedBy
  const result11 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'updatedBy', 
      'Updated by'
    ) returning "displayName"`.then(([x]) => x);
  console.log("updatedBy:", result11);

  // createdAt
  const result12 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'createdAt', 
      'Created at'
    ) returning "displayName"`.then(([x]) => x);
  console.log("createdAt:", result12);

  // updatedAt
  const result13 = await sql`
    INSERT INTO "contactLabels" (
      name, 
      "displayName"
    ) VALUES (
      'updatedAt', 
      'Updated at'
    ) returning "displayName"`.then(([x]) => x);
  console.log("updatedAt:", result13);
};

module.exports = contactLabels;

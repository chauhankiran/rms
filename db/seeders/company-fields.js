const companyLabels = async (sql) => {
  // id
  const result1 = await sql`
    INSERT INTO "companyLabels" (
      name, 
      "displayName"
    ) VALUES (
      'id', 
      'Id'
    ) returning "displayName"`.then(([x]) => x);
  console.log("id:", result1);

  // name
  const result2 = await sql`
    INSERT INTO "companyLabels" (
      name, 
      "displayName"
    ) VALUES (
      'name', 
      'Name'
    ) returning "displayName"`.then(([x]) => x);
  console.log("name:", result2);

  // employeeSize
  const result3 = await sql`
    INSERT INTO "companyLabels" (
      name, 
      "displayName"
    ) VALUES (
      'employeeSize', 
      'Employee size'
    ) returning "displayName"`.then(([x]) => x);
  console.log("employeeSize:", result3);

  // description
  const result4 = await sql`
    INSERT INTO "companyLabels" (
      name, 
      "displayName"
    ) VALUES (
      'description', 
      'Description'
    ) returning "displayName"`.then(([x]) => x);
  console.log("description:", result4);

  // companySourceId
  const result5 = await sql`
    INSERT INTO "companyLabels" (
      name, 
      "displayName"
    ) VALUES (
      'companySourceId', 
      'Company source'
    ) returning "displayName"`.then(([x]) => x);
  console.log("companySourceId:", result5);

  // isActive
  const result6 = await sql`
    INSERT INTO "companyLabels" (
      name, 
      "displayName"
    ) VALUES (
      'isActive', 
      'Is active'
    ) returning "displayName"`.then(([x]) => x);
  console.log("isActive:", result6);

  // createdBy
  const result7 = await sql`
    INSERT INTO "companyLabels" (
      name, 
      "displayName"
    ) VALUES (
     'createdBy', 
     'Created by'
  ) returning "displayName"`.then(([x]) => x);
  console.log("createdBy:", result7);

  // updatedBy
  const result8 = await sql`
    INSERT INTO "companyLabels" (
      name, 
      "displayName"
    ) VALUES (
      'updatedBy', 
      'Updated by'
    ) returning "displayName"`.then(([x]) => x);
  console.log("updatedBy:", result8);

  // createdAt
  const result9 = await sql`
    INSERT INTO "companyLabels" (
    name, 
    "displayName"
    ) VALUES (
      'createdAt', 
      'Created at'
    ) returning "displayName"`.then(([x]) => x);
  console.log("createdAt:", result9);

  // updatedAt
  const result10 = await sql`
    INSERT INTO "companyLabels" (
      name, 
      "displayName"
    ) VALUES (
      'updatedAt', 
      'Updated at'
    ) returning "displayName"`.then(([x]) => x);
  console.log("updatedAt:", result10);
};

module.exports = companyLabels;

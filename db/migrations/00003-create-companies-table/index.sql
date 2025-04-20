CREATE TABLE companies (
  id SERIAL PRIMARY KEY,

  name VARCHAR(255),
  "employeeSize" INT,
  description TEXT,
  "companySourceId" INT,

  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);

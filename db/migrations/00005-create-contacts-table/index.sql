CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,

  prefix VARCHAR(255),
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,

  "annualRevenue" INT,
  description TEXT,
  "contactIndustryId" INT,

  "companyId" INT,

  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);

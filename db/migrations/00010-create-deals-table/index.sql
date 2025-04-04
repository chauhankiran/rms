CREATE TABLE deals (
  id SERIAL PRIMARY KEY,

  name VARCHAR(255) UNIQUE NOT NULL,
  total INT,
  description TEXT,
  "dealSourceId" INT,

  "companyId" INT,
  "contactId" INT,

  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);

CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,

  name VARCHAR(255),
  total INT,
  description TEXT,

  "companyId" INT,
  "contactId" INT,
  "dealId" INT,

  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);

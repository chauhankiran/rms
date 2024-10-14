CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,

  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  "ticketTypeId" INT,

  "companyId" INT,
  "contactId" INT,
  "dealId" INT,

  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);

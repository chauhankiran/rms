CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,

  name VARCHAR(255),
  description TEXT,
  "taskTypeId" INT,

  phone varchar(255),
  location varchar(255),

  "companyId" INT,
  "contactId" INT,
  "dealId" INT,
  "quoteId" INT,
  "ticketId" INT,

  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);

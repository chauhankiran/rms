CREATE TABLE "contactComments" (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,

  "contactId" INT,

  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);
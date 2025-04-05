CREATE TABLE "dealComments" (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,

  "dealId" INT,

  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);
CREATE TABLE "ticketViews" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);
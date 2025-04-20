CREATE TABLE "contactViews" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),

  "seq" INT,
  "userId" INT,

  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);
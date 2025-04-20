CREATE TABLE "taskComments" (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,

  "taskId" INT,

  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);
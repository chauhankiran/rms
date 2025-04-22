CREATE TABLE "modules" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);

INSERT INTO "modules" (name) VALUES ('company');
INSERT INTO "modules" (name) VALUES ('contact');
INSERT INTO "modules" (name) VALUES ('deal');
INSERT INTO "modules" (name) VALUES ('quote');
INSERT INTO "modules" (name) VALUES ('ticket');
INSERT INTO "modules" (name) VALUES ('task');
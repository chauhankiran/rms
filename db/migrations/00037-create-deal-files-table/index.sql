CREATE TABLE "dealFiles" (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,

    "dealId" INT,

    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INT,
    "updatedBy" INT,
    "createdAt" timestamp NOT NULL DEFAULT NOW(),
    "updatedAt" timestamp
);
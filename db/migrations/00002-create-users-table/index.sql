CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100),

    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,

    "createdBy" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedBy" UUID,
    "updatedAt" TIMESTAMPTZ,

    life SMALLINT NOT NULL DEFAULT 1,
    
    metadata JSONB DEFAULT '{}'::jsonb
);

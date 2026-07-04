CREATE TABLE orgs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,
    description TEXT,

    "createdBy" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedBy" UUID,
    "updatedAt" TIMESTAMPTZ,

    life SMALLINT NOT NULL DEFAULT 1,

    metadata JSONB DEFAULT '{}'::jsonb
);
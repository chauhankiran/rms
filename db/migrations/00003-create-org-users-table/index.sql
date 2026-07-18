CREATE TABLE "orgUsers" (
    id SERIAL PRIMARY KEY,

    "orgId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    -- 1 = user.
    -- 2 = admin.
    -- 3 = su
    "role" SMALLINT NOT NULL DEFAULT 1,

    "createdBy" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedBy" UUID,
    "updatedAt" TIMESTAMPTZ,

    life SMALLINT NOT NULL DEFAULT 1
);

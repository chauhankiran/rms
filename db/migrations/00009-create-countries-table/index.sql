CREATE TABLE "countries" (
	id BIGSERIAL PRIMARY KEY,

	"orgId" UUID NOT NULL,

    name TEXT NOT NULL,
    seq SMALLINT,

    "createdBy" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedBy" UUID,
    "updatedAt" TIMESTAMPTZ,

    life SMALLINT NOT NULL DEFAULT 1
);
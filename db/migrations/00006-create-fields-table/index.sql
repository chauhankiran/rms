CREATE TABLE "fields" (
	id BIGSERIAL PRIMARY KEY,

	"orgId" UUID NOT NULL,

    name TEXT NOT NULL,
    "displayName" TEXT NOT NULL,

    -- "system"
    -- "companies"
    -- "contacts"
    -- "deals"
    -- "quotes"
    -- "tickets"
    -- "tasks"
    -- "reports"
    category TEXT NOT NULL,

    "createdBy" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedBy" UUID,
    "updatedAt" TIMESTAMPTZ,

    life SMALLINT NOT NULL DEFAULT 1
);

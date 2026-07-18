CREATE TABLE "userLand" (
	id BIGSERIAL PRIMARY KEY,

    "userId" UUID NOT NULL,
	"orgId" UUID NOT NULL,

	permission JSONB DEFAULT '{}'::jsonb,
    setting JSONB DEFAULT '{}'::jsonb,

    "createdBy" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedBy" UUID,
    "updatedAt" TIMESTAMPTZ,

    life SMALLINT NOT NULL DEFAULT 1,

    metadata JSONB DEFAULT '{}'::jsonb
);
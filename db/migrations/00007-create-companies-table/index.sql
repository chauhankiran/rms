CREATE TABLE "companies" (
	id BIGSERIAL PRIMARY KEY,

	"orgId" UUID NOT NULL,

    -- Company details fields.
    name TEXT,
    email TEXT, 
    website TEXT,
    phone TEXT,
    mobile TEXT,
    telephone TEXT,
    fax TEXT,

    address1 TEXT,
    address2 TEXT,
    city TEXT,
    "stateId" BIGINT,
    zip TEXT,
    "countryId" BIGINT,

    -- Additional details fields.
    "industryId" BIGINT,
    revenue TEXT,
    "employeeSize" TEXT,

    -- Sales details fields.
    "sourceId" BIGINT,
    "statusId" BIGINT,
    "stageId" BIGINT,

    "createdBy" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedBy" UUID,
    "updatedAt" TIMESTAMPTZ,

    life SMALLINT NOT NULL DEFAULT 1
);
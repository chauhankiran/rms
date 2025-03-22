CREATE TABLE "public"."companies" (
    "id"            SERIAL PRIMARY KEY,
    "name"          VARCHAR,
    "website"       VARCHAR,
    "phone"         VARCHAR,
    "description"   TEXT,
    "createdBy"     INT,
    "createdOn"     TIMESTAMP,
    "updatedBy"     INT,
    "updatedOn"     TIMESTAMP,
    "isActive"      BOOLEAN DEFAULT true
);
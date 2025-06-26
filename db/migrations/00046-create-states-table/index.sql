CREATE TABLE "states" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"countryId"		INT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO "countries" ("name") VALUES ('None');
INSERT INTO "countries" ("name") VALUES ('Gujarat');
INSERT INTO "countries" ("name") VALUES ('Goa');
INSERT INTO "countries" ("name") VALUES ('New York');
INSERT INTO "countries" ("name") VALUES ('California');
INSERT INTO "countries" ("name") VALUES ('Texas');
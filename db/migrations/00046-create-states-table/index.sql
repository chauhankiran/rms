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

INSERT INTO "states" ("name") VALUES ('None');
INSERT INTO "states" ("name") VALUES ('Gujarat');
INSERT INTO "states" ("name") VALUES ('Goa');
INSERT INTO "states" ("name") VALUES ('New York');
INSERT INTO "states" ("name") VALUES ('California');
INSERT INTO "states" ("name") VALUES ('Texas');
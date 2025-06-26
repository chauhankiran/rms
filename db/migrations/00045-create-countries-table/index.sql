CREATE TABLE "countries" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO "countries" ("name") VALUES ('None');
INSERT INTO "countries" ("name") VALUES ('India');
INSERT INTO "countries" ("name") VALUES ('Australia');
INSERT INTO "countries" ("name") VALUES ('US');
INSERT INTO "countries" ("name") VALUES ('UK');
INSERT INTO "countries" ("name") VALUES ('Japan');
INSERT INTO "countries" ("name") VALUES ('Russia');
INSERT INTO "countries" ("name") VALUES ('Germany');
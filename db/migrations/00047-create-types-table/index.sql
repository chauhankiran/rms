CREATE TABLE "types" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO "types" ("name") VALUES ('None');
INSERT INTO "types" ("name") VALUES ('Lead');
INSERT INTO "types" ("name") VALUES ('Sales');
INSERT INTO "types" ("name") VALUES ('Company');
INSERT INTO "types" ("name") VALUES ('Contact');
INSERT INTO "types" ("name") VALUES ('Referral');
CREATE TABLE "sources" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO "sources" ("name") VALUES ('None');
INSERT INTO "sources" ("name") VALUES ('Facebook');
INSERT INTO "sources" ("name") VALUES ('LinkedIn');
INSERT INTO "sources" ("name") VALUES ('Google');
INSERT INTO "sources" ("name") VALUES ('Direct');
INSERT INTO "sources" ("name") VALUES ('Referral');
INSERT INTO "sources" ("name") VALUES ('Expo');
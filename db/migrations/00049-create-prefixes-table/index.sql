CREATE TABLE "prefixes" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO "prefixes" (name) VALUES ('None');
INSERT INTO "prefixes" (name) VALUES ('Mr.');
INSERT INTO "prefixes" (name) VALUES ('Miss.');
INSERT INTO "prefixes" (name) VALUES ('Ms.');
INSERT INTO "prefixes" (name) VALUES ('Dr.');
INSERT INTO "prefixes" (name) VALUES ('Prof.');
INSERT INTO "prefixes" (name) VALUES ('Sir.');
INSERT INTO "prefixes" (name) VALUES ('Madam.');
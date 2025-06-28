CREATE TABLE "taxes" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO "taxes" (name) VALUES ('None');
INSERT INTO "taxes" (name) VALUES ('GST');
INSERT INTO "taxes" (name) VALUES ('VAT');
INSERT INTO "taxes" (name) VALUES ('Service Tax');
INSERT INTO "taxes" (name) VALUES ('Sales Tax');
INSERT INTO "taxes" (name) VALUES ('Income Tax');
INSERT INTO "taxes" (name) VALUES ('Custom Duty');
INSERT INTO "taxes" (name) VALUES ('Excise Duty');
CREATE TABLE "industries" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO "industries" ("name") VALUES ('None');
INSERT INTO "industries" ("name") VALUES ('Insurance');
INSERT INTO "industries" ("name") VALUES ('Healthcare');
INSERT INTO "industries" ("name") VALUES ('Mortgage & Debt');
INSERT INTO "industries" ("name") VALUES ('Marketing & Advertising');
INSERT INTO "industries" ("name") VALUES ('Call Centers');
INSERT INTO "industries" ("name") VALUES ('Education');
INSERT INTO "industries" ("name") VALUES ('Manufacturing & Distribution');
INSERT INTO "industries" ("name") VALUES ('Real Estate');
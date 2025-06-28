CREATE TABLE "discounts" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO "discounts" (name) VALUES ('None');
INSERT INTO "discounts" (name) VALUES ('10%');
INSERT INTO "discounts" (name) VALUES ('20%');
INSERT INTO "discounts" (name) VALUES ('30%');
INSERT INTO "discounts" (name) VALUES ('40%');
INSERT INTO "discounts" (name) VALUES ('50%');
INSERT INTO "discounts" (name) VALUES ('60%');
INSERT INTO "discounts" (name) VALUES ('70%');
INSERT INTO "discounts" (name) VALUES ('80%');
INSERT INTO "discounts" (name) VALUES ('90%');

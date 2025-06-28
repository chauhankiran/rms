CREATE TABLE "probabilities" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO "probabilities" (name) VALUES ('None');
INSERT INTO "probabilities" (name) VALUES ('10%');
INSERT INTO "probabilities" (name) VALUES ('50%');
INSERT INTO "probabilities" (name) VALUES ('90%');
INSERT INTO "probabilities" (name) VALUES ('100%');
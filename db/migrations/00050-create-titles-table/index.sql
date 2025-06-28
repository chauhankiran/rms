CREATE TABLE "titles" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO "titles" (name) VALUES ('None');
INSERT INTO "titles" (name) VALUES ('CEO');
INSERT INTO "titles" (name) VALUES ('CTO');
INSERT INTO "titles" (name) VALUES ('CFO');
INSERT INTO "titles" (name) VALUES ('Manager');
INSERT INTO "titles" (name) VALUES ('VP');
INSERT INTO "titles" (name) VALUES ('HR');
INSERT INTO "titles" (name) VALUES ('Admin');
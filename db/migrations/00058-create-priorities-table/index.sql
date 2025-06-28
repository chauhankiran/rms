CREATE TABLE "priorities" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO "priorities" (name) VALUES ('None');
INSERT INTO "priorities" (name) VALUES ('Low');
INSERT INTO "priorities" (name) VALUES ('Medium');
INSERT INTO "priorities" (name) VALUES ('High');
INSERT INTO "priorities" (name) VALUES ('Urgent');
INSERT INTO "priorities" (name) VALUES ('Critical');
INSERT INTO "priorities" (name) VALUES ('Immediate');
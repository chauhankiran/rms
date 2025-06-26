CREATE TABLE "stages" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO "stages" ("name") VALUES ('None');
INSERT INTO "stages" ("name") VALUES ('New');
INSERT INTO "stages" ("name") VALUES ('Open');
INSERT INTO "stages" ("name") VALUES ('In progress');
INSERT INTO "stages" ("name") VALUES ('Quote sent');
INSERT INTO "stages" ("name") VALUES ('Closed');
INSERT INTO "stages" ("name") VALUES ('Won');
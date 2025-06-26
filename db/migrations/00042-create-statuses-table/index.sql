CREATE TABLE "statuses" (
	id				SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	description		TEXT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO "statuses" ("name") VALUES ('None');
INSERT INTO "statuses" ("name") VALUES ('Open');
INSERT INTO "statuses" ("name") VALUES ('Working');
INSERT INTO "statuses" ("name") VALUES ('Closed');
INSERT INTO "statuses" ("name") VALUES ('Converted');
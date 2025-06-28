CREATE TABLE "items" (
	id 			 	SERIAL PRIMARY KEY,
	"dealId"		INT,
	"quoteId"		INT,
	name			VARCHAR(255),
	sku				VARCHAR(255),
	description		TEXT,
	quantities		INT,
	price			DECIMAL,
	tax				DECIMAL,
	discount		DECIMAL,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT true
);
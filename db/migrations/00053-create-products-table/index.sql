CREATE TABLE "products" (
	id 			 	SERIAL PRIMARY KEY,
	name			VARCHAR(255),
	sku				VARCHAR(255),
	description		TEXT,
	price			DECIMAL,
	"taxId"			INT,
	"discountId"		INT,
	"createdAt"	 	TIMESTAMP NOT NULL DEFAULT NOW(),
	"createdBy"	 	INT,
	"updatedAt"	 	TIMESTAMP,
	"updatedBy"	 	INT,
	"isActive"	 	BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO "products" (name, sku, price) VALUES ('None', 'none', 0);
INSERT INTO "products" (name, sku, price, "taxId", "discountId") VALUES ('Product A', 'product-a', 100, 1, 1);
INSERT INTO "products" (name, sku, price, "taxId", "discountId") VALUES ('Product B', 'product-b', 200, 2, 2);
INSERT INTO "products" (name, sku, price, "taxId", "discountId") VALUES ('Product C', 'product-c', 300, 3, 3);
INSERT INTO "products" (name, sku, price, "taxId", "discountId") VALUES ('Product D', 'product-d', 400, 4, 4);
INSERT INTO "products" (name, sku, price, "taxId", "discountId") VALUES ('Product E', 'product-e', 500, 5, 5);
INSERT INTO "products" (name, sku, price, "taxId", "discountId") VALUES ('Product F', 'product-f', 600, 1, 2);
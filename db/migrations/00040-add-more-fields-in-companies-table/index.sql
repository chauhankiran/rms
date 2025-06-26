ALTER TABLE companies
ADD COLUMN website VARCHAR(255),
ADD COLUMN email VARCHAR(255),
ADD COLUMN phone VARCHAR(255),
ADD COLUMN mobile VARCHAR(255),
ADD COLUMN fax VARCHAR(255),
ADD COLUMN address1 VARCHAR(255),
ADD COLUMN address2 VARCHAR(255),
ADD COLUMN city VARCHAR(255),
ADD COLUMN "stateId" INT,
ADD COLUMN zip VARCHAR(255),
ADD COLUMN "countryId" INT,
ADD COLUMN "sourceId" INT,
ADD COLUMN "statusId" INT,
ADD COLUMN "stageId" INT,
ADD COLUMN "industryId" INT,
ADD COLUMN "closeDate" DATE,
ADD COLUMN "closeReason" TEXT,
ADD COLUMN "assigneeId" INT,
ADD COLUMN revenue DECIMAL,
ADD COLUMN "typeId" INT;

-- Insert labels for these fields.
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('website', 'Website');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('email', 'Email');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('phone', 'Phone');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('mobile', 'Mobile');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('fax', 'Fax');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('address1', 'Address 1');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('address2', 'Address 2');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('city', 'City');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('stateId', 'State');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('zip', 'Zip');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('countryId', 'Country');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('sourceId', 'Source');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('statusId', 'Status');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('stageId', 'Stage');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('industryId', 'Industry');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('closeDate', 'Close date');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('closeReason', 'Close reason');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('assigneeId', 'Assignee');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('revenue', 'Revenue');
INSERT INTO "companyLabels" ("name", "displayName") VALUES ('typeId', 'Type');
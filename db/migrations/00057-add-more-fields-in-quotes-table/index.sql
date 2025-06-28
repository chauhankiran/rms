ALTER TABLE quotes
ADD COLUMN "sourceId" INT,
ADD COLUMN "stageId" INT,
ADD COLUMN "statusId" INT,
ADD COLUMN discount DECIMAL,
ADD COLUMN tax DECIMAL,
ADD COLUMN "probabilityId" INT,
ADD COLUMN "assigneeId" INT,
ADD COLUMN "templateId" INT,
ADD COLUMN "expireOn" DATE;
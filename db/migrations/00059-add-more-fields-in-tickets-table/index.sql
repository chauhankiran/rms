ALTER TABLE tickets
ADD COLUMN "priorityId" INT,
ADD COLUMN "sourceId" INT,
ADD COLUMN "typeId" INT,
ADD COLUMN "assignId" INT,
ADD COLUMN "statusId" INT,
ADD COLUMN "dueDate" DATE,
ADD COLUMN "closeDate" DATE,
ADD COLUMN "closeReason" TEXT;
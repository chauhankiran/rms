ALTER TABLE tasks
ADD COLUMN "typeId" INT,
ADD COLUMN "when" TIMESTAMP,
ADD COLUMN "duration" INT,
ADD COLUMN "isCompleted" BOOLEAN;
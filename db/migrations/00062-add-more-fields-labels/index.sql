-- Labels for contacts
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('titleId', 'Title');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('website', 'Website');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('email', 'Email');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('phone', 'Phone');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('mobile', 'Mobile');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('fax', 'Fax');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('address1', 'Address 1');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('address2', 'Address 2');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('city', 'City');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('stateId', 'State');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('zip', 'Zip');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('countryId', 'Country');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('sourceId', 'Source');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('statusId', 'Status');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('stageId', 'Stage');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('industryId', 'Industry');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('employeeSize', 'Employee size');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('closeDate', 'Close date');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('closeReason', 'Close reason');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('assigneeId', 'Assignee');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('revenue', 'Revenue');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('typeId', 'Type');
INSERT INTO "contactLabels" ("name", "displayName") VALUES ('isKey', 'Is key');

-- Labels for deals
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('sourceId', 'Source');
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('stageId', 'Stage');
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('statusId', 'Status');
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('discount', 'Discount');
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('tax', 'Tax');
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('probabilityId', 'Probability');
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('assigneeId', 'Assignee');
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('typeId', 'Type');
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('closeDate', 'Close date');
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('closeReason', 'Close reason');
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('wonDate', 'Won Date');
INSERT INTO "dealLabels" ("name", "displayName") VALUES ('wonReason', 'Won reason');

-- Labels for quotes
INSERT INTO "quoteLabels" ("name", "displayName") VALUES ('sourceId', 'Source');
INSERT INTO "quoteLabels" ("name", "displayName") VALUES ('stageId', 'Stage');
INSERT INTO "quoteLabels" ("name", "displayName") VALUES ('statusId', 'Status');
INSERT INTO "quoteLabels" ("name", "displayName") VALUES ('discount', 'Discount');
INSERT INTO "quoteLabels" ("name", "displayName") VALUES ('tax', 'Tax');
INSERT INTO "quoteLabels" ("name", "displayName") VALUES ('probabilityId', 'Probability');
INSERT INTO "quoteLabels" ("name", "displayName") VALUES ('assigneeId', 'Assignee');
INSERT INTO "quoteLabels" ("name", "displayName") VALUES ('templateId', 'Template');
INSERT INTO "quoteLabels" ("name", "displayName") VALUES ('expireOn', 'Expire on');

-- Labels for tickets
INSERT INTO "ticketLabels" ("name", "displayName") VALUES ('priorityId', 'Priority');
INSERT INTO "ticketLabels" ("name", "displayName") VALUES ('sourceId', 'Source');
INSERT INTO "ticketLabels" ("name", "displayName") VALUES ('typeId', 'Type');
INSERT INTO "ticketLabels" ("name", "displayName") VALUES ('assignId', 'Assign');
INSERT INTO "ticketLabels" ("name", "displayName") VALUES ('statusId', 'Status');
INSERT INTO "ticketLabels" ("name", "displayName") VALUES ('dueDate', 'Due date');
INSERT INTO "ticketLabels" ("name", "displayName") VALUES ('closeDate', 'Close date');
INSERT INTO "ticketLabels" ("name", "displayName") VALUES ('closeReason', 'Close reason');

-- Labels for task
INSERT INTO "taskLabels" ("name", "displayName") VALUES ('typeId', 'Type');
INSERT INTO "taskLabels" ("name", "displayName") VALUES ('when', 'When');
INSERT INTO "taskLabels" ("name", "displayName") VALUES ('duration', 'Duration');
INSERT INTO "taskLabels" ("name", "displayName") VALUES ('isCompleted', 'Is completed');
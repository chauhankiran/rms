CREATE TABLE "labels" (
    id SERIAL PRIMARY KEY,

    "name" VARCHAR(255) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    
    "module" VARCHAR(255) NOT NULL,
    
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INT,
    "updatedBy" INT,
    "createdAt" timestamp NOT NULL DEFAULT NOW(),
    "updatedAt" timestamp
);

--- company labels
INSERT INTO "labels" (name, label, module) VALUES ('id',            'Id',               'company');
INSERT INTO "labels" (name, label, module) VALUES ('name',          'Name',             'company');
INSERT INTO "labels" (name, label, module) VALUES ('employeeSize',  'Employee size',    'company');
INSERT INTO "labels" (name, label, module) VALUES ('annualRevenue', 'Annual revenue',   'company');
INSERT INTO "labels" (name, label, module) VALUES ('source',        'Source',           'company');
INSERT INTO "labels" (name, label, module) VALUES ('description',   'Description',      'company');
INSERT INTO "labels" (name, label, module) VALUES ('isActive',      'Is active',        'company');
INSERT INTO "labels" (name, label, module) VALUES ('createdBy',     'Created by',       'company');
INSERT INTO "labels" (name, label, module) VALUES ('updatedBy',     'Updated by',       'company');
INSERT INTO "labels" (name, label, module) VALUES ('createdAt',     'Created at',       'company');
INSERT INTO "labels" (name, label, module) VALUES ('updatedAt',     'Updated at',       'company');

--- contact labels
INSERT INTO "labels" (name, label, module) VALUES ('id',            'Id',               'contact');
INSERT INTO "labels" (name, label, module) VALUES ('prefix',        'Prefix',           'contact');
INSERT INTO "labels" (name, label, module) VALUES ('firstName',     'First name',       'contact');
INSERT INTO "labels" (name, label, module) VALUES ('lastName',      'Last name',        'contact');
INSERT INTO "labels" (name, label, module) VALUES ('name',          'Name',             'contact');
INSERT INTO "labels" (name, label, module) VALUES ('annualRevenue', 'Annual revenue',   'contact');
INSERT INTO "labels" (name, label, module) VALUES ('description',   'Description',      'contact');
INSERT INTO "labels" (name, label, module) VALUES ('industry',      'Industry',         'contact');
INSERT INTO "labels" (name, label, module) VALUES ('companyId',     'Company id',       'contact');
INSERT INTO "labels" (name, label, module) VALUES ('isActive',      'Is active',        'contact');
INSERT INTO "labels" (name, label, module) VALUES ('createdBy',     'Created by',       'contact');
INSERT INTO "labels" (name, label, module) VALUES ('updatedBy',     'Updated by',       'contact');
INSERT INTO "labels" (name, label, module) VALUES ('createdAt',     'Created at',       'contact');
INSERT INTO "labels" (name, label, module) VALUES ('updatedAt',     'Updated at',       'contact');

--- deal labels
INSERT INTO "labels" (name, label, module) VALUES ('id',            'Id',               'deal');
INSERT INTO "labels" (name, label, module) VALUES ('name',          'Name',             'deal');
INSERT INTO "labels" (name, label, module) VALUES ('total',         'Total',            'deal');
INSERT INTO "labels" (name, label, module) VALUES ('description',   'Description',      'deal');
INSERT INTO "labels" (name, label, module) VALUES ('source',        'Source',           'deal');
INSERT INTO "labels" (name, label, module) VALUES ('isActive',      'Is active',        'deal');
INSERT INTO "labels" (name, label, module) VALUES ('createdBy',     'Created by',       'deal');
INSERT INTO "labels" (name, label, module) VALUES ('updatedBy',     'Updated by',       'deal');
INSERT INTO "labels" (name, label, module) VALUES ('createdAt',     'Created at',       'deal');
INSERT INTO "labels" (name, label, module) VALUES ('updatedAt',     'Updated at',       'deal');

--- quote labels
INSERT INTO "labels" (name, label, module) VALUES ('id',            'Id',               'quote');
INSERT INTO "labels" (name, label, module) VALUES ('name',          'Name',             'quote');
INSERT INTO "labels" (name, label, module) VALUES ('description',   'Description',      'quote');
INSERT INTO "labels" (name, label, module) VALUES ('total',         'Total',            'quote');
INSERT INTO "labels" (name, label, module) VALUES ('isActive',      'Is active',        'quote');
INSERT INTO "labels" (name, label, module) VALUES ('createdBy',     'Created by',       'quote');
INSERT INTO "labels" (name, label, module) VALUES ('updatedBy',     'Updated by',       'quote');
INSERT INTO "labels" (name, label, module) VALUES ('createdAt',     'Created at',       'quote');
INSERT INTO "labels" (name, label, module) VALUES ('updatedAt',     'Updated at',       'quote');

--- ticket labels
INSERT INTO "labels" (name, label, module) VALUES ('id',            'Id',               'ticket');
INSERT INTO "labels" (name, label, module) VALUES ('name',          'Name',             'ticket');
INSERT INTO "labels" (name, label, module) VALUES ('description',   'Description',      'ticket');
INSERT INTO "labels" (name, label, module) VALUES ('type',          'Type',             'ticket');
INSERT INTO "labels" (name, label, module) VALUES ('isActive',      'Is active',        'ticket');
INSERT INTO "labels" (name, label, module) VALUES ('createdBy',     'Created by',       'ticket');
INSERT INTO "labels" (name, label, module) VALUES ('updatedBy',     'Updated by',       'ticket');
INSERT INTO "labels" (name, label, module) VALUES ('createdAt',     'Created at',       'ticket');
INSERT INTO "labels" (name, label, module) VALUES ('updatedAt',     'Updated at',       'ticket');

--- task labels
INSERT INTO "labels" (name, label, module) VALUES ('id',            'Id',               'task');
INSERT INTO "labels" (name, label, module) VALUES ('name',          'Name',             'task');
INSERT INTO "labels" (name, label, module) VALUES ('description',   'Description',      'task');
INSERT INTO "labels" (name, label, module) VALUES ('type',          'Type',             'task');
INSERT INTO "labels" (name, label, module) VALUES ('isActive',      'Is active',        'task');
INSERT INTO "labels" (name, label, module) VALUES ('createdBy',     'Created by',       'task');
INSERT INTO "labels" (name, label, module) VALUES ('updatedBy',     'Updated by',       'task');
INSERT INTO "labels" (name, label, module) VALUES ('createdAt',     'Created at',       'task');
INSERT INTO "labels" (name, label, module) VALUES ('updatedAt',     'Updated at',       'task');

--- module labels
INSERT INTO "labels" (name, label, module) VALUES ('company',       'company',          'module');
INSERT INTO "labels" (name, label, module) VALUES ('contact',       'contact',          'module');
INSERT INTO "labels" (name, label, module) VALUES ('deal',          'deal',             'module');
INSERT INTO "labels" (name, label, module) VALUES ('quote',         'quote',            'module');
INSERT INTO "labels" (name, label, module) VALUES ('ticket',        'ticket',           'module');
INSERT INTO "labels" (name, label, module) VALUES ('task',          'task',             'module');
INSERT INTO "labels" (name, label, module) VALUES ('comment',       'comment',          'module');
INSERT INTO "labels" (name, label, module) VALUES ('file',          'file',             'module');

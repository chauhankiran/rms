CREATE TABLE "fields" (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    
    module VARCHAR(255) NOT NULL,
    
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INT,
    "updatedBy" INT,
    "createdAt" timestamp NOT NULL DEFAULT NOW(),
    "updatedAt" timestamp
);

--- company fields
INSERT INTO "fields" (name, label, module) VALUES ('id',            'Id',               'company');
INSERT INTO "fields" (name, label, module) VALUES ('name',          'Name',             'company');
INSERT INTO "fields" (name, label, module) VALUES ('employeeSize',  'Employee size',    'company');
INSERT INTO "fields" (name, label, module) VALUES ('annualRevenue', 'Annual revenue',   'company');
INSERT INTO "fields" (name, label, module) VALUES ('source',        'Source',           'company');
INSERT INTO "fields" (name, label, module) VALUES ('description',   'Description',      'company');
INSERT INTO "fields" (name, label, module) VALUES ('isActive',      'Is active',        'company');
INSERT INTO "fields" (name, label, module) VALUES ('createdBy',     'Created by',       'company');
INSERT INTO "fields" (name, label, module) VALUES ('updatedBy',     'Updated by',       'company');
INSERT INTO "fields" (name, label, module) VALUES ('createdAt',     'Created at',       'company');
INSERT INTO "fields" (name, label, module) VALUES ('updatedAt',     'Updated at',       'company');

--- contact fields
INSERT INTO "fields" (name, label, module) VALUES ('id',            'Id',               'contact');
INSERT INTO "fields" (name, label, module) VALUES ('prefix',        'Prefix',           'contact');
INSERT INTO "fields" (name, label, module) VALUES ('firstName',     'First name',       'contact');
INSERT INTO "fields" (name, label, module) VALUES ('lastName',      'Last name',        'contact');
INSERT INTO "fields" (name, label, module) VALUES ('name',          'Name',             'contact');
INSERT INTO "fields" (name, label, module) VALUES ('annualRevenue', 'Annual revenue',   'contact');
INSERT INTO "fields" (name, label, module) VALUES ('description',   'Description',      'contact');
INSERT INTO "fields" (name, label, module) VALUES ('industry',      'Industry',         'contact');
INSERT INTO "fields" (name, label, module) VALUES ('companyId',     'Company id',       'contact');
INSERT INTO "fields" (name, label, module) VALUES ('isActive',      'Is active',        'contact');
INSERT INTO "fields" (name, label, module) VALUES ('createdBy',     'Created by',       'contact');
INSERT INTO "fields" (name, label, module) VALUES ('updatedBy',     'Updated by',       'contact');
INSERT INTO "fields" (name, label, module) VALUES ('createdAt',     'Created at',       'contact');
INSERT INTO "fields" (name, label, module) VALUES ('updatedAt',     'Updated at',       'contact');

--- deal fields
INSERT INTO "fields" (name, label, module) VALUES ('id',            'Id',               'deal');
INSERT INTO "fields" (name, label, module) VALUES ('name',          'Name',             'deal');
INSERT INTO "fields" (name, label, module) VALUES ('total',         'Total',            'deal');
INSERT INTO "fields" (name, label, module) VALUES ('description',   'Description',      'deal');
INSERT INTO "fields" (name, label, module) VALUES ('source',        'Source',           'deal');
INSERT INTO "fields" (name, label, module) VALUES ('isActive',      'Is active',        'deal');
INSERT INTO "fields" (name, label, module) VALUES ('createdBy',     'Created by',       'deal');
INSERT INTO "fields" (name, label, module) VALUES ('updatedBy',     'Updated by',       'deal');
INSERT INTO "fields" (name, label, module) VALUES ('createdAt',     'Created at',       'deal');
INSERT INTO "fields" (name, label, module) VALUES ('updatedAt',     'Updated at',       'deal');

--- quote fields
INSERT INTO "fields" (name, label, module) VALUES ('id',            'Id',               'quote');
INSERT INTO "fields" (name, label, module) VALUES ('name',          'Name',             'quote');
INSERT INTO "fields" (name, label, module) VALUES ('description',   'Description',      'quote');
INSERT INTO "fields" (name, label, module) VALUES ('total',         'Total',            'quote');
INSERT INTO "fields" (name, label, module) VALUES ('isActive',      'Is active',        'quote');
INSERT INTO "fields" (name, label, module) VALUES ('createdBy',     'Created by',       'quote');
INSERT INTO "fields" (name, label, module) VALUES ('updatedBy',     'Updated by',       'quote');
INSERT INTO "fields" (name, label, module) VALUES ('createdAt',     'Created at',       'quote');
INSERT INTO "fields" (name, label, module) VALUES ('updatedAt',     'Updated at',       'quote');

--- ticket fields
INSERT INTO "fields" (name, label, module) VALUES ('id',            'Id',               'ticket');
INSERT INTO "fields" (name, label, module) VALUES ('name',          'Name',             'ticket');
INSERT INTO "fields" (name, label, module) VALUES ('description',   'Description',      'ticket');
INSERT INTO "fields" (name, label, module) VALUES ('type',          'Type',             'ticket');
INSERT INTO "fields" (name, label, module) VALUES ('isActive',      'Is active',        'ticket');
INSERT INTO "fields" (name, label, module) VALUES ('createdBy',     'Created by',       'ticket');
INSERT INTO "fields" (name, label, module) VALUES ('updatedBy',     'Updated by',       'ticket');
INSERT INTO "fields" (name, label, module) VALUES ('createdAt',     'Created at',       'ticket');
INSERT INTO "fields" (name, label, module) VALUES ('updatedAt',     'Updated at',       'ticket');

--- task fields
INSERT INTO "fields" (name, label, module) VALUES ('id',            'Id',               'task');
INSERT INTO "fields" (name, label, module) VALUES ('name',          'Name',             'task');
INSERT INTO "fields" (name, label, module) VALUES ('description',   'Description',      'task');
INSERT INTO "fields" (name, label, module) VALUES ('type',          'Type',             'task');
INSERT INTO "fields" (name, label, module) VALUES ('isActive',      'Is active',        'task');
INSERT INTO "fields" (name, label, module) VALUES ('createdBy',     'Created by',       'task');
INSERT INTO "fields" (name, label, module) VALUES ('updatedBy',     'Updated by',       'task');
INSERT INTO "fields" (name, label, module) VALUES ('createdAt',     'Created at',       'task');
INSERT INTO "fields" (name, label, module) VALUES ('updatedAt',     'Updated at',       'task');

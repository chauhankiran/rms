CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,

  type VARCHAR(255) NOT NULL DEFAULT 'user',

  "isRequiredToChangePassword" BOOLEAN NOT NULL DEFAULT false, 

  "isActive" BOOLEAN NOT NULL DEFAULT true, 
  "createdBy" INT,
  "updatedBy" INT,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);
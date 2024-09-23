CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true, 
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp
);
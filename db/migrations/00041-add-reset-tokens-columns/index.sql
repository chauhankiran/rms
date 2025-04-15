ALTER TABLE users
ADD "resetToken" varchar(255),
ADD "resetTokenExpiresIn" timestamp;

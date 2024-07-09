CREATE DATABASE business_manager;
\connect business_manager;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "Role" (
    "role_id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Users" (
    "user_id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "role_id" INT,
    FOREIGN KEY ("role_id") REFERENCES "Role" ("role_id")
);

CREATE INDEX IF NOT EXISTS "idx_users_role_id" ON "Users" ("role_id");

-- Вставка начальных данных, если необходимо
INSERT INTO "Role" ("role_id", "name") VALUES (1, 'Admin');
INSERT INTO "Role" ("role_id", "name") VALUES (2, 'User');

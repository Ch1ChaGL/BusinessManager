-- Создаем базу данных и подключаемся к ней
CREATE DATABASE business_manager;
\connect business_manager;

-- Устанавливаем расширение для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создаем таблицу ролей, если она еще не существует
CREATE TABLE IF NOT EXISTS "Role" (
    "role_id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

-- Вставляем начальные данные в таблицу ролей, если они еще не добавлены
INSERT INTO "Role" ("role_id", "name") VALUES (1, 'Admin') ON CONFLICT DO NOTHING;
INSERT INTO "Role" ("role_id", "name") VALUES (2, 'User') ON CONFLICT DO NOTHING;

-- Создаем таблицу пользователей, если она еще не существует
CREATE TABLE IF NOT EXISTS "Users" (
    "user_id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL DEFAULT '',
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role_id" INT,
    FOREIGN KEY ("role_id") REFERENCES "Role" ("role_id")
);

-- Создаем индекс на role_id в таблице пользователей, если его еще нет
CREATE INDEX IF NOT EXISTS "idx_users_role_id" ON "Users" ("role_id");

-- Создаем функцию для триггера, которая устанавливает name как 'user_' + uuid_generate_v4()
CREATE OR REPLACE FUNCTION set_user_name() RETURNS TRIGGER AS $$
BEGIN
    -- Проверяем, было ли явно указано значение для name
    IF NEW.name IS NULL OR NEW.name = '' THEN
        NEW.name = 'user_' || NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер, который вызывает функцию при вставке новых строк в таблицу Users
CREATE TRIGGER before_insert_users
BEFORE INSERT ON "Users"
FOR EACH ROW
EXECUTE PROCEDURE set_user_name();

INSERT INTO "Users" ("email", "role_id") VALUES ('john.doe@example.com', 1);
INSERT INTO "Users" ("email", "role_id") VALUES ('jane.smith@example.com', 2);

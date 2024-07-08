# Базовый образ с Node.js для сборки приложения
FROM node:latest

# Установка рабочего каталога
WORKDIR /app

# Копирование зависимостей
COPY package.json yarn.lock ./

# Установка зависимостей
RUN yarn install
RUN yarn global add nestjs

# Копирование .env файла
COPY .env ./

# Копирование исходного кода
COPY . .

# Установка Prisma CLI
RUN yarn global add prisma

# Генерация Prisma клиента
# RUN npx prisma db pull
# RUN npx prisma generate

# Команда для запуска приложения
CMD ["yarn", "start:dev"]

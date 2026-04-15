# 🧾 Order Service API (NestJS + Prisma + PostgreSQL)

Backend service for creating orders 

---

## ⚙️ Requirements

- Node.js v22+
- PostgreSQL

---

## Installation

```bash
npm install
```

---

### Environment Setup

Create a `.env` file based on `_example.env`

Example:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME
```

---

## Apply DB migration

```bash
npm run migrate:dev
```

---

## Add Seed Data

```bash
npm run seed
```

---

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

---

## API Base URL

```
http://localhost:3000
```

## Swagger URL

```
http://localhost:3000/api
```

---

## Main Endpoint

### Create Order

```
POST /orders
```
---

## Tech Stack

- Node.js v22
- NestJS
- Prisma ORM
- PostgreSQL
- TypeScript

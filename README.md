# SB Notes API

A simple notes API built with **Express**, **TypeScript**, and **Prisma** backed by a Postgres database. Authentication is handled using JWT tokens, and request validation is performed via Zod schemas.

---
## DB Design

![DB Design](/SB%20Notes%20Database%20Design.png "DB Design")

## 🚀 Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/teyiadzufeh/sb-notes-api.git
   cd sb-notes-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env` file in the project root. Example values (adjust to your environment):
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/notes_db
   JWT_SECRET=supersecretkey
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=anothersecret
   JWT_REFRESH_EXPIRES_IN=30d
   NODE_ENV=development
   ```

4. **Database migration**
   The project uses Prisma for database access. To apply migrations:
   ```bash
   npx prisma migrate deploy
   ```
   (For development you can also run `npx prisma migrate dev` to create new migrations.)

5. **Build & start**
   ```bash
   npm run build      # compile TypeScript
   npm start          # run compiled server
   ```
   During development you can use:
   ```bash
   npm run dev        # uses nodemon
   ```

6. **Running tests**
   - Unit tests: `npm run test:unit`
   - Integration tests: `npm run test:integration`
   - Full suite: `npm test`
   
   A `.env.test` file should contain a test database URL and any other necessary secrets.
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/test_notes_db
   JWT_SECRET=test-secret
   NODE_ENV=test
   ```

---

## 📄 API Documentation

> Here's a Postman collection link to test each endpoint: [SB Notes API Doc](https://documenter.getpostman.com/view/20140877/2sBXcLfHLb)

### Authentication
Users register and then login.

### Notes

All note-related routes require a valid Bearer token.
> NB: `content` is optional on creation and update.

---

## 🧠 Design Decisions & Assumptions

- **Prisma & PostgreSQL**: chosen for schema migrations and type-safe database access. The generated client lives under `src/generated/prisma`.
- **Zod validation**: all input payloads are validated using Zod schemas defined in `src/types/*` to ensure request integrity.
- **JWT-based auth**: access and refresh tokens are generated/verified in `src/utils/jwt.ts`. Tokens expire by default (`7d` / `30d`).
- **Modular architecture**: controllers, services, routes and middleware are separated, following a clean layered pattern for maintainability.
- **Environment-specific logging**: Prisma logs queries in development only.
- **Pagination**: note listing supports simple page/limit parameters with computed metadata.

Additional assumptions:

1. **User registration** stores user information with a hashed password (bcrypt) although the hashing logic is in `UserService` (not inspected here).  
2. Refresh token logic appears to be implemented (generateRefreshToken) but no endpoint to refresh tokens is present yet; future feature.
3. The app is built assuming a Postgres connection string provided by `DATABASE_URL`; other adapters may require configuration changes.

---

## 🛠 Future Enhancements

- Use of An AppError error handler
- Expand note search/filtering.
- Improve error responses with structured JSON.

---

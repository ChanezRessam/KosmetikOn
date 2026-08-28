# KosmetikOn — Raw Materials Management Module

Full Stack Developer technical test — CRUD module for managing raw materials used in cosmetics manufacturing.

## Tech stack

- **Frontend**: Angular 21 (standalone components, Reactive Forms)
- **Backend**: Express.js + Node.js (layered architecture)
- **Database**: PostgreSQL 16
- **API documentation**: Swagger / OpenAPI
- **Authentication**: JWT (bonus)
- **Containerization**: Docker / docker-compose (bonus)
- **Testing**: Jest (bonus)

---

## 3. Sector knowledge question

> **In your own words, what is a raw material in cosmetology?**


"Pour moi, une matière première en cosmétologie est un ingrédient de base utilisé dans la formulation d’un produit cosmétique. Elle peut être d’origine naturelle, comme une huile végétale, une cire, un extrait de plante ou une argile, mais elle peut aussi être d’origine synthétique ou minérale.

Chaque matière première a une fonction précise dans la formulation : hydrater, nourrir, épaissir, stabiliser, parfumer, conserver ou apporter une action spécifique sur la peau ou les cheveux. Par exemple, une huile végétale peut jouer à la fois un rôle d’émollient et contribuer à améliorer la sensorialité du produit.

Le choix des matières premières est donc important, car leurs propriétés, leur qualité et leur compatibilité entre elles vont influencer la texture, la stabilité, la sécurité et l’efficacité du produit cosmétique final."




```

---

## Project structure

```
KosmetikOn/
├── frontend/          # Angular application
├── backend/           # Express.js API
├── database/          # SQL scripts (schema + seed data)
├── docker-compose.yml # Orchestrates all three services
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- [npm](https://www.npmjs.com/) v10 or higher
- [PostgreSQL](https://www.postgresql.org/) 16 (only if running locally without Docker)
- [Angular CLI](https://angular.dev/tools/cli) v21 (`npm install -g @angular/cli`)
- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose (recommended — simplest setup)

---

##  Quick start with Docker (recommended)

The simplest way to run the whole stack with a single command.

### 1. Clone the repository and move to its root

```bash
cd KosmetikOn
```

### 2. Start all services

```bash
docker compose up --build

```

This will:
- Start a PostgreSQL 16 container, automatically initialized with the schema (`database/create.sql`) and seed data (`database/seed.sql`)
- Build and start the Express backend on port **3000**
- Build and start the Angular frontend (served via nginx) on port **4200**

### 3. Create a test user (first run only)

In a new terminal, once the containers are up:

```bash
docker exec -it kosmetikon-backend node scripts/createUser.js test@kosmetikon.com password123
```

### 4. Access the application

| Service | URL |
|---|---|
| Application (frontend) | http://localhost:4200 |
| Backend API | http://localhost:3000 |
| Swagger documentation | http://localhost:3000/api-docs |
| Backend health check | http://localhost:3000/health |

**Default login credentials**:
- Email: `test@kosmetikon.com`
- Password: `password123`

### 5. Stop the services

```bash
docker compose down
```

Data persists across restarts thanks to a named Docker volume (`db_data`). To start from a completely clean database:

```bash
docker compose down -v
```

---

## Manual setup without Docker

### 1. PostgreSQL database

Create a local database named `kosmetikon`:

```bash
createdb kosmetikon
```

Run the schema and seed scripts:

```bash
psql -d kosmetikon -f database/create.sql
psql -d kosmetikon -f database/seed.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file at the root of `backend/` (see `.env.example` for the template):

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kosmetikon
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
JWT_SECRET=a_long_random_secret_string
```

Create a test user:

```bash
node scripts/createUser.js test@kosmetikon.com password123
```

Start the server in development mode (auto-reload):

```bash
npm run dev
```

Or in production mode:

```bash
npm start
```

The backend is available at **http://localhost:3000**, Swagger documentation at **http://localhost:3000/api-docs**.

### 3. Frontend

In a new terminal:

```bash
cd frontend
npm install
ng serve
```

The application is available at **http://localhost:4200**.

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Express server listening port | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` (or `db` under Docker) |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `kosmetikon` |
| `DB_USER` | PostgreSQL user | — |
| `DB_PASSWORD` | PostgreSQL password | — |
| `JWT_SECRET` | Secret key used to sign JWT tokens | long random string |

A `.env.example` file is provided as a template in `backend/`.

### Frontend

The backend API URL is currently hardcoded in the Angular services (`src/app/services/raw-material.ts` and `src/app/services/auth.ts`) via the `apiUrl = 'http://localhost:3000'` constant. For a production environment, this should be moved to Angular's `environment.ts` / `environment.prod.ts` files.

---

## Features

### Raw materials management
- Paginated list with filters by name, category, and status
- Creation via a reactive form with validations
- Editing with pre-filled existing data
- Deletion with a confirmation modal
- Uniqueness validation on name and code (frontend + backend)
- Centralized error handling with clear messages (validation errors, duplicates, network failures)

### Authentication (bonus)
- Email / password login
- Passwords hashed with `bcrypt`
- Sessions managed via JWT tokens (8h validity)
- All `/raw-materials` routes are protected on the backend (JWT middleware)
- The frontend protects routes via an `AuthGuard` and automatically attaches the token to every request through an HTTP interceptor
- Logout via a dedicated button

### API documentation (Swagger)
Available at `http://localhost:3000/api-docs` once the backend is running. All endpoints (`/auth/login`, `/raw-materials` CRUD) are documented there with their request/response schemas and possible error codes.

### Unit tests (bonus)
Unit tests cover the backend's service layer (`src/services/rawMaterialService.js`), which holds the business logic (uniqueness validation, 404/409 error handling). The repository is mocked to isolate the tested logic from the database.

Run them with:

```bash
cd backend
npm test
```

---

## Backend architecture

Layered architecture with a strict separation of concerns:

```
src/
├── config/           # PostgreSQL connection, Swagger configuration
├── routes/           # Endpoint definitions (raw-materials, auth)
├── controllers/      # Receive the HTTP request, call the service, return the response
├── services/         # Business logic (validations, uniqueness rules, error handling)
├── repositories/      # Raw SQL queries to PostgreSQL
├── middlewares/       # JWT authentication, centralized error handling
├── dtos/              # Input validation schemas (zod)
└── index.js           # Entry point, Express app assembly
```

**Request flow**: `route → controller → service → repository → PostgreSQL`, then the response bubbles back up. Any error thrown at any layer is caught by the centralized error-handling middleware, which returns a consistent JSON response to the frontend.

## Frontend architecture

```
src/app/
├── components/
│   ├── raw-material-list/    # List, pagination, filters, deletion
│   ├── raw-material-form/    # Create / edit (Reactive Forms)
│   └── login/                 # Login form
├── services/
│   ├── raw-material.ts        # HTTP calls to the raw materials API
│   └── auth.ts                # Authentication, token management
├── guards/
│   └── auth-guard.ts          # Blocks access to routes when not logged in
├── interceptors/
│   └── auth-interceptor.ts    # Automatically attaches the JWT token to requests
├── models/
│   └── raw-material.ts        # TypeScript interfaces (RawMaterial, pagination, filters)
├── app.routes.ts               # Route definitions and their guards
└── app.config.ts                # Application configuration (HttpClient, routing)
```

---

## Technical decisions

- **Angular standalone components**: the project was scaffolded with Angular CLI 21, which defaults to standalone components (no `NgModule`). This approach was kept to stay aligned with current Angular practices.
- **PostgreSQL with the native `pg` driver** (rather than an ORM like Sequelize or Prisma): for a module this simple (a single entity, no relationships), a native driver keeps full control over SQL queries and avoids the abstraction overhead of an ORM, which also makes the code easier to review.
- **Validation with `zod`** on the backend, rather than manual validation: more readable, centralized in a single DTO, and produces detailed per-field error messages.
- **Centralized error handling** via a dedicated Express middleware, rather than scattered `try/catch` blocks with duplicated response logic in every controller.
- **JWT stored in `localStorage`** on the frontend: standard choice for this type of SPA. A more secure alternative (`httpOnly` cookie) would require additional server-side configuration (CSRF, SameSite) outside the scope of this test.
- **A single test user created via a script**, rather than a signup form: since authentication was not part of the core requirements (bonus only), a minimal script (`scripts/createUser.js`) is enough to demonstrate access control without unnecessarily expanding the scope.
- **PostgreSQL exposed on port 5433 in Docker** (instead of 5432): to avoid any conflict with a PostgreSQL instance already installed locally on the development/review machine.

---

## Proof of functionality

*(To be completed — screenshots or a demo GIF/video showing the module in action: list, create, edit, delete, filters, pagination, login/logout)*

---

## Test account

Email : test@kosmetikon.com 

Password : password123 

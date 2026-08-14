# Task Management REST API

A simple REST API for managing tasks, built as a backend engineering case study.

## Tech Stack

- **Node.js + Express** — REST API framework
- **PostgreSQL** — relational database, run via Docker
- **Sequelize** — ORM for schema definition and queries
- **dotenv** — environment variable management

## Architecture

The project follows a layered architecture (routes → controller → service → repository → model), separating HTTP concerns from business logic and data access:

- `routes/` — endpoint definitions, maps HTTP verbs to controllers
- `controllers/` — handles req/res, delegates to services
- `services/` — business logic and validation rules
- `repositories/` — data access layer, talks to Sequelize models
- `models/` — Sequelize schema definitions
- `middleware/` — centralized error handling
- `utils/` — shared helpers (custom error class, UUID validation)

## Setup Instructions

1. Clone the repo:
```bash
   git clone https://github.com/Oladayo234/Task_manager
   cd task_manager
```

2. Install dependencies:
```bash
   npm install
```

3. Start PostgreSQL via Docker:
```bash
   docker run --name task_manager_db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=task_manager \
     -p 5432:5432 \
     -d postgres:16
```

4. Create a `.env` file in the project root:
    PORT=3000
    NODE_ENV=development
    DB_NAME=task_manager
    DB_USER=postgres
    DB_PASSWORD=postgres
    DB_HOST=127.0.0.1
    DB_PORT=5432

5. Run the server:
```bash
   npm run dev
```
   The API will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks` | Create a task |
| GET | `/tasks` | Get all tasks (supports `?status=` filter) |
| GET | `/tasks/:id` | Get a single task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Task fields
`id`, `title` (required), `description`, `status` (`pending` \| `in-progress` \| `completed`), `dueDate`, `createdAt`, `updatedAt`

### Example requests

Create a task:
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Write README", "status": "pending"}'
```

Filter by status:
```bash
curl "http://localhost:3000/tasks?status=pending"
```

## Assumptions

- `title` is the only required field on creation; `description`, `status`, and `dueDate` are optional.
- `status` is restricted to a fixed enum (`pending`, `in-progress`, `completed`) rather than free text, to keep filtering and validation predictable.
- IDs are UUIDs rather than auto-incrementing integers, to avoid exposing sequential/enumerable identifiers via the API.
- No authentication/authorization was implemented — out of scope per the assignment brief.

## Challenges Encountered

- Sequelize threw a raw database error (uncaught, surfacing as a 500) when queried with a malformed UUID instead of a valid one. Solved by validating UUID format at the service layer before hitting the database, returning a clean 400 instead of leaking the underlying Postgres error message.
- Iterated on error handling to centralize it through a single Express error-handling middleware and a custom `AppError` class, rather than scattering try/catch logic with inconsistent response shapes across controllers.

## What I'd Improve With More Time

- Add automated tests (unit tests for the service layer, integration tests for the endpoints) rather than relying on manual curl testing.
- Add request validation via a schema library (e.g. Joi or express-validator) instead of manual field checks.
- Add pagination to `GET /tasks` for scalability.
- Containerize the app itself (not just the database) with a Dockerfile and docker-compose for one-command setup.
- Add authentication/authorization (e.g. JWT) if the API were to move beyond an internal tool.
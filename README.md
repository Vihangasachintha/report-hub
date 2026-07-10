# ReportHub — Weekly Report Generator & Team Dashboard

A full-stack web application for submitting structured weekly work reports and analyzing them across a team. Built with **Laravel 11 (JWT REST API)**, **React 18 + TypeScript**, and **MySQL**.

- **Team members** create, edit, and submit their own weekly reports (fixed schema, same fields for everyone).
- **Managers** view and analyze reports across the whole team through a filterable dashboard with charts, submission tracking, and project management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios, Recharts |
| Backend | Laravel 11, `tymon/jwt-auth` (JWT authentication) |
| Database | MySQL |
| Auth | JWT (Bearer token), role-based middleware (`member` / `manager`) |

---

## Prerequisites

Install these before starting:

| Tool | Version | Check with |
|---|---|---|
| PHP | 8.2+ | `php -v` |
| Composer | 2.x | `composer -V` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| MySQL | 8.x (or MariaDB 10.x) | `mysql --version` |

---

## Project Structure

```
ReportHub/
├── backend/     # Laravel API
└── frontend/    # React + TypeScript app
```

---

## 1. Installing Dependencies

Clone the repository, then install both sides:

```bash
git clone <repository-url>
cd ReportHub
```

**Backend:**
```bash
cd backend
composer install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

---

## 2. Running the Database

1. Start your local MySQL server (via XAMPP, native service, Docker, etc.).
2. Create an empty database:
   ```sql
   CREATE DATABASE reporthub;
   ```
3. No manual schema setup needed — Laravel's migrations (next section) build every table automatically.

---

## 3. Running the Backend

All commands run from the `backend/` directory.

**a) Copy the environment file and configure it:**
```bash
cp .env.example .env
```

Edit `.env` and set your database credentials:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=reporthub
DB_USERNAME=root
DB_PASSWORD=
```

**b) Generate the Laravel app key:**
```bash
php artisan key:generate
```

**c) Generate the JWT secret:**
```bash
php artisan jwt:secret
```

**d) Run migrations and seed sample data:**
```bash
php artisan migrate:fresh --seed
```
This creates all tables (`users`, `projects`, `reports`, `project_user`) and seeds:
- 1 manager + 4 members
- 4 sample projects
- ~4 weeks of sample reports with a realistic mix of submitted/late/draft statuses

**Seeded login credentials** (all passwords: `password123`):

| Role | Email |
|---|---|
| Manager | `manager@test.com` |
| Member | `bob@test.com` |
| Member | `alice@test.com` |
| Member | `raj@test.com` |
| Member | `maria@test.com` |

**e) Start the API server:**
```bash
php artisan serve
```
API is now running at `http://localhost:8000/api`.

---

## 4. Running the Frontend

All commands run from the `frontend/` directory.

**a) Create the environment file:**
```bash
cp .env.example .env
```
Confirm it points to your running backend:
```
VITE_API_URL=http://localhost:8000/api
```

**b) Start the dev server:**
```bash
npm run dev
```
App is now running at `http://localhost:5173` (or the port shown in your terminal).

**c) CORS check:** if the frontend runs on a different port than `5173`, update `backend/config/cors.php` → `allowed_origins` to match, or requests will be blocked by the browser.

---

## Quick Start (all steps together)

```bash
# Terminal 1 — backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate:fresh --seed
php artisan serve

# Terminal 2 — frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```
Then open the frontend URL and log in with any seeded account above.

---

## Features

### Authentication & Roles
- Registration with role selection (member/manager) at signup
- JWT-based login/logout with token blacklisting on logout
- Route-level and object-level role enforcement

### Personal Report Page (all roles)
- Fixed weekly report schema: week range, project, tasks completed, tasks planned, blockers, hours worked, notes
- Create → Save as Draft → Submit lifecycle
- Report history grouped by week, read-only once submitted

### Team Dashboard (manager only)
- Summary metrics: team size, reports submitted, compliance rate, open blockers
- Charts: submission trend over time, status distribution, workload by project (Recharts)
- Filterable, paginated team reports table (member, project, date range, status)
- Per-member submission status tracking (submitted / late / draft / pending)
- Click-through report detail view

### Projects
- Full CRUD (manager-only writes, open reads)
- Optional team-member assignment per project

---

## API Overview

Base URL: `http://localhost:8000/api`

| Group | Example endpoints | Access |
|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login` | Public |
| Reports | `GET/POST/PUT/DELETE /reports` | Authenticated, own data only |
| Projects | `GET /projects` (read), `POST/PUT/DELETE /projects` (write) | Any user / manager only |
| Dashboard | `GET /dashboard/summary`, `/trend`, `/workload-by-project`, etc. | Manager only |

---

## Troubleshooting

| Issue | Fix |
|---|---|
| CORS error in browser console | Match `allowed_origins` in `backend/config/cors.php` to your frontend's actual port |
| `419` / `401` on every request | Re-run `php artisan jwt:secret` and restart `php artisan serve` |
| Empty dashboard charts | Re-run `php artisan migrate:fresh --seed` to restore sample data |
| `Table doesn't exist` errors | Run `php artisan migrate:status` to confirm all migrations ran, then `php artisan migrate` |

---

## Deliverables

- **GitHub Repository:** this repo
- **ER Diagram:** [link]
- **Demo Video:** [link]
- **Presentation:** [link]
Submission Instructions

Repository: local workspace at this path.

What to include on GitHub

- All files in this workspace (backend, frontend, README.md).
- Database schema: `backend/sql/schema.sql` (included).
- Seed script: `backend/seed.js` (creates sample data).
- Admin dashboard: `backend/src/admin/dashboard.html` and admin API `backend/src/routes/admin.js`.

Recommended Git commands

1. Initialize repository and commit:

```bash
cd /var/www/html/booking
git init
git add .
git commit -m "Initial submission: resource-booking app"
```

2. Create GitHub repo (use your account) and add remote, then push:

```bash
# create a repo on GitHub (via website) named <your-repo>
git remote add origin git@github.com:<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

Database schema and seed

- Schema file: `backend/sql/schema.sql`
- To create DB and seed sample data (uses `seed.js`):

```bash
cd backend
cp .env.example .env   # edit DB connection values if needed
npm install
node seed.js
```

Running locally

Backend (serves API and built frontend static files):

```bash
cd backend
npm install
# set DB env vars in .env if needed
npm start
```

Frontend (development):

```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173 for frontend dev server
# or build for production and backend will serve the dist at http://localhost:4000/
npm run build
```

Admin credentials (dev default)

- Username: `admin`
- Password: `password`
- You can override with environment variables `ADMIN_USER` and `ADMIN_PASS`.

Files of interest

- `backend/sql/schema.sql` — database schema
- `backend/seed.js` — seeds sample data
- `backend/src` — backend source (routes, db, admin files)
- `frontend/src` — frontend source (React + Redux Toolkit)

Notes

- Redux Toolkit is used for state management in the frontend (slices under `frontend/src/slices`).
- Slices include async thunks, loading states and error fields for resources, bookings, and users.

If you want, I can:
- Create the remote GitHub repo and push (requires your GitHub access token/SSH key configured locally), or
- Prepare a zip of the workspace for upload.

Contact me which option you prefer.

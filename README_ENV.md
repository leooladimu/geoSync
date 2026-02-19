# Environment variable snippets — copy/paste

Quick copy/paste file with example env values for local development and common hosts.

## Local (development)

Create `server/.env` locally (not committed):

```env
MONGO_URI=mongodb://localhost:27017/geosync
JWT_SECRET=super_long_random_secret_here
PORT=5000
```

Create `client/.env` locally (not committed):

```env
VITE_API_URL=http://localhost:5000/api
```

Notes:
- Keep `server/.env` out of source control. Add `/server/.env` and `/client/.env.local` to `.gitignore` if needed.

## Vercel (frontend)

In your Vercel project settings → Environment Variables add:

- Key: `VITE_API_URL`
- Value: `https://your-api-host.example.com/api`
- Environment: Production (and Preview if you want preview deploys)

Vite will embed `VITE_API_URL` at build-time; redeploy to pick up changes.

## Render (backend web service)

In your Render service → Environment → Environment Variables add:

- Key: `MONGO_URI` Value: `mongodb+srv://<user>:<pass>@cluster0.mongodb.net/geosync?retryWrites=true&w=majority`
- Key: `JWT_SECRET` Value: `a-very-long-secret-string`
- Key: `PORT` Value: `5000` (optional)

Start command on Render: `npm start` (server root)

## Netlify (static frontend)

In Site settings → Build & deploy → Environment add:

- Key: `VITE_API_URL` Value: `https://your-api-host.example.com/api`

If building in CI, Netlify will use the variable during `npm run build`.

## GitHub Actions (inject at build time)

Add repository Secrets (Settings → Secrets & variables → Actions): `VITE_API_URL`, `MONGO_URI`, `JWT_SECRET`.

Example workflow snippet (frontend build):

```yaml
jobs:
  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install and build client
        working-directory: ./client
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
        run: |
          npm ci
          npm run build
```

## Docker Compose (local or host)

Example `docker-compose.yml` snippet to set runtime envs for the server service:

```yaml
services:
  server:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/geosync
      - JWT_SECRET=super_long_random_secret_here
  client:
    build: ./client
    environment:
      - VITE_API_URL=http://localhost:5000/api
```

Note: Client envs are read at build-time for static sites. If you want runtime injection, use a server-side proxy or runtime variable injection technique.

## Security reminders

- Anything starting with `VITE_` is bundled into the client and publicly visible — do NOT store secrets there.
- Keep `JWT_SECRET` and database credentials private; rotate them if they are ever accidentally committed.
- Use platform secrets management (Vercel/Render/Netlify/GitHub secrets) rather than committing `.env` files in your repo.

---

If you'd like, I can also add a `server/.env.example` (non-secret placeholders) to the repo for quick onboarding.

# EraseMate — Professional Background Remover

> AI-powered background removal built with React + Vite + FastAPI + REMBG + Supabase + Cloudflare R2

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · Vite · Tailwind CSS · Zustand · React Router |
| Backend | FastAPI · REMBG · Pillow · NumPy |
| Auth | Supabase (Google, GitHub, email) |
| Storage | Cloudflare R2 (S3-compatible) |
| Deploy FE | Vercel |
| Deploy BE | Railway |

---

## Project Structure

```
erasemate/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # Navbar, UploadSection, ResultSection, etc.
│   │   ├── pages/          # HomePage, Dashboard (coming soon)
│   │   ├── hooks/          # useAuth, useBackgroundRemoval
│   │   ├── lib/            # Supabase client, API client
│   │   └── store/          # Zustand stores (auth, image, processing, toast)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── vercel.json
│
└── backend/                # FastAPI app
    ├── main.py             # All routes and processing logic
    ├── requirements.txt
    ├── Dockerfile
    ├── supabase_migration.sql
    └── .env.example
```

---

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- A Supabase project (free tier works)
- A Cloudflare R2 bucket (optional for local dev)

---

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase and R2 credentials

# Start the server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
Interactive docs at `http://localhost:8000/docs`.

#### Environment Variables (backend)
```
SUPABASE_URL          https://your-project.supabase.co
SUPABASE_ANON_KEY     eyJ...
SUPABASE_SERVICE_KEY  eyJ...
R2_ENDPOINT           https://<account_id>.r2.cloudflarestorage.com
R2_ACCESS_KEY         your_access_key
R2_SECRET_KEY         your_secret_key
R2_BUCKET             erasemate
R2_PUBLIC_URL         https://pub-xxx.r2.dev
FRONTEND_URL          http://localhost:5173
MAX_FILE_SIZE_MB      25
FREE_LIMIT            5
```

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local:
#   VITE_API_URL=http://localhost:8000
#   VITE_SUPABASE_URL=https://your-project.supabase.co
#   VITE_SUPABASE_ANON_KEY=eyJ...

# Start dev server
npm run dev
```

App will be at `http://localhost:5173`.

---

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `backend/supabase_migration.sql`
3. Go to **Authentication → Providers** and enable:
   - Email (enabled by default)
   - Google OAuth (add Client ID + Secret)
   - GitHub OAuth (add Client ID + Secret)
4. Set redirect URL to your frontend domain (e.g. `https://erasemate.vercel.app`)

---

### 4. Cloudflare R2 Setup

1. Go to [Cloudflare Dashboard → R2](https://dash.cloudflare.com/?to=/:account/r2)
2. Create a bucket named `erasemate`
3. Create an **API Token** with `Object Read & Write` permissions
4. Enable **Public Access** on the bucket (for result URLs) or use a custom domain
5. Copy the endpoint, access key, and secret key into your `.env`

---

## Deployment

### Backend → Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo, point to the `backend/` directory
4. Railway auto-detects the `Dockerfile`
5. Add all environment variables in the **Variables** tab
6. Railway gives you a public URL like `https://erasemate-backend.railway.app`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set **Root Directory** to `frontend/`
3. Framework preset: **Vite**
4. Add environment variables:
   - `VITE_API_URL` → your Railway backend URL
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

---

## API Reference

### `POST /api/remove-background`

Removes the background from an uploaded image.

**Parameters** (multipart/form-data):
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `file` | File | required | Image file (JPG, PNG, WebP, BMP, TIFF, GIF) |
| `model` | string | `auto` | `auto` \| `u2net` \| `u2net_human_seg` \| `isnet-general-use` |
| `enhance_edges` | bool | `true` | Run post-processing edge refinement |
| `bg_color` | string | null | Hex colour to composite onto (e.g. `#ffffff`) |
| `store` | bool | `true` | Upload result to R2 (auth required) |

**Response headers:**
- `X-Processing-Time-Ms` — server processing time
- `X-Model-Used` — model that was selected
- `X-Original-Size` — original image dimensions
- `X-Result-URL` — R2 public URL of stored result

**Example (curl):**
```bash
curl -X POST https://your-backend.railway.app/api/remove-background \
  -H "Authorization: Bearer YOUR_JWT" \
  -F "file=@photo.jpg" \
  -F "model=auto" \
  -F "enhance_edges=true" \
  --output result.png
```

---

### `POST /api/remove-background/batch`

Process up to 10 images at once. Requires authentication.

**Returns:** JSON with array of results including R2 URLs.

---

### `GET /api/models`

List available REMBG models.

---

### `GET /api/user/usage`

Get current user's daily usage stats (authenticated).

---

## REMBG Models

| Model ID | Best For | Speed |
|----------|----------|-------|
| `u2net` | General (products, animals, objects) | Medium |
| `u2net_human_seg` | People & portraits | Medium |
| `isnet-general-use` | Sharp complex edges | Slow |
| `auto` | Auto-detect from image heuristics | — |

---

## Architecture Notes

### Image Processing Pipeline

1. **Validation** — type check, size check (≤25 MB)
2. **Resize** — downsample to 4096px if larger (speed + quality)
3. **Model selection** — heuristic skin-tone analysis for auto mode
4. **REMBG** — U2Net/ISNet inference with `alpha_matting=True`
5. **Post-processing** — median filter + Gaussian feather on alpha channel
6. **Scale-up** — restore to original resolution after processing
7. **Encode** — PNG (transparent) or JPEG (bg colour applied)
8. **Stream** — direct HTTP streaming response (no temp files)

### Concurrency & Caching

- REMBG sessions are cached per model with `@lru_cache` — no reload per request
- Models are pre-warmed at startup in the Railway container
- Gunicorn runs 2 worker processes; each worker caches its own sessions

---

## Free Tier Limits

By default: **5 images per day** for free users. Change via `FREE_LIMIT` env var. Users with `plan: pro` in Supabase `user_metadata` get unlimited access.

---

## License

MIT

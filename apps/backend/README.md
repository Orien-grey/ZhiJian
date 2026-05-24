# backend

To install dependencies:

```bash
uv sync
```

To run:

```bash
uv run uvicorn app.main:app --reload --port 8000
```

Recommended development `.env`:

```env
ACCESS_TOKEN_MINUTES=1440
REFRESH_TOKEN_DAYS=30
JWT_SECRET=dev-zhi-jian-secret
```

Keep `JWT_SECRET` fixed across restarts in development. If it changes, previously issued access and refresh tokens will all become invalid.

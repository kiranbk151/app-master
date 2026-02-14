# Running the Indent Management System UI

This project is a static single-page UI. The easiest way is to use the built-in
preview server so platforms and local machines run the same way.

## Recommended (works with preview platforms)

From the repository root, run:

```bash
npm start
```

This starts `server.js` on port `3000` by default (or `PORT` if provided).

Then open:

- `http://localhost:3000`

The server automatically serves files from `public/` first, then `dist/`, then
project root.

## Alternative: Python static server

If you prefer Python:

```bash
python -m http.server 8000 --directory public
```

Then open `http://localhost:8000`.

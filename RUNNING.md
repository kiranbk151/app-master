# Running the Indent Management System UI

This project is a static single-page UI. You can run it locally using a simple
static file server or by opening the HTML directly in a browser.

## Option A: Static server (recommended)

From the repository root, run:

```bash
python -m http.server 8000 --directory public
```

Then open `http://localhost:8000` in your browser.

## Option B: Use the dist/ folder

If your environment expects a `dist/` output folder, run:

```bash
python -m http.server 8000 --directory dist
```

Then open `http://localhost:8000` in your browser.

## Option C: Open the file directly

Open `public/index.html` (or `index.html`) in your browser. This works for a
quick preview but some browsers may restrict local file access for scripts.

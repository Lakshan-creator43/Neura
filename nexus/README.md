# NEXUS — Universal Problem Solver

## SETUP IN 3 STEPS

### Step 1 — Install Node.js (if not installed)
Download from: https://nodejs.org  (choose LTS version)
After install, open a terminal and run:
  node --version   ← should print something like v18.x.x

### Step 2 — Install dependencies
Open terminal IN the nexus folder and run:
  npm install

### Step 3 — Start the server
  npm start

Then open your browser and go to:
  http://localhost:3000

That's it! NEXUS is running.

---

## WHAT IT DOES
- You type a question in plain language
- It auto-detects the domain (tech, medical, electronics, agriculture, science)
- The background and colour theme CHANGES based on what you type (live)
- It shows direct links to Reddit, YouTube, Stack Overflow, and 6+ more platforms
- All links open in new tabs — no data scraped, nothing stored server-side
- Search history is saved locally in your browser

## FILE STRUCTURE
  nexus/
  ├── server.js          ← Backend (Express)
  ├── package.json       ← Dependencies
  ├── public/
  │   └── index.html     ← Full frontend (all-in-one)
  └── README.md

## DEVELOPMENT MODE (auto-restart on save)
  npm run dev
(requires nodemon — installs automatically via npx)

## WORKS WITHOUT BACKEND TOO
If the server is not running, the frontend falls back to
client-side link generation — so it still works if you
just open index.html directly in a browser.

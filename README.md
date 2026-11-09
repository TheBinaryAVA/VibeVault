# Mood Book Suggester 📚✨

Type or speak your mood and get matching book recommendations.

**Stack:** HTML, CSS, vanilla JS, Node.js, Express (serverless on Vercel). Optional: Google Books API, OpenAI.

## Features
- Mood recommendations from free text (keyword NLP) or a clickable mood shelf
- Optional OpenAI mood classification (set `OPENAI_API_KEY`)
- Book covers, ratings and links from Google Books
- Genre filter, search by title/author/genre/mood
- Favorites and mood history (saved in the browser)
- Voice input (Chrome, Edge, Safari), dark mode, mobile-friendly

## Run locally
```bash
npm install
npm start      # http://localhost:3000
```

## Deploy to Vercel
**CLI:** `npm i -g vercel && vercel --prod`
**Dashboard:** push this folder to GitHub, then import the repo at vercel.com/new. No build settings needed.

Optional environment variables (Project Settings → Environment Variables): see `.env.example`.

## Structure
```
api/index.js      Express app, exported as a Vercel serverless function
lib/recommend.js  Mood detection, OpenAI, Google Books, search
data/books.js     Curated moods and books (add your own here)
public/           Static frontend (served by Vercel)
vercel.json       Routes /api/* to the Express function
server.js         Local dev server only
```

## Extending
Add a mood or books in `data/books.js`. For MongoDB-backed users and history, add an API route in `api/index.js` using `MONGODB_URI`.

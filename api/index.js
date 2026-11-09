const express = require('express');
const { recommend, search, listMoods } = require('../lib/recommend');

const app = express();
app.use(express.json({ limit: '10kb' }));

app.get('/api/moods', (req, res) => res.json(listMoods()));

app.post('/api/recommend', async (req, res) => {
  try {
    const text = String(req.body?.text || '').slice(0, 300);
    const moodId = String(req.body?.mood || '');
    const genre = String(req.body?.genre || 'All');
    if (!text.trim() && !moodId) return res.status(400).json({ error: 'Tell us your mood or pick one from the shelf.' });
    res.json(await recommend({ text, moodId, genre }));
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.get('/api/search', (req, res) => res.json({ books: search(String(req.query.q || '')) }));

app.get('/api/health', (req, res) => res.json({ ok: true }));

module.exports = app;

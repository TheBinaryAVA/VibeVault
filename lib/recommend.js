const MOODS = require('../data/books');

// Score each mood by keyword hits in the user's text (lightweight NLP).
function detectMoods(text = '') {
  const words = text.toLowerCase().replace(/[^a-z\s']/g, ' ');
  const scores = Object.entries(MOODS).map(([id, m]) => {
    let score = 0;
    for (const k of m.keywords) {
      const re = new RegExp(`\\b${k}\\w*`, 'g');
      score += (words.match(re) || []).length;
    }
    if (words.includes(id)) score += 2;
    return { id, score };
  }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
  return scores.map(s => s.id);
}

// Optional: ask OpenAI to classify free text into one of our moods.
async function detectWithOpenAI(text) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0,
        messages: [
          { role: 'system', content: `Classify the reader's mood. Reply with up to 2 ids from this list, comma-separated, nothing else: ${Object.keys(MOODS).join(', ')}` },
          { role: 'user', content: text }
        ]
      })
    });
    clearTimeout(t);
    const data = await res.json();
    const ids = (data.choices?.[0]?.message?.content || '').toLowerCase().split(/[,\s]+/).filter(id => MOODS[id]);
    return ids.length ? ids : null;
  } catch { return null; }
}

// Optional: add a cover and link from Google Books (works without a key at low volume).
async function withCover(book) {
  try {
    const q = encodeURIComponent(`intitle:${book.title} inauthor:${book.author}`);
    const key = process.env.GOOGLE_BOOKS_API_KEY ? `&key=${process.env.GOOGLE_BOOKS_API_KEY}` : '';
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1${key}`, { signal: ctrl.signal });
    clearTimeout(t);
    const item = (await res.json()).items?.[0]?.volumeInfo;
    const cover = item?.imageLinks?.thumbnail?.replace('http://', 'https://');
    return { ...book, cover: cover || null, link: item?.infoLink || null, rating: item?.averageRating || null };
  } catch { return { ...book, cover: null, link: null, rating: null }; }
}

async function recommend({ text, moodId, genre }) {
  let ids = moodId && MOODS[moodId] ? [moodId] : [];
  if (!ids.length && text) ids = (await detectWithOpenAI(text)) || detectMoods(text);
  const matched = ids.length > 0;
  if (!matched) ids = ['curious'];

  let books = ids.slice(0, 2).flatMap(id =>
    MOODS[id].books.map(bk => ({ ...bk, mood: id, moodLabel: MOODS[id].label })));
  if (genre && genre !== 'All') books = books.filter(bk => bk.genre === genre);
  books = await Promise.all(books.slice(0, 8).map(withCover));

  return {
    matched,
    moods: ids.slice(0, 2).map(id => ({ id, label: MOODS[id].label, emoji: MOODS[id].emoji, intro: MOODS[id].intro })),
    books
  };
}

function search(q = '') {
  const s = q.toLowerCase().trim();
  if (!s) return [];
  const out = [];
  for (const [id, m] of Object.entries(MOODS)) {
    for (const bk of m.books) {
      if ([bk.title, bk.author, bk.genre, bk.blurb, m.label].some(f => f.toLowerCase().includes(s)))
        out.push({ ...bk, mood: id, moodLabel: m.label });
    }
  }
  return out.slice(0, 12);
}

function listMoods() {
  const genres = [...new Set(Object.values(MOODS).flatMap(m => m.books.map(b => b.genre)))].sort();
  return {
    moods: Object.entries(MOODS).map(([id, m]) => ({ id, label: m.label, emoji: m.emoji, color: m.color })),
    genres
  };
}

module.exports = { recommend, search, listMoods, detectMoods };

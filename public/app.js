const $ = s => document.querySelector(s);
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

let favs = store.get('favs', []);
let history = store.get('history', []);
let selectedMood = '';
let tab = 'results';
let lastBooks = [];
let moodColors = {};

// Theme
const root = document.documentElement;
const savedTheme = store.get('theme', null);
if (savedTheme) root.dataset.theme = savedTheme;
$('#theme').onclick = () => {
  const dark = (root.dataset.theme || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light')) === 'dark';
  root.dataset.theme = dark ? 'light' : 'dark';
  store.set('theme', root.dataset.theme);
};

// Load moods + genres
fetch('/api/moods').then(r => r.json()).then(({ moods, genres }) => {
  $('#shelf').innerHTML = moods.map(m =>
    `<button class="spine" role="listitem" aria-pressed="false" data-id="${esc(m.id)}" style="background:${esc(m.color)}">${esc(m.emoji)} ${esc(m.label)}</button>`).join('');
  $('#genre').innerHTML = '<option>All</option>' + genres.map(g => `<option>${esc(g)}</option>`).join('');
  moods.forEach(m => moodColors[m.id] = m.color);
  document.querySelectorAll('.spine').forEach(btn => btn.onclick = () => {
    const same = selectedMood === btn.dataset.id;
    selectedMood = same ? '' : btn.dataset.id;
    document.querySelectorAll('.spine').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === selectedMood)));
    if (!same) { $('#text').value = ''; ask(); }
  });
}).catch(() => status('Could not load moods. Check your connection.'));

function status(html) { $('#status').innerHTML = html; }
function setTab(t) {
  tab = t;
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  render();
}
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => setTab(b.dataset.tab));

async function ask() {
  const text = $('#text').value.trim();
  if (!text && !selectedMood) return status('Type how you feel or pick a mood from the shelf.');
  status('Finding books…');
  setTab('results');
  try {
    const res = await fetch('/api/recommend', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mood: selectedMood, genre: $('#genre').value })
    });
    const data = await res.json();
    if (!res.ok) return status(esc(data.error || 'Something went wrong.'));
    lastBooks = data.books;
    const names = data.moods.map(m => `${m.emoji} <strong>${esc(m.label)}</strong>`).join(' and ');
    status(data.matched
      ? `Detected mood: ${names}. ${esc(data.moods[0].intro)}`
      : `We couldn't read a clear mood, so here are ${names} picks. Try a word like “calm” or “stressed”.`);
    history.unshift({ text: text || data.moods[0].label, mood: data.moods[0].label, emoji: data.moods[0].emoji, at: Date.now() });
    history = history.slice(0, 15); store.set('history', history);
    render();
  } catch { status('Network problem. Please try again.'); }
}
$('#go').onclick = () => { if ($('#text').value.trim()) selectedMood = ''; ask(); };
$('#text').addEventListener('keydown', e => { if (e.key === 'Enter') { selectedMood = ''; ask(); } });
$('#genre').onchange = () => { if ($('#text').value.trim() || selectedMood) ask(); };

// Search
let t;
$('#search').oninput = e => {
  clearTimeout(t);
  const q = e.target.value.trim();
  t = setTimeout(async () => {
    if (!q) return render();
    const { books } = await (await fetch('/api/search?q=' + encodeURIComponent(q))).json();
    lastBooks = books; setTab('results');
    status(books.length ? `${books.length} match${books.length > 1 ? 'es' : ''} for “${esc(q)}”.` : `No books match “${esc(q)}”. Try a mood or genre.`);
  }, 250);
};

// Voice input
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SR) $('#mic').hidden = true;
else $('#mic').onclick = () => {
  const r = new SR(); r.lang = 'en-US';
  $('#mic').textContent = '🔴';
  r.onresult = e => { $('#text').value = e.results[0][0].transcript; selectedMood = ''; ask(); };
  r.onend = r.onerror = () => { $('#mic').textContent = '🎤'; };
  r.start();
};

const isFav = b => favs.some(f => f.title === b.title);
function toggleFav(title) {
  const book = [...lastBooks, ...favs].find(b => b.title === title);
  favs = isFav(book) ? favs.filter(f => f.title !== title) : [...favs, book];
  store.set('favs', favs); render();
}

function card(b) {
  const color = moodColors[b.mood] || '#5B3FA0';
  const cover = b.cover
    ? `<img class="cover" src="${esc(b.cover)}" alt="Cover of ${esc(b.title)}" loading="lazy">`
    : `<div class="cover" style="background:${esc(color)}" aria-hidden="true">${esc(b.title)}</div>`;
  const q = encodeURIComponent(b.title + ' ' + b.author);
  return `<article class="card">${cover}<div class="info">
    <h3>${esc(b.title)}</h3><span class="by">${esc(b.author)}</span>
    <p class="blurb">${esc(b.blurb)}</p>
    <div class="meta"><span class="tag">${esc(b.genre)}</span>${b.moodLabel ? `<span class="tag">${esc(b.moodLabel)}</span>` : ''}${b.rating ? `<span class="tag">★ ${esc(b.rating)}</span>` : ''}</div>
    <div class="acts"><button class="fav" aria-pressed="${isFav(b)}" data-title="${esc(b.title)}">${isFav(b) ? '♥ Saved' : '♡ Save'}</button>
    <a href="${esc(b.link || 'https://www.google.com/books?q=' + q)}" target="_blank" rel="noopener">Details</a></div></div></article>`;
}

function render() {
  $('#favCount').textContent = favs.length ? `(${favs.length})` : '';
  const out = $('#results');
  if (tab === 'favs') {
    status(favs.length ? '' : 'No favorites yet. Save a book to keep it here.');
    out.innerHTML = favs.map(card).join('');
  } else if (tab === 'history') {
    status(history.length ? '' : 'Your mood history will show up here.');
    out.innerHTML = history.length ? '<ul class="hist">' + history.map(h =>
      `<li><span>${esc(h.emoji)} ${esc(h.text)}</span><span>${esc(h.mood)}, ${new Date(h.at).toLocaleDateString()}</span></li>`).join('') + '</ul>' : '';
  } else {
    out.innerHTML = lastBooks.map(card).join('');
  }
  out.querySelectorAll('.fav').forEach(b => b.onclick = () => toggleFav(b.dataset.title));
}
render();

// Local development: npm install && npm start  ->  http://localhost:3000
const path = require('path');
const express = require('express');
const app = require('./api/index.js');
const wrapper = express();
wrapper.use(express.static(path.join(__dirname, 'public')));
wrapper.use(app);
const port = process.env.PORT || 3000;
wrapper.listen(port, () => console.log(`Mood Book Suggester on http://localhost:${port}`));

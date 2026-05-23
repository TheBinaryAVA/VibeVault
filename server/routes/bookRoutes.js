const express = require('express');
const { getBooks, getBookById, createBook } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getBooks).post(protect, createBook);
router.route('/:id').get(getBookById);

module.exports = router;

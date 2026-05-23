const express = require('express');
const { getMoodRecommendations, getTrendingBooks, getPersonalizedRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/mood', getMoodRecommendations);
router.get('/trending', getTrendingBooks);
router.get('/personalized', protect, getPersonalizedRecommendations);

module.exports = router;

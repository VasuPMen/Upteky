const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/feedback - add feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;

    // validation
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required.' });
    }
    const r = Number(rating) || 0;
    if (r < 1 || r > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    const fb = new Feedback({ name, email, message, rating: r });
    await fb.save();
    res.status(201).json({ success: true, feedback: fb });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/feedback - fetch all feedbacks (optional query ?rating=4)
router.get('/', async (req, res) => {
  try {
    const { rating } = req.query;
    let filter = {};
    if (rating) {
      filter.rating = Number(rating);
    }
    const all = await Feedback.find(filter).sort({ createdAt: -1 });
    res.json({ feedbacks: all });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/stats - analytics
router.get('/stats', async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const aggr = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          positiveCount: {
            $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] }
          },
          negativeCount: {
            $sum: { $cond: [{ $lt: ['$rating', 3] }, 1, 0] }
          }
        }
      }
    ]);
    const data = aggr[0] || { avgRating: 0, positiveCount: 0, negativeCount: 0 };
    res.json({
      total,
      avgRating: Number((data.avgRating || 0).toFixed(2)),
      positive: data.positiveCount,
      negative: data.negativeCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

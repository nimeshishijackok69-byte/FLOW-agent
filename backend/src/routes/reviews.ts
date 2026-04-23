import express from 'express';
import { 
  getLevels, createLevel, 
  getShortlistData, createShortlist, 
  getReviews, updateReview, saveReviewScore 
} from '../controllers/reviews.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Levels
router.get('/review-levels', getLevels);
router.post('/review-levels', authorize('admin'), createLevel);

// Shortlisting
router.get('/shortlist', authorize('admin'), getShortlistData);
router.post('/shortlist', authorize('admin'), createShortlist);

// Reviews
router.get('/reviews', getReviews);
router.put('/reviews', authorize('admin', 'reviewer'), updateReview);
router.post('/review-scores', authorize('admin', 'reviewer'), saveReviewScore);

export default router;

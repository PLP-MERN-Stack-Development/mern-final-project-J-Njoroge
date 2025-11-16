import express from 'express';
import {
  getCarbonEntries,
  createCarbonEntry,
  getCarbonStats,
  deleteCarbonEntry
} from '../controllers/carbonController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getCarbonEntries)
  .post(protect, createCarbonEntry);

router.get('/stats', protect, getCarbonStats);
router.delete('/:id', protect, deleteCarbonEntry);

export default router;


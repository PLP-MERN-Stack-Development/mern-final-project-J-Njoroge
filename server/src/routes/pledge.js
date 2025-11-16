import express from 'express';
import {
  getPledges,
  createPledge,
  toggleLike,
  getGlobalCO2
} from '../controllers/pledgeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Middleware to attach io to request
const attachIO = (req, res, next) => {
  req.io = req.app.get('io');
  next();
};

router.get('/', getPledges);
router.get('/global-co2', getGlobalCO2);
router.post('/', protect, attachIO, createPledge);
router.post('/:id/like', protect, attachIO, toggleLike);

export default router;


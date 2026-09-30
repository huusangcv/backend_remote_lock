const express = require('express');
const router = express.Router();
const { getStatus, lockApp, unlockApp, getHistory } = require('../controllers/lockController');
const { requireApiKey } = require('../middleware/auth');

// PUBLIC - Electron app calls this on startup (no API key needed)
router.get('/status', getStatus);
router.get('/status/:appId', getStatus);

// ADMIN - Requires API key
router.post('/lock', requireApiKey, lockApp);
router.post('/unlock', requireApiKey, unlockApp);
router.get('/history', requireApiKey, getHistory);

module.exports = router;
const express = require('express');
const router = express.Router();
const { notifyOpportunity } = require('../controllers/notifyController');
const auth = require('../middleware/auth'); // adapt path if different

router.post('/:id/notify', auth, notifyOpportunity);

module.exports = router;

const express = require('express');
const router = express.Router();
const violationController = require('../controllers/violationController');

router.get('/', violationController.handleViolation);

module.exports = router;
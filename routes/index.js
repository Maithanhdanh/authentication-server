const express = require('express');
const authRoutes = require('./auth.route');
const router = express.Router();

router.get('/status', (req, res) => res.json('OK'));

router.use('/auth', authRoutes);
module.exports = router
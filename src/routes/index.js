const express = require('express');
const router = express.Router();
const userRoutes = require('./users/index');

router.use('/usuarios', userRoutes);

module.exports = router;
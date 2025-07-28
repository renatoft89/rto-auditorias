const express = require('express');

const routers = express.Router();

const usersRouter = require('./users/index');

routers.use('/users', usersRouter);

module.exports = routers;


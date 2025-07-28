const express = require('express');
const userController = require('../../controllers/usersController');

const usersRouter = express.Router();

usersRouter.get('/users', userController.getAllUsersController);

module.exports = usersRouter;
const express = require('express');
const { createUser, getAllUsers, loginUser, logoutUser, getUserById } = require('../controller/usersController');
const router = express.Router();

router.post('/create', createUser);
router.get('/all', getAllUsers);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/users/:id', getUserById);

module.exports = router;

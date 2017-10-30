const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

router.get('/', ctrlUsers.getUsers);

router.get('/:id', ctrlUsers.getUser);

router.post('/', ctrlUsers.addUser);

router.put('/:id', ctrlUsers.editUser);

router.delete('/:id', ctrlUsers.deleteUser);

module.exports = router;
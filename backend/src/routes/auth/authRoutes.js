const { Router } = require('express');
const authController = require('../../controller/auth/authController');

const router = Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/getUserInfo/:id', authController.getUserInfo);

module.exports = router;
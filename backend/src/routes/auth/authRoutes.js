const { Router } = require('express');
const authController = require('../../controller/auth/authController');

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res, next) => authController.register(req, res, next));

// POST /api/auth/login
router.post('/login', (req, res, next) => authController.login(req, res, next));

router.post('/getUserInfo', authController.getUserInfo);


module.exports = router;
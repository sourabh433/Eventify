const epress = require('express');
const router = epress.Router();
const {registerUser, loginUser, verifyOtp} = require('../controllers/authController');



router.post('/register',  registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);

module.exports = router;
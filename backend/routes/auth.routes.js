import express from 'express';
const router = express.Router();
import { signUp, login, verifyOtp, resendOtp } from '../controllers/auth.controller.js';


router.post('/signUp', signUp);
router.post('/login',login);
router.post('/verifyOTP', verifyOtp)
router.post('/resendOTP',resendOtp)

export default router;

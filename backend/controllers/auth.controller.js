import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { sendOTPEmail } from '../config/nodemailer.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// ➤ SIGNUP CONTROLLER
export const signUp = async (req, res) => {
  try {
 
    
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser){
      return res.status(409).json({ success: false, message: 'User already exists' });
    } 

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
    const newUser = new User({ name, email, password: hashedPassword, otp, otpExpires, verified: false });
    await newUser.save();
    // Send OTP via email
    await sendOTPEmail(email, otp);
    return res.status(201).json({ success: true, message: 'User registered. OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Signup Error', error: error   });
  }
};

// ➤ VERIFY OTP CONTROLLER
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.verified) return res.status(400).json({ success: false, message: 'User already verified' });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.verified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ success: true, message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'OTP Verification Error', error: error.message });
  }
};

// ➤ RESEND OTP CONTROLLER
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.verified) return res.status(400).json({ success: false, message: 'User already verified' });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP again via email
    await sendOTPEmail(email, otp);

    return res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Resend OTP Error', error: error.message });
  }
};

// ➤ LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.verified) return res.status(403).json({ success: false, message: 'User not verified. Please verify OTP' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login Error', error: error.message });
  }
};

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const router = useRouter();
  const [step, setStep] = useState('signup'); // 'signup' or 'otp'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/signup', formData);
      if (res.data.success) {
        setStep('otp');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await api.post('/auth/verifyOTP', { email: formData.email, otp });
      if (res.data.success) {
        alert('Account verified! Please login.');
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'OTP Verification failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Signup</h2>

      {step === 'signup' ? (
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button type="submit" className="w-full">Signup</Button>
        </form>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">Enter the OTP sent to your email</p>

          <InputOTP maxLength={6} value={otp} onChange={setOtp} className="mx-auto">
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button onClick={handleVerifyOtp} className="w-full">Verify OTP</Button>
        </div>
      )}

      {/* Already have an account link */}
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default Signup;

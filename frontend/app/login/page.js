'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setMessage('Login Successful');
      router.push('/'); // Change route as per your flow
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl shadow-lg border mt-10 bg-white dark:bg-gray-900 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Email</label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Password</label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </form>

      {message && (
        <p className="mt-4 text-center text-red-500 dark:text-red-400">{message}</p>
      )}

      {/* Don't have an account */}
      <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;

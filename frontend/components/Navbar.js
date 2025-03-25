'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-background text-foreground">
      <Link href="/">Home</Link>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button variant="outline" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>

        {/* Show "Add New Product" if logged in */}
        {token && (
          <Link href="/products/create">
            <Button>Add New Product</Button>
          </Link>
        )}

        {/* Auth Buttons */}
        {token === null ? (
          <span>Loading...</span>
        ) : token ? (
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

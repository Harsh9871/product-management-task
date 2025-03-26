'use client'
import ProductList from '@/components/ProductList';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <ProductList />
    </div>
  );
}

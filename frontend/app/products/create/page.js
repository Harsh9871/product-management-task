'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createProduct } from '@/lib/api';

const CreateProductPage = () => {
  const router = useRouter();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await createProduct(product, token);

      if (res.status === 201 || res.status === 200) {
        alert('Product added successfully!');
        router.push('/'); // Redirect to home or product list
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <Button type="submit">Add Product</Button>
      </form>
    </div>
  );
};

export default CreateProductPage;

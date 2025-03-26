'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { updateProduct, getProducts } from '@/lib/api';

const EditProductPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await getProducts();
        const existingProduct = res.data.products.find((p) => p._id === id);
        if (existingProduct) {
          setProduct(existingProduct);
        } else {
          alert('Product not found');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Failed to fetch product');
      }
    };

    if (id) checkAuthAndFetch();
  }, [id, router]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to update the product.');
      router.push('/login');
      return;
    }

    try {
      const res = await updateProduct(id, product, token);
      if (res.status === 200) {
        alert('Product updated successfully!');
        router.push('/');
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <Button type="submit" className="w-full">Update Product</Button>
      </form>
    </div>
  );
};

export default EditProductPage;

'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('No token found');
          setLoading(false);
          return;
        }
        const res = await api.get('/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
        setMessage('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      console.error(err);
      setMessage('Failed to delete product');
    }
  };

  const handleEdit = (id) => {
    router.push(`/products/${id}/edit`);
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;

  return (
    <>
      {message && <p className="text-red-500 mb-4">{message}</p>}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 ">Category: {product.category}</p>
                <p className="mb-2">Price: ₹{product.price}</p>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex gap-3">
                  <Button variant="destructive" onClick={() => handleDelete(product._id)}>Delete</Button>
                  <Button onClick={() => handleEdit(product._id)}>Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </>
  );
};

export default ProductList;

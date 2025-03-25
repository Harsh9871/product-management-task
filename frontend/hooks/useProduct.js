'use client';
import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../lib/api';
import { getToken } from '../lib/auth';

const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data.products || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (data) => {
    const token = getToken();
    if (!token) return;
    await createProduct(data, token);
    fetchProducts();
  };

  const editProduct = async (id, data) => {
    const token = getToken();
    if (!token) return;
    await updateProduct(id, data, token);
    fetchProducts();
  };

  const removeProduct = async (id) => {
    const token = getToken();
    if (!token) return;
    await deleteProduct(id, token);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
    loading,
    error,
  };
};

export default useProduct;

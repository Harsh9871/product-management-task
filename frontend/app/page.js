import ProductList from '@/components/ProductList';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <ProductList />
    </div>
  );
}

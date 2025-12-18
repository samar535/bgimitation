// Add Product Page

import { ProductForm } from '@/components/admin/ProductForm';

export default function AddProductPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Add New Product</h1>
        <p className="text-gray-600">Fill in the details to create a new product</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <ProductForm />
      </div>
    </div>
  );
}
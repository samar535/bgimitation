// Admin Edit Product Page
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProduct } from '@/lib/firestore';
import { ProductForm } from '@/components/admin/ProductForm';
import { Loader } from '@/components/ui/Loader';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types/product';  // ← ये ऐड करो

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProduct(params.id as string);
        if (!data) {
          toast.error('Product not found');
          router.push('/admin/products');
          return;
        }
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return null; // या कोई एरर मैसेज
  }

  return (
    <div>
      {/* Back Button */}
      <Link 
        href="/admin/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Products
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Edit Product</h1>
        <p className="text-gray-600">Update product information and images</p>
      </div>
      
      {/* Form - सिर्फ़ product लोड होने पर दिखाओ */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
        <ProductForm product={product} isEdit={true} />
      </div>
    </div>
  );
}
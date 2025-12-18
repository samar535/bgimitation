// src/app/page.tsx
'use client';

import { CldImage } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import { getProducts } from '../lib/firestore';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Hybrid Setup Test (Firebase + Cloudinary)</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p className="text-green-600 font-semibold mb-4">
            ✅ Firebase Firestore Connected! + Cloudinary Ready!
          </p>
          <p>Products found: {products.length}</p>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded">
                <h3 className="font-bold">{product.name}</h3>
                <p>₹{product.price}</p>
                
                {product.images && product.images[0] && (
                  <CldImage
                    width="300"
                    height="300"
                    src={product.images[0]}
                    alt={product.name}
                    className="mt-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
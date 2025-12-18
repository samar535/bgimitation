'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrder, updateOrder } from '@/lib/firestore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  products: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
}

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    products: [] as { name: string; price: number; quantity: number }[],
    totalAmount: 0,
    status: 'Pending' as 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
    notes: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        router.push('/admin/orders');
        return;
      }
      setLoading(true);
      try {
        const data = await getOrder(id);  // ← single order लाओ
        if (!data) {
          toast.error('Order not found');
          router.push('/admin/orders');
          return;
        }
        setOrder(data);
        setFormData({
          customerName: data.customerName || '',
          customerPhone: data.customerPhone || '',
          products: data.products && data.products.length > 0 ? data.products : [{ name: '', price: 0, quantity: 1 }],
          totalAmount: data.totalAmount || 0,
          status: data.status || 'Pending',
          notes: data.notes || '',
        });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load order');
        router.push('/admin/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleProductChange = (index: number, field: 'name' | 'price' | 'quantity', value: string | number) => {
    const newProducts = [...formData.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setFormData({ ...formData, products: newProducts });
  };

  const addProductField = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { name: '', price: 0, quantity: 1 }],
    }));
  };

  const removeProductField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateOrder(id, {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        products: formData.products.filter(p => p.name.trim()),
        totalAmount: formData.totalAmount,
        status: formData.status,
        notes: formData.notes.trim(),
      });
      toast.success('Order updated successfully!');
      router.push('/admin/orders');
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!order) {
    return <div className="p-8 text-center">Order not found</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Order</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Customer Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Customer Phone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Products</label>
          {formData.products.map((product, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
              <Input
                label="Product Name"
                value={product.name}
                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                required
              />
              <Input
                label="Price"
                type="number"
                value={product.price}
                onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value) || 0)}
                required
              />
              <div className="flex gap-2">
                <Input
                  label="Quantity"
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  required
                />
                {formData.products.length > 1 && (
                  <Button type="button" variant="outline" onClick={() => removeProductField(index)}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button type="button" onClick={addProductField} variant="outline">
            + Add Product
          </Button>
        </div>

        <Input
          label="Total Amount"
          name="totalAmount"
          type="number"
          value={formData.totalAmount}
          onChange={handleInputChange}
          required
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none"
            placeholder="Customization details, address, etc."
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Update Order
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
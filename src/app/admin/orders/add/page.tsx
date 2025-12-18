'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addOrder } from '@/lib/firestore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function AddOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    products: [{ name: '', price: 0, quantity: 1 }],
    totalAmount: 0,
    status: 'Pending' as 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const newProducts = [...formData.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setFormData({ ...formData, products: newProducts });
  };

  const addProductField = () => {
    setFormData({ ...formData, products: [...formData.products, { name: '', price: 0, quantity: 1 }] });
  };

  const removeProductField = (index: number) => {
    setFormData({ ...formData, products: formData.products.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addOrder({
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        products: formData.products.filter(p => p.name.trim()),
        totalAmount: formData.totalAmount,
        status: formData.status,
        notes: formData.notes.trim(),
      });
      toast.success('Order added successfully!');
      router.push('/admin/orders');
    } catch (error) {
      toast.error('Failed to add order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Order</h1>

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
            label="Customer Phone (WhatsApp)"
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
                min="1"
                required
              />
              <div className="flex gap-2">
                <Input
                  label="Quantity"
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  min="1"
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
            + Add Another Product
          </Button>
        </div>

        <Input
          label="Total Amount (₹)"
          name="totalAmount"
          type="number"
          value={formData.totalAmount}
          onChange={handleInputChange}
          min="1"
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Customization, Address, etc.)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none"
            placeholder="Size: Medium, Color: Gold, Address: ..."
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" loading={loading} className="flex-1 cursor-pointer">
            Add Order
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 cursor-pointer">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
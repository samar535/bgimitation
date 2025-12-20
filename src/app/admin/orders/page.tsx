'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { getOrders, deleteOrder } from '@/lib/firestore';  // ← getOrders ऐड करो  // ← getOrders यूज़ करो
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: any;
  notes?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);  // ← array
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();  // ← सारे ऑर्डर्स लाओ
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await deleteOrder(id);
      toast.success('Order deleted successfully!');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600 mt-1">Total Orders: {orders.length}</p>
        </div>
        <Link href="/admin/orders/add">
          <Button className='cursor-pointer'>
            <Plus size={20} />
            Add Order
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
          <p className="text-gray-600">When customers order via WhatsApp, add them here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{order.customerName}</td>
                  <td className="px-6 py-4">{order.customerPhone}</td>
                  <td className="px-6 py-4 font-semibold">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.orderDate ? new Date(order.orderDate.toDate()).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/orders/edit/${order.id}`}>
                        <button className="p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
                          <Edit size={18} className="text-blue-600" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="p-2 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
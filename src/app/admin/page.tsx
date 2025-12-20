// Admin Dashboard
'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, IndianRupee, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { getProducts } from '@/lib/firestore';
import { getOrders } from '@/lib/firestore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
  });

  const [orders, setOrders] = useState<any[]>([]);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const products = await getProducts();
        
        const total = products.length;
        const inStockCount = products.filter(p => 
          p.inStock === true && (p.stockQuantity ?? 0) > 0
        ).length;
        const outOfStockCount = total - inStockCount;
  
        setStats({
          totalProducts: total,
          inStock: inStockCount,
          outOfStock: outOfStockCount,
        });

        // ORDERS
        const ordersData = await getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-3 sm:p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold" style={{ color }}>{value}</p>
        </div>
        <div className="p-2 sm:p-4 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon className="w-5 sm:w-7 h-5 sm-h-7" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className=''>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.totalProducts}
          color="#C9A961"
        />
        <StatCard
          icon={ShoppingBag}
          label="In Stock"
          value={stats.inStock}
          color="#10B981"
        />
        <StatCard
          icon={TrendingUp}
          label="Out of Stock"
          value={stats.outOfStock}
          color="#EF4444"
        />
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-6">
        Orders Overview
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          label="Total Orders"
          value={orders.length}
          color="#3B82F6"
        />

        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={
            orders.filter(
              o => o.status?.toLowerCase().trim() === 'pending'
            ).length
          }
          color="#F59E0B"
        />


        <StatCard
          icon={Calendar}
          label="Today's Orders"
          value={
            orders.filter(o => {
              const today = new Date().toDateString();
              const orderDate = o.orderDate?.toDate()?.toDateString();
              return today === orderDate;
            }).length
          }
          color="#8B5CF6"
        />

        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={
            '₹' +
            orders
              .reduce(
                (sum, o) => sum + Number(o.totalAmount || 0),
                0
              )
              .toLocaleString('en-IN')
          }
          color="#10B981"
        />


      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://thkbnqmnatphefnnllme.supabase.co';
const supabaseAnonKey = 'sb_publishable_4U7gn3gCQ3np5-Y9cD-sTQ_b0EWrYdC';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  city: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  items: any[];
  created_at: string;
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert('Failed to load orders: ' + error.message);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateOrder = async (id: string, payment_status?: string, order_status?: string) => {
    const updates: Record<string, string> = {};
    if (payment_status) updates.payment_status = payment_status;
    if (order_status) updates.order_status = order_status;

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id);

    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      fetchOrders(); // refresh table
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Permanently delete this order?')) return;
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Delete failed: ' + error.message);
    } else {
      fetchOrders();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-mono">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-wider">Orders</h1>
        <span className="text-xs text-neutral-500">{orders.length} order(s)</span>
      </div>

      {orders.length === 0 ? (
        <p className="text-neutral-500">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-neutral-800">
            <thead>
              <tr className="bg-neutral-900 text-neutral-400 uppercase tracking-wider">
                <th className="p-3 text-left">Order #</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">City</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Payment</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-neutral-800 hover:bg-neutral-900/50">
                  <td className="p-3 font-medium">{order.order_number}</td>
                  <td className="p-3">
                    <div>{order.customer_name}</div>
                    <div className="text-neutral-500">{order.customer_email}</div>
                    <div className="text-neutral-500">{order.customer_address}</div>
                  </td>
                  <td className="p-3">{order.customer_phone}</td>
                  <td className="p-3">{order.city}</td>
                  <td className="p-3">
                    {order.items?.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {order.items.map((item: any, i: number) => (
                          <li key={i}>
                            {item.name} × {item.quantity} ({item.size})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-bold">
                    ৳{Number(order.total_amount).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        updateOrder(order.id, order.payment_status === 'paid' ? 'pending' : 'paid')
                      }
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        order.payment_status === 'paid' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {order.payment_status}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        updateOrder(order.id, undefined, order.order_status === 'shipped' ? 'pending' : 'shipped')
                      }
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        order.order_status === 'shipped' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'
                      }`}
                    >
                      {order.order_status}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="text-red-400 hover:text-red-300 text-[10px] uppercase"
                    >
                      Delete
                    </button>
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
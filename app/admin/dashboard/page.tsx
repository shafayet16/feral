'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client'; // Shared client instance

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
  stock_deducted: boolean;
  created_at: string;
};

// Helper: show relative time (e.g., "5m ago", "2h ago", "12 Jun, 3:45 PM")
function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false }); // newest first

    if (error) {
      alert('Failed to load orders: ' + error.message);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  // Deduct stock for a specific order (manual or after payment)
  const deductStockForOrder = async (orderId: string) => {
    // Fetch the order with its items
    const { data: order, error: fetchErr } = await supabase
      .from('orders')
      .select('items, stock_deducted')
      .eq('id', orderId)
      .single();

    if (fetchErr || !order) {
      alert('Could not fetch order: ' + (fetchErr?.message || ''));
      return;
    }

    if (order.stock_deducted) {
      alert('Stock already deducted for this order.');
      return;
    }

    const items = order.items || [];
    for (const item of items) {
      if (!item.product_id || !item.size || !item.quantity) continue;

      // Get current product
      const { data: product, error: prodErr } = await supabase
        .from('products')
        .select('size_quantities, stock_count')
        .eq('id', item.product_id)
        .single();

      if (prodErr || !product) {
        console.error(`Product ${item.product_id} not found, skipping deduction`);
        continue;
      }

      let sizeQuantities = product.size_quantities || {};
      if (typeof sizeQuantities === 'string') {
        sizeQuantities = JSON.parse(sizeQuantities);
      }

      const currentStock = product.stock_count ?? 0;
      const newQty = Math.max(0, (sizeQuantities[item.size] || 0) - item.quantity);
      sizeQuantities[item.size] = newQty;
      const newTotalStock = Math.max(0, currentStock - item.quantity);

      const { error: updateProdErr } = await supabase
        .from('products')
        .update({
          size_quantities: sizeQuantities,
          stock_count: newTotalStock,
        })
        .eq('id', item.product_id);

      if (updateProdErr) {
        console.error('Failed to update product stock:', updateProdErr);
      }
    }

    // Mark order as stock deducted
    const { error: markErr } = await supabase
      .from('orders')
      .update({ stock_deducted: true })
      .eq('id', orderId);

    if (markErr) {
      alert('Stock deducted but failed to mark order: ' + markErr.message);
    }

    fetchOrders(); // refresh table
  };

  // Update payment/order status (with auto-deduction on paid)
  const updateOrder = async (id: string, payment_status?: string, order_status?: string) => {
    // Fetch current order state BEFORE updating
    const { data: currentOrder, error: fetchErr } = await supabase
      .from('orders')
      .select('payment_status, stock_deducted, items')
      .eq('id', id)
      .single();

    if (fetchErr || !currentOrder) {
      alert('Failed to fetch order: ' + (fetchErr?.message || ''));
      return;
    }

    const updates: Record<string, string> = {};
    if (payment_status) updates.payment_status = payment_status;
    if (order_status) updates.order_status = order_status;

    // Perform the status update
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id);

    if (error) {
      alert('Update failed: ' + error.message);
      return;
    }

    // If marking as paid and stock not yet deducted → auto deduct
    if (
      payment_status === 'paid' &&
      currentOrder.payment_status !== 'paid' &&
      !currentOrder.stock_deducted
    ) {
      await deductStockForOrder(id);
    }

    fetchOrders(); // refresh table
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
                <th className="p-3 text-center">Ordered</th>
                <th className="p-3 text-center">Deduct</th>
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
                        order.payment_status === 'paid'
                          ? 'bg-green-900 text-green-300'
                          : 'bg-red-900 text-red-300'
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
                        order.order_status === 'shipped'
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-yellow-900 text-yellow-300'
                      }`}
                    >
                      {order.order_status}
                    </button>
                  </td>
                  <td className="p-3 text-center text-[10px] text-neutral-400">
                    {timeAgo(order.created_at)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deductStockForOrder(order.id)}
                      disabled={order.stock_deducted}
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        order.stock_deducted
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-green-800 text-green-300 hover:bg-green-700'
                      }`}
                      title={order.stock_deducted ? 'Stock already deducted' : 'Deduct stock now'}
                    >
                      {order.stock_deducted ? '✓' : '✓ Deduct'}
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
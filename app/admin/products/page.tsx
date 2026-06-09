'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://thkbnqmnatphefnnllme.supabase.co';
const supabaseAnonKey = 'sb_publishable_4U7gn3gCQ3np5-Y9cD-sTQ_b0EWrYdC';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  is_bestseller: boolean;
  in_stock: boolean;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    if (!error) setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // Securely processes the delete request via your backend API route setup
  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product permanently? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete product');
      }

      // Success loop confirmation and localized tree state refresh
      fetchProducts();
    } catch (error: any) {
      console.error('Delete request error execution:', error);
      
      // Friendly message loop capturing raw Postgres foreign key blocks
      if (error.message.includes('violates foreign key constraint')) {
        alert(
          'This product can’t be deleted because it’s already been ordered by customers.\n\n' +
          'To keep your order history intact, consider marking it as “Out of Stock” instead.\n\n' +
          'If you really need to delete it, please contact the developer to remove the associated orders first.'
        );
      } else {
        alert('Delete failed: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-[#f4f4f5] font-sans antialiased">
      {/* Sticky header */}
      <div className="border-b border-[#52525b]/20 bg-[#0a0a0a]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-sm md:text-base font-black uppercase tracking-[0.2em]">
            Manage Products
          </h1>
          <Link
            href="/admin/products/new"
            className="bg-white text-[#0a0a0a] text-xs font-bold uppercase tracking-wider px-5 py-2 hover:bg-[#d4d4d8] transition"
          >
            + Add New
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-14">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#a1a1aa] uppercase tracking-wider text-sm">No products yet.</p>
            <Link
              href="/admin/products/new"
              className="inline-block mt-6 text-xs border border-[#52525b]/50 px-6 py-2 hover:border-white transition uppercase tracking-wider"
            >
              Create first product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                {/* Image container – NO dark overlay, fully visible */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#18181b]">
                  <img
                    src={product.image || '/feralshirt1.png'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Badges – only if in_stock is strictly false */}
                  {product.is_bestseller && (
                    <span className="absolute top-3 left-3 bg-white text-[#0a0a0a] text-[9px] font-bold uppercase tracking-wider px-2 py-1 z-10">
                      BESTSELLER
                    </span>
                  )}
                  {product.in_stock === false && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 z-10">
                      OUT OF STOCK
                    </span>
                  )}

                  {/* Edit / Delete overlay (only on hover) */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/edit?id=${product.id}`}
                        className="bg-white/90 backdrop-blur-sm text-[#0a0a0a] text-[10px] font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteProduct(product.id);
                        }}
                        className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product info */}
                <div className="mt-4 text-center">
                  <h3 className="text-xs md:text-sm font-medium uppercase tracking-wide text-[#f4f4f5] group-hover:text-[#a1a1aa] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#a1a1aa] mt-1">
                    ৳{Number(product.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#52525b]/20 py-6 text-center">
        <p className="text-[10px] tracking-[0.2em] text-[#52525b] uppercase">
          FERAL Admin · Product Management
        </p>
      </div>
    </div>
  );
}
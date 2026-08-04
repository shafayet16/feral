'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://thkbnqmnatphefnnllme.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4U7gn3gCQ3np5-Y9cD-sTQ_b0EWrYdC';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-fab4e79b5407486695278c53c8ded542.r2.dev';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  is_bestseller: boolean;
  in_stock: boolean;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Formats any raw image field into a valid R2 public URL
  const getImageUrl = (url?: string): string => {
    if (!url) return '/feralshirt1.png';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Handles cases where relative paths are stored
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    return `${R2_PUBLIC_URL}/${cleanPath}`;
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, category, image, images, is_bestseller, in_stock')
      .order('id', { ascending: true });
    
    if (!error) {
      const mapped = (data || []).map((item: any) => {
        const rawImage = (item.images && item.images[0]) || item.image;
        return {
          ...item,
          image: getImageUrl(rawImage)
        };
      });
      setProducts(mapped);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (product: Product) => {
    if (!confirm(`Delete "${product.name}" permanently? This cannot be undone.`)) return;

    try {
      // Send DELETE request to API route (handles DB record + server-side R2 bucket cleanup)
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: product.images || [product.image]
        })
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete product from database');
      }

      fetchProducts();
    } catch (error: any) {
      console.error('Delete request error execution:', error);
      
      if (error.message.includes('violates foreign key constraint')) {
        alert(
          'This product can’t be deleted because it’s already been ordered by customers.\n\n' +
          'To keep your order history intact, consider marking it as “Out of Stock” instead.'
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
                <div className="relative aspect-[3/4] overflow-hidden bg-[#18181b]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

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
                          deleteProduct(product);
                        }}
                        className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

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

      <div className="border-t border-[#52525b]/20 py-6 text-center">
        <p className="text-[10px] tracking-[0.2em] text-[#52525b] uppercase">
          FERAL Admin · Product Management
        </p>
      </div>
    </div>
  );
}
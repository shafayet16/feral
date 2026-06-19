'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import MobileMenu from '../MobileMenu';

// Direct Supabase client configuration
const supabaseUrl = 'https://thkbnqmnatphefnnllme.supabase.co';
const supabaseAnonKey = 'sb_publishable_4U7gn3gCQ3np5-Y9cD-sTQ_b0EWrYdC';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Product = {
  id: string;
  name: string;
  price: number | null;
  category: string;
  image: string;
  is_bestseller: boolean;
  in_stock: boolean;
};

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Pagination states
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 8;

  // READ URL SEARCH PARAMETERS
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Listen for category parameters in the URL route
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam.toLowerCase());
    } else {
      setActiveCategory('all');
    }
  }, [categoryParam]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch products for a specific page
  const fetchProducts = async (pageNum: number) => {
    setLoading(true);
    const from = pageNum * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('Error fetching products:', error);
      setHasMore(false);
    } else {
      if (data.length < PAGE_SIZE) setHasMore(false);
      setProducts(prev => (pageNum === 0 ? data : [...prev, ...data]));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // When category changes, reset pagination and fetch from start
  useEffect(() => {
    setPage(0);
    setHasMore(true);
  }, [activeCategory]);

  const categories = [
    { id: 'all', name: 'ALL' },
    { id: 'bestsellers', name: 'BESTSELLERS' },
    { id: 'tops', name: 'TOPS' },
    { id: 'pants', name: 'PANTS' },
    { id: 'jackets', name: 'JACKETS' },
    { id: 'denims', name: 'DENIMS' },
  ];

  // Apply category filter client‑side on currently loaded products
  const filteredProducts = products.filter(product => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'bestsellers') return product.is_bestseller === true;
    return product.category?.toLowerCase() === activeCategory;
  });

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-[#f4f4f5] font-sans antialiased overflow-x-hidden">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
            : 'bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-[#52525b]/20'
        }`}
      >
        <div className="px-4 py-2 md:py-3 md:px-8">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between md:hidden">
            <div className="w-8">
              <MobileMenu />
            </div>
            <div>
              <img src="/ferallogu.png" alt="FERAL" className="h-16 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-3 w-8 justify-end">
              <Link
                href="/cart"
                className="text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-6">
              <MobileMenu />
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img src="/ferallogu.png" alt="FERAL" className="h-20 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-5">
              <Link
                href="/cart"
                className="relative text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="h-14 md:h-16"></div>

      {/* SHOP HEADER */}
      <section className="w-full bg-[#0a0a0a] py-10 md:py-14 border-b border-[#52525b]/20">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-center">
          SHOP
        </h1>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="sticky top-14 md:top-16 z-40 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#52525b]/20 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'text-white border-b border-white pb-1'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="w-full bg-[#0a0a0a] py-12 md:py-16">
        <div className="container mx-auto px-4">
          {loading && filteredProducts.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#a1a1aa]">No products found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#18181b]">
                      <img
                        src={product.image || '/feralshirt1.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                      {product.is_bestseller && (
                        <span className="absolute top-3 left-3 bg-white text-black text-[9px] font-bold uppercase tracking-wider px-2 py-1">
                          BESTSELLER
                        </span>
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="text-xs md:text-sm font-medium uppercase tracking-wide text-[#f4f4f5] group-hover:text-[#a1a1aa] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#a1a1aa] mt-1">
                        ৳{product.price !== null && product.price !== undefined ? product.price.toLocaleString() : '0'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={loading}
                    className="border border-[#52525b]/50 text-[#f4f4f5] px-8 py-3 text-xs uppercase tracking-wider hover:border-white transition disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#0a0a0a] pt-12 pb-14 text-center flex flex-col items-center relative border-t border-[#52525b]/20">
        <div className="w-[90%] max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />
        <div className="flex gap-6 mb-8">
          <a
            href="https://instagram.com/feral.untamed"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#52525b]/20 rounded-full transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            IG
          </a>
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#52525b]/20 rounded-full transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            FB
          </a>
        </div>
        <div className="leading-relaxed text-[10px] md:text-xs tracking-[0.25em] text-[#52525b] uppercase space-y-2">
          <p className="font-bold text-[#71717a] transition-all duration-300 hover:text-[#a1a1aa] active:text-white">
            © 2026 FERAL. All rights reserved.
          </p>
          <p className="text-[9px] font-mono lowercase tracking-normal text-[#52525b]/70 transition-all duration-300 hover:text-[#71717a] active:text-white">
            made by shafbitz
          </p>
        </div>
      </footer>
    </div>
  );
}

// MAIN EXPORT WRAPPED IN SUSPENSE FOR NEXT.JS COMPILATION SECURITY
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-[#0a0a0a] text-[#f4f4f5] flex justify-center items-center font-mono text-xs tracking-widest">
        LOADING COLLECTION VALUATION...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
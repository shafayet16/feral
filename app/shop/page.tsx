'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import MobileMenu from '../MobileMenu';

// Direct Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://thkbnqmnatphefnnllme.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4U7gn3gCQ3np5-Y9cD-sTQ_b0EWrYdC';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const R2_PUBLIC_URL = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-fab4e79b5407486695278c53c8ded542.r2.dev'
).replace(/\/$/, '');

// Normalizes any image input (array, legacy URL, or filename) into a valid R2 public URL
const formatImageUrl = (item: any): string => {
  const rawUrl =
    (item.images && Array.isArray(item.images) && item.images.length > 0 && item.images[0]) ||
    item.image;

  if (!rawUrl || typeof rawUrl !== 'string') return '/feralshirt1.png';

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    if (rawUrl.includes('/storage/v1/object/public/product-images/')) {
      const filename = rawUrl.split('/product-images/')[1];
      return `${R2_PUBLIC_URL}/products/${filename}`;
    }
    return rawUrl;
  }

  const cleanPath = rawUrl.replace(/^\//, '');
  if (cleanPath.startsWith('products/')) {
    return `${R2_PUBLIC_URL}/${cleanPath}`;
  }
  return `${R2_PUBLIC_URL}/products/${cleanPath}`;
};

type Product = {
  id: string;
  name: string;
  price: number | null;
  category: string;
  categories?: string[];
  image: string;
  images?: string[];
  is_bestseller: boolean;
  in_stock: boolean;
};

const normalizeCategory = (raw: string | null): string => {
  const val = (raw || 'all').toLowerCase().trim();
  if (val === 'denim' || val === 'denims') return 'denims';
  if (val === 'top' || val === 'tops') return 'tops';
  if (val === 'pant' || val === 'pants') return 'pants';
  if (val === 'jacket' || val === 'jackets') return 'jackets';
  if (val === 'bestseller' || val === 'bestsellers') return 'bestsellers';
  return val || 'all';
};

const getCategoryVariants = (cat: string): string[] => {
  switch (cat) {
    case 'denims':
      return ['denim', 'denims', 'Denim', 'Denims', 'DENIM', 'DENIMS'];
    case 'tops':
      return ['top', 'tops', 'Top', 'Tops', 'TOPS'];
    case 'pants':
      return ['pant', 'pants', 'Pant', 'Pants', 'PANTS'];
    case 'jackets':
      return ['jacket', 'jackets', 'Jacket', 'Jackets', 'JACKETS'];
    default:
      return [cat];
  }
};

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState<string>(() =>
    normalizeCategory(categoryParam)
  );
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const PAGE_SIZE = 8;

  // Sync URL ?category=... changes into activeCategory
  useEffect(() => {
    const normalized = normalizeCategory(categoryParam);
    setActiveCategory(normalized);
    setPage(0);
  }, [categoryParam]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProductsForCategory = useCallback(
    async (category: string, pageNum: number, append: boolean) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE; // Fetch 1 extra item to check if more exist

      let query = supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (category === 'bestsellers') {
        query = query.eq('is_bestseller', true);
      } else if (category !== 'all') {
        const variants = getCategoryVariants(category);
        query = query.in('category', variants);
      }

      const { data, error } = await query.range(from, to);

      if (error) {
        console.error('Error fetching products:', error);
        if (!append) setProducts([]);
        setHasMore(false);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      const rows = data || [];
      const moreAvailable = rows.length > PAGE_SIZE;

      const formatted: Product[] = rows.slice(0, PAGE_SIZE).map((item: any) => ({
        ...item,
        image: formatImageUrl(item),
      }));

      setHasMore(moreAvailable);
      setProducts(prev => {
        if (!append) return formatted;
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNew = formatted.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });

      setLoading(false);
      setLoadingMore(false);
    },
    []
  );

  useEffect(() => {
    fetchProductsForCategory(activeCategory, page, page > 0);
  }, [activeCategory, page, fetchProductsForCategory]);

  const handleSelectCategory = (catId: string) => {
    const normalized = normalizeCategory(catId);
    setActiveCategory(normalized);
    setPage(0);
  };

  const categories = [
    { id: 'all', name: 'ALL' },
    { id: 'bestsellers', name: 'BESTSELLERS' },
    { id: 'tops', name: 'TOPS' },
    { id: 'pants', name: 'PANTS' },
    { id: 'jackets', name: 'JACKETS' },
    { id: 'denims', name: 'DENIMS' },
  ];

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
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
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
          {loading && products.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#a1a1aa]">No products found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products.map(product => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#18181b]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
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
                        ৳
                        {product.price !== null && product.price !== undefined
                          ? product.price.toLocaleString()
                          : '0'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-10">
                  <button
                    type="button"
                    disabled={loadingMore}
                    onClick={() => setPage(prev => prev + 1)}
                    className="border border-[#52525b]/50 text-[#f4f4f5] px-8 py-3 text-xs uppercase tracking-wider hover:border-white transition disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#0a0a0a] pt-16 pb-14 text-center flex flex-col items-center relative border-t border-[#52525b]/20">
        <div className="w-[90%] max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />

        <div className="flex justify-center mb-8">
          <a
            href="https://instagram.com/feral.untamed"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#52525b]/20 rounded-full transition-all duration-300 hover:-translate-y-1 active:scale-95"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
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

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#0a0a0a] text-[#f4f4f5] flex justify-center items-center font-mono text-xs tracking-widest">
          LOADING COLLECTION VALUATION...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
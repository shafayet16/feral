'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import MobileMenu from './MobileMenu';

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

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [newDrops, setNewDrops] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch the 4 newest products from Supabase
  useEffect(() => {
    const fetchNewDrops = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false }) // Newest item entries first
        .limit(4);

      if (!error && data) {
        setNewDrops(data);
      } else {
        console.error('Error fetching new drops:', error);
      }
      setLoading(false);
    };

    fetchNewDrops();
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-[#0a0a0a] text-[#f4f4f5] font-sans antialiased selection:bg-[#d4d4d8] selection:text-[#0a0a0a] overflow-x-hidden">
      
      {/* INJECTED CSS FOR ANIMATIONS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: infinite-scroll 20s linear infinite;
          will-change: transform;
        }
        .animate-marquee:hover, 
        .animate-marquee:active {
          animation-play-state: paused;
        }
        .animate-marquee.slow {
          animation-duration: 35s;
        }
        
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        .video-zoom {
          animation: subtle-zoom 20s ease-in-out infinite alternate;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .hero-fade-in {
          animation: fadeIn 1.2s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }

        @keyframes shimmer {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
            border-bottom-color: rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 2px 20px 0 rgba(255, 255, 255, 0.15);
            border-bottom-color: rgba(255, 255, 255, 0.3);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
            border-bottom-color: rgba(255, 255, 255, 0.1);
          }
        }
        .navbar-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}} />

      {/* 1. HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] navbar-shimmer' 
          : 'bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-[#52525b]/20'
      }`}>
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
              <button className="text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="relative text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
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
              <button className="text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="relative text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button className="relative text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-[#f4f4f5] text-[#0a0a0a] text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="h-14 md:h-16"></div>

      {/* 2. HERO */}
      <section className="relative w-full h-[65dvh] md:h-[80dvh] border-b border-[#52525b]/20 overflow-hidden">
        <div className="absolute inset-0 z-0 hero-fade-in">
          <img src="/bakkarputki.jpg" alt="FERAL Hero" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 active:scale-100" />
          <div className="absolute inset-0 bg-black/40 transition-all duration-500 hover:bg-black/30 active:bg-black/50" />
        </div>
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 w-full flex justify-center">
          <Link href="/shop" className="fade-in-up bg-transparent text-white border border-white hover:bg-white hover:text-black active:bg-[#d4d4d8] active:text-black active:scale-95 uppercase tracking-[0.25em] text-xs md:text-sm font-bold px-8 py-3 md:px-12 md:py-4 transition-all duration-300 hover:scale-105 block">
            shop
          </Link>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="w-full bg-[#0a0a0a] py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-center text-[#f4f4f5] mb-12 md:mb-16">
            SHOP BY CATEGORY
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Link href="/shop?category=tops" className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#18181b]">
                <img src="/feralshirt1.png" alt="Tops" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <div className="text-center mt-4">
                <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#f4f4f5] group-hover:text-[#a1a1aa] transition-colors">TOPS</h3>
              </div>
            </Link>

            <Link href="/shop?category=pants" className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#18181b]">
                <img src="/feralpant1.png" alt="Pants" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <div className="text-center mt-4">
                <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#f4f4f5] group-hover:text-[#a1a1aa] transition-colors">PANTS</h3>
              </div>
            </Link>

            <Link href="/shop?category=jackets" className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#18181b]">
                <img src="/feralshirt1.png" alt="Jackets" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <div className="text-center mt-4">
                <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#f4f4f5] group-hover:text-[#a1a1aa] transition-colors">JACKETS</h3>
              </div>
            </Link>

            <Link href="/shop?category=denims" className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#18181b]">
                <img src="/feralpant1.png" alt="Denims" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <div className="text-center mt-4">
                <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#f4f4f5] group-hover:text-[#a1a1aa] transition-colors">DENIMS</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. KALAPLANE EDITORIAL PULL QUOTE */}
      <section className="w-full bg-[#0a0a0a] py-16 md:py-24 border-b border-[#52525b]/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight">Feral</h2>
              <p className="text-[#a1a1aa] text-sm md:text-base mt-4 leading-relaxed">
                Where the wild meets the refined. A collection born from chaos, shaped by intention. Each piece tells a story of rebellion and grace.
              </p>
              <Link href="/shop" className="inline-block mt-6 text-xs uppercase tracking-wider border-b border-[#52525b] pb-1 hover:border-white transition-colors">
                EXPLORE THE COLLECTION
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#18181b]">
                <video src="/feralquote.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW DROPS HEADER */}
      <section className="w-full bg-[#0a0a0a] text-center py-10 md:py-14">
        <h2 className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-[#f4f4f5] transition-all duration-300 hover:tracking-[0.4em] active:tracking-[0.2em]">
          NEW DROPS
        </h2>
      </section>

      {/* 6. DYNAMIC NEW DROPS GRID */}
      <section className="w-full bg-[#0a0a0a] pb-12 md:pb-16 border-b border-[#52525b]/20 overflow-hidden">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : newDrops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xs text-[#a1a1aa] uppercase font-mono tracking-widest">No recent drops discovered.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newDrops.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="group cursor-pointer block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#18181b]">
                    <img 
                      src={product.image || '/feralshirt1.png'} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300" />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-xs md:text-sm font-medium uppercase tracking-wide text-[#f4f4f5] group-hover:text-[#a1a1aa] transition-colors truncate px-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#a1a1aa] mt-1">
                      ৳{product.price !== null && product.price !== undefined ? product.price.toLocaleString() : '0'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. UNTAMED VIDEO SECTION */}
      <section className="relative w-full bg-[#0a0a0a] py-16 md:py-24 border-b border-[#52525b]/20 overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <video src="/fluid.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover video-zoom" />
          <div className="absolute inset-0 bg-black/50 transition-all duration-500 group-hover:bg-black/40 group-active:bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white drop-shadow-2xl transition-all duration-500 group-hover:tracking-tight group-hover:scale-105 active:scale-95">
            UNTAMED
          </h1>
        </div>
      </section>

      {/* 8. SUB-FOOTER INFO RIBBON */}
      <section className="w-full bg-[#0a0a0a] text-[10px] md:text-xs font-medium tracking-widest text-[#d4d4d8]/80 py-5 border-b border-[#52525b]/10 overflow-hidden">
        <div className="animate-marquee slow cursor-pointer">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 pr-8 items-center flex-shrink-0">
              <span className="hover:text-[#f4f4f5] active:text-white active:scale-95 transition-all duration-300">puran dhaka</span>
              <span className="text-[#52525b]/40">•</span>
              <span className="hover:text-[#f4f4f5] active:text-white active:scale-95 transition-all duration-300">free delivery over x</span>
              <span className="text-[#52525b]/40">•</span>
              <span className="hover:text-[#f4f4f5] active:text-white active:scale-95 transition-all duration-300">contact - xxx</span>
              <span className="text-[#52525b]/40">•</span>
              <span className="hover:text-[#f4f4f5] active:text-white active:scale-95 transition-all duration-300">email - xxx</span>
              <span className="text-[#52525b]/40">•</span>
              <span className="hover:text-[#f4f4f5] active:text-white active:scale-95 transition-all duration-300">deliveries all over bd</span>
              <span className="text-[#52525b]/40">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="w-full bg-[#0a0a0a] pt-12 pb-14 text-center flex flex-col items-center relative border-t border-[#52525b]/20">
        <div className="w-[90%] max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />
        <div className="flex gap-6 mb-8">
          <a href="https://instagram.com/feral.untamed" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#52525b]/20 rounded-full transition-all duration-300 hover:-translate-y-1 active:scale-95" aria-label="Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <a href="https://facebook.com/yourusername" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#52525b]/20 rounded-full transition-all duration-300 hover:-translate-y-1 active:scale-95" aria-label="Facebook">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>
        
        <div className="leading-relaxed text-[10px] md:text-xs tracking-[0.25em] text-[#52525b] uppercase space-y-2">
          <p className="font-bold text-[#71717a] transition-all duration-300 hover:text-[#a1a1aa] active:text-white">© 2026 FERAL. All rights reserved.</p>
          <p className="text-[9px] font-mono lowercase tracking-normal text-[#52525b]/70 transition-all duration-300 hover:text-[#71717a] active:text-white">made by shafbitz</p>
        </div>
      </footer>

    </div>
  );
}
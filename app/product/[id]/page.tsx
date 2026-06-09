'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { useCartStore } from '@/app/store/cartStore';

const supabaseUrl = 'https://thkbnqmnatphefnnllme.supabase.co';
const supabaseAnonKey = 'sb_publishable_4U7gn3gCQ3np5-Y9cD-sTQ_b0EWrYdC';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex flex-col gap-1.5 w-6 h-6 justify-center items-start group"
        whileTap={{ scale: 0.95 }}
      >
        <span className="w-6 h-[2px] bg-[#f4f4f5] transition-all group-hover:w-4"></span>
        <span className="w-4 h-[2px] bg-[#f4f4f5] transition-all group-hover:w-6"></span>
        <span className="w-5 h-[2px] bg-[#f4f4f5] transition-all group-hover:w-3"></span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-50 bg-[#0a0a0a]"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setIsOpen(false)} className="text-[#f4f4f5]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col items-center gap-8 mt-20">
              {['Shop', 'New', 'Archive', 'Account'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-[#f4f4f5] text-lg font-bold uppercase tracking-wider hover:text-[#a1a1aa] transition"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  details: string;
  sizes: string[];
  images: string[];
  category: string;
  isBestseller: boolean;
  inStock: boolean;
  stockCount: number;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const imageReveal = {
  hidden: { opacity: 0, scale: 1.05, filter: 'blur(8px)' },
  visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } },
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const productId = params.id as string;
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true);
        const { data: fetchedProduct, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (productError || !fetchedProduct) throw productError || new Error('Product not found');

        // Map the database row to our Product type – fixed image handling
        const mappedProduct: Product = {
          id: String(fetchedProduct.id),
          name: fetchedProduct.name,
          price: fetchedProduct.price,
          description: fetchedProduct.description || '',
          details: fetchedProduct.details || '',
          sizes: fetchedProduct.sizes || ['S', 'M', 'L', 'XL'],
          images: [fetchedProduct.image || '/feralshirt1.png'], // always use the single image column
          category: fetchedProduct.category,
          isBestseller: fetchedProduct.is_bestseller ?? false,
          inStock: fetchedProduct.in_stock ?? true,
          stockCount: fetchedProduct.stock_count ?? 0,
        };

        setProduct(mappedProduct);

        // Fetch related products (same category, excluding current)
        const { data: related, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .neq('id', fetchedProduct.id)
          .eq('category', fetchedProduct.category)
          .limit(4);

        if (!relatedError && related) {
          const mappedRelated = related.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            price: item.price,
            description: item.description || '',
            details: item.details || '',
            sizes: item.sizes || ['S', 'M', 'L', 'XL'],
            images: [item.image || '/feralshirt1.png'],
            category: item.category,
            isBestseller: item.is_bestseller ?? false,
            inStock: item.in_stock ?? true,
            stockCount: item.stock_count ?? 0,
          }));
          setRelatedProducts(mappedRelated);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-[#a1a1aa] hover:text-white">Return to Shop</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    await addItem(Number(product.id), quantity, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    const checkoutItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      image: product.images[0],
    };
    localStorage.setItem('checkoutItem', JSON.stringify(checkoutItem));
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-[#f4f4f5] overflow-x-hidden">
      {/* HEADER */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10'
            : 'bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-[#52525b]/20'
        }`}
      >
        <div className="px-4 py-2 md:py-3 md:px-8">
          <div className="flex items-center justify-between md:hidden">
            <div className="w-8"><MobileMenu /></div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <img src="/ferallogu.png" alt="FERAL" className="h-16 w-auto" />
            </motion.div>
            <div className="flex items-center gap-3">
              <Link href="/cart">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-6"><MobileMenu /></div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <img src="/ferallogu.png" alt="FERAL" className="h-20 w-auto" />
            </motion.div>
            <div className="flex items-center gap-5">
              <Link href="/cart">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="h-14 md:h-16"></div>

      {/* PRODUCT SECTION */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* LEFT: Image Gallery */}
          <motion.div initial="hidden" animate="visible" variants={imageReveal}>
            <div className="relative aspect-[3/4] overflow-hidden bg-transparent mb-4 group transition-transform duration-700 hover:scale-95">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isBestseller && (
                <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                  BESTSELLER
                </span>
              )}
              {product.inStock && product.stockCount < 10 && (
                <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 animate-pulse">
                  LOW STOCK
                </span>
              )}
            </div>

            {/* Thumbnails (if multiple images, but we only have one for now) */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img: string, idx: number) => (
                  <motion.button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    whileHover={{ scale: 0.95 }}
                    whileTap={{ scale: 0.92 }}
                    className={`aspect-[3/4] overflow-hidden bg-transparent transition-all duration-300 ${
                      selectedImage === idx ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT: Product Details */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 text-xs text-[#a1a1aa] mb-4">
                <Link href="/shop" className="hover:text-white">Shop</Link>
                <span>/</span>
                <span className="capitalize">{product.category}</span>
                <span>/</span>
                <span className="text-white">{product.name}</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2">
              {product.name}
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#a1a1aa] mb-4">
              ৳{product.price.toLocaleString()}
            </motion.p>

            {/* Delivery & Returns */}
            <motion.div variants={fadeInUp} className="space-y-2 text-[#a1a1aa] text-xs mb-6 p-4 bg-[#18181b] border border-[#52525b]/20">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m-4-4H4" /></svg>
                <span>Free shipping on orders over ৳5,000</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" /></svg>
                <span>14‑day easy returns</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span>Secure payment (bKash / Nagad / card)</span>
              </div>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-sm text-[#d4d4d8] leading-relaxed mb-6 border-l-2 border-[#52525b]/30 pl-4">
              {product.description}
            </motion.p>

            {/* Model Info */}
            <motion.div variants={fadeInUp} className="bg-[#18181b] p-4 mb-6 border border-[#52525b]/20">
              <p className="text-[#a1a1aa] text-xs leading-relaxed">
                <span className="font-bold text-white">Model info</span> – 188 cm / 6'2"<br />
                Wearing size <span className="font-bold text-white">L</span> for oversized fit.<br />
                This style runs large — size down for regular fit.
              </p>
            </motion.div>

            {/* Size Selector */}
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-bold uppercase">Size</span>
                <motion.button
                  whileHover={{ opacity: 0.7 }}
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-[#a1a1aa] hover:text-white transition"
                >
                  Size Guide
                </motion.button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size: string) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[60px] py-3 px-4 border text-sm font-medium uppercase transition-all ${
                      selectedSize === size
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-[#d4d4d8] border-[#52525b]/50 hover:border-white'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Quantity & Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-4 mb-8">
              <div className="flex border border-[#52525b]/50 w-fit">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center">-</motion.button>
                <span className="w-10 h-10 flex items-center justify-center">{quantity}</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center">+</motion.button>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 font-bold uppercase tracking-wider text-sm transition-all ${
                    addedToCart ? 'bg-emerald-600 text-white' : 'bg-white text-black hover:bg-[#d4d4d8]'
                  }`}
                >
                  {addedToCart ? 'ADDED ✓' : 'ADD TO CART'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-4 font-bold uppercase tracking-wider text-sm transition-all bg-transparent border border-white text-white hover:bg-white hover:text-black"
                >
                  BUY NOW
                </motion.button>
              </div>
            </motion.div>

            {/* Why FERAL */}
            <motion.div variants={fadeInUp} className="border-t border-[#52525b]/20 pt-6 mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Why FERAL</h3>
              <div className="grid grid-cols-2 gap-3 text-[#a1a1aa] text-xs">
                <div className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg><span>450gsm heavy cotton</span></div>
                <div className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" /></svg><span>Made for dancefloors</span></div>
                <div className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>Hand‑embroidered sigils</span></div>
                <div className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" /></svg><span>Ethically made</span></div>
              </div>
            </motion.div>

            {/* Details */}
            <motion.div variants={fadeInUp} className="border-t border-[#52525b]/20 pt-6 mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3">DETAILS</h3>
              <p className="text-sm text-[#a1a1aa] whitespace-pre-line">{product.details}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
        className="py-16 md:py-20 border-t border-[#52525b]/20"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-sm font-black tracking-[0.3em] uppercase text-center mb-12"
          >
            YOU MAY ALSO LIKE
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {relatedProducts.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                whileHover={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/product/${item.id}`} className="group">
                  <div className="aspect-[3/4] overflow-hidden bg-transparent relative">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    {item.isBestseller && <span className="absolute top-2 left-2 bg-white text-black text-[8px] font-bold uppercase px-1.5 py-0.5">BEST</span>}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-xs md:text-sm font-medium uppercase tracking-wide text-[#f4f4f5] group-hover:text-[#a1a1aa] transition">{item.name}</h3>
                    <p className="text-xs text-[#a1a1aa] mt-1">৳{item.price.toLocaleString()}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* SIZE GUIDE MODAL */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="bg-[#0a0a0a] border border-white/20 p-6 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold uppercase">Size Guide</h3>
                <button onClick={() => setShowSizeGuide(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2 text-sm text-[#d4d4d8]">
                <div className="flex justify-between border-b border-[#52525b]/20 py-2"><span>S</span><span>46</span><span>90‑95 cm</span></div>
                <div className="flex justify-between border-b border-[#52525b]/20 py-2"><span>M</span><span>48</span><span>96‑101 cm</span></div>
                <div className="flex justify-between border-b border-[#52525b]/20 py-2"><span>L</span><span>50</span><span>102‑107 cm</span></div>
                <div className="flex justify-between py-2"><span>XL</span><span>52</span><span>108‑113 cm</span></div>
              </div>
              <p className="text-[10px] text-[#a1a1aa] mt-4 text-center">Measurements are chest circumference</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="pt-12 pb-14 text-center border-t border-[#52525b]/20">
        <div className="flex gap-6 justify-center mb-8">
          <a href="https://instagram.com/feral.untamed" target="_blank" className="w-10 h-10 flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] border border-[#52525b]/30 rounded-full transition-all duration-300 hover:border-white">IG</a>
          <a href="#" className="w-10 h-10 flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] border border-[#52525b]/30 rounded-full transition-all duration-300 hover:border-white">FB</a>
        </div>
        <div className="text-[10px] tracking-[0.25em] text-[#52525b] uppercase space-y-2">
          <p>© 2026 FERAL. All rights reserved.</p>
          <p className="text-[9px] font-mono lowercase tracking-normal">made by shafbitz</p>
        </div>
      </footer>
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants, useMotionValue, animate } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { useCartStore } from '@/app/store/cartStore';
import MobileMenu from '../../MobileMenu';

const supabaseUrl = 'https://thkbnqmnatphefnnllme.supabase.co';
const supabaseAnonKey = 'sb_publishable_4U7gn3gCQ3np5-Y9cD-sTQ_b0EWrYdC';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  details: string;
  modelInfo?: string;
  sizes: string[];
  images: string[];
  category: string;
  isBestseller: boolean;
  inStock: boolean;
  stockCount: number;
  sizeQuantities: Record<string, number>;
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.05, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  }
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

  // Carousel state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);

  const productId = params.id as string;
  const addItem = useCartStore((state) => state.addItem);

  // Measure carousel width — runs whenever product loads and on resize
  useEffect(() => {
    const measure = () => {
      const node = carouselRef.current;
      if (node && node.clientWidth > 0) {
        setContainerWidth(node.clientWidth);
      }
    };

    // Try immediately, then again after paint, then after a short delay
    // to handle cases where the DOM hasn't fully laid out yet
    measure();
    requestAnimationFrame(() => {
      measure();
      setTimeout(measure, 100);
    });

    const observer = new ResizeObserver(measure);
    if (carouselRef.current) observer.observe(carouselRef.current);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [product]); // re-run when product loads so ref is populated

  const snapTo = (index: number) => {
    const images = product?.images.filter(img => img.trim() !== '') || [];
    const validIndex = Math.max(0, Math.min(index, images.length - 1));
    setSelectedImage(validIndex);

    // Fallback to reading the ref directly if containerWidth hasn't been set yet
    const width = containerWidth > 0 ? containerWidth : (carouselRef.current?.clientWidth ?? 0);
    if (width > 0) {
      animate(x, -validIndex * width, {
        type: 'spring',
        stiffness: 200,
        damping: 25,
        mass: 0.5,
      });
    }
  };

  const goPrev = () => snapTo(selectedImage - 1);
  const goNext = () => snapTo(selectedImage + 1);

  const handleDragEnd = (_: any, info: any) => {
    if (containerWidth <= 0) return;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > containerWidth / 4) {
      const direction = offset < 0 ? 1 : -1;
      snapTo(selectedImage + direction);
    } else {
      snapTo(selectedImage);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard arrow navigation
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, selectedImage]);

  // Trackpad horizontal swipe on the carousel
  useEffect(() => {
    if (!product) return;
    const node = carouselRef.current;
    if (!node) return;

    let accumulatedDelta = 0;
    let rafId: number;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // ignore vertical scroll
      e.preventDefault();
      accumulatedDelta += e.deltaX;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (accumulatedDelta > 40) { goNext(); accumulatedDelta = 0; }
        else if (accumulatedDelta < -40) { goPrev(); accumulatedDelta = 0; }
      });
    };

    node.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      node.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(rafId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, selectedImage]);

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

        const explicitGallery = (fetchedProduct.images && Array.isArray(fetchedProduct.images) && fetchedProduct.images.length > 0)
          ? fetchedProduct.images
          : [fetchedProduct.image || '/feralshirt1.png'];

        const dynamicSizes = Array.isArray(fetchedProduct.sizes)
          ? fetchedProduct.sizes.filter((s: string) => s.toUpperCase() !== 'S')
          : ['M', 'L', 'XL', 'XXL'];

        const sizeQuantities = fetchedProduct.size_quantities
          ? (typeof fetchedProduct.size_quantities === 'string'
              ? JSON.parse(fetchedProduct.size_quantities)
              : fetchedProduct.size_quantities)
          : {};

        const mappedProduct: Product = {
          id: String(fetchedProduct.id),
          name: fetchedProduct.name || '',
          price: fetchedProduct.price || 0,
          description: fetchedProduct.description || '',
          details: fetchedProduct.details || '',
          modelInfo: fetchedProduct.model_info || undefined,
          sizes: dynamicSizes.length > 0 ? dynamicSizes : ['M', 'L', 'XL', 'XXL'],
          images: explicitGallery,
          category: fetchedProduct.category || '',
          isBestseller: fetchedProduct.is_bestseller ?? false,
          inStock: fetchedProduct.in_stock ?? true,
          stockCount: fetchedProduct.stock_count ?? 0,
          sizeQuantities,
        };

        setProduct(mappedProduct);

        if (mappedProduct.sizes.length > 0) {
          const firstAvailable = mappedProduct.sizes.find(s => (sizeQuantities[s] ?? 0) > 0);
          setSelectedSize(firstAvailable || mappedProduct.sizes[0]);
        }

        const { data: related, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .neq('id', fetchedProduct.id)
          .eq('category', fetchedProduct.category)
          .limit(4);

        if (!relatedError && related) {
          const mappedRelated = related.map((item: any) => {
            const relGallery = (item.images && Array.isArray(item.images) && item.images.length > 0)
              ? item.images
              : [item.image || '/feralshirt1.png'];
            const relSizes = Array.isArray(item.sizes)
              ? item.sizes.filter((s: string) => s.toUpperCase() !== 'S')
              : ['M', 'L', 'XL', 'XXL'];
            const relSizeQuant = item.size_quantities
              ? (typeof item.size_quantities === 'string' ? JSON.parse(item.size_quantities) : item.size_quantities)
              : {};
            return {
              id: String(item.id),
              name: item.name,
              price: item.price,
              description: item.description || '',
              details: item.details || '',
              modelInfo: item.model_info || undefined,
              sizes: relSizes.length > 0 ? relSizes : ['M', 'L', 'XL', 'XXL'],
              images: relGallery,
              category: item.category,
              isBestseller: item.is_bestseller ?? false,
              inStock: item.in_stock ?? true,
              stockCount: item.stock_count ?? 0,
              sizeQuantities: relSizeQuant,
            };
          });
          setRelatedProducts(mappedRelated);
        }
      } catch (err: any) {
        console.error('Error fetching product details:', err);
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

  const isAnySizeAvailable = Object.values(product.sizeQuantities || {}).some(qty => qty > 0);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    const qtyAvailable = product.sizeQuantities[selectedSize] ?? 0;
    if (qtyAvailable <= 0) {
      alert('This size is currently unavailable');
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
    const qtyAvailable = product.sizeQuantities[selectedSize] ?? 0;
    if (qtyAvailable <= 0) {
      alert('This size is currently unavailable');
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

  const visibleImages = product.images.filter(img => img.trim() !== '');

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-[#f4f4f5] overflow-x-hidden">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
            : 'bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-[#52525b]/20'
        }`}
      >
        <div className="px-4 py-2 md:py-3 md:px-8">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" />
                </svg>
              </Link>
            </div>
          </div>

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="h-14 md:h-16"></div>

      {/* PRODUCT SECTION */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">

          {/* LEFT: Instagram-style Carousel */}
          <motion.div initial="hidden" animate="visible" variants={imageReveal}>

            {/* Main carousel track */}
            <div
              ref={carouselRef}
              className="relative aspect-[3/4] overflow-hidden bg-[#111] border border-[#27272a] mb-3 select-none"
            >
              {/* Sliding strip */}
              <motion.div
                className="flex h-full cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={
                  containerWidth > 0
                    ? { left: -containerWidth * (visibleImages.length - 1), right: 0 }
                    : {}
                }
                dragElastic={0.08}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                style={{ x, width: visibleImages.length * 100 + '%' }}
              >
                {visibleImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="h-full flex-shrink-0"
                    style={{ width: 100 / visibleImages.length + '%' }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                      draggable="false"
                    />
                  </div>
                ))}
              </motion.div>

              {/* Bestseller badge */}
              {product.isBestseller && (
                <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1 z-10">
                  BESTSELLER
                </span>
              )}

              {/* Instagram-style dot indicators */}
              {visibleImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                  {visibleImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => snapTo(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        selectedImage === idx
                          ? 'w-2 h-2 bg-white'
                          : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Side arrows + invisible wide tap zones */}
              {visibleImages.length > 1 && (
                <>
                  {/* Invisible left tap zone */}
                  <button
                    onClick={goPrev}
                    className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
                    aria-label="Previous image"
                  />
                  {/* Invisible right tap zone */}
                  <button
                    onClick={goNext}
                    className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
                    aria-label="Next image"
                  />

                  {/* Left visible arrow */}
                  <button
                    onClick={goPrev}
                    aria-label="Previous image"
                    className={`absolute left-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-9 h-9 border border-white/25 bg-black/50 backdrop-blur-sm transition-all duration-200 hover:bg-black/80 hover:border-white/60 hover:scale-105 active:scale-95 ${selectedImage === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}`}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Right visible arrow */}
                  <button
                    onClick={goNext}
                    aria-label="Next image"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-9 h-9 border border-white/25 bg-black/50 backdrop-blur-sm transition-all duration-200 hover:bg-black/80 hover:border-white/60 hover:scale-105 active:scale-95 ${selectedImage === visibleImages.length - 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}`}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {visibleImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {visibleImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => snapTo(idx)}
                    className={`aspect-[3/4] overflow-hidden bg-[#111] border transition-all duration-300 ${
                      selectedImage === idx
                        ? 'border-white opacity-100'
                        : 'border-transparent opacity-40 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
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

            <motion.h1 variants={fadeInUp} className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2 text-white">
              {product.name}
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#a1a1aa] mb-6 font-mono">
              ৳{product.price.toLocaleString()}
            </motion.p>

            {/* Trust Badges */}
            <motion.div variants={fadeInUp} className="space-y-3 text-xs text-[#a1a1aa] mb-6 font-mono border-t border-b border-[#27272a] py-4">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span>Shipping all over bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" />
                </svg>
                <span>Exchange upto 3 days</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure payment (bKash / Nagad / cash on delivery)</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p variants={fadeInUp} className="text-sm text-[#d4d4d8] whitespace-pre-line leading-relaxed mb-6 border-l-2 border-[#52525b]/30 pl-4">
              {product.description}
            </motion.p>

            {product.modelInfo && (
              <motion.div variants={fadeInUp} className="bg-[#18181b] p-4 mb-6 border border-[#52525b]/20 text-xs text-[#a1a1aa] leading-relaxed whitespace-pre-line font-mono">
                {product.modelInfo}
              </motion.div>
            )}

            {/* Size Selector */}
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-bold uppercase">Size</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size: string) => {
                  const qty = product.sizeQuantities[size] ?? 0;
                  const isAvailable = qty > 0;
                  return (
                    <motion.button
                      key={size}
                      whileHover={isAvailable ? { scale: 1.02 } : {}}
                      whileTap={isAvailable ? { scale: 0.98 } : {}}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`relative min-w-[60px] py-3 px-4 border text-sm font-medium uppercase transition-all ${
                        !isAvailable
                          ? 'border-[#52525b]/20 text-[#52525b]/40 cursor-not-allowed'
                          : selectedSize === size
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-[#d4d4d8] border-[#52525b]/50 hover:border-white'
                      }`}
                    >
                      {size}
                      {!isAvailable && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                          OUT
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Quantity & Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-4 mb-8">
              <div className="flex border border-[#52525b]/50 w-fit bg-black">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center font-mono">-</motion.button>
                <span className="w-10 h-10 flex items-center justify-center font-mono text-sm">{quantity}</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center font-mono">+</motion.button>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!product.inStock || !isAnySizeAvailable || !selectedSize || (product.sizeQuantities[selectedSize] ?? 0) <= 0}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    addedToCart ? 'bg-emerald-600 text-white' : 'bg-white text-black hover:bg-[#d4d4d8]'
                  }`}
                >
                  {!product.inStock || !isAnySizeAvailable ? 'OUT OF STOCK' : addedToCart ? 'ADDED ✓' : 'ADD TO CART'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!product.inStock || !isAnySizeAvailable || !selectedSize || (product.sizeQuantities[selectedSize] ?? 0) <= 0}
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-4 font-bold uppercase tracking-wider text-sm transition-all bg-transparent border border-white text-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  BUY NOW
                </motion.button>
              </div>
            </motion.div>

            {/* Details Section */}
            {product.details && (
              <motion.div variants={fadeInUp} className="border-t border-[#52525b]/20 pt-6 mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3">DETAILS</h3>
                <p className="text-sm text-[#a1a1aa] whitespace-pre-line font-mono text-xs bg-[#111]/30 p-4 border border-white/5">{product.details}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <motion.section className="py-16 md:py-20 border-t border-[#52525b]/20">
        <div className="container mx-auto px-4">
          <h2 className="text-sm font-black tracking-[0.3em] uppercase text-center mb-12 text-white">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/product/${item.id}`} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-[#111] border border-white/5 relative">
                  <img src={item.images[0] || '/feralshirt1.png'} className="w-full h-full object-cover" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-[#f4f4f5]">{item.name}</h3>
                  <p className="text-xs text-[#a1a1aa] mt-1 font-mono">৳{item.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="w-full bg-[#0a0a0a] pt-16 pb-14 text-center flex flex-col items-center relative border-t border-[#52525b]/20">
        <div className="w-[90%] max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />
        <div className="flex gap-6 mb-8">
          <a href="https://instagram.com/feral_bd" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#52525b]/20 rounded-full transition-all duration-300 hover:-translate-y-1 active:scale-95" aria-label="Instagram">
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
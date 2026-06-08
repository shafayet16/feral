'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileMenu from '../MobileMenu';
import { useCartStore } from '@/app/store/cartStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, fetchCart } = useCartStore();
  
  const [scrolled, setScrolled] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [hasCheckedData, setHasCheckedData] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const loadData = async () => {
      await fetchCart();
      setHasCheckedData(true);
    };
    
    loadData();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const singleItemRaw = localStorage.getItem('checkoutItem');
    
    if (cartItems && cartItems.length > 0) {
      setCheckoutItems(cartItems);
      setIsBuyNow(false);
      localStorage.removeItem('checkoutItem');
    } 
    else if (singleItemRaw) {
      try {
        const parsed = JSON.parse(singleItemRaw);
        // Ensure buy‑now item has product_id (id is product id)
        setCheckoutItems([{ ...parsed, product_id: parsed.id }]);
        setIsBuyNow(true);
      } catch (e) {
        console.error("Error parsing buy now payload:", e);
      }
    } 
    else if (hasCheckedData && cartItems.length === 0) {
      router.push('/shop');
    }
  }, [cartItems, hasCheckedData]);

  const subtotal = checkoutItems.reduce((acc, item) => {
    const rawPrice = item.price ?? item.products?.price ?? 0;
    const cleanPrice = Number(rawPrice);
    const qty = item.quantity || 1;
    return acc + (cleanPrice * qty);
  }, 0);
  const total = subtotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsProcessing(true);
    
    // Build order payload for the API
    const orderPayload = {
      action: 'checkout',          // <-- tells the API to process checkout
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      paymentMethod: formData.paymentMethod,
      total,
      items: checkoutItems.map(item => ({
        product_id: item.product_id,
        name: item.name ?? item.products?.name ?? 'Feral Item',
        price: item.price ?? item.products?.price ?? 0,
        quantity: item.quantity,
        size: item.size,
      })),
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
        credentials: 'include',   // send cookies (important for session)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Checkout failed');
      }

      const result = await res.json();
      
      // Clear the buy‑now item if it existed
      if (isBuyNow) localStorage.removeItem('checkoutItem');
      
      // Store only the order number in localStorage for the confirmation page
      localStorage.setItem('lastOrder', JSON.stringify(result));
      
      router.push('/order-confirmation');
    } catch (error: any) {
      alert('Error placing order: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!hasCheckedData && checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-[#f4f4f5] overflow-x-hidden">
      
      {/* HEADER (same as before) */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/20' : 'bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-[#52525b]/20'
      }`}>
        <div className="px-4 py-2 md:py-3 md:px-8">
          <div className="flex items-center justify-between md:hidden">
            <div className="w-8"><MobileMenu /></div>
            <div><img src="/ferallogu.png" alt="FERAL" className="h-12 w-auto" /></div>
            <Link href="/cart" className="text-[#d4d4d8] hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" />
              </svg>
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-6"><MobileMenu /></div>
            <div><img src="/ferallogu.png" alt="FERAL" className="h-16 w-auto" /></div>
            <Link href="/cart" className="text-[#d4d4d8] hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="h-14 md:h-16"></div>

      {/* CHECKOUT CONTENT */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-center mb-8">CHECKOUT</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Order Summary Sidebar */}
          <div className="md:order-2">
            <div className="bg-[#18181b] border border-[#52525b]/20 p-6 sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-4">ORDER SUMMARY</h2>
              <div className="space-y-4 mb-4 pb-4 border-b border-[#52525b]/20">
                {checkoutItems.map((item, index) => {
                  const name = item.name ?? item.products?.name ?? 'Feral Apparel';
                  const rawPrice = item.price ?? item.products?.price ?? 0;
                  const price = Number(rawPrice);
                  const image = item.image ?? item.products?.image ?? '/feralshirt1.png';
                  return (
                    <div key={`${item.id}-${item.size}-${index}`} className="flex gap-4 items-start">
                      <div className="w-20 h-24 bg-[#0a0a0a] overflow-hidden flex-shrink-0">
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium uppercase">{name}</h3>
                        <p className="text-xs text-[#a1a1aa]">Size: {item.size}</p>
                        <p className="text-xs text-[#a1a1aa]">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold mt-1">৳{(price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#a1a1aa]">Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#a1a1aa]">Shipping</span><span className="text-emerald-500">Free</span></div>
                <div className="flex justify-between pt-2 border-t border-[#52525b]/20 font-bold"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="md:col-span-2 md:order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Info (same inputs as before) */}
              <div className="bg-[#18181b] border border-[#52525b]/20 p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4">SHIPPING INFORMATION</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-xs text-[#a1a1aa] mb-1">Full Name *</label><input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white" /></div>
                  <div><label className="block text-xs text-[#a1a1aa] mb-1">Email *</label><input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white" /></div>
                  <div><label className="block text-xs text-[#a1a1aa] mb-1">Phone *</label><input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white" /></div>
                  <div><label className="block text-xs text-[#a1a1aa] mb-1">City *</label><input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white" /></div>
                  <div className="md:col-span-2"><label className="block text-xs text-[#a1a1aa] mb-1">Address *</label><input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white" /></div>
                  <div><label className="block text-xs text-[#a1a1aa] mb-1">Postal Code</label><input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white" /></div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-[#18181b] border border-[#52525b]/20 p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4">PAYMENT METHOD</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="accent-white" /><span className="text-sm">Cash on Delivery</span></label>
                  <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="paymentMethod" value="bkash" checked={formData.paymentMethod === 'bkash'} onChange={handleInputChange} className="accent-white" /><span className="text-sm">bKash</span></label>
                  <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="paymentMethod" value="nagad" checked={formData.paymentMethod === 'nagad'} onChange={handleInputChange} className="accent-white" /><span className="text-sm">Nagad</span></label>
                  <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="accent-white" /><span className="text-sm">Credit / Debit Card</span></label>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link href="/shop" className="flex-1 py-3 px-6 text-center border border-[#52525b]/50 text-sm uppercase tracking-wider hover:border-white transition">BACK TO SHOP</Link>
                <button type="submit" disabled={isProcessing} className={`flex-1 py-3 px-6 font-bold uppercase tracking-wider text-sm transition ${isProcessing ? 'bg-[#52525b] cursor-not-allowed' : 'bg-white text-black hover:bg-[#d4d4d8]'}`}>
                  {isProcessing ? 'PROCESSING...' : 'PLACE ORDER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER (same) */}
      <footer className="pt-12 pb-14 text-center border-t border-[#52525b]/20">
        <div className="text-[10px] tracking-[0.25em] text-[#52525b] uppercase">© 2026 FERAL. All rights reserved.</div>
        <div className="text-[9px] font-mono lowercase tracking-normal text-[#52525b]/70 mt-2">made by shafbitz</div>
      </footer>
    </div>
  );
}
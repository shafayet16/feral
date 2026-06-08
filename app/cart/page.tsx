'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/app/store/cartStore';

export default function CartPage() {
  const { items, isLoading, fetchCart, removeItem, updateQuantity, getTotal, getCount } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center tracking-widest text-xs font-mono uppercase">
        [ Loading Bag Metrics... ]
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 mb-6">Your bag is empty</h2>
        <Link 
          href="/shop" 
          className="text-xs font-mono uppercase tracking-widest bg-white text-black px-6 py-3 hover:bg-neutral-200 transition-colors duration-300"
        >
          View Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white selection:text-black pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="border-b border-neutral-900 pb-4 mb-12 flex justify-between items-baseline">
          <h1 className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">Shopping Bag</h1>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            {getCount()} {getCount() === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {/* Workspace Layout */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Main Items Display Column */}
          <div className="lg:col-span-8 divide-y divide-neutral-900">
            {items.map((item) => {
              const productInfo = item.products;
              const productName = productInfo?.name || 'FERAL PIECE';
              const productImg = productInfo?.image || '/fallback.png';
              const productPrice = Number(productInfo?.price || 0);

              return (
                <div 
                  key={item.id} 
                  className="flex gap-6 py-8 first:pt-0 group relative"
                >
                  {/* Premium Image Container */}
                  <div className="w-24 h-32 bg-[#0c0c0e] overflow-hidden flex-shrink-0 relative border border-neutral-900">
                    <img 
                      src={productImg} 
                      alt={productName} 
                      className="w-full h-full object-cover grayscale contrast-115 group-hover:scale-102 group-hover:grayscale-0 transition-all duration-500 ease-out" 
                    />
                  </div>

                  {/* Operational Layout Block */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xs uppercase tracking-[0.15em] font-medium text-neutral-200">
                          {productName}
                        </h3>
                        <p className="text-xs tracking-wider font-mono font-medium text-white">
                          ৳{(productPrice * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      
                      {/* Meta Parameters Grid */}
                      <div className="flex gap-8 mt-3 font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                        <p>Size: <span className="text-neutral-300">{item.size}</span></p>
                        <p>Price: <span className="text-neutral-300">৳{productPrice.toLocaleString()}</span></p>
                      </div>
                    </div>

                    {/* Controller Action Row */}
                    <div className="flex items-center gap-6 mt-4">
                      {/* Minimalist Selector Layout */}
                      <div className="flex items-center border border-neutral-800 bg-neutral-950 h-7 px-2">
                        <span className="text-[9px] font-mono tracking-widest text-neutral-500 mr-2 select-none">QTY</span>
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="bg-transparent text-xs font-mono focus:outline-none cursor-pointer text-white pr-1"
                        >
                          {[1, 2, 3, 4, 5].map((q) => (
                            <option key={q} value={q} className="bg-black text-white font-mono">{q}</option>
                          ))}
                        </select>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 hover:text-white transition-colors duration-200"
                      >
                        [ Delete ]
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Premium Right Dynamic Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="border border-neutral-900 p-6 md:p-8 bg-black relative">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-6 pb-2 border-b border-neutral-900">
                Summary
              </h2>
              
              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between tracking-wide">
                  <span className="text-neutral-500 uppercase">Subtotal</span>
                  <span className="text-neutral-200">৳{getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between tracking-wide">
                  <span className="text-neutral-500 uppercase">Shipping</span>
                  <span className="text-neutral-400 uppercase tracking-wider text-[11px]">Calculated Next</span>
                </div>
                
                <div className="border-t border-neutral-900 pt-4 mt-6 flex justify-between items-baseline">
                  <span className="font-sans text-xs uppercase tracking-[0.15em] text-white font-medium">Total</span>
                  <span className="text-base font-medium tracking-wide text-white">৳{getTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Block */}
              <div className="mt-8 space-y-3">
                <Link
                  href="/checkout"
                  className="block w-full bg-white text-black text-center py-3.5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-neutral-200 transition-colors duration-300 font-mono"
                >
                  Checkout
                </Link>
                
                {/* Clean inline footnote matching adidas standard placement */}
                <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest text-center leading-normal">
                  Taxes & duties adjusted throughout checkout processing.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
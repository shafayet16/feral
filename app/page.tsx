export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#0a0a0a] text-[#f4f4f5] font-sans antialiased selection:bg-[#d4d4d8] selection:text-[#0a0a0a] overflow-x-hidden">
      
      {/* INJECTED CSS FOR INFINITE SEAMLESS SCROLLING & VIDEO EFFECT */}
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
      `}} />

                                          {/* 1. HEADER - VESCARTES INSPIRED MOBILE HEADER WITH LOGO IMAGE */}
      <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#52525b]/20">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Left: Hamburger Menu (Three Lines) - Fixed width to balance centering */}
          <div className="w-8">
            <button className="flex flex-col gap-1.5 w-6 h-6 justify-center items-start group">
              <span className="w-6 h-[2px] bg-[#f4f4f5] transition-all group-hover:w-4"></span>
              <span className="w-4 h-[2px] bg-[#f4f4f5] transition-all group-hover:w-6"></span>
              <span className="w-5 h-[2px] bg-[#f4f4f5] transition-all group-hover:w-3"></span>
            </button>
          </div>

          {/* Center: Logo Image - MUCH LARGER AND PERFECTLY CENTERED */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="/ferallogu.png" 
              alt="FERAL" 
              className="h-16 md:h-20 w-auto object-contain"
            />
          </div>

          {/* Right: Search + Account Icons - Fixed width to balance centering */}
          <div className="flex items-center gap-4 w-8 justify-end">
            <button className="text-[#d4d4d8] hover:text-[#f4f4f5] transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="relative text-[#d4d4d8] hover:text-[#f4f4f5] transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown (Hidden by default - add state to toggle) */}
      </header>
      {/* 2. HERO */}
      <section className="relative w-full h-[65dvh] border-b border-[#52525b]/20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/bakkarputki.jpg" 
            alt="FERAL Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <button className="bg-transparent text-white border border-white hover:bg-white hover:text-black uppercase tracking-[0.25em] text-xs font-bold px-10 py-4 transition-all duration-300">
            shop
          </button>
        </div>
      </section>

      {/* 3. NEW DROPS HEADER */}
      <section className="w-full bg-[#0a0a0a] text-center py-10">
        <h2 className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-[#f4f4f5]">
          NEW DROPS
        </h2>
      </section>

      {/* 4. NEW DROPS SLIDESHOW */}
      <section className="w-full bg-[#0a0a0a] pb-12 md:pb-16 border-b border-[#52525b]/20 overflow-hidden">
        <div className="animate-marquee cursor-pointer">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] border-r border-y border-[#52525b]/30 flex-shrink-0 overflow-hidden">
                <img src="/feralshirt1.png" alt="Feral Shirt" className="w-full h-full object-cover" />
              </div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] border-r border-y border-[#52525b]/30 flex-shrink-0 overflow-hidden">
                <img src="/feralpant1.png" alt="Feral Pant" className="w-full h-full object-cover" />
              </div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] border-r border-y border-[#52525b]/30 flex-shrink-0 overflow-hidden">
                <img src="/feralshirt1.png" alt="Feral Shirt" className="w-full h-full object-cover" />
              </div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] border-r border-y border-[#52525b]/30 flex-shrink-0 overflow-hidden">
                <img src="/feralpant1.png" alt="Feral Pant" className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. COMING SOON HEADER */}
      <section className="w-full bg-[#0a0a0a] text-center py-10">
        <h2 className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-[#a1a1aa]">
          COMING SOON
        </h2>
      </section>

      {/* 6. COMING SOON SLIDESHOW */}
      <section className="w-full bg-[#52525b]/5 pb-12 md:pb-16 border-b border-[#52525b]/20 overflow-hidden">
        <div className="animate-marquee cursor-pointer">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] border-r border-y border-[#52525b]/30 flex-shrink-0 overflow-hidden">
                <img src="/feralpant1.png" alt="Feral Pant" className="w-full h-full object-cover" />
              </div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] border-r border-y border-[#52525b]/30 flex-shrink-0 overflow-hidden">
                <img src="/feralshirt1.png" alt="Feral Shirt" className="w-full h-full object-cover" />
              </div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] border-r border-y border-[#52525b]/30 flex-shrink-0 overflow-hidden">
                <img src="/feralpant1.png" alt="Feral Pant" className="w-full h-full object-cover" />
              </div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] border-r border-y border-[#52525b]/30 flex-shrink-0 overflow-hidden">
                <img src="/feralshirt1.png" alt="Feral Shirt" className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FERAL VIDEO TEXTURE SECTION - LARGE UNTAMED HEADLINE */}
      <section className="relative w-full bg-[#0a0a0a] py-12 md:py-16 border-b border-[#52525b]/20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            src="/fluid.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover video-zoom"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black uppercase tracking-tighter text-white drop-shadow-2xl">
            UNTAMED
          </h1>
        </div>
      </section>

            {/* 8. CATEGORY BANNERS - WITH EST AND 24 */}
      <section className="w-full grid grid-cols-5 text-center text-[8px] min-[380px]:text-[10px] md:text-sm font-black uppercase tracking-wide bg-[#0a0a0a] border-b border-[#52525b]/20 items-stretch min-h-[30vh]">
        {/* Left Box - EST */}
        <div className="bg-[#52525b]/10 border-r border-[#52525b]/20 flex items-center justify-center px-2 py-6 md:p-6 h-full">
          <span className="text-white text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter">
            EST
          </span>
        </div>
        
        <button className="border-r border-[#52525b]/20 flex items-center justify-center px-2 py-6 md:p-6 text-[#d4d4d8] hover:bg-[#52525b]/10 transition w-full h-full">
          BESTSELLERS
        </button>
        <button className="border-r border-[#52525b]/20 flex items-center justify-center px-2 py-6 md:p-6 text-[#f4f4f5] hover:bg-[#52525b]/10 transition w-full h-full">
          TOPS
        </button>
        <button className="border-r border-[#52525b]/20 flex items-center justify-center px-2 py-6 md:p-6 text-[#d4d4d8] hover:bg-[#52525b]/10 transition w-full h-full">
          PANTS
        </button>
        
        {/* Right Box - 24 */}
        <div className="bg-[#52525b]/10 flex items-center justify-center px-2 py-6 md:p-6 h-full">
          <span className="text-white text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter">
            24
          </span>
        </div>
      </section>

      {/* 9. SUB-FOOTER INFO RIBBON */}
      <section className="w-full bg-[#0a0a0a] text-[10px] md:text-xs font-medium tracking-widest text-[#d4d4d8]/80 py-5 border-b border-[#52525b]/10 overflow-hidden">
        <div className="animate-marquee slow cursor-pointer">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 pr-8 items-center flex-shrink-0">
              <span>puran dhaka</span>
              <span className="text-[#52525b]/40">•</span>
              <span>free delivery over x</span>
              <span className="text-[#52525b]/40">•</span>
              <span>contact - xxx</span>
              <span className="text-[#52525b]/40">•</span>
              <span>email - xxx</span>
              <span className="text-[#52525b]/40">•</span>
              <span>deliveries all over bd</span>
              <span className="text-[#52525b]/40">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="w-full bg-[#0a0a0a] pt-12 pb-14 text-center flex flex-col items-center relative border-t border-[#52525b]/20">
        <div className="w-[90%] max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />
        <div className="flex gap-6 mb-8">
          <a href="#" className="w-12 h-12 bg-transparent text-[#f4f4f5] border border-[#52525b]/30 hover:border-white flex items-center justify-center font-bold text-xs uppercase hover:bg-white hover:text-[#0a0a0a] transition-all duration-300 hover:-translate-y-0.5">ig</a>
          <a href="#" className="w-12 h-12 bg-transparent text-[#f4f4f5] border border-[#52525b]/30 hover:border-white flex items-center justify-center font-bold text-xs uppercase hover:bg-white hover:text-[#0a0a0a] transition-all duration-300 hover:-translate-y-0.5">fb</a>
        </div>
        <div className="leading-relaxed text-[10px] md:text-xs tracking-[0.25em] text-[#52525b] uppercase space-y-2">
          <p className="font-bold text-[#71717a]">© 2026 FERAL. All rights reserved.</p>
          <p className="text-[9px] font-mono lowercase tracking-normal text-[#52525b]/70">made by shafbitz</p>
        </div>
      </footer>

    </div>
  );
}
import MobileMenu from './MobileMenu';
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

            {/* 1. HEADER - FULLY RESPONSIVE */}
      <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#52525b]/20">
        <div className="px-4 py-4 md:px-8">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between md:hidden">
            <div className="w-8">
              {/* REPLACED with MobileMenu component */}
              <MobileMenu />
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 hover:scale-105 active:scale-95">
              <img src="/ferallogu.png" alt="FERAL" className="h-16 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-4 w-8 justify-end">
              <button className="text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="relative text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Desktop Layout - Logo centered, with hamburger on left */}
          <div className="hidden md:flex items-center justify-between">
            {/* Left: Hamburger Menu - Desktop also uses MobileMenu */}
            <div className="flex items-center gap-6">
              <MobileMenu />
            </div>

            {/* Center: Logo */}
            <div className="transition-all duration-300 hover:scale-105 active:scale-95">
              <img 
                src="/ferallogu.png" 
                alt="FERAL" 
                className="h-20 md:h-24 w-auto object-contain"
              />
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-6">
              <button className="text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="relative text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button className="relative text-[#d4d4d8] hover:text-[#f4f4f5] transition-all duration-300 hover:scale-110 active:scale-90">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-[#f4f4f5] text-[#0a0a0a] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO - FULLY RESPONSIVE */}
      <section className="relative w-full h-[65dvh] md:h-[80dvh] border-b border-[#52525b]/20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/bakkarputki.jpg" alt="FERAL Hero" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 active:scale-100" />
          <div className="absolute inset-0 bg-black/40 transition-all duration-500 hover:bg-black/30 active:bg-black/50" />
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <button className="bg-transparent text-white border border-white hover:bg-white hover:text-black active:bg-[#d4d4d8] active:text-black active:scale-95 uppercase tracking-[0.25em] text-xs md:text-sm font-bold px-8 py-3 md:px-12 md:py-4 transition-all duration-300 hover:scale-105">
            shop
          </button>
        </div>
      </section>

      {/* 3. NEW DROPS HEADER */}
      <section className="w-full bg-[#0a0a0a] text-center py-10 md:py-14">
        <h2 className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-[#f4f4f5] transition-all duration-300 hover:tracking-[0.4em] active:tracking-[0.2em]">
          NEW DROPS
        </h2>
      </section>

      {/* 4. NEW DROPS SLIDESHOW - RESPONSIVE MARQUEE */}
      <section className="w-full bg-[#0a0a0a] pb-12 md:pb-16 border-b border-[#52525b]/20 overflow-hidden">
        <div className="animate-marquee cursor-pointer">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              {['/feralshirt1.png', '/feralpant1.png', '/feralshirt1.png', '/feralpant1.png'].map((src, idx) => (
                <div key={idx} className="w-[50vw] md:w-[25vw] aspect-[4/5] border-r border-y border-[#52525b]/30 flex-shrink-0 overflow-hidden group">
                  <img 
                    src={src} 
                    alt="Feral Product" 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 active:scale-95 active:brightness-90" 
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 5. COMING SOON HEADER */}
      <section className="w-full bg-[#0a0a0a] text-center py-10 md:py-14">
        <h2 className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-[#a1a1aa] transition-all duration-300 hover:tracking-[0.4em] hover:text-[#f4f4f5] active:tracking-[0.2em]">
          COMING SOON
        </h2>
      </section>

      {/* 6. COMING SOON SLIDESHOW */}
      <section className="w-full bg-[#52525b]/5 pb-12 md:pb-16 border-b border-[#52525b]/20 overflow-hidden">
        <div className="animate-marquee cursor-pointer">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              {['/feralpant1.png', '/feralshirt1.png', '/feralpant1.png', '/feralshirt1.png'].map((src, idx) => (
                <div key={idx} className="w-[50vw] md:w-[25vw] aspect-[4/5] border-r border-y border-[#52525b]/30 flex-shrink-0 overflow-hidden group">
                  <img 
                    src={src} 
                    alt="Feral Product" 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 active:scale-95 active:brightness-90" 
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 7. UNTAMED VIDEO SECTION - FULLY RESPONSIVE */}
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

      {/* 8. CATEGORY BANNERS - RESPONSIVE GRID */}
      <section className="w-full grid grid-cols-5 text-center text-[8px] sm:text-[10px] md:text-sm font-black uppercase tracking-wide bg-[#0a0a0a] border-b border-[#52525b]/20 items-stretch min-h-[30vh]">
        <div className="bg-[#52525b]/10 border-r border-[#52525b]/20 flex items-center justify-center px-2 py-6 md:p-6 h-full transition-all duration-300 hover:bg-[#52525b]/20 active:bg-[#52525b]/30">
          <span className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter transition-all duration-300 hover:scale-110 hover:tracking-normal active:scale-95">EST</span>
        </div>
        <button className="border-r border-[#52525b]/20 flex items-center justify-center px-2 py-6 md:p-6 text-[#d4d4d8] hover:bg-[#52525b]/20 active:bg-[#52525b]/30 transition-all duration-300 w-full h-full text-[10px] sm:text-xs md:text-sm hover:text-[#f4f4f5] active:text-white active:scale-95">
          BESTSELLERS
        </button>
        <button className="border-r border-[#52525b]/20 flex items-center justify-center px-2 py-6 md:p-6 text-[#f4f4f5] hover:bg-[#52525b]/20 active:bg-[#52525b]/30 transition-all duration-300 w-full h-full text-[10px] sm:text-xs md:text-sm active:scale-95">
          TOPS
        </button>
        <button className="border-r border-[#52525b]/20 flex items-center justify-center px-2 py-6 md:p-6 text-[#d4d4d8] hover:bg-[#52525b]/20 active:bg-[#52525b]/30 transition-all duration-300 w-full h-full text-[10px] sm:text-xs md:text-sm hover:text-[#f4f4f5] active:text-white active:scale-95">
          PANTS
        </button>
        <div className="bg-[#52525b]/10 flex items-center justify-center px-2 py-6 md:p-6 h-full transition-all duration-300 hover:bg-[#52525b]/20 active:bg-[#52525b]/30">
          <span className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter transition-all duration-300 hover:scale-110 hover:tracking-normal active:scale-95">24</span>
        </div>
      </section>

      {/* 9. SUB-FOOTER INFO RIBBON */}
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

                  {/* 10. FOOTER */}
      <footer className="w-full bg-[#0a0a0a] pt-12 pb-14 text-center flex flex-col items-center relative border-t border-[#52525b]/20">
        <div className="w-[90%] max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />
        
        {/* Social Icons - Instagram & Facebook */}
        <div className="flex gap-6 mb-8">
          <a 
            href="https://instagram.com/feral.untamed" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#52525b]/20 rounded-full transition-all duration-300 hover:-translate-y-1 active:scale-95"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <a 
            href="https://facebook.com/yourusername" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#52525b]/20 rounded-full transition-all duration-300 hover:-translate-y-1 active:scale-95"
            aria-label="Facebook"
          >
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
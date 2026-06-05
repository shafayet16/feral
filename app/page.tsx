export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#0a0a0a] text-[#f4f4f5] font-sans antialiased selection:bg-[#d4d4d8] selection:text-[#0a0a0a] overflow-x-hidden">
      
      {/* INJECTED CSS FOR INFINITE SEAMLESS SCROLLING */}
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
      `}} />

      {/* 1. HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-[#52525b]/20 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="grid grid-cols-5 w-full text-center text-[10px] md:text-sm font-bold tracking-widest uppercase items-stretch h-14 md:h-16">
          <div className="bg-[#f4f4f5] text-[#0a0a0a] flex items-center justify-center font-black tracking-normal uppercase h-full">
            Feral
          </div>
          <button className="h-full flex items-center justify-center hover:bg-[#52525b]/10 transition text-[#d4d4d8] hover:text-[#f4f4f5] border-r border-[#52525b]/10">shop</button>
          <button className="h-full flex items-center justify-center hover:bg-[#52525b]/10 transition text-[#d4d4d8] hover:text-[#f4f4f5] border-r border-[#52525b]/10">cart</button>
          <button className="h-full flex items-center justify-center hover:bg-[#52525b]/10 transition text-[#d4d4d8] hover:text-[#f4f4f5] border-r border-[#52525b]/10">search</button>
          <button className="h-full flex items-center justify-center hover:bg-[#52525b]/10 transition text-[#d4d4d8] hover:text-[#f4f4f5]">account</button>
        </div>
      </header>

      {/* 2. HERO / MAIN MARKETING VIDEO SECTION */}
      <section className="relative w-full h-[65dvh] bg-[#52525b]/10 flex flex-col items-center justify-center text-center p-6 border-b border-[#52525b]/20">
        <span className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-[#a1a1aa] opacity-60 mb-8 max-w-lg">
          MAIN MARKETING VIDEO OR HERO VIDEO
        </span>
        <button className="bg-[#52525b]/30 text-[#f4f4f5] border border-[#52525b]/40 hover:bg-[#f4f4f5] hover:text-[#0a0a0a] uppercase tracking-[0.25em] text-xs font-bold px-10 py-4 transition-all duration-300 rounded-none mix-blend-difference">
          shop
        </button>
      </section>

      {/* 3. NEW DROPS SECTION HEADER */}
      <section className="w-full bg-[#0a0a0a] text-center py-10 border-b border-[#52525b]/10">
        <h2 className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-[#f4f4f5]">
          NEW DROPS
        </h2>
      </section>

      {/* 4. PRODUCT SLIDESHOW (Perfect Flush Grid, No Scroll Hijacking) */}
      <section className="w-full bg-[#0a0a0a] py-12 md:py-16 border-b border-[#52525b]/20 overflow-hidden">
        <p className="text-center text-[10px] md:text-xs text-[#d4d4d8] font-bold tracking-[0.2em] uppercase mb-8 opacity-40">
          Product slideshow
        </p>
        
        {/* The Marquee Wrapper */}
        <div className="animate-marquee cursor-pointer">
          {/* We map twice to create the seamless infinite loop */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              {/* Exactly 50vw on mobile (2 per row), 25vw on desktop (4 per row). Edge-to-edge flush borders. */}
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] bg-[#52525b]/10 border-r border-y border-[#52525b]/30 flex items-center justify-center text-xs tracking-widest text-[#a1a1aa] flex-shrink-0">IMAGE_01</div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] bg-[#52525b]/10 border-r border-y border-[#52525b]/30 flex items-center justify-center text-xs tracking-widest text-[#a1a1aa] flex-shrink-0">IMAGE_02</div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] bg-[#52525b]/10 border-r border-y border-[#52525b]/30 flex items-center justify-center text-xs tracking-widest text-[#a1a1aa] flex-shrink-0">IMAGE_03</div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] bg-[#52525b]/10 border-r border-y border-[#52525b]/30 flex items-center justify-center text-xs tracking-widest text-[#a1a1aa] flex-shrink-0">IMAGE_04</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. COMING SOON HEADER */}
      <section className="w-full bg-[#0a0a0a] text-center py-10 border-b border-[#52525b]/10">
        <h2 className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-[#a1a1aa]">
          COMING SOON
        </h2>
      </section>

      {/* 6. SAME SLIDESHOW BLOCK */}
      <section className="w-full bg-[#52525b]/5 py-24 md:py-32 text-center border-b border-[#52525b]/20 overflow-hidden flex flex-col justify-center">
        <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#a1a1aa] opacity-40 mb-8">
          SAME SLIDESHOW
        </p>
        
        <div className="animate-marquee cursor-pointer">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] bg-[#52525b]/10 border-r border-y border-[#52525b]/30 flex items-center justify-center text-xs tracking-widest text-[#a1a1aa] flex-shrink-0">IMG_A</div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] bg-[#52525b]/10 border-r border-y border-[#52525b]/30 flex items-center justify-center text-xs tracking-widest text-[#a1a1aa] flex-shrink-0">IMG_B</div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] bg-[#52525b]/10 border-r border-y border-[#52525b]/30 flex items-center justify-center text-xs tracking-widest text-[#a1a1aa] flex-shrink-0">IMG_C</div>
              <div className="w-[50vw] md:w-[25vw] aspect-[4/5] bg-[#52525b]/10 border-r border-y border-[#52525b]/30 flex items-center justify-center text-xs tracking-widest text-[#a1a1aa] flex-shrink-0">IMG_D</div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. COOL FERAL TEXTURE SECTION */}
      <section className="w-full bg-[#0a0a0a] text-center py-16 md:py-24 px-6 border-b border-[#52525b]/20">
        <p className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-[#f4f4f5]/80 max-w-2xl mx-auto leading-relaxed cursor-pointer hover:text-[#f4f4f5] transition">
          COOL FERAL TEXTURE OR SMTH OR GO SHOPPING
        </p>
      </section>

      {/* 8. CATEGORY BANNERS / BOTTOM INTERFACE */}
      <section className="w-full grid grid-cols-5 text-center text-[10px] md:text-sm font-black uppercase tracking-wider bg-[#0a0a0a] border-b border-[#52525b]/20 items-stretch min-h-[15vh]">
        <div className="bg-[#52525b]/10 border-r border-[#52525b]/20 text-[#a1a1aa] flex items-center justify-center p-2 md:p-4 font-normal leading-snug">
          fluid gradient design
        </div>
        <button className="border-r border-[#52525b]/20 flex items-center justify-center p-2 md:p-4 text-[#d4d4d8] hover:bg-[#52525b]/10 transition w-full h-full">
          BESTSELLERS
        </button>
        <button className="border-r border-[#52525b]/20 flex items-center justify-center p-2 md:p-4 text-[#f4f4f5] hover:bg-[#52525b]/10 transition w-full h-full">
          TOPS
        </button>
        <button className="border-r border-[#52525b]/20 flex items-center justify-center p-2 md:p-4 text-[#d4d4d8] hover:bg-[#52525b]/10 transition w-full h-full">
          PANTS
        </button>
        <div className="bg-[#52525b]/10 text-[#a1a1aa] flex items-center justify-center p-2 md:p-4 font-normal leading-snug">
          fluid gradient design
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

      {/* 10. FOOTER ATTRIBUTION */}
      <footer className="w-full bg-[#0a0a0a] pt-10 pb-12 text-center flex flex-col items-center">
        <div className="w-[90%] max-w-4xl h-[1px] bg-[#52525b]/20 mb-8"></div>
        <div className="flex gap-4 mb-6">
          <a href="#" className="w-10 h-10 bg-[#f4f4f5] text-[#0a0a0a] flex items-center justify-center font-bold text-sm rounded-none hover:bg-[#d4d4d8] transition">ig</a>
          <a href="#" className="w-10 h-10 bg-[#f4f4f5] text-[#0a0a0a] flex items-center justify-center font-bold text-sm rounded-none hover:bg-[#d4d4d8] transition">fb</a>
        </div>
        <div className="leading-relaxed text-[10px] md:text-xs tracking-widest text-[#a1a1aa] uppercase space-y-1.5">
          <p>© 2026 FERAL. All rights reserved.</p>
          <p className="text-[#52525b] font-normal lowercase tracking-normal">made by shafbitz</p>
        </div>
      </footer>

    </div>
  );
}
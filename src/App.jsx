import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Leaf, Activity, MousePointer2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- 1. NAVBAR ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
      <div className={`transition-all duration-500 rounded-full px-6 py-4 flex items-center justify-between gap-8 ${
        scrolled ? 'bg-background/70 backdrop-blur-xl border border-muted shadow-2xl' : 'bg-transparent'
      }`}>
        <div className="font-sans font-bold text-primary tracking-tight text-xl">DR LAWN</div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-primary/70">
          <a href="#features" className="hover:text-primary transition-colors hover:-translate-y-[1px] transform">Features</a>
          <a href="#philosophy" className="hover:text-primary transition-colors hover:-translate-y-[1px] transform">Philosophy</a>
          <a href="#protocol" className="hover:text-primary transition-colors hover:-translate-y-[1px] transform">Protocol</a>
        </div>
        <a href="#contact" className="relative overflow-hidden group bg-accent text-white px-6 py-2.5 rounded-full text-sm font-medium transition-transform transform hover:scale-[1.03] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
          <span className="relative z-10 flex items-center gap-2">Consultation <ArrowUpRight size={14} /></span>
          <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
        </a>
      </div>
    </nav>
  );
};

// --- 2. HERO SECTION ---
const Hero = () => {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-text', { y: 40, opacity: 0, duration: 1, stagger: 0.1, delay: 0.2 })
      .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8 }, '-=0.4');
  }, { scope: container });

  return (
    <section ref={container} className="relative h-[100dvh] w-full flex items-end pb-32 px-8 md:px-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1589578168289-4fc6e7ad7fdb?q=80&w=2600&auto=format&fit=crop" 
          alt="Premium Dark Lawn" 
          className="w-full h-full object-cover object-center transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl">
        <h1 className="flex flex-col gap-2">
          <span className="hero-text font-sans tracking-tight font-bold text-2xl md:text-3xl lg:text-4xl text-primary/90">
            Lawn perfection meets
          </span>
          <span className="hero-text font-drama italic text-6xl md:text-8xl lg:text-[130px] leading-[0.9] tracking-tighter text-primary">
            Precision care.
          </span>
        </h1>
        <p className="hero-text mt-8 max-w-xl text-lg text-primary/70 font-sans text-balance">
          Premium lawn growing and restoration services in the Nelson/Tasman region of New Zealand.
        </p>
        <div className="hero-cta mt-10">
          <a href="#contact" className="inline-flex relative overflow-hidden group bg-accent text-white px-8 py-4 rounded-full text-base font-medium transition-transform transform hover:scale-[1.03] duration-300 shadow-[0_0_40px_rgba(74,124,89,0.2)]">
            <span className="relative z-10 pr-2">Get in touch</span>
            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
          </a>
        </div>
      </div>
    </section>
  );
};

// --- FEATURE 1: Diagnostic Shuffler ---
const ShufflerCard = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'Nutrient Optimisation', val: '98%' },
    { id: 2, title: 'Root Deepening', val: '+40mm' },
    { id: 3, title: 'Thatch Reduction', val: 'Low' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newArr = [...prev];
        const last = newArr.pop();
        newArr.unshift(last);
        return newArr;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      {cards.map((c, i) => {
        const isTop = i === 0;
        const isMiddle = i === 1;
        const yOffset = isTop ? 0 : isMiddle ? 20 : 40;
        const scale = isTop ? 1 : isMiddle ? 0.95 : 0.9;
        const opacity = isTop ? 1 : isMiddle ? 0.7 : 0.4;
        const zIndex = 3 - i;
        
        return (
          <div 
            key={c.id}
            className="absolute w-full max-w-xs bg-surface border border-muted p-6 rounded-[2rem] shadow-xl transition-all duration-700 ease-spring"
            style={{ 
              transform: `translateY(${yOffset}px) scale(${scale})`, 
              opacity, 
              zIndex 
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <Leaf className="text-accent" size={20} />
              <span className="font-mono text-xs text-primary/50">SYS_{c.id}</span>
            </div>
            <h4 className="font-sans font-bold text-lg">{c.title}</h4>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-sm text-primary/60">Metric</span>
              <span className="font-mono text-accent">{c.val}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- FEATURE 2: Telemetry Typewriter ---
const TypewriterCard = () => {
  const [text, setText] = useState('');
  const fullText = "Initiating lawn rescue protocol... \nAnalyzing soil pH... \nDetecting pathogen stress... \nDeploying corrective bio-agents... \nRestoration sequence active.";
  
  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, currentIdx));
      currentIdx++;
      if (currentIdx > fullText.length) {
        setTimeout(() => { currentIdx = 0; }, 5000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64 bg-surface border border-muted p-6 rounded-[2rem] shadow-xl flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 border-b border-muted pb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
        <span className="font-mono text-xs text-primary/70 tracking-widest uppercase">Live Feed</span>
      </div>
      <div className="font-mono text-sm text-primary/80 whitespace-pre-line flex-1">
        {text}<span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse"></span>
      </div>
    </div>
  );
};

// --- FEATURE 3: Cursor Protocol Scheduler ---
const SchedulerCard = () => {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, defaults: { ease: 'power2.inOut' } });
    tl.set('.cursor-svg', { x: 0, y: 0, scale: 1 })
      .to('.cursor-svg', { x: 120, y: 60, duration: 1.5 })
      .to('.cursor-svg', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
      .to('.day-cell', { backgroundColor: '#4A7C59', color: '#fff', duration: 0.3 }, "-=0.2")
      .to('.cursor-svg', { x: 200, y: 140, duration: 1 })
      .to('.cursor-svg', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
      .to('.save-btn', { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }, "-=0.2")
      .to('.cursor-svg', { opacity: 0, duration: 0.5 })
      .set('.day-cell', { backgroundColor: 'transparent', color: 'inherit' });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full h-64 bg-surface border border-muted p-6 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col">
      <div className="mb-4">
        <h4 className="font-sans font-bold text-lg">Custom Maintenance</h4>
        <p className="text-xs text-primary/50 mt-1">Automated scheduling</p>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-6 mt-auto">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className={`h-8 font-mono text-xs flex items-center justify-center rounded-md border border-muted ${i === 3 ? 'day-cell' : ''}`}>
            {d}
          </div>
        ))}
      </div>
      <div className="save-btn w-full bg-muted/50 py-2 rounded-lg text-center font-mono text-xs border border-muted">
        Save Protocol
      </div>
      <div className="cursor-svg absolute top-4 left-4 z-10 text-primary drop-shadow-md">
        <MousePointer2 className="fill-white" size={24} />
      </div>
    </div>
  );
};

// --- 3. FEATURES SECTION ---
const Features = () => {
  return (
    <section id="features" className="py-32 px-8 md:px-16 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-6">
          <h3 className="font-sans font-bold text-2xl">Premium lawn growth.</h3>
          <p className="text-primary/60 text-sm">Engineered density and colour optimization for luxury residential turf.</p>
          <ShufflerCard />
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="font-sans font-bold text-2xl">Lawn rescue and care.</h3>
          <p className="text-primary/60 text-sm">Systematic eradication of pathogens, weeds, and compacted soil trauma.</p>
          <TypewriterCard />
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="font-sans font-bold text-2xl">Soil tests & limits.</h3>
          <p className="text-primary/60 text-sm">Comprehensive biological profiling shaping custom fertiliser programs.</p>
          <SchedulerCard />
        </div>
      </div>
    </section>
  );
};

// --- 4. PHILOSOPHY ---
const Philosophy = () => {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from('.phil-line', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 70%',
      },
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out'
    });
  }, { scope: container });

  return (
    <section ref={container} id="philosophy" className="relative py-40 px-8 md:px-16 w-full flex items-center justify-center overflow-hidden bg-dark">
      <div className="absolute inset-0 opacity-10">
        <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Moss texture" />
      </div>
      <div className="relative z-10 max-w-5xl text-center flex flex-col gap-12">
        <h2 className="phil-line font-sans font-medium text-xl md:text-2xl text-primary/60">
          Most lawn services focus on: <span className="text-primary">temporary fixes and generic chemicals.</span>
        </h2>
        <h2 className="phil-line font-drama italic text-5xl md:text-7xl lg:text-8xl leading-none text-primary">
          We focus on: <span className="text-accent underline decoration-1 underline-offset-8">biological precision.</span>
        </h2>
      </div>
    </section>
  );
};

// --- 5. PROTOCOL (Sticky Stacking Archive) ---
const Protocol = () => {
  const container = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray('.protocol-card');
    
    cards.forEach((card, index) => {
      if (index === cards.length - 1) return; // Don't dim the last card
      
      ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        end: 'bottom top',
        endTrigger: '.protocol-container',
        pin: true,
        pinSpacing: false,
        scrub: true,
        animation: gsap.to(card, {
          scale: 0.9,
          opacity: 0.5,
          filter: 'blur(10px)',
          ease: 'none'
        })
      });
    });
  }, { scope: container });

  return (
    <section id="protocol" ref={container} className="protocol-container relative w-full pt-16 pb-32">
      {/* Background layer for cards */}
      <div className="protocol-card h-screen w-full flex items-center justify-center sticky top-0 px-6">
        <div className="w-full max-w-6xl h-[80vh] bg-surface border border-muted rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 shadow-2xl relative overflow-hidden">
          <div className="flex-1 z-10">
            <span className="font-mono text-accent text-lg mb-4 block">01</span>
            <h2 className="font-sans font-bold text-4xl md:text-6xl mb-6">Soil Architecture.</h2>
            <p className="text-primary/70 text-lg max-w-md text-balance">Deep analysis of your turf's micro-biome to establish a baseline for biological correction.</p>
          </div>
          <div className="flex-1 h-full w-full relative min-h-[300px]">
            {/* Rotating Geometric Motif */}
            <div className="absolute inset-0 flex items-center justify-center opacity-80 mix-blend-screen">
              <svg viewBox="0 0 100 100" className="w-full h-full max-w-[400px] animate-[spin_20s_linear_infinite]">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#4A7C59" strokeWidth="0.5" strokeDasharray="2 4" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#2A332A" strokeWidth="1" />
                <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="#4A7C59" strokeWidth="0.2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="protocol-card h-screen w-full flex items-center justify-center sticky top-0 px-6">
        <div className="w-full max-w-6xl h-[80vh] bg-[#0A0D0A] border border-muted rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 shadow-2xl relative overflow-hidden">
          <div className="flex-1 z-10">
            <span className="font-mono text-accent text-lg mb-4 block">02</span>
            <h2 className="font-sans font-bold text-4xl md:text-6xl mb-6">Targeted Nutrition.</h2>
            <p className="text-primary/70 text-lg max-w-md text-balance">Custom fertiliser blends engineered specifically for the distinct microclimates of Nelson/Tasman.</p>
          </div>
          <div className="flex-1 h-full w-full relative min-h-[300px]">
            {/* Scanning Laser */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
               <div className="w-full h-full relative border border-muted/30 grid grid-cols-10 grid-rows-10 gap-1 p-2">
                 {Array.from({ length: 100 }).map((_, i) => (
                   <div key={i} className="bg-muted/10 rounded-sm"></div>
                 ))}
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_15px_#4A7C59] animate-[ping_3s_linear_infinite]" style={{ animationDuration: '4s', animationName: 'scan' }}></div>
               </div>
               <style>{`
                 @keyframes scan {
                   0% { top: 0; opacity: 1; }
                   90% { top: 100%; opacity: 1; }
                   100% { top: 100%; opacity: 0; }
                 }
               `}</style>
            </div>
          </div>
        </div>
      </div>

      <div className="protocol-card h-screen w-full flex items-center justify-center sticky top-0 px-6">
        <div className="w-full max-w-6xl h-[80vh] bg-surface border border-muted rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 shadow-2xl relative overflow-hidden">
          <div className="flex-1 z-10">
            <span className="font-mono text-accent text-lg mb-4 block">03</span>
            <h2 className="font-sans font-bold text-4xl md:text-6xl mb-6">Sustained Vitality.</h2>
            <p className="text-primary/70 text-lg max-w-md text-balance">Ongoing precision maintenance ensuring resilient, premium growth year-round.</p>
          </div>
          <div className="flex-1 h-full w-full relative min-h-[300px] flex items-center justify-center">
            {/* EKG Waveform */}
            <svg viewBox="0 0 200 100" className="w-full max-w-[400px] drop-shadow-[0_0_8px_rgba(74,124,89,0.5)]">
               <path 
                 d="M 0 50 L 40 50 L 50 20 L 60 80 L 70 50 L 130 50 L 140 30 L 150 70 L 160 50 L 200 50" 
                 fill="none" 
                 stroke="#4A7C59" 
                 strokeWidth="2" 
                 className="path-anim"
               />
               <style>{`
                 .path-anim {
                   stroke-dasharray: 400;
                   stroke-dashoffset: 400;
                   animation: draw 3s ease-in-out infinite;
                 }
                 @keyframes draw {
                   0% { stroke-dashoffset: 400; }
                   50% { stroke-dashoffset: 0; }
                   100% { stroke-dashoffset: -400; }
                 }
               `}</style>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 6. CTA & FOOTER ---
const Footer = () => {
  return (
    <>
      <section id="contact" className="py-32 px-8 flex flex-col items-center justify-center text-center">
        <h2 className="font-drama italic text-5xl md:text-7xl mb-12">Begin your lawn transformation.</h2>
        <a href="mailto:hello@drlawn.co.nz" className="relative overflow-hidden group bg-primary text-background hover:text-white px-12 py-5 rounded-full text-lg font-bold transition-transform transform hover:scale-[1.03] duration-300">
          <span className="relative z-10 flex items-center gap-3">Get in touch <ArrowUpRight size={20} /></span>
          <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
        </a>
      </section>

      <footer className="bg-dark rounded-t-[4rem] px-8 md:px-16 pt-24 pb-12 mt-12 border-t border-muted">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 md:col-span-2">
            <div className="font-sans font-bold text-primary tracking-tight text-3xl mb-4">DR LAWN</div>
            <p className="text-primary/50 text-balance max-w-sm">Premium lawn growing and restoration services. Nelson/Tasman region of New Zealand.</p>
          </div>
          <div>
            <h4 className="font-mono text-sm text-primary/40 mb-6 uppercase tracking-widest">Navigation</h4>
            <ul className="flex flex-col gap-4 text-primary/80">
              <li><a href="#features" className="hover:text-accent transition-colors">Features</a></li>
              <li><a href="#philosophy" className="hover:text-accent transition-colors">Philosophy</a></li>
              <li><a href="#protocol" className="hover:text-accent transition-colors">Protocol</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-sm text-primary/40 mb-6 uppercase tracking-widest">Legal</h4>
            <ul className="flex flex-col gap-4 text-primary/80">
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-muted/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 bg-surface px-4 py-2 rounded-full border border-muted">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#4A7C59]"></div>
            <span className="font-mono text-xs text-primary/70 uppercase tracking-wider">System Operational</span>
          </div>
          <div className="font-mono text-xs text-primary/40">
            &copy; {new Date().getFullYear()} Dr Lawn. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default function App() {
  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />
      <Footer />
    </div>
  );
}

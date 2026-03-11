import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Leaf, Activity, MousePointer2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- 1. NAVBAR ---
export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
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

// --- 2. BEFORE/AFTER SLIDER ---
export const BeforeAfterSlider = () => {
  const containerRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-animation (subtle oscillation)
  useGSAP(() => {
    if (hasInteracted) return;

    const obj = { val: 50 };
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: 'power2.inOut' }
    });

    tl.to(obj, {
      val: 60,
      duration: 3,
      onUpdate: () => {
        if (!hasInteracted) setSliderPosition(obj.val);
      }
    })
    .to(obj, {
      val: 40,
      duration: 3,
      onUpdate: () => {
        if (!hasInteracted) setSliderPosition(obj.val);
      }
    });

    return () => tl.kill();
  }, { scope: containerRef, dependencies: [hasInteracted] });

  // Entrance animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.slider-content', { y: 40, opacity: 0, duration: 1, stagger: 0.15 });
  }, { scope: containerRef });

  // Drag handling with inline position calculation
  useEffect(() => {
    const container = sliderContainerRef.current;
    if (!container) return;

    let isDragging = false;

    const getPosition = (clientX) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      return Math.max(0, Math.min(100, (x / rect.width) * 100));
    };

    const onMouseDown = (e) => {
      e.preventDefault();
      isDragging = true;
      setHasInteracted(true);
      setSliderPosition(getPosition(e.clientX));
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      setSliderPosition(getPosition(e.clientX));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e) => {
      isDragging = true;
      setHasInteracted(true);
      setSliderPosition(getPosition(e.touches[0].clientX));
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      setSliderPosition(getPosition(e.touches[0].clientX));
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative py-24 px-8 md:px-16 w-full bg-dark">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="slider-content text-center mb-12">
          <span className="font-mono text-accent text-sm tracking-widest uppercase block mb-4">
            Transformation
          </span>
          <h2 className="font-drama italic text-5xl md:text-7xl text-primary">
            See the difference.
          </h2>
        </div>

        {/* Slider Container */}
        <div
          ref={sliderContainerRef}
          className="slider-content slider-container relative w-full aspect-[4/3] md:aspect-[16/10] rounded-[2rem] overflow-hidden border border-muted shadow-2xl cursor-ew-resize select-none"
        >
          {/* After Image (Background - full width) */}
          <img
            src="/images/house1_after.webp"
            alt="After lawn treatment"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable="false"
          />

          {/* Before Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src="/images/house1_before.webp"
              alt="Before lawn treatment"
              className="absolute top-0 left-0 h-full object-cover"
              style={{
                width: sliderContainerRef.current?.offsetWidth || '100vw',
                maxWidth: 'none'
              }}
              draggable="false"
            />
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary/80 shadow-[0_0_20px_rgba(232,237,232,0.3)] pointer-events-none"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            {/* Circular Drag Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary border-4 border-background flex items-center justify-center shadow-xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-background">
                <polyline points="15 18 9 12 15 6" />
                <polyline points="9 18 15 12 9 6" transform="translate(6, 0)" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full font-mono text-xs text-primary/80 uppercase tracking-wider pointer-events-none">
            Before
          </div>
          <div className="absolute bottom-4 right-4 bg-accent/90 backdrop-blur-sm px-4 py-2 rounded-full font-mono text-xs text-white uppercase tracking-wider pointer-events-none">
            After
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 3. HERO SECTION ---
export const Hero = () => {
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
export const ShufflerCard = () => {
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
export const TypewriterCard = () => {
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
export const SchedulerCard = () => {
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

export const Philosophy = () => {
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

// --- FIX: Stacking Archive Scroll Overlap Bug Resolved via master-pinning
export const Protocol = () => {
  const container = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray('.protocol-card');
    
    // Set explicit starting z-indexes and move cards 2 & 3 completely offscreen
    cards.forEach((card, i) => {
      gsap.set(card, { zIndex: i + 1 });
      if (i !== 0) {
        gsap.set(card, { yPercent: 100 });
      }
    });

    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: `+=${cards.length * 100}%`,
          pin: true,
          scrub: 1,
        }
      });

      cards.forEach((card, index) => {
        if (index === 0) return; 

        // Animate current card coming up from bottom
        tl.to(card, {
          yPercent: 0,
          ease: 'none',
        });

        // Concurrently animate the previous card receding into the background
        tl.to(cards[index - 1], {
          scale: 0.9,
          opacity: 0.3, // Deepened the fade for better overlapping contrast
          filter: 'blur(10px)',
          ease: 'none',
        }, '<');
      });
    });

  }, { scope: container });

  return (
    <section id="protocol" className="relative w-full pt-16">
       <div ref={container} className="protocol-container h-screen w-full relative overflow-hidden">
        {/* Card 1 */}
        <div className="protocol-card absolute inset-0 w-full flex items-center justify-center px-6">
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

        {/* Card 2 -> FIX: Refined scanning animation via translation rather than top spacing */}
        <div className="protocol-card absolute inset-0 w-full flex items-center justify-center px-6">
          <div className="w-full max-w-6xl h-[80vh] bg-[#0A0D0A] border border-muted rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 shadow-2xl relative overflow-hidden">
            <div className="flex-1 z-10">
              <span className="font-mono text-accent text-lg mb-4 block">02</span>
              <h2 className="font-sans font-bold text-4xl md:text-6xl mb-6">Targeted Nutrition.</h2>
              <p className="text-primary/70 text-lg max-w-md text-balance">Custom fertiliser blends engineered specifically for the distinct microclimates of Nelson/Tasman.</p>
            </div>
            <div className="flex-1 h-full w-full relative min-h-[300px]">
              {/* Scanning Laser -> Fixed Glitch */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                 <div className="w-full h-full relative border border-muted/30 grid grid-cols-10 grid-rows-10 gap-1 p-2 overflow-hidden">
                   {Array.from({ length: 100 }).map((_, i) => (
                     <div key={i} className="bg-muted/10 rounded-sm"></div>
                   ))}
                   <div className="absolute top-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_15px_#4A7C59]" 
                     style={{ 
                       animation: 'smooth-scan 4s linear infinite'
                     }}>
                   </div>
                 </div>
                 <style>{`
                   @keyframes smooth-scan {
                     0% { transform: translateY(-10px); opacity: 0; }
                     5% { opacity: 1; }
                     95% { opacity: 1; }
                     100% { transform: translateY(105%); opacity: 0; }
                   }
                 `}</style>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="protocol-card absolute inset-0 w-full flex items-center justify-center px-6">
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
      </div>
    </section>
  );
};

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Camera, Video, Home, Heart, Briefcase, Map, Zap, Shield, Award,
  Star, ChevronDown, Menu, X, Instagram, Youtube, MessageCircle,
  Phone, Mail, MapPin, ArrowRight, Play, CheckCircle
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; max: number; }

// ── Data ──────────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Camera,    title: 'Aerial Photography',  desc: 'High-resolution stills from the sky for landscapes, architecture, and commercial shoots.' },
  { icon: Video,     title: 'Aerial Videography',  desc: '4K cinematic footage with smooth movements that elevate every story you tell.' },
  { icon: Home,      title: 'Real Estate Shoots',  desc: 'Showcase properties from stunning angles that drive buyer interest and close deals.' },
  { icon: Heart,     title: 'Weddings & Events',   desc: 'Romantic sweeping aerial coverage of your most precious moments.' },
  { icon: Briefcase, title: 'Corporate Films',     desc: 'Powerful brand narratives with cinematic aerial sequences for marketing.' },
  { icon: Zap,       title: 'FPV Drone Shoots',    desc: 'High-adrenaline first-person view footage for sports and immersive content.' },
  { icon: Map,       title: 'Drone Mapping',       desc: 'Precision surveys, 3D models, and topographic mapping for industries.' },
];

const PORTFOLIO = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', title: 'Mountain Landscape', cat: 'Aerial Photography' },
  { src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', title: 'Coastal Resort',     cat: 'Real Estate' },
  { src: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80', title: 'Urban Cityscape',   cat: 'Videography' },
  { src: 'https://images.unsplash.com/photo-1531767153987-4b8cf2f27d28?w=600&q=80', title: 'Wedding Ceremony',  cat: 'Wedding' },
  { src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80', title: 'City Skyline',      cat: 'Corporate' },
  { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80', title: 'Forest Canopy',     cat: 'Aerial Photography' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80', title: 'Valley Survey',     cat: 'Drone Survey' },
  { src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80', title: 'Beach Coastline',   cat: 'Videography' },
];

const STATS = [
  { value: 100, suffix: '+', label: 'Projects Delivered', icon: Award },
  { value: 4,   suffix: 'K', label: 'Cinematic Quality',  icon: Video },
  { value: 50,  suffix: '+', label: 'Cities Covered',     icon: MapPin },
  { value: 5,   suffix: '★', label: 'Client Rating',      icon: Star },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma',  role: 'Real Estate Developer, Mumbai', text: 'De Drone World transformed how we showcase properties. The aerial shots were absolutely cinematic — our conversions jumped by 40%.', rating: 5 },
  { name: 'Priya Mehta',   role: 'Wedding Planner, Delhi',        text: "The drone footage from our client's wedding was straight out of a Bollywood film. Every couple now asks for aerial coverage.", rating: 5 },
  { name: 'Arjun Nair',    role: 'Brand Director, Bangalore',     text: 'Our corporate film received international recognition, largely thanks to the stunning aerial sequences by De Drone World.', rating: 5 },
];

// ── Hook: scroll-triggered visibility ────────────────────────────────────────
function useVisible(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold });
    ob.observe(el);
    return () => ob.disconnect();
  }, [threshold]);
  return { ref, vis };
}

// ── Animated Counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix, vis }: { target: number; suffix: string; vis: boolean }) {
  const [n, setN] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!vis || done.current) return;
    done.current = true;
    let cur = 0; const step = target / 55;
    const t = setInterval(() => { cur += step; if (cur >= target) { setN(target); clearInterval(t); } else setN(Math.floor(cur)); }, 35);
    return () => clearInterval(t);
  }, [vis, target]);
  return <>{n}{suffix}</>;
}

// ── Particle Canvas ───────────────────────────────────────────────────────────
function Particles() {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    const ps: Particle[] = [];
    let raf: number;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const frame = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      if (ps.length < 70) ps.push({ x: Math.random()*c.width, y: Math.random()*c.height, vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35, size: Math.random()*1.4+.3, alpha: Math.random()*.5+.1, life: 0, max: Math.random()*250+120 });
      for (let i = ps.length-1; i >= 0; i--) {
        const p = ps[i]; p.x += p.vx; p.y += p.vy; p.life++;
        const fade = p.life < 25 ? p.life/25 : p.life > p.max-25 ? (p.max-p.life)/25 : 1;
        ctx.save(); ctx.globalAlpha = p.alpha * fade; ctx.fillStyle = '#00d4ff'; ctx.shadowBlur = 5; ctx.shadowColor = '#00d4ff';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); ctx.restore();
        if (p.life >= p.max) ps.splice(i,1);
      }
      for (let i=0;i<ps.length;i++) for (let j=i+1;j<ps.length;j++) {
        const d = Math.hypot(ps[i].x-ps[j].x, ps[i].y-ps[j].y);
        if (d < 90) { ctx.save(); ctx.globalAlpha=(1-d/90)*.1; ctx.strokeStyle='#00d4ff'; ctx.lineWidth=.5; ctx.beginPath(); ctx.moveTo(ps[i].x,ps[i].y); ctx.lineTo(ps[j].x,ps[j].y); ctx.stroke(); ctx.restore(); }
      }
      raf = requestAnimationFrame(frame);
    };
    frame();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={cv} id="particles" />;
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 50); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn); }, []);
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false); };
  const links = [['home','Home'],['about','About'],['services','Services'],['portfolio','Portfolio'],['why-us','Why Us'],['testimonials','Testimonials'],['contact','Contact']];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <button onClick={() => window.scrollTo({top:0,behavior:'smooth'})} className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-[#00d4ff] rotate-45" style={{boxShadow:'0 0 10px rgba(0,212,255,.6)'}} />
            <Zap size={14} className="text-[#00d4ff] relative z-10" />
          </div>
          <div className="text-left">
            <div className="font-orbitron font-bold text-white text-xs tracking-widest leading-none">DE DRONE WORLD</div>
            <div className="font-orbitron text-[#00d4ff] text-[9px] tracking-[.3em] leading-none mt-1">CINEMATIC AERIAL</div>
          </div>
        </button>
        <div className="hidden lg:flex items-center gap-7">
          {links.map(([id,label]) => (
            <button key={id} onClick={() => go(id)} className="relative text-[10px] tracking-widest uppercase text-gray-400 hover:text-[#00d4ff] font-inter transition-colors duration-300 group">
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00d4ff] group-hover:w-full transition-all duration-300" />
            </button>
          ))}
          <button onClick={() => go('contact')} className="neon-btn text-[10px] px-5 py-3">Book Now</button>
        </div>
        <button className="lg:hidden text-white p-2" onClick={() => setOpen(!open)}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-[#00d4ff]/10" style={{background:'rgba(10,10,10,.98)',backdropFilter:'blur(20px)'}}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {links.map(([id,label]) => <button key={id} onClick={() => go(id)} className="text-gray-300 hover:text-[#00d4ff] text-xs tracking-widest uppercase font-inter text-left transition-colors">{label}</button>)}
            <button onClick={() => go('contact')} className="neon-btn text-[10px] mt-1">Book Now</button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const [py, setPy] = useState(0);
  useEffect(() => { const fn = () => setPy(window.scrollY*.4); window.addEventListener('scroll', fn, {passive:true}); return () => window.removeEventListener('scroll', fn); }, []);
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg grid-tex">
      <Particles />
      <div className="absolute inset-0 z-0" style={{transform:`translateY(${py}px)`,willChange:'transform'}}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-[#0a0a0a] z-10" />
        <img src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1600&q=80" alt="" className="w-full h-full object-cover opacity-20" />
      </div>
      {/* Rotating rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="rotate-slow w-[640px] h-[640px] border border-[#00d4ff]/5 rounded-full absolute" />
        <div className="rotate-slow-rev w-[420px] h-[420px] border border-[#00d4ff]/8 rounded-full absolute" />
      </div>
      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <span className="section-label mb-6 block">Cinematic Aerial Intelligence</span>
        <h1 className="font-orbitron font-black leading-[1.05] mb-5" style={{fontSize:'clamp(48px,8vw,96px)'}}>
          <span className="block text-white">DE DRONE</span>
          <span className="block text-glow" style={{color:'#00d4ff'}}>WORLD</span>
        </h1>
        <p className="font-inter text-gray-300 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          India's premier cinematic aerial intelligence. DGCA certified pilots delivering 4K drone cinematography across the nation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="neon-btn" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Book a Shoot</button>
          <button className="neon-btn-ghost" onClick={() => document.getElementById('portfolio')?.scrollIntoView({behavior:'smooth'})}><Play size={13}/>View Portfolio</button>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {['DGCA Certified','Pan India','100+ Projects','4K Quality'].map(b => (
            <div key={b} className="flex items-center gap-2 text-gray-400 text-[10px] tracking-widest uppercase font-inter">
              <CheckCircle size={11} className="text-[#00d4ff]"/>{b}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 bounce-scroll">
        <span className="text-[#00d4ff]/50 text-[9px] tracking-widest uppercase font-inter">Scroll</span>
        <ChevronDown size={18} className="text-[#00d4ff]/50"/>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  const {ref, vis} = useVisible();
  return (
    <section id="about" ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.03)'}} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className={`ai-in ${vis?'ai-visible':''} ai-d1`}>
          <div className="relative">
            <div className="relative overflow-hidden" style={{clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))'}}>
              <img src="https://images.unsplash.com/photo-1531767153987-4b8cf2f27d28?w=700&q=80" alt="Drone pilot" className="w-full h-[460px] object-cover"/>
              <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(10,10,10,.5) 0%,transparent 60%,rgba(0,212,255,.06) 100%)'}}/>
            </div>
            <div className="absolute -bottom-5 -right-5 p-5 border border-[#00d4ff]/20" style={{background:'#1a1a1a',clipPath:'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)'}}>
              <div className="font-orbitron text-[#00d4ff] text-3xl font-black">5+</div>
              <div className="font-inter text-gray-400 text-[10px] tracking-wider uppercase mt-1">Years of Excellence</div>
            </div>
            <div className="absolute -top-3 -left-3 w-10 h-10 border-l-2 border-t-2 border-[#00d4ff]"/>
            <div className="absolute -bottom-3 -right-10 w-10 h-10 border-r-2 border-b-2 border-[#00d4ff]"/>
          </div>
        </div>
        {/* Text */}
        <div className="space-y-5">
          <div className={`ai-in ${vis?'ai-visible':''} ai-d2`}>
            <span className="section-label">About Us</span>
            <h2 className="section-title">We Capture India<br/><span style={{color:'#00d4ff'}}>From Above</span></h2>
            <div className="w-10 h-0.5 bg-[#00d4ff] mt-4" style={{boxShadow:'0 0 8px rgba(0,212,255,.8)'}}/>
          </div>
          <div className={`space-y-3 ai-in ${vis?'ai-visible':''} ai-d3`}>
            <p className="font-inter text-gray-300 text-sm leading-relaxed">De Drone World is India's leading cinematic aerial intelligence company. We blend cutting-edge drone technology with a filmmaker's eye to create visuals that don't just capture moments — they tell stories.</p>
            <p className="font-inter text-gray-400 text-sm leading-relaxed">Our DGCA certified pilots operate across the Indian subcontinent — from the Himalayas to Kerala, Rajasthan's deserts to Bangalore's tech corridors.</p>
          </div>
          <div className={`grid grid-cols-2 gap-3 ai-in ${vis?'ai-visible':''} ai-d4`}>
            {[['DGCA Licensed & Insured',Shield],['Award-Winning Shots',Award],['Pan India Operations',MapPin],['Deadline Guaranteed',CheckCircle]].map(([t,I]) => {
              const Icon = I as React.ElementType;
              return (
                <div key={t as string} className="flex items-center gap-3">
                  <Icon size={14} className="text-[#00d4ff] flex-shrink-0"/>
                  <span className="font-inter text-gray-300 text-xs">{t as string}</span>
                </div>
              );
            })}
          </div>
          <div className={`ai-in ${vis?'ai-visible':''} ai-d5`}>
            <button className="neon-btn-ghost" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Get in Touch <ArrowRight size={13}/></button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────
function Services() {
  const {ref, vis} = useVisible();
  return (
    <section id="services" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#080808'}}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.015)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Our Services</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">From artistic aerial photography to precision drone surveys — every aerial need, unmatched professionalism.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SERVICES.map(({icon:Icon, title, desc}, i) => (
            <div key={title} className={`service-card ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,7)}`}>
              <div className="relative w-11 h-11 flex items-center justify-center mb-4">
                <div className="absolute inset-0 border border-[#00d4ff]/25 bg-[#00d4ff]/8 rotate-45"/>
                <Icon size={18} className="text-[#00d4ff] relative z-10"/>
              </div>
              <h3 className="font-orbitron font-semibold text-white text-xs mb-2 leading-tight">{title}</h3>
              <p className="font-inter text-gray-400 text-xs leading-relaxed">{desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[#00d4ff] text-xs font-inter">
                <span>Learn more</span><ArrowRight size={10}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Portfolio ─────────────────────────────────────────────────────────────────
function Portfolio() {
  const {ref, vis} = useVisible();
  const [filter, setFilter] = useState('All');
  const cats = ['All','Aerial Photography','Videography','Real Estate','Wedding'];
  const items = filter === 'All' ? PORTFOLIO : PORTFOLIO.filter(p => p.cat === filter);
  return (
    <section id="portfolio" ref={ref} className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-10 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Our Work</span>
          <h2 className="section-title">Portfolio</h2>
          <div className="glow-line"/>
        </div>
        <div className={`flex flex-wrap justify-center gap-3 mb-9 ai-in ${vis?'ai-visible':''} ai-d2`}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-5 py-2 text-[10px] tracking-widest uppercase font-inter border transition-all duration-300 ${filter===c ? 'border-[#00d4ff] text-[#00d4ff] bg-[#00d4ff]/10' : 'border-gray-700 text-gray-400 hover:border-[#00d4ff]/40 hover:text-gray-200'}`}
              style={filter===c?{boxShadow:'0 0 12px rgba(0,212,255,.2)'}:{}}>
              {c}
            </button>
          ))}
        </div>
        <div className={`masonry ai-in ${vis?'ai-visible':''} ai-d3`}>
          {items.map(({src, title, cat}) => (
            <div key={src} className="portfolio-wrap">
              <img src={src} alt={title} loading="lazy" className="w-full object-cover"/>
              <div className="portfolio-overlay">
                <div>
                  <p className="font-orbitron text-white text-xs font-semibold">{title}</p>
                  <p className="font-inter text-[#00d4ff] text-[10px] tracking-widest uppercase mt-1">{cat}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={`text-center mt-10 ai-in ${vis?'ai-visible':''} ai-d4`}>
          <button className="neon-btn-ghost mx-auto">View Full Portfolio <ArrowRight size={13}/></button>
        </div>
      </div>
    </section>
  );
}

// ── Why Us ────────────────────────────────────────────────────────────────────
function WhyUs() {
  const {ref, vis} = useVisible();
  return (
    <section id="why-us" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#080808'}}>
      <div className="absolute inset-0 grid-tex opacity-40"/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-title">Built for Excellence</h2>
          <div className="glow-line"/>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {STATS.map(({value,suffix,label,icon:Icon},i) => (
            <div key={label} className={`text-center p-7 border border-gray-800 bg-[#111]/50 hover:border-[#00d4ff]/30 transition-all duration-400 group ai-in ${vis?'ai-visible':''} ai-d${i+1}`}
              style={{clipPath:'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))'}}>
              <Icon size={22} className="text-[#00d4ff] mx-auto mb-3 group-hover:scale-110 transition-transform"/>
              <div className="font-orbitron text-3xl font-black text-white mb-1 text-glow">
                <Counter target={value} suffix={suffix} vis={vis}/>
              </div>
              <div className="font-inter text-gray-400 text-[10px] tracking-widest uppercase">{label}</div>
            </div>
          ))}
        </div>
        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            [Shield,   'DGCA Licensed Pilots',      'All pilots hold valid DGCA remote pilot certificates. Every flight is legal, safe, and insured.'],
            [Video,    '4K Cinematic Cameras',       'DJI Mavic 3 Cine, Inspire 2 with X7, and custom FPV rigs delivering broadcast-quality footage.'],
            [Zap,      'Fast Turnaround',            'Edited footage delivered within 5–7 business days. Rushed projects accommodated on request.'],
            [MapPin,   'Pan India Operations',       'From Kashmir to Kanyakumari — we operate across all 28 states with necessary local permits.'],
            [Award,    'Award-Winning Work',         'Our work has been featured in national publications and recognised at industry film festivals.'],
            [CheckCircle,'End-to-End Service',       'Concept, logistics, shoot, edit — we handle everything so you can focus on your vision.'],
          ].map(([Icon, title, desc], i) => {
            const I = Icon as React.ElementType;
            return (
              <div key={title as string} className={`flex gap-4 p-5 border border-gray-800/50 bg-[#111]/30 hover:border-[#00d4ff]/20 transition-all duration-400 ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,6)}`}>
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/5">
                  <I size={16} className="text-[#00d4ff]"/>
                </div>
                <div>
                  <h3 className="font-orbitron text-white text-xs font-semibold mb-1">{title as string}</h3>
                  <p className="font-inter text-gray-400 text-xs leading-relaxed">{desc as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials() {
  const {ref, vis} = useVisible();
  const [active, setActive] = useState(0);
  const next = useCallback(() => setActive(a => (a+1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setActive(a => (a-1+TESTIMONIALS.length) % TESTIMONIALS.length), []);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);
  return (
    <section id="testimonials" ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.03)'}}/>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.025)'}}/>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Client Stories</span>
          <h2 className="section-title">Testimonials</h2>
          <div className="glow-line"/>
        </div>
        <div className={`ai-in ${vis?'ai-visible':''} ai-d2`}>
          <div className="relative p-10 border border-gray-800 bg-[#111]/50 text-center"
            style={{clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))'}}>
            <div className="font-orbitron text-7xl text-[#00d4ff]/8 absolute top-3 left-6 leading-none select-none">"</div>
            <div className="flex justify-center mb-4">
              {Array.from({length: TESTIMONIALS[active].rating}).map((_,i) => <Star key={i} size={13} className="text-[#00d4ff] fill-[#00d4ff]"/>)}
            </div>
            <blockquote className="font-inter text-gray-200 text-base leading-relaxed mb-7 max-w-2xl mx-auto relative z-10">
              "{TESTIMONIALS[active].text}"
            </blockquote>
            <div className="font-orbitron text-white text-sm font-semibold">{TESTIMONIALS[active].name}</div>
            <div className="font-inter text-[#00d4ff] text-[10px] tracking-widest uppercase mt-1">{TESTIMONIALS[active].role}</div>
          </div>
          {/* Controls */}
          <div className="flex items-center justify-center gap-5 mt-7">
            <button onClick={prev} className="w-9 h-9 border border-gray-700 hover:border-[#00d4ff] flex items-center justify-center text-gray-400 hover:text-[#00d4ff] transition-all duration-300">
              <ArrowRight size={14} className="rotate-180"/>
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_,i) => (
                <button key={i} onClick={() => setActive(i)}
                  className="h-1 transition-all duration-300"
                  style={{width: i===active?28:8, background: i===active?'#00d4ff':'#374151', boxShadow: i===active?'0 0 8px rgba(0,212,255,.6)':undefined}}/>
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 border border-gray-700 hover:border-[#00d4ff] flex items-center justify-center text-gray-400 hover:text-[#00d4ff] transition-all duration-300">
              <ArrowRight size={14}/>
            </button>
          </div>
          {/* Mini cards */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {TESTIMONIALS.map((t,i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`p-3 border text-left transition-all duration-300 ${i===active?'border-[#00d4ff]/50 bg-[#00d4ff]/5':'border-gray-800 hover:border-gray-700'}`}>
                <div className="font-orbitron text-white text-[10px] font-semibold truncate">{t.name}</div>
                <div className="font-inter text-gray-500 text-[10px] mt-0.5 truncate">{t.role}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const {ref, vis} = useVisible();
  const [form, setForm] = useState({name:'',email:'',phone:'',service:'',message:''});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    setTimeout(() => { setBusy(false); setSent(true); }, 1600);
  };
  return (
    <section id="contact" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#060606'}}>
      <div className="absolute inset-0 grid-tex opacity-25"/>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[500px] h-48 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.04)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Get Started</span>
          <h2 className="section-title">Book a Shoot</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-md mx-auto leading-relaxed">Fill in your details and our team will get back to you within 24 hours.</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className={`lg:col-span-2 space-y-7 ai-in ${vis?'ai-visible':''} ai-d1`}>
            <div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-5">Contact Information</h3>
              <div className="space-y-5">
                {[[Phone,'Phone','+91 98765 43210'],[Mail,'Email','hello@dedroneworld.in'],[MapPin,'Base','Mumbai, India — Pan India']].map(([I,label,val]) => {
                  const Icon = I as React.ElementType;
                  return (
                    <div key={label as string} className="flex items-start gap-4">
                      <div className="w-8 h-8 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/5 flex-shrink-0 mt-0.5">
                        <Icon size={13} className="text-[#00d4ff]"/>
                      </div>
                      <div>
                        <div className="font-inter text-gray-500 text-[10px] uppercase tracking-wider">{label as string}</div>
                        <div className="font-inter text-gray-200 text-sm mt-0.5">{val as string}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border border-[#00d4ff]/15" style={{background:'rgba(0,212,255,.02)'}}>
              <p className="font-inter text-gray-300 text-xs leading-relaxed">We typically respond within <span className="text-[#00d4ff] font-semibold">24 hours</span>. For urgent shoots, call or WhatsApp directly.</p>
            </div>
            <div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-3">Follow Our Work</h3>
              <div className="flex gap-3">
                {[[Instagram,'Instagram'],[Youtube,'YouTube'],[MessageCircle,'WhatsApp']].map(([I,label]) => {
                  const Icon = I as React.ElementType;
                  return (
                    <a key={label as string} href="#" title={label as string}
                      className="w-9 h-9 flex items-center justify-center border border-gray-700 hover:border-[#00d4ff] hover:bg-[#00d4ff]/10 text-gray-400 hover:text-[#00d4ff] transition-all duration-300">
                      <Icon size={14}/>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Form */}
          <div className={`lg:col-span-3 ai-in ${vis?'ai-visible':''} ai-d2`}>
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center p-12 border border-[#00d4ff]/20 h-full" style={{background:'rgba(0,212,255,.03)',clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,0 100%)'}}>
                <CheckCircle size={44} className="text-[#00d4ff] mb-4"/>
                <h3 className="font-orbitron text-white text-lg font-bold mb-2">Request Sent!</h3>
                <p className="font-inter text-gray-300 text-sm">Our team will contact you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="neon-btn-ghost mt-6 text-[10px] px-5 py-3">Send Another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Full Name *</label>
                    <input type="text" required placeholder="Your name" className="form-field" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Email *</label>
                    <input type="email" required placeholder="your@email.com" className="form-field" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}/>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Phone</label>
                    <input type="tel" placeholder="+91 XXXXX XXXXX" className="form-field" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Service *</label>
                    <select required className="form-field" value={form.service} onChange={e => setForm(f=>({...f,service:e.target.value}))}>
                      <option value="">Select service</option>
                      {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Project Details</label>
                  <textarea rows={5} placeholder="Tell us about your project, location, date, requirements..." className="form-field resize-none" value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))}/>
                </div>
                <button type="submit" disabled={busy} className="neon-btn w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  {busy ? 'Sending...' : <><ArrowRight size={13}/>Submit Request</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  return (
    <footer className="bg-[#111] border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <button onClick={() => window.scrollTo({top:0,behavior:'smooth'})} className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-[#00d4ff] rotate-45" style={{boxShadow:'0 0 10px rgba(0,212,255,.5)'}}/>
                <Zap size={14} className="text-[#00d4ff] relative z-10"/>
              </div>
              <div>
                <div className="font-orbitron font-bold text-white text-xs tracking-wider leading-none">DE DRONE WORLD</div>
                <div className="font-inter text-[#00d4ff] text-[9px] tracking-[.3em] mt-1">CINEMATIC AERIAL INTELLIGENCE</div>
              </div>
            </button>
            <p className="font-inter text-gray-400 text-xs leading-relaxed max-w-xs">India's premier drone cinematography company. DGCA certified. Pan India operations. Unmatched aerial visuals.</p>
            <div className="flex gap-3 mt-5">
              {[[Instagram,'Instagram'],[Youtube,'YouTube'],[MessageCircle,'WhatsApp']].map(([I,label]) => {
                const Icon = I as React.ElementType;
                return <a key={label as string} href="#" title={label as string} className="w-8 h-8 flex items-center justify-center border border-gray-700 hover:border-[#00d4ff] hover:bg-[#00d4ff]/10 text-gray-500 hover:text-[#00d4ff] transition-all duration-300"><Icon size={13}/></a>;
              })}
            </div>
          </div>
          <div>
            <h4 className="font-orbitron text-white text-[10px] font-semibold tracking-widest uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[['home','Home'],['about','About'],['services','Services'],['portfolio','Portfolio'],['contact','Contact']].map(([id,label]) => (
                <li key={id}><button onClick={() => go(id)} className="font-inter text-gray-400 hover:text-[#00d4ff] text-xs transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-3 h-px bg-gray-700 group-hover:bg-[#00d4ff] group-hover:w-5 transition-all duration-300"/>{label}
                </button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-orbitron text-white text-[10px] font-semibold tracking-widest uppercase mb-5">Services</h4>
            <ul className="space-y-3">
              {SERVICES.slice(0,5).map(s => (
                <li key={s.title}><a href="#" className="font-inter text-gray-400 hover:text-[#00d4ff] text-xs transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-3 h-px bg-gray-700 group-hover:bg-[#00d4ff] group-hover:w-5 transition-all duration-300"/>{s.title}
                </a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="py-5 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-inter text-gray-500 text-[11px]">© {new Date().getFullYear()} De Drone World. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy','Terms of Service'].map(l => <a key={l} href="#" className="font-inter text-gray-500 hover:text-[#00d4ff] text-[11px] transition-colors duration-300">{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">
      <Navbar/>
      <Hero/>
      <About/>
      <Services/>
      <Portfolio/>
      <WhyUs/>
      <Testimonials/>
      <Contact/>
      <Footer/>
    </div>
  );
}

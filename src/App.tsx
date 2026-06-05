import { useEffect, useRef, useState, useCallback } from 'react';
import {
  GraduationCap, Camera, Map, Leaf, Cpu, Eye, Zap, Shield, Award,
  Star, ChevronDown, Menu, X, Instagram, Youtube, Facebook, Linkedin,
  Phone, Mail, MapPin, ArrowRight, CheckCircle, Users, Clock,
  Building2, Handshake, Home, BookOpen, Factory, MessageCircle, Play,
  TrendingUp, Sprout, Search, Lock, Film
} from 'lucide-react';

interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; max: number; }

// ── Real Unsplash images matched to each section ──────────────────────────────
const HERO_BG = 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1600&q=80';

const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1531767153987-4b8cf2f27d28?w=600&q=80', label: 'Pilot Training' },
  { src: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80', label: 'Aerial Cinematography' },
  { src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', label: 'Real Estate Survey' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', label: 'Landscape Mapping' },
  { src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80', label: 'Urban Operations' },
  { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80', label: 'Forest Survey' },
];

const SERVICES_WITH_IMG = [
  { icon: GraduationCap, title: 'Drone Pilot Training',     desc: 'DGCA-approved Remote Pilot Training with guaranteed placement assistance.',            img: 'https://images.unsplash.com/photo-1531767153987-4b8cf2f27d28?w=500&q=80' },
  { icon: Leaf,           title: 'Agriculture Solutions',   desc: 'Drone-based precision farming, crop monitoring, NDVI analysis & spraying.',             img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&q=80' },
  { icon: Camera,         title: 'Aerial Cinematography',  desc: '4K/8K cinematic footage for films, weddings, events & commercial productions.',         img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80' },
  { icon: Map,            title: '3D Mapping & Survey',    desc: 'High-precision photogrammetry, 3D modeling & topographic surveys.',                     img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80' },
  { icon: Cpu,            title: 'Industrial Inspection',  desc: 'Thermal & visual inspection of solar panels, wind turbines, and power lines.',           img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80' },
  { icon: Eye,            title: 'Surveillance & Security','desc': 'Advanced aerial surveillance and perimeter security for enterprises and events.',      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80' },
];

const TRAINING_CENTERS = [
  { name: 'Hindustan College of Engineering', location: 'Coimbatore, Tamil Nadu', img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80' },
  { name: 'Vaigai Engineering College',       location: 'Madurai, Tamil Nadu',    img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&q=80' },
];

const CURRICULUM_DOCS = [
  { label: 'Pilot Training Curriculum',         color: '#00d4ff' },
  { label: 'DGCA Registration Certificate',     color: '#22c55e' },
  { label: 'A Copy of UAS Pilot Certificate',   color: '#f59e0b' },
  { label: 'Certificate of Qualification',      color: '#8b5cf6' },
];

const IMPACT_USES = [
  { icon: Sprout,   title: 'Agriculture',  desc: 'Crop monitoring, pesticide spraying, and yield prediction for modern farming.', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80' },
  { icon: Film,     title: 'Events',       desc: 'Professional aerial coverage for weddings, concerts, and live events.',           img: 'https://images.unsplash.com/photo-1531767153987-4b8cf2f27d28?w=400&q=80' },
  { icon: Search,   title: 'Inspection',   desc: 'Industrial asset inspection — solar, wind turbines, power infrastructure.',      img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80' },
  { icon: Map,      title: 'Survey & Mapping', desc: 'High-precision topographic surveys and 3D terrain modeling.',               img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
  { icon: Lock,     title: 'Security',     desc: 'Perimeter surveillance and crowd management for secured operations.',            img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
];

const STATS = [
  { value: 370, suffix: '+', label: 'Trained Pilots' },
  { value: 50,  suffix: '+', label: 'Expert Mentors' },
  { value: 3,   suffix: ' Days', label: 'Min. Course' },
  { value: 6,   suffix: ' Years', label: 'Experience' },
  { value: 7,   suffix: ' Lakh', label: 'Avg. Package' },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma',    role: 'Certified Drone Pilot, Batch 2024',  text: 'The training at De Drone World was exceptional. The instructors are truly world-class, and the hands-on experience with real drones gave me the confidence to fly professionally.', rating: 5 },
  { name: 'Priya Venkatesh', role: 'Agricultural Drone Specialist',      text: 'Being from a non-aviation background, I was nervous. But the team made everything easy to understand. The simulators and practical sessions are top-notch. Got placed immediately!', rating: 5 },
  { name: 'Arun Kumar',      role: 'Enterprise Drone Operator',          text: 'The DGCA certification process was seamless with De Drone World. Their partnership with IGRUA speaks volumes. The accommodation made my stay comfortable throughout the program.', rating: 5 },
];

const PARTNERS = [
  { name: 'IGRUA',                       img: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=60' },
  { name: 'Drone Destination',           img: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200&q=60' },
  { name: 'Hindustan College of Engg',   img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=60' },
  { name: 'Vaigai Engineering College',  img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&q=60' },
  { name: 'TSAW Drones',                 img: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=200&q=60' },
];

const WHY_US = [
  { icon: MapPin,        title: 'Multiple Training Centers', desc: 'Coimbatore & Madurai — premier institutions with state-of-the-art facilities.' },
  { icon: Handshake,     title: 'Guaranteed Placement',      desc: 'Placement assistance for all course participants with industry partners.' },
  { icon: GraduationCap, title: 'DGCA Approved Instructors', desc: 'Learn from experienced DGCA-approved instructors with real field expertise.' },
  { icon: Award,         title: 'IGRUA Collaboration',       desc: 'Partnership with India\'s premier flying training institute & Drone Destination.' },
  { icon: Building2,     title: 'World-class Infrastructure',desc: 'Best-in-class simulators, smart classrooms, and dedicated flying ground area.' },
  { icon: Home,          title: 'Accommodation Available',   desc: 'AC rooms with healthy food options for outstation students within campus.' },
];

// ── Hook ──────────────────────────────────────────────────────────────────────
function useVisible(threshold = 0.1) {
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

// ── Particles ─────────────────────────────────────────────────────────────────
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
      if (ps.length < 60) ps.push({ x: Math.random()*c.width, y: Math.random()*c.height, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, size: Math.random()*1.2+.3, alpha: Math.random()*.4+.1, life: 0, max: Math.random()*230+120 });
      for (let i = ps.length-1; i >= 0; i--) {
        const p = ps[i]; p.x += p.vx; p.y += p.vy; p.life++;
        const fade = p.life < 20 ? p.life/20 : p.life > p.max-20 ? (p.max-p.life)/20 : 1;
        ctx.save(); ctx.globalAlpha = p.alpha*fade; ctx.fillStyle='#00d4ff'; ctx.shadowBlur=4; ctx.shadowColor='#00d4ff';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); ctx.restore();
        if (p.life >= p.max) ps.splice(i,1);
      }
      for (let i=0;i<ps.length;i++) for (let j=i+1;j<ps.length;j++) {
        const d = Math.hypot(ps[i].x-ps[j].x,ps[i].y-ps[j].y);
        if (d<85) { ctx.save(); ctx.globalAlpha=(1-d/85)*.09; ctx.strokeStyle='#00d4ff'; ctx.lineWidth=.5; ctx.beginPath(); ctx.moveTo(ps[i].x,ps[i].y); ctx.lineTo(ps[j].x,ps[j].y); ctx.stroke(); ctx.restore(); }
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
  const links: [string,string][] = [['home','Home'],['about','Who We Are'],['services','Services'],['training','Training'],['why-us','Why Us'],['impact','Real Impact'],['contact','Contact']];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-20">
        <button onClick={() => window.scrollTo({top:0,behavior:'smooth'})} className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-[#00d4ff] rotate-45" style={{boxShadow:'0 0 10px rgba(0,212,255,.6)'}}/>
            <Zap size={13} className="text-[#00d4ff] relative z-10"/>
          </div>
          <div className="text-left">
            <div className="font-orbitron font-bold text-white text-xs tracking-widest leading-none">DE DRONE WORLD</div>
            <div className="font-orbitron text-[#00d4ff] text-[8px] tracking-[.3em] leading-none mt-0.5">CINEMATIC AERIAL INTELLIGENCE</div>
          </div>
        </button>
        <div className="hidden xl:flex items-center gap-6">
          {links.map(([id,label]) => (
            <button key={id} onClick={() => go(id)} className="relative text-[10px] tracking-widest uppercase text-gray-400 hover:text-[#00d4ff] font-inter transition-colors duration-300 group flex-shrink-0">
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00d4ff] group-hover:w-full transition-all duration-300"/>
            </button>
          ))}
          <button onClick={() => go('contact')} className="neon-btn text-[9px] px-5 py-2.5 flex-shrink-0">Enroll Now</button>
        </div>
        <button className="xl:hidden text-white p-2" onClick={() => setOpen(!open)}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
      </div>
      {open && (
        <div className="xl:hidden border-t border-[#00d4ff]/10" style={{background:'rgba(10,10,10,.98)',backdropFilter:'blur(20px)'}}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {links.map(([id,label]) => <button key={id} onClick={() => go(id)} className="text-gray-300 hover:text-[#00d4ff] text-xs tracking-widest uppercase font-inter text-left transition-colors">{label}</button>)}
            <button onClick={() => go('contact')} className="neon-btn text-[10px] mt-1">Enroll Now</button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── 1. Hero ───────────────────────────────────────────────────────────────────
function Hero() {
  const [py, setPy] = useState(0);
  useEffect(() => { const fn = () => setPy(window.scrollY*.3); window.addEventListener('scroll',fn,{passive:true}); return () => window.removeEventListener('scroll',fn); }, []);
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{background:'#0a0a0a'}}>
      <Particles/>
      {/* BG image */}
      <div className="absolute inset-0 z-0" style={{transform:`translateY(${py}px)`,willChange:'transform'}}>
        <div className="absolute inset-0 z-10" style={{background:'linear-gradient(135deg,rgba(10,10,10,.85) 0%,rgba(10,10,10,.6) 50%,rgba(10,10,10,.75) 100%)'}}/>
        <img src={HERO_BG} alt="" className="w-full h-full object-cover"/>
      </div>
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-tex z-10"/>
      {/* Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="rotate-slow w-[650px] h-[650px] border border-[#00d4ff]/5 rounded-full absolute"/>
        <div className="rotate-slow-rev w-[420px] h-[420px] border border-[#00d4ff]/8 rounded-full absolute"/>
      </div>
      <div className="relative z-20 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center pt-20">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-[#00d4ff]/30 bg-[#00d4ff]/8 text-[#00d4ff] text-[10px] font-semibold tracking-[.2em] uppercase font-orbitron" style={{clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)'}}>
            <Shield size={11}/> DGCA Approved RPTO
          </div>
          <h1 className="font-orbitron font-black leading-[1.1] mb-5 text-white" style={{fontSize:'clamp(32px,5vw,64px)'}}>
            Elevate Your Future<br/>With Professional<br/>
            <span className="text-glow" style={{color:'#00d4ff'}}>Drone Training</span>
          </h1>
          <p className="font-inter text-gray-300 text-sm leading-relaxed mb-8 max-w-lg">
            India's most trusted drone pilot training academy. DGCA-approved certification programs from <span className="text-[#00d4ff] font-semibold">aviation experts of the Indian Armed Forces</span>. Highest standards. Guaranteed placement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="neon-btn" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Get Our Brochure <ArrowRight size={13}/></button>
            <button className="neon-btn-ghost flex items-center gap-2" onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}><Play size={13}/>Explore Services</button>
          </div>
          {/* Mini stats */}
          <div className="grid grid-cols-4 gap-3">
            {[['50+','Expert Pilots'],['1000+','Trained'],['5+','Years'],['100%','DGCA']].map(([v,l]) => (
              <div key={l} className="text-center p-3 border border-gray-800/60 bg-[#111]/60">
                <div className="font-orbitron text-[#00d4ff] text-lg font-black text-glow leading-none">{v}</div>
                <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right — drone visual */}
        <div className="hidden lg:flex items-center justify-center relative">
          <div className="relative w-full max-w-md">
            {/* Glow circle */}
            <div className="absolute inset-0 rounded-full blur-3xl" style={{background:'rgba(0,212,255,.08)'}}/>
            <img
              src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80"
              alt="Professional Drone"
              className="drone-float relative z-10 w-full rounded-none"
              style={{clipPath:'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))',filter:'brightness(1.1) saturate(0.9)'}}
            />
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 p-4 z-20 border border-[#00d4ff]/20" style={{background:'rgba(17,17,17,.95)',clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)'}}>
              <div className="font-orbitron text-[#00d4ff] text-xl font-black leading-none">370+</div>
              <div className="font-inter text-gray-300 text-[10px] mt-0.5">Pilots Trained</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 bounce-scroll">
        <span className="text-[#00d4ff]/50 text-[9px] tracking-widest uppercase font-inter">Scroll</span>
        <ChevronDown size={18} className="text-[#00d4ff]/50"/>
      </div>
    </section>
  );
}

// ── 2. DGCA Badge Strip ───────────────────────────────────────────────────────
function DGCAStrip() {
  return (
    <div className="py-5 relative overflow-hidden" style={{background:'linear-gradient(135deg,#0d1f2d,#0a2030,#0d1f2d)'}}>
      <div className="absolute inset-0" style={{background:'linear-gradient(90deg,rgba(0,212,255,.06) 0%,rgba(0,212,255,.12) 50%,rgba(0,212,255,.06) 100%)'}}/>
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center border border-[#00d4ff]/40 bg-[#00d4ff]/10">
            <Shield size={18} className="text-[#00d4ff]"/>
          </div>
          <div>
            <div className="font-orbitron text-white text-sm font-bold tracking-wider">DGCA APPROVED RPTO</div>
            <div className="font-inter text-[#00d4ff]/70 text-[10px] tracking-widest uppercase">Ministry of Civil Aviation</div>
          </div>
        </div>
        <div className="hidden sm:block w-px h-8 bg-[#00d4ff]/15"/>
        {['ISO 9001:2024 Certified','IGRUA Collaboration','Armed Forces Veterans','Pan-India Operations'].map((b,i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle size={12} className="text-[#00d4ff]"/>
            <span className="font-inter text-gray-300 text-xs tracking-wide">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 3. Stories in Motion (Gallery) ───────────────────────────────────────────
function StoriesSection() {
  const {ref, vis} = useVisible();
  return (
    <section ref={ref} className="py-20" style={{background:'#080808'}}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-12 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Our Work</span>
          <h2 className="section-title">Stories in Motion...</h2>
          <div className="glow-line"/>
        </div>
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ai-in ${vis?'ai-visible':''} ai-d2`}>
          {GALLERY_IMAGES.map(({src,label},i) => (
            <div key={i} className="portfolio-wrap group cursor-pointer" style={i===0||i===3?{gridRow:'span 1'}:{}}>
              <img src={src} alt={label} loading="lazy" className="w-full h-48 object-cover"/>
              <div className="portfolio-overlay">
                <div>
                  <p className="font-orbitron text-white text-xs font-semibold">{label}</p>
                  <p className="font-inter text-[#00d4ff] text-[10px] tracking-wider uppercase mt-0.5">De Drone World</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 4. Who We Are ─────────────────────────────────────────────────────────────
function AboutSection() {
  const {ref, vis} = useVisible();
  return (
    <section id="about" ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.03)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        {/* Visual */}
        <div className={`ai-in ${vis?'ai-visible':''} ai-d1`}>
          <div className="relative">
            <div className="overflow-hidden" style={{clipPath:'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))'}}>
              <img src="https://images.unsplash.com/photo-1531767153987-4b8cf2f27d28?w=700&q=80" alt="De Drone World team" className="w-full h-[420px] object-cover"/>
              <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(10,10,10,.4) 0%,transparent 60%,rgba(0,212,255,.05) 100%)'}}/>
            </div>
            {/* Founded */}
            <div className="absolute -bottom-5 -right-4 p-4 border border-[#00d4ff]/20 z-10" style={{background:'#1a1a1a',clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)'}}>
              <div className="font-orbitron text-[#00d4ff] text-2xl font-black">2022</div>
              <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-0.5">Founded</div>
            </div>
            {/* Logo watermark overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <div className="font-orbitron text-5xl font-black text-[#00d4ff] text-center leading-tight">DE<br/>DRONE<br/>WORLD</div>
            </div>
            <div className="absolute -top-3 -left-3 w-9 h-9 border-l-2 border-t-2 border-[#00d4ff]"/>
            <div className="absolute -bottom-3 -right-10 w-9 h-9 border-r-2 border-b-2 border-[#00d4ff]"/>
          </div>
        </div>
        {/* Text */}
        <div className="space-y-5">
          <div className={`ai-in ${vis?'ai-visible':''} ai-d2`}>
            <span className="section-label">About Us</span>
            <h2 className="section-title">WHO WE ARE...</h2>
            <div className="w-10 h-0.5 bg-[#00d4ff] mt-4" style={{boxShadow:'0 0 8px rgba(0,212,255,.8)'}}/>
          </div>
          <div className={`p-5 border-l-2 border-[#00d4ff] bg-[#00d4ff]/4 ai-in ${vis?'ai-visible':''} ai-d3`}>
            <p className="font-inter text-gray-300 text-sm italic leading-relaxed">"You must be shapeless, formless, like water. Water can drip and it can crash."</p>
            <cite className="font-inter text-gray-500 text-xs mt-2 block not-italic">— Bruce Lee</cite>
          </div>
          <div className={`space-y-3 ai-in ${vis?'ai-visible':''} ai-d3`}>
            <p className="font-inter text-gray-300 text-sm leading-relaxed"><strong className="text-white">De Drone World</strong> is an entrepreneurial venture with a vision to become a global company — built by aviation experts from the <strong className="text-[#00d4ff]">Indian Armed Forces</strong> and enthusiastic young technocrats with a strong passion for drones.</p>
            <p className="font-inter text-gray-400 text-sm leading-relaxed">We aim to usher in a new era in drone development and adoption, bringing revolutionary changes in human lives. Registered as <strong className="text-gray-300">De Drone World Solutions Pvt Ltd</strong> — a DGCA-authorized RPTO based in Coimbatore, Tamil Nadu.</p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ai-in ${vis?'ai-visible':''} ai-d4`}>
            {[['Armed Forces Veterans',Shield],['DGCA Authorized RPTO',Award],['Pan-India Operations',MapPin]].map(([t,I]) => {
              const Icon = I as React.ElementType;
              return (
                <div key={t as string} className="flex items-center gap-2 p-3 border border-[#00d4ff]/12 bg-[#00d4ff]/4">
                  <Icon size={12} className="text-[#00d4ff] flex-shrink-0"/>
                  <span className="font-inter text-gray-300 text-xs">{t as string}</span>
                </div>
              );
            })}
          </div>
          <div className={`ai-in ${vis?'ai-visible':''} ai-d5`}>
            <button className="neon-btn-ghost" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>
              Get in Touch <ArrowRight size={13}/>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 5. Soar Beyond Limits (Services with images) ─────────────────────────────
function ServicesSection() {
  const {ref, vis} = useVisible();
  return (
    <section id="services" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#080808'}}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.015)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Drone Solutions</span>
          <h2 className="section-title">Soar Beyond Limits...</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">End-to-end drone solutions tailored for enterprises, government, and individuals.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES_WITH_IMG.map(({icon:Icon,title,desc,img},i) => (
            <div key={title} className={`group border border-gray-800/50 bg-[#111]/60 overflow-hidden hover:border-[#00d4ff]/30 transition-all duration-500 hover:-translate-y-2 ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,6)}`}
              style={{clipPath:'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%)'}}>
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" loading="lazy"/>
                <div className="absolute inset-0" style={{background:'linear-gradient(180deg,transparent 40%,rgba(10,10,10,.9) 100%)'}}/>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center bg-[#00d4ff]/20 border border-[#00d4ff]/40">
                    <Icon size={14} className="text-[#00d4ff]"/>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="p-5">
                <h3 className="font-orbitron text-white text-xs font-semibold mb-2">{title}</h3>
                <p className="font-inter text-gray-400 text-xs leading-relaxed mb-3">{desc}</p>
                <div className="flex items-center gap-1 text-[#00d4ff] text-xs font-inter">
                  <span>Learn more</span><ArrowRight size={10}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 6. Training Centers ───────────────────────────────────────────────────────
function TrainingCenters() {
  const {ref, vis} = useVisible();
  return (
    <section id="training" ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 grid-tex opacity-30"/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Our Centers</span>
          <h2 className="section-title">Train with Confidence...</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">State-of-the-art training facilities at premier engineering institutions across Tamil Nadu.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {TRAINING_CENTERS.map(({name,location,img},i) => (
            <div key={name} className={`group border border-gray-800/50 bg-[#111]/60 overflow-hidden hover:border-[#00d4ff]/30 transition-all duration-500 ai-in ${vis?'ai-visible':''} ai-d${i+1}`}
              style={{clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,0 100%)'}}>
              <div className="relative h-52 overflow-hidden">
                <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" loading="lazy"/>
                <div className="absolute inset-0" style={{background:'linear-gradient(180deg,transparent 40%,rgba(10,10,10,.9) 100%)'}}/>
                <div className="absolute top-3 left-3 px-3 py-1 bg-[#00d4ff]/15 border border-[#00d4ff]/30">
                  <span className="font-orbitron text-[#00d4ff] text-[9px] tracking-widest uppercase">Training Center</span>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-orbitron text-white text-sm font-semibold">{name}</h3>
                  <div className="flex items-center gap-1 mt-1.5">
                    <MapPin size={10} className="text-[#00d4ff]"/>
                    <span className="font-inter text-gray-400 text-xs">{location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#00d4ff] text-xs font-inter">
                  <span>Navigate</span><ArrowRight size={10}/>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Curriculum docs */}
        <div className={`ai-in ${vis?'ai-visible':''} ai-d3`}>
          <p className="font-inter text-gray-400 text-xs tracking-widest uppercase text-center mb-5">Course Documents & Certifications</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CURRICULUM_DOCS.map(({label,color}) => (
              <div key={label} className="p-4 border bg-[#111]/60 text-center hover:scale-105 transition-transform duration-300 cursor-pointer" style={{borderColor:`${color}30`}}>
                <div className="w-10 h-12 mx-auto mb-3 flex items-center justify-center border" style={{borderColor:`${color}40`,background:`${color}10`}}>
                  <BookOpen size={18} style={{color}}/>
                </div>
                <p className="font-inter text-gray-300 text-[10px] leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 7. Built for Excellence (Stats + Why Us) ──────────────────────────────────
function ExcellenceSection() {
  const {ref, vis} = useVisible();
  return (
    <section id="why-us" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#080808'}}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-title">Built for Excellence...</h2>
          <div className="glow-line"/>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 items-start mb-14">
          {/* Left: why us cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {WHY_US.map(({icon:Icon,title,desc},i) => (
              <div key={title} className={`flex gap-3 p-4 border border-gray-800/50 bg-[#111]/30 hover:border-[#00d4ff]/20 transition-all duration-400 ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,6)}`}>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/5">
                  <Icon size={14} className="text-[#00d4ff]"/>
                </div>
                <div>
                  <h3 className="font-orbitron text-white text-[10px] font-semibold mb-1">{title}</h3>
                  <p className="font-inter text-gray-400 text-[10px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Right: RPTO card + stats */}
          <div className={`ai-in ${vis?'ai-visible':''} ai-d3`}>
            {/* RPTO certificate card */}
            <div className="p-6 border border-[#00d4ff]/20 bg-[#00d4ff]/4 mb-5" style={{clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,0 100%)'}}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 flex items-center justify-center border border-[#00d4ff]/40 bg-[#00d4ff]/10">
                  <Shield size={26} className="text-[#00d4ff]"/>
                </div>
                <div>
                  <div className="font-orbitron text-white text-sm font-bold leading-snug">REMOTE PILOT TRAINING</div>
                  <div className="font-orbitron text-[#00d4ff] text-sm font-bold">ORGANISATION</div>
                  <div className="font-inter text-gray-400 text-[10px] mt-0.5">DGCA Approved · Ministry of Civil Aviation</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['DGCA Licensed','IGRUA Partner','ISO 9001:2024','Zero Accidents'].map(b => (
                  <span key={b} className="px-2 py-1 text-[9px] font-inter tracking-wide border border-[#00d4ff]/20 text-[#00d4ff]/80">{b}</span>
                ))}
              </div>
            </div>
            {/* Stats grid */}
            <div className="grid grid-cols-5 gap-2">
              {STATS.map(({value,suffix,label},i) => (
                <div key={label} className={`text-center p-3 border border-gray-800 bg-[#111]/50 ai-in ${vis?'ai-visible':''} ai-d${i+1}`}>
                  <div className="font-orbitron text-white text-lg font-black text-glow leading-none">
                    <Counter target={value} suffix={suffix} vis={vis}/>
                  </div>
                  <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-1 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 8. Testimonials ───────────────────────────────────────────────────────────
function TestimonialsSection() {
  const {ref, vis} = useVisible();
  const [active, setActive] = useState(0);
  const next = useCallback(() => setActive(a => (a+1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setActive(a => (a-1+TESTIMONIALS.length) % TESTIMONIALS.length), []);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);
  return (
    <section ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.03)'}}/>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">From Learners</span>
          <h2 className="section-title">What Our Students Say</h2>
          <div className="glow-line"/>
        </div>
        <div className={`ai-in ${vis?'ai-visible':''} ai-d2`}>
          <div className="relative p-10 border border-gray-800 bg-[#111]/50 text-center"
            style={{clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))'}}>
            <div className="font-orbitron text-7xl text-[#00d4ff]/8 absolute top-3 left-6 leading-none select-none">"</div>
            <div className="flex justify-center mb-4">
              {Array.from({length:TESTIMONIALS[active].rating}).map((_,i) => <Star key={i} size={14} className="text-[#00d4ff] fill-[#00d4ff]"/>)}
            </div>
            <blockquote className="font-inter text-gray-200 text-base leading-relaxed mb-7 max-w-2xl mx-auto relative z-10">
              "{TESTIMONIALS[active].text}"
            </blockquote>
            {/* Avatar */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-[#00d4ff]/25 bg-[#00d4ff]/8">
                <Users size={14} className="text-[#00d4ff]"/>
              </div>
              <div className="text-left">
                <div className="font-orbitron text-white text-xs font-semibold">{TESTIMONIALS[active].name}</div>
                <div className="font-inter text-[#00d4ff] text-[10px] tracking-widest uppercase mt-0.5">{TESTIMONIALS[active].role}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 mt-6">
            <button onClick={prev} className="w-9 h-9 border border-gray-700 hover:border-[#00d4ff] flex items-center justify-center text-gray-400 hover:text-[#00d4ff] transition-all duration-300">
              <ArrowRight size={14} className="rotate-180"/>
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_,i) => (
                <button key={i} onClick={() => setActive(i)} className="h-1 transition-all duration-300"
                  style={{width:i===active?28:8,background:i===active?'#00d4ff':'#374151',boxShadow:i===active?'0 0 8px rgba(0,212,255,.6)':undefined}}/>
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 border border-gray-700 hover:border-[#00d4ff] flex items-center justify-center text-gray-400 hover:text-[#00d4ff] transition-all duration-300">
              <ArrowRight size={14}/>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 9. Create Real Impact ─────────────────────────────────────────────────────
function RealImpactSection() {
  const {ref, vis} = useVisible();
  return (
    <section id="impact" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#080808'}}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Real Applications</span>
          <h2 className="section-title">Create Real Impact...</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">Experience drone technology transforming industries across India.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {IMPACT_USES.map(({icon:Icon,title,desc,img},i) => (
            <div key={title} className={`group border border-gray-800/50 bg-[#111]/50 overflow-hidden hover:border-[#00d4ff]/30 transition-all duration-500 hover:-translate-y-2 ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,5)}`}>
              <div className="relative h-32 overflow-hidden">
                <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110" loading="lazy"/>
                <div className="absolute inset-0" style={{background:'linear-gradient(180deg,transparent 30%,rgba(10,10,10,.85) 100%)'}}/>
                <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
                  <Icon size={12} className="text-[#00d4ff]"/>
                  <span className="font-orbitron text-white text-[10px] font-semibold">{title}</span>
                </div>
              </div>
              <div className="p-3">
                <p className="font-inter text-gray-400 text-[10px] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 10. Trusted Partners ──────────────────────────────────────────────────────
function PartnersSection() {
  const {ref, vis} = useVisible();
  return (
    <section ref={ref} className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-12 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Trusted By</span>
          <h2 className="section-title">Our Partners</h2>
          <div className="glow-line"/>
        </div>
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 ai-in ${vis?'ai-visible':''} ai-d2`}>
          {PARTNERS.map(({name,img},i) => (
            <div key={name} className={`group border border-gray-800/50 bg-[#111]/50 overflow-hidden hover:border-[#00d4ff]/25 transition-all duration-400 ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,5)}`}>
              <div className="h-24 overflow-hidden relative">
                <img src={img} alt={name} className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-400" loading="lazy"/>
                <div className="absolute inset-0" style={{background:'linear-gradient(180deg,transparent 30%,rgba(10,10,10,.7) 100%)'}}/>
              </div>
              <div className="p-3 text-center">
                <span className="font-inter text-gray-300 text-[10px] font-medium group-hover:text-[#00d4ff] transition-colors duration-300">{name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 11. CTA Banner ────────────────────────────────────────────────────────────
function CTABanner() {
  const {ref, vis} = useVisible();
  return (
    <section ref={ref} className="py-20 relative overflow-hidden" style={{background:'#060606'}}>
      <div className="absolute inset-0 grid-tex opacity-20"/>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className={`p-10 border border-[#00d4ff]/15 bg-[#00d4ff]/3 ai-in ${vis?'ai-visible':''}`}
          style={{clipPath:'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))'}}>
          <span className="section-label block mb-4">Ready to Take Flight?</span>
          <h2 className="font-orbitron text-white font-black mb-4" style={{fontSize:'clamp(22px,4vw,42px)'}}>
            Enroll in India's Premier<br/>
            <span className="text-glow" style={{color:'#00d4ff'}}>Drone Academy</span>
          </h2>
          <p className="font-inter text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Enroll in our DGCA-approved drone pilot training or hire our professional aerial services. Be part of India's drone revolution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="neon-btn" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>
              Enroll Now <ArrowRight size={13}/>
            </button>
            <a href="tel:+917448800997" className="neon-btn-ghost">
              <Phone size={13}/> +91 74488 00997
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 12. Contact ───────────────────────────────────────────────────────────────
function ContactSection() {
  const {ref, vis} = useVisible();
  const [form, setForm] = useState({name:'',email:'',phone:'',service:'',message:''});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = (e: React.FormEvent) => { e.preventDefault(); setBusy(true); setTimeout(() => { setBusy(false); setSent(true); }, 1500); };
  const services = ['Drone Pilot Training (DGCA)','DGCA Certification Course','Agriculture Drone Course','Technician Course','Aerial Cinematography','3D Mapping & Survey','Agriculture Solutions','Industrial Inspection','Surveillance & Security','Drone Manufacturing'];
  return (
    <section id="contact" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#0a0a0a'}}>
      <div className="absolute inset-0 grid-tex opacity-20"/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">Contact Us</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-md mx-auto leading-relaxed">Enroll in a training program or inquire about our services. We respond within 24 hours.</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className={`lg:col-span-2 space-y-6 ai-in ${vis?'ai-visible':''} ai-d1`}>
            <div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-5">Contact Information</h3>
              <div className="space-y-4">
                {[
                  [Phone,  'Phone',   '+91 74488 00997',       'tel:+917448800997'],
                  [Mail,   'Email',   'md@thedroneworld.in',    'mailto:md@thedroneworld.in'],
                  [MapPin, 'Address', 'Coimbatore, Tamil Nadu, India', null],
                  [Clock,  'Hours',   'Mon–Sat: 10AM – 5PM',   null],
                ].map(([I,label,val,href]) => {
                  const Icon = I as React.ElementType;
                  return (
                    <div key={label as string} className="flex items-start gap-4">
                      <div className="w-8 h-8 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/5 flex-shrink-0 mt-0.5">
                        <Icon size={12} className="text-[#00d4ff]"/>
                      </div>
                      <div>
                        <div className="font-inter text-gray-500 text-[10px] uppercase tracking-wider">{label as string}</div>
                        {href ? <a href={href as string} className="font-inter text-gray-200 text-sm mt-0.5 hover:text-[#00d4ff] transition-colors block">{val as string}</a>
                          : <div className="font-inter text-gray-200 text-sm mt-0.5">{val as string}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Training centers */}
            <div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-3">Training Centers</h3>
              <div className="space-y-2">
                {['Coimbatore, Tamil Nadu','Madurai, Tamil Nadu'].map(loc => (
                  <div key={loc} className="flex items-center gap-3 p-3 border border-gray-800/50">
                    <MapPin size={11} className="text-[#00d4ff] flex-shrink-0"/>
                    <span className="font-inter text-gray-300 text-xs">{loc}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Social */}
            <div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {[[Facebook,'Facebook'],[Instagram,'Instagram'],[Linkedin,'LinkedIn'],[Youtube,'YouTube'],[MessageCircle,'WhatsApp']].map(([I,label]) => {
                  const Icon = I as React.ElementType;
                  return <a key={label as string} href="#" title={label as string} className="w-9 h-9 flex items-center justify-center border border-gray-700 hover:border-[#00d4ff] hover:bg-[#00d4ff]/10 text-gray-400 hover:text-[#00d4ff] transition-all duration-300"><Icon size={14}/></a>;
                })}
              </div>
            </div>
          </div>
          {/* Form */}
          <div className={`lg:col-span-3 ai-in ${vis?'ai-visible':''} ai-d2`}>
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center p-12 border border-[#00d4ff]/20 bg-[#00d4ff]/3 min-h-[400px]"
                style={{clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,0 100%)'}}>
                <CheckCircle size={44} className="text-[#00d4ff] mb-4"/>
                <h3 className="font-orbitron text-white text-lg font-bold mb-2">Enquiry Sent!</h3>
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
                    <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Phone *</label>
                    <input type="tel" required placeholder="+91 XXXXX XXXXX" className="form-field" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Interested In *</label>
                    <select required className="form-field" value={form.service} onChange={e => setForm(f=>({...f,service:e.target.value}))}>
                      <option value="">Select program / service</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Message</label>
                  <textarea rows={5} placeholder="Tell us your requirements, preferred dates, or any questions..." className="form-field resize-none" value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))}/>
                </div>
                <button type="submit" disabled={busy} className="neon-btn w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  {busy ? 'Sending...' : <><ArrowRight size={13}/>Submit Enquiry</>}
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
                <Zap size={13} className="text-[#00d4ff] relative z-10"/>
              </div>
              <div>
                <div className="font-orbitron font-bold text-white text-xs tracking-wider leading-none">DE DRONE WORLD</div>
                <div className="font-inter text-[#00d4ff] text-[8px] tracking-[.3em] mt-0.5">CINEMATIC AERIAL INTELLIGENCE</div>
              </div>
            </button>
            <p className="font-inter text-gray-400 text-xs leading-relaxed max-w-xs mb-2">We invest & innovate to transform the way drones are made & utilized to bring positive and lasting change in human lives.</p>
            <p className="font-inter text-gray-500 text-[10px] mb-5">De Drone World Solutions Pvt Ltd</p>
            <div className="flex gap-3">
              {[[Facebook,'Facebook'],[Instagram,'Instagram'],[Linkedin,'LinkedIn'],[Youtube,'YouTube']].map(([I,label]) => {
                const Icon = I as React.ElementType;
                return <a key={label as string} href="#" title={label as string} className="w-8 h-8 flex items-center justify-center border border-gray-700 hover:border-[#00d4ff] hover:bg-[#00d4ff]/10 text-gray-500 hover:text-[#00d4ff] transition-all duration-300"><Icon size={13}/></a>;
              })}
            </div>
          </div>
          <div>
            <h4 className="font-orbitron text-white text-[10px] font-semibold tracking-widest uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[['home','Home'],['about','About Us'],['services','Services'],['training','Training'],['why-us','Why Us'],['contact','Contact']].map(([id,label]) => (
                <li key={id}><button onClick={() => go(id)} className="font-inter text-gray-400 hover:text-[#00d4ff] text-xs transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-3 h-px bg-gray-700 group-hover:bg-[#00d4ff] group-hover:w-5 transition-all duration-300"/>{label}
                </button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-orbitron text-white text-[10px] font-semibold tracking-widest uppercase mb-5">Contact Info</h4>
            <ul className="space-y-3">
              {[[MapPin,'Coimbatore, Tamil Nadu, India'],[Phone,'+91 74488 00997'],[Mail,'md@thedroneworld.in'],[Clock,'Mon–Sat: 10AM – 5PM']].map(([I,val]) => {
                const Icon = I as React.ElementType;
                return <li key={val as string} className="flex items-start gap-2"><Icon size={11} className="text-[#00d4ff] flex-shrink-0 mt-0.5"/><span className="font-inter text-gray-400 text-xs">{val as string}</span></li>;
              })}
            </ul>
          </div>
        </div>
        <div className="py-5 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-inter text-gray-500 text-[11px]">© 2025 De Drone World Solutions Pvt Ltd. All rights reserved.</p>
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
      <DGCAStrip/>
      <StoriesSection/>
      <AboutSection/>
      <ServicesSection/>
      <TrainingCenters/>
      <ExcellenceSection/>
      <TestimonialsSection/>
      <RealImpactSection/>
      <PartnersSection/>
      <CTABanner/>
      <ContactSection/>
      <Footer/>
    </div>
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  GraduationCap, Camera, Map, Leaf, Cpu, Eye, Zap, Shield, Award,
  Star, ChevronDown, Menu, X, Instagram, Youtube, Facebook, Linkedin,
  Phone, Mail, MapPin, ArrowRight, CheckCircle, Users, Clock,
  Building2, Handshake, Home, BookOpen, Factory, MessageCircle
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; max: number; }

// ── Constants ─────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: GraduationCap, title: 'Drone Pilot Training',      desc: 'DGCA-approved Remote Pilot Training with guaranteed placement assistance for every graduate.' },
  { icon: Camera,         title: 'Aerial Cinematography',    desc: 'Cinematic 4K/8K aerial footage for films, documentaries, events, and commercial productions.' },
  { icon: Map,            title: '3D Mapping & Survey',      desc: 'High-precision photogrammetry, 3D modeling, and topographic surveys for industries.' },
  { icon: Leaf,           title: 'Agriculture Solutions',    desc: 'Precision farming — drone-based crop monitoring, NDVI analysis, and spraying operations.' },
  { icon: Cpu,            title: 'Industrial Inspection',    desc: 'Thermal & visual inspection of solar panels, wind turbines, power lines, and infrastructure.' },
  { icon: Eye,            title: 'Surveillance & Security',  desc: 'Advanced aerial surveillance and perimeter security solutions for enterprises and events.' },
];

const DRONE_CATEGORIES = [
  { weight: '≤ 250g',        name: 'Nano',   note: 'No License Required',              badge: 'Consumer',    color: '#22c55e' },
  { weight: '250g – 2kg',    name: 'Micro',  note: 'License Required (Commercial Use)', badge: 'Commercial',  color: '#3b82f6' },
  { weight: '2kg – 25kg',    name: 'Small',  note: 'License Required',                 badge: 'Professional', color: '#f59e0b' },
  { weight: '25kg – 150kg',  name: 'Medium', note: 'License Required',                 badge: 'Industrial',  color: '#ef4444' },
  { weight: '> 150kg',       name: 'Large',  note: 'License Required',                 badge: 'Enterprise',  color: '#8b5cf6' },
];

const WHY_US = [
  { icon: MapPin,       title: 'Multiple Training Centers', desc: 'Coimbatore & Madurai — premier institutions with state-of-the-art facilities.' },
  { icon: Handshake,    title: 'Guaranteed Placement',      desc: 'Placement assistance for all course participants with industry partners.' },
  { icon: GraduationCap,title: 'DGCA Approved Instructors', desc: 'Learn from experienced DGCA-approved instructors with real field expertise.' },
  { icon: Award,        title: 'IGRUA Collaboration',       desc: 'Partnership with India\'s premier flying training institute & Drone Destination.' },
  { icon: Building2,    title: 'World-class Infrastructure', desc: 'Best-in-class simulators, smart classrooms, and dedicated flying ground area.' },
  { icon: Home,         title: 'Accommodation Available',   desc: 'AC rooms with healthy food options for outstation students within campus.' },
];

const CERTIFICATIONS = [
  { title: 'DGCA Approved RPTO',         desc: 'Authorised Remote Pilot Training Organisation under Ministry of Civil Aviation', icon: Shield },
  { title: 'ISO 9001:2024 Certified',    desc: 'Internationally recognised quality management system for training & operations', icon: Award },
  { title: 'IGRUA Collaboration',        desc: 'Strategic partnership with India\'s premier flying training institute',          icon: Handshake },
  { title: 'Best Training Academy 2024', desc: 'Awarded for outstanding contribution to drone education & skill development',    icon: Star },
  { title: 'Drone Innovation Excellence',desc: 'Recognised for breakthrough R&D in precision agriculture & mapping drones',     icon: Zap },
  { title: 'Gold Safety Rating',         desc: 'Aviation Safety & Compliance Council certified with zero accident record',      icon: CheckCircle },
];

const PARTNERS = ['IGRUA', 'Drone Destination', 'Hindustan College of Engg', 'Vaigai Engineering College', 'TSAW Drones'];

const TESTIMONIALS = [
  { name: 'Rahul Sharma',   role: 'Certified Drone Pilot, Batch 2024',  text: 'The training at De Drone World was exceptional. The instructors are truly world-class, and the hands-on experience with real drones gave me the confidence to fly professionally.', rating: 5 },
  { name: 'Priya Venkatesh', role: 'Agricultural Drone Specialist',     text: 'Being from a non-aviation background, I was nervous. But the team made everything easy to understand. The simulators and practical sessions are top-notch. Got placed immediately!', rating: 5 },
  { name: 'Arun Kumar',     role: 'Enterprise Drone Operator',          text: 'The DGCA certification process was seamless with De Drone World. Their partnership with IGRUA speaks volumes. The accommodation made my stay comfortable throughout the program.', rating: 5 },
];

const STATS = [
  { value: 50,   suffix: '+', label: 'Expert Pilots',      icon: Users },
  { value: 1000, suffix: '+', label: 'Students Trained',   icon: GraduationCap },
  { value: 5,    suffix: '+', label: 'Years Experience',   icon: Clock },
  { value: 100,  suffix: '%', label: 'DGCA Compliant',     icon: Shield },
];

// ── Hook ──────────────────────────────────────────────────────────────────────
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

// ── Counter ───────────────────────────────────────────────────────────────────
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
      if (ps.length < 65) ps.push({ x: Math.random()*c.width, y: Math.random()*c.height, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, size: Math.random()*1.3+.3, alpha: Math.random()*.45+.1, life: 0, max: Math.random()*250+120 });
      for (let i = ps.length-1; i >= 0; i--) {
        const p = ps[i]; p.x += p.vx; p.y += p.vy; p.life++;
        const fade = p.life < 25 ? p.life/25 : p.life > p.max-25 ? (p.max-p.life)/25 : 1;
        ctx.save(); ctx.globalAlpha = p.alpha*fade; ctx.fillStyle='#00d4ff'; ctx.shadowBlur=5; ctx.shadowColor='#00d4ff';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); ctx.restore();
        if (p.life >= p.max) ps.splice(i,1);
      }
      for (let i=0;i<ps.length;i++) for (let j=i+1;j<ps.length;j++) {
        const d = Math.hypot(ps[i].x-ps[j].x,ps[i].y-ps[j].y);
        if (d<90) { ctx.save(); ctx.globalAlpha=(1-d/90)*.1; ctx.strokeStyle='#00d4ff'; ctx.lineWidth=.5; ctx.beginPath(); ctx.moveTo(ps[i].x,ps[i].y); ctx.lineTo(ps[j].x,ps[j].y); ctx.stroke(); ctx.restore(); }
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

  const links: [string, string][] = [
    ['home','Home'],['about','About'],['services','Services'],['categories','Drone Types'],
    ['why-us','Why Us'],['certifications','Certifications'],['testimonials','Testimonials'],['contact','Contact'],
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-20">
        {/* Logo */}
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
        {/* Desktop links */}
        <div className="hidden xl:flex items-center gap-6">
          {links.map(([id,label]) => (
            <button key={id} onClick={() => go(id)} className="relative text-[9px] tracking-widest uppercase text-gray-400 hover:text-[#00d4ff] font-inter transition-colors duration-300 group flex-shrink-0">
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

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const [py, setPy] = useState(0);
  useEffect(() => { const fn = () => setPy(window.scrollY*.35); window.addEventListener('scroll',fn,{passive:true}); return () => window.removeEventListener('scroll',fn); }, []);
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg grid-tex">
      <Particles/>
      <div className="absolute inset-0 z-0" style={{transform:`translateY(${py}px)`,willChange:'transform'}}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[#0a0a0a] z-10"/>
        <img src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1600&q=80" alt="" className="w-full h-full object-cover opacity-15"/>
      </div>
      {/* Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="rotate-slow w-[600px] h-[600px] border border-[#00d4ff]/5 rounded-full absolute"/>
        <div className="rotate-slow-rev w-[380px] h-[380px] border border-[#00d4ff]/8 rounded-full absolute"/>
      </div>
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        {/* DGCA badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-7 border border-[#00d4ff]/25 bg-[#00d4ff]/8 text-[#00d4ff] text-[10px] font-semibold tracking-[.25em] uppercase font-orbitron" style={{clipPath:'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)'}}>
          <Shield size={12}/> DGCA Approved RPTO
        </div>
        <h1 className="font-orbitron font-black leading-[1.05] mb-5 text-white" style={{fontSize:'clamp(38px,7vw,82px)'}}>
          Train with the Best.<br/>
          <span className="text-glow" style={{color:'#00d4ff'}}>Lead the Skies.</span>
        </h1>
        <p className="font-inter text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          India's most trusted drone pilot training academy. DGCA-approved certification programs from <span className="text-[#00d4ff] font-semibold">aviation experts of the Indian Armed Forces</span> — plus professional aerial services across the nation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button className="neon-btn" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>
            Start Your Training <ArrowRight size={13}/>
          </button>
          <button className="neon-btn-ghost" onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}>
            Explore Services <ArrowRight size={13}/>
          </button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {STATS.map(({value,suffix,label,icon:Icon}) => (
            <div key={label} className="text-center p-3 border border-gray-800/60 bg-[#111]/60 backdrop-blur-sm">
              <Icon size={14} className="text-[#00d4ff] mx-auto mb-1"/>
              <div className="font-orbitron text-white text-xl font-black text-glow leading-none">{value}{suffix}</div>
              <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-1">{label}</div>
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

// ── Quick Links ───────────────────────────────────────────────────────────────
function QuickLinks() {
  const {ref, vis} = useVisible();
  const items = [
    { icon: BookOpen,  title: 'Drone Pilot Training', desc: 'DGCA-approved certification programs',    id: 'services' },
    { icon: Camera,    title: 'Aerial Services',       desc: 'Cinematography, mapping & inspection',   id: 'services' },
    { icon: Factory,   title: 'Drone Manufacturing',   desc: 'Custom drone solutions & assembly',       id: 'contact'  },
    { icon: Phone,     title: 'Get in Touch',          desc: 'Enroll or partner with us today',         id: 'contact'  },
  ];
  return (
    <section ref={ref} className="py-12 relative z-10" style={{background:'#080808'}}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({icon:Icon,title,desc,id},i) => (
            <button key={title} onClick={() => document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}
              className={`service-card text-left p-6 cursor-pointer group ai-in ${vis?'ai-visible':''} ai-d${i+1}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-11 h-11 flex items-center justify-center">
                  <div className="absolute inset-0 border border-[#00d4ff]/25 bg-[#00d4ff]/8 rotate-45"/>
                  <Icon size={18} className="text-[#00d4ff] relative z-10"/>
                </div>
                <ArrowRight size={14} className="text-gray-600 group-hover:text-[#00d4ff] transition-colors duration-300 mt-1"/>
              </div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-1.5">{title}</h3>
              <p className="font-inter text-gray-400 text-xs leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  const {ref, vis} = useVisible();
  return (
    <section id="about" ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.03)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        {/* Image */}
        <div className={`ai-in ${vis?'ai-visible':''} ai-d1`}>
          <div className="relative">
            <div className="overflow-hidden" style={{clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))'}}>
              <img src="https://images.unsplash.com/photo-1531767153987-4b8cf2f27d28?w=700&q=80" alt="Drone pilot training" className="w-full h-[420px] object-cover"/>
              <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(10,10,10,.4) 0%,transparent 60%,rgba(0,212,255,.05) 100%)'}}/>
            </div>
            {/* Founded badge */}
            <div className="absolute -bottom-5 -right-4 p-4 border border-[#00d4ff]/20" style={{background:'#1a1a1a',clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)'}}>
              <div className="font-orbitron text-[#00d4ff] text-2xl font-black">2022</div>
              <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-0.5">Founded</div>
            </div>
            <div className="absolute -top-3 -left-3 w-9 h-9 border-l-2 border-t-2 border-[#00d4ff]"/>
            <div className="absolute -bottom-3 -right-10 w-9 h-9 border-r-2 border-b-2 border-[#00d4ff]"/>
          </div>
        </div>
        {/* Text */}
        <div className="space-y-5">
          <div className={`ai-in ${vis?'ai-visible':''} ai-d2`}>
            <span className="section-label">About Us</span>
            <h2 className="section-title">HI! WE ARE...</h2>
            <div className="w-10 h-0.5 bg-[#00d4ff] mt-4" style={{boxShadow:'0 0 8px rgba(0,212,255,.8)'}}/>
          </div>
          {/* Quote */}
          <div className={`p-5 border-l-2 border-[#00d4ff] bg-[#00d4ff]/4 ai-in ${vis?'ai-visible':''} ai-d3`}>
            <p className="font-inter text-gray-300 text-sm italic leading-relaxed">"You must be shapeless, formless, like water. Water can drip and it can crash."</p>
            <cite className="font-inter text-gray-500 text-xs mt-2 block not-italic">— Bruce Lee</cite>
          </div>
          <div className={`space-y-3 ai-in ${vis?'ai-visible':''} ai-d3`}>
            <p className="font-inter text-gray-300 text-sm leading-relaxed"><strong className="text-white">De Drone World</strong> is an entrepreneurial venture with a vision to become a global company — built by a team of aviation experts from the <strong className="text-[#00d4ff]">Indian Armed Forces</strong> and enthusiastic young technocrats with a strong passion for drones.</p>
            <p className="font-inter text-gray-400 text-sm leading-relaxed">Registered as <strong className="text-gray-300">De Drone World Solutions Pvt Ltd</strong>, we are a DGCA-authorized Remote Pilot Training Organisation (RPTO) based in Coimbatore, Tamil Nadu, with operations across India.</p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ai-in ${vis?'ai-visible':''} ai-d4`}>
            {[['Armed Forces Veterans',Shield],['DGCA Authorized RPTO',Award],['Pan-India Operations',MapPin]].map(([t,I]) => {
              const Icon = I as React.ElementType;
              return (
                <div key={t as string} className="flex items-center gap-2 p-3 border border-[#00d4ff]/12 bg-[#00d4ff]/4">
                  <Icon size={13} className="text-[#00d4ff] flex-shrink-0"/>
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

// ── Services ──────────────────────────────────────────────────────────────────
function Services() {
  const {ref, vis} = useVisible();
  return (
    <section id="services" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#080808'}}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.015)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Our Services</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">End-to-end drone solutions tailored for enterprises, government, and individuals.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(({icon:Icon,title,desc},i) => (
            <div key={title} className={`service-card ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,6)}`}>
              <div className="relative w-12 h-12 flex items-center justify-center mb-4">
                <div className="absolute inset-0 border border-[#00d4ff]/25 bg-[#00d4ff]/8 rotate-45"/>
                <Icon size={20} className="text-[#00d4ff] relative z-10"/>
              </div>
              <h3 className="font-orbitron text-white text-sm font-semibold mb-2">{title}</h3>
              <p className="font-inter text-gray-400 text-xs leading-relaxed mb-4">{desc}</p>
              <div className="flex items-center gap-1 text-[#00d4ff] text-xs font-inter">
                <span>Learn more</span><ArrowRight size={10}/>
              </div>
            </div>
          ))}
        </div>
        <div className={`text-center mt-10 ai-in ${vis?'ai-visible':''}`}>
          <button className="neon-btn-ghost mx-auto" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>
            Enquire About Services <ArrowRight size={13}/>
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Drone Categories ──────────────────────────────────────────────────────────
function DroneCategories() {
  const {ref, vis} = useVisible();
  return (
    <section id="categories" ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 grid-tex opacity-40"/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Know Your Drones</span>
          <h2 className="section-title">Drone Categories</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">Understanding drone categories as per DGCA regulations</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {DRONE_CATEGORIES.map(({weight,name,note,badge,color},i) => (
            <div key={name} className={`text-center p-6 border border-gray-800/60 bg-[#111]/50 hover:border-[#00d4ff]/25 transition-all duration-400 group cursor-default ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,5)}`}
              style={{clipPath:'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))'}}>
              <div className="font-orbitron text-[10px] font-semibold mb-3 px-2 py-1 inline-block" style={{color,background:`${color}18`,border:`1px solid ${color}40`}}>
                {weight}
              </div>
              <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center border border-gray-700/50 group-hover:border-[#00d4ff]/30 transition-colors duration-300">
                <Zap size={18} className="text-gray-500 group-hover:text-[#00d4ff] transition-colors duration-300"/>
              </div>
              <h3 className="font-orbitron text-white text-sm font-bold mb-1.5">{name}</h3>
              <p className="font-inter text-gray-400 text-[10px] leading-snug mb-3">{note}</p>
              <span className="font-inter text-[9px] font-bold tracking-widest uppercase px-2 py-0.5" style={{color,background:`${color}15`}}>
                {badge}
              </span>
            </div>
          ))}
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-title">We Think Beyond...</h2>
          <div className="glow-line"/>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {STATS.map(({value,suffix,label,icon:Icon},i) => (
            <div key={label} className={`text-center p-6 border border-gray-800 bg-[#111]/50 hover:border-[#00d4ff]/30 transition-all duration-400 group ai-in ${vis?'ai-visible':''} ai-d${i+1}`}
              style={{clipPath:'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))'}}>
              <Icon size={22} className="text-[#00d4ff] mx-auto mb-2 group-hover:scale-110 transition-transform"/>
              <div className="font-orbitron text-3xl font-black text-white mb-1 text-glow">
                <Counter target={value} suffix={suffix} vis={vis}/>
              </div>
              <div className="font-inter text-gray-400 text-[10px] tracking-wider uppercase">{label}</div>
            </div>
          ))}
        </div>
        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WHY_US.map(({icon:Icon,title,desc},i) => (
            <div key={title} className={`flex gap-4 p-5 border border-gray-800/50 bg-[#111]/30 hover:border-[#00d4ff]/20 transition-all duration-400 ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,6)}`}>
              <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/5">
                <Icon size={16} className="text-[#00d4ff]"/>
              </div>
              <div>
                <h3 className="font-orbitron text-white text-xs font-semibold mb-1.5">{title}</h3>
                <p className="font-inter text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Certifications ────────────────────────────────────────────────────────────
function Certifications() {
  const {ref, vis} = useVisible();
  return (
    <section id="certifications" ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 grid-tex opacity-30"/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Our Accolades</span>
          <h2 className="section-title">Certifications & Achievements</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">Recognised by leading aviation authorities and industry bodies for excellence in drone training and operations.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CERTIFICATIONS.map(({icon:Icon,title,desc},i) => (
            <div key={title} className={`service-card p-6 ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,6)}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/8 flex-shrink-0">
                  <Icon size={22} className="text-[#00d4ff]"/>
                </div>
                <h3 className="font-orbitron text-white text-xs font-semibold leading-snug">{title}</h3>
              </div>
              <p className="font-inter text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        {/* Partners */}
        <div className={`mt-16 ai-in ${vis?'ai-visible':''}`}>
          <p className="section-label text-center mb-8">Trusted Collaborations</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {PARTNERS.map((name,i) => (
              <div key={name} className={`p-5 border border-gray-800/50 bg-[#111]/30 hover:border-[#00d4ff]/25 transition-all duration-300 text-center ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,5)}`}>
                <Building2 size={22} className="text-[#00d4ff]/50 mx-auto mb-2"/>
                <span className="font-inter text-gray-300 text-xs font-medium">{name}</span>
              </div>
            ))}
          </div>
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
  useEffect(() => { const t = setInterval(next, 5500); return () => clearInterval(t); }, [next]);
  return (
    <section id="testimonials" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#080808'}}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.03)'}}/>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.025)'}}/>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Student Stories</span>
          <h2 className="section-title">What Our Students Say</h2>
          <div className="glow-line"/>
        </div>
        <div className={`ai-in ${vis?'ai-visible':''} ai-d2`}>
          <div className="relative p-10 border border-gray-800 bg-[#111]/50 text-center"
            style={{clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))'}}>
            <div className="font-orbitron text-7xl text-[#00d4ff]/8 absolute top-3 left-6 leading-none select-none">"</div>
            <div className="flex justify-center mb-4">
              {Array.from({length:TESTIMONIALS[active].rating}).map((_,i) => <Star key={i} size={13} className="text-[#00d4ff] fill-[#00d4ff]"/>)}
            </div>
            <blockquote className="font-inter text-gray-200 text-base leading-relaxed mb-7 max-w-2xl mx-auto relative z-10">
              "{TESTIMONIALS[active].text}"
            </blockquote>
            <div className="font-orbitron text-white text-sm font-semibold">{TESTIMONIALS[active].name}</div>
            <div className="font-inter text-[#00d4ff] text-[10px] tracking-widest uppercase mt-1">{TESTIMONIALS[active].role}</div>
          </div>
          <div className="flex items-center justify-center gap-5 mt-7">
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

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CTABanner() {
  const {ref, vis} = useVisible();
  return (
    <section ref={ref} className="py-20 relative overflow-hidden" style={{background:'#0a0a0a'}}>
      <div className="absolute inset-0 grid-tex opacity-20"/>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className={`p-10 border border-[#00d4ff]/15 bg-[#00d4ff]/3 ai-in ${vis?'ai-visible':''}`}
          style={{clipPath:'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))'}}>
          <span className="section-label block mb-4">Ready to Take Flight?</span>
          <h2 className="font-orbitron text-white font-black mb-4" style={{fontSize:'clamp(24px,4vw,44px)'}}>
            Enroll in India's Premier<br/>
            <span className="text-glow" style={{color:'#00d4ff'}}>Drone Academy</span>
          </h2>
          <p className="font-inter text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Enroll in our DGCA-approved drone pilot training program or hire our professional drone services. Be part of India's drone revolution.
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

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const {ref, vis} = useVisible();
  const [form, setForm] = useState({name:'',email:'',phone:'',service:'',message:''});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    setTimeout(() => { setBusy(false); setSent(true); }, 1500);
  };
  const services = ['Drone Pilot Training (DGCA)', 'DGCA Certification Course', 'Agriculture Drone Course', 'Technician Course', 'Aerial Cinematography', '3D Mapping & Survey', 'Agriculture Solutions', 'Industrial Inspection', 'Surveillance & Security', 'Drone Manufacturing'];
  return (
    <section id="contact" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#060606'}}>
      <div className="absolute inset-0 grid-tex opacity-25"/>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[500px] h-48 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.04)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Get Started</span>
          <h2 className="section-title">Contact Us</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-md mx-auto leading-relaxed">Enroll in a training program or inquire about our drone services. We respond within 24 hours.</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className={`lg:col-span-2 space-y-6 ai-in ${vis?'ai-visible':''} ai-d1`}>
            <div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-5">Contact Information</h3>
              <div className="space-y-4">
                {[
                  [Phone,   'Phone',   '+91 74488 00997',       'tel:+917448800997'],
                  [Mail,    'Email',   'md@thedroneworld.in',    'mailto:md@thedroneworld.in'],
                  [MapPin,  'Address', 'Coimbatore, Tamil Nadu, India', null],
                  [Clock,   'Hours',   'Mon–Sat: 10AM – 5PM',    null],
                ].map(([I,label,val,href]) => {
                  const Icon = I as React.ElementType;
                  return (
                    <div key={label as string} className="flex items-start gap-4">
                      <div className="w-8 h-8 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/5 flex-shrink-0 mt-0.5">
                        <Icon size={12} className="text-[#00d4ff]"/>
                      </div>
                      <div>
                        <div className="font-inter text-gray-500 text-[10px] uppercase tracking-wider">{label as string}</div>
                        {href ? (
                          <a href={href as string} className="font-inter text-gray-200 text-sm mt-0.5 hover:text-[#00d4ff] transition-colors">{val as string}</a>
                        ) : (
                          <div className="font-inter text-gray-200 text-sm mt-0.5">{val as string}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-3">Training Centers</h3>
              <div className="space-y-2">
                {['Coimbatore, Tamil Nadu','Madurai, Tamil Nadu'].map(loc => (
                  <div key={loc} className="flex items-center gap-3 p-3 border border-gray-800/50">
                    <MapPin size={12} className="text-[#00d4ff] flex-shrink-0"/>
                    <span className="font-inter text-gray-300 text-xs">{loc}</span>
                  </div>
                ))}
              </div>
            </div>
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
              <div className="flex flex-col items-center justify-center text-center p-12 border border-[#00d4ff]/20 bg-[#00d4ff]/3 h-full"
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
                  <textarea rows={5} placeholder="Tell us about your requirements, preferred batch dates, or any questions..." className="form-field resize-none" value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))}/>
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
          {/* Brand */}
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
            <p className="font-inter text-gray-400 text-xs leading-relaxed max-w-xs mb-5">
              We invest & innovate to transform the way drones are made & utilized to bring positive and lasting change in human lives.
            </p>
            <p className="font-inter text-gray-500 text-[10px] mb-5">De Drone World Solutions Pvt Ltd</p>
            <div className="flex gap-3">
              {[[Facebook,'Facebook'],[Instagram,'Instagram'],[Linkedin,'LinkedIn'],[Youtube,'YouTube']].map(([I,label]) => {
                const Icon = I as React.ElementType;
                return <a key={label as string} href="#" title={label as string} className="w-8 h-8 flex items-center justify-center border border-gray-700 hover:border-[#00d4ff] hover:bg-[#00d4ff]/10 text-gray-500 hover:text-[#00d4ff] transition-all duration-300"><Icon size={13}/></a>;
              })}
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-orbitron text-white text-[10px] font-semibold tracking-widest uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[['home','Home'],['about','About Us'],['services','Services'],['categories','Drone Types'],['why-us','Why Us'],['contact','Contact']].map(([id,label]) => (
                <li key={id}><button onClick={() => go(id)} className="font-inter text-gray-400 hover:text-[#00d4ff] text-xs transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-3 h-px bg-gray-700 group-hover:bg-[#00d4ff] group-hover:w-5 transition-all duration-300"/>{label}
                </button></li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="font-orbitron text-white text-[10px] font-semibold tracking-widest uppercase mb-5">Contact Info</h4>
            <ul className="space-y-3">
              {[
                [MapPin, 'Coimbatore, Tamil Nadu, India'],
                [Phone,  '+91 74488 00997'],
                [Mail,   'md@thedroneworld.in'],
                [Clock,  'Mon–Sat: 10AM – 5PM'],
              ].map(([I,val]) => {
                const Icon = I as React.ElementType;
                return (
                  <li key={val as string} className="flex items-start gap-2">
                    <Icon size={11} className="text-[#00d4ff] flex-shrink-0 mt-0.5"/>
                    <span className="font-inter text-gray-400 text-xs">{val as string}</span>
                  </li>
                );
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
      <QuickLinks/>
      <About/>
      <Services/>
      <DroneCategories/>
      <WhyUs/>
      <Certifications/>
      <Testimonials/>
      <CTABanner/>
      <Contact/>
      <Footer/>
    </div>
  );
}

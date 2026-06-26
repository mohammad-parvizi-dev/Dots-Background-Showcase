import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Sparkles, 
  Layers, 
  MousePointerClick, 
  Layout, 
  Palette, 
  Sliders, 
  ArrowLeft,
  Terminal,
  Cpu,
  Monitor,
  Flame,
  CheckCircle2,
  Lock,
  Compass
} from 'lucide-react';
import { BGPattern } from './components/ui/bg-pattern';
import DotsBgGenerator from './components/DotsBgGenerator';
import LiquidGlassGenerator from './components/LiquidGlassGenerator';

type ViewState = 'home' | 'dots-bg' | 'liquid-glass';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  // Liquid Glass Teaser View (Step 2 placeholder)
  const renderLiquidGlassTeaser = () => {
    return (
      <div className="min-h-screen bg-[#090a0b] text-slate-200 select-none font-sans relative overflow-hidden flex flex-col justify-between">
        {/* Subtle ambient animated grid underlay */}
        <BGPattern 
          size={32}
          dotSize={1}
          fill="rgba(255, 255, 255, 0.05)"
          maskColor="#090a0b"
          maskPosition="center"
          maskStart={10}
          maskEnd={90}
          showGlow={true}
          glowColor="rgba(147, 51, 234, 0.15)" // Beautiful purple glow
          glowSize={150}
          glowSpread={30}
          interactive={true}
          mouseRadius={180}
          mouseStrength={4}
        />

        {/* Header navigation bar */}
        <header className="relative z-20 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md px-8 py-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('home')}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/10 transition-all flex items-center gap-2 cursor-pointer font-sans text-xs group"
              >
                <ChevronRight className="size-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                <span>بازگشت به خانه</span>
              </button>
              
              <div className="h-6 w-[1px] bg-white/10" />

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold tracking-tight uppercase text-white">Liquid Glass</h1>
                  <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">v2.0.0-draft // components / liquid-glass.tsx</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20 text-[10px] font-medium text-purple-400 tracking-wider font-mono">
              <Lock className="size-3 animate-pulse" /> NEXT STEP PIPELINE
            </div>
          </div>
        </header>

        {/* Content Showcase */}
        <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 w-full flex flex-col items-center"
          >
            {/* Visual Icon Box */}
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-xl shadow-purple-500/5">
              <Layers className="size-8" />
            </div>

            {/* Typography Heading */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">// UPCOMING COMPONENT</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase">
                LIQUID GLASS EFFECT
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed font-sans" style={{ direction: 'rtl' }}>
                افکت بازتاب مایع شیشه‌ای متحرک با فلوئیدهای آکریلیک و انحرافات نوری شکست نور. این بخش آماده پیاده‌سازی در گام بعدی است.
              </p>
            </div>

            {/* Interactive Simulated Glass Card Mockup */}
            <div className="relative group w-full max-w-md h-64 rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col justify-between p-8 transition-all hover:border-white/25">
              {/* Floating interactive glowing fluid blobs */}
              <div className="absolute -top-12 -left-12 size-40 rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-500/30 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 size-48 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/25 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

              {/* Glassmorphic border glow line */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-60 pointer-events-none" />

              <div className="flex items-start justify-between relative z-10">
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">// EXPERIMENTAL</div>
                  <div className="text-lg font-bold text-white tracking-wide mt-1">Acrylic Card Prototype</div>
                </div>
                <div className="px-2.5 py-1 rounded bg-white/10 border border-white/10 text-[9px] font-mono text-white tracking-wider uppercase">
                  DRAFT STATE
                </div>
              </div>

              {/* Placeholder text area inside glass card */}
              <div className="text-right space-y-2 relative z-10 bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <p className="text-[11px] text-purple-300 font-sans leading-relaxed flex items-center justify-end gap-1.5" style={{ direction: 'rtl' }}>
                  <Sparkles className="size-3.5 text-purple-400" />
                  <span>آماده برای بارگذاری کدهای شکست نور در قدم بعدی!</span>
                </p>
                <p className="text-[10px] text-slate-400 font-sans leading-normal" style={{ direction: 'rtl' }}>
                  در پیام بعدی به من بفرمایید تا چگونه افکت شیشه مایع (میزان فلوئید، انیمیشن یا رنگ‌ها) را طراحی کنیم.
                </p>
              </div>

              {/* Glass card bottom metadata */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 relative z-10 border-t border-white/5 pt-3">
                <span>BREAK RADIUS: 24px</span>
                <span>BLUR STRENGTH: 32px</span>
              </div>
            </div>

            {/* Steps & Guidance Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl w-full pt-4 font-sans text-right" style={{ direction: 'rtl' }}>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-1.5 justify-end">
                  <span>گام اول (همین بخش)</span>
                  <div className="size-2 rounded-full bg-emerald-500" />
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  تنظیم ساختار جدید سایت، راه‌اندازی کارت‌های انتخابی و بهینه‌سازی کدهای پس‌زمینه تعاملی نقطه‌ای به پایان رسید.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/20 transition-colors">
                <h4 className="text-xs font-bold text-purple-300 mb-1.5 flex items-center gap-1.5 justify-end animate-pulse">
                  <span>گام دوم (پیام بعدی شما)</span>
                  <div className="size-2 rounded-full bg-purple-500" />
                </h4>
                <p className="text-[11px] text-slate-450 leading-relaxed">
                  جلوه طراحی شیشه مایع (Liquid Glass) را توصیف کنید تا من آن را مستقیماً جایگزین این پوسته خالی کنم.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('home')}
              className="mt-4 px-6 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 uppercase tracking-wider font-sans"
            >
              <span>برگشت به کتابخانه المان‌ها</span>
            </button>
          </motion.div>
        </main>

        {/* Footer System Bar */}
        <footer className="h-8 px-8 border-t border-white/5 bg-[#050505] flex items-center justify-between text-[9px] font-mono text-slate-600 relative z-10">
          <div>PIPELINE: LIQUID_GLASS_RESERVED</div>
          <div className="flex gap-4">
            <span>READY FOR UPDATE</span>
          </div>
        </footer>
      </div>
    );
  };

  // Main Landing / Dashboard Selection Page
  const renderHomeView = () => {
    return (
      <div className="min-h-screen bg-[#090a0b] text-slate-200 select-none font-sans relative overflow-hidden flex flex-col justify-between">
        {/* Ambient background using the signature BGPattern itself, making the landing page instantly premium */}
        <BGPattern 
          size={24}
          dotSize={1}
          fill="rgba(255, 255, 255, 0.08)"
          maskColor="#090a0b"
          maskPosition="center"
          maskStart={10}
          maskEnd={80}
          showGlow={true}
          glowColor="rgba(54, 83, 229, 0.16)" // Elegant indigo glow underlay
          glowSize={130}
          glowSpread={40}
          interactive={true}
          mouseRadius={180}
          mouseStrength={6}
        />

        {/* Top Header Bento Style */}
        <header className="relative z-20 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md px-8 py-4">
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 bg-indigo-650 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 font-sans text-sm">UI</div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold tracking-tight uppercase text-white">Core UI Component Library</h1>
                  <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">PLAYGROUND V2.0</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 font-sans text-right md:text-left" style={{ direction: 'rtl' }}>
                  مجموعه قطعات فرانت‌اند مدرن و بهینه‌سازی شده با تم تاریک مینیمال
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 self-start md:self-center">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-medium text-indigo-400 tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> SYSTEM OK
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Dashboard */}
        <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 py-12 max-w-5xl mx-auto w-full">
          
          {/* Welcome Typography Header */}
          <div className="text-center space-y-4 mb-12 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-medium text-indigo-300 mb-2"
            >
              <Sparkles className="size-3.5 text-indigo-400" />
              <span className="font-sans font-semibold">ساختار قدم‌به‌قدم کتابخانه المان‌ها</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase"
            >
              CRAFTED COMPONENT WORKSPACE
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-sm text-slate-400 leading-relaxed font-sans"
              style={{ direction: 'rtl' }}
            >
              یکی از المان‌های زیر را برای شخصی‌سازی، مشاهده کدهای پیاده‌سازی و خروجی گرفتن انتخاب کنید. ساختار پروژه با حفظ تم لوکس و پایدار بازنویسی شده است.
            </motion.p>
          </div>

          {/* Cards Selection Grid - Responsive Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            
            {/* Card 1: Dotted Background Generator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              whileHover={{ y: -6, transition: { duration: 0.15 } }}
              onClick={() => setCurrentView('dots-bg')}
              className="group relative h-96 rounded-3xl border border-white/10 bg-[#0a0a0c] overflow-hidden flex flex-col justify-between p-8 cursor-pointer shadow-2xl transition-all hover:border-indigo-500/40 hover:shadow-indigo-500/5 select-none"
            >
              {/* Card visual miniature background (active preview!) */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                <BGPattern 
                  size={16}
                  dotSize={1}
                  fill="rgba(255, 255, 255, 0.12)"
                  maskColor="#0a0a0c"
                  maskPosition="bottom-right"
                  maskStart={0}
                  maskEnd={80}
                  showGlow={false}
                  interactive={false}
                />
              </div>

              {/* Glowing card border and effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Card Header Info */}
              <div className="flex items-start justify-between relative z-10">
                <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-md">
                  <Sliders className="size-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest">
                  Active Tool
                </span>
              </div>

              {/* Card Content & Features */}
              <div className="space-y-4 relative z-10 text-right" style={{ direction: 'rtl' }}>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    شبیه‌ساز پس‌زمینه نقطه‌ای (Dots Background)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    محو شدن نقطه‌ها در مرکز فید، هاله نوری نئون، افکت اعوجاج لنزی ماوس تعاملی و خروجی کدهای آماده برای کپی.
                  </p>
                </div>

                {/* Badges list */}
                <div className="flex flex-wrap gap-1.5 justify-end pt-1">
                  {['Interactive Canvas', 'SVG Exporter', 'Theme Presets'].map((b) => (
                    <span key={b} className="text-[9px] font-mono text-indigo-200 bg-indigo-500/5 border border-indigo-500/15 py-0.5 px-2 rounded">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer action button */}
              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4 relative z-10">
                <span className="font-mono text-[10px]">// bg-pattern.tsx</span>
                <span className="text-white font-bold flex items-center gap-1 group-hover:gap-2 transition-all font-sans text-xs">
                  ورود به بخش پس‌زمینه
                  <ChevronRight className="size-4" />
                </span>
              </div>
            </motion.div>

            {/* Card 2: Liquid Glass (Active WebGL Sandbox) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ y: -6, transition: { duration: 0.15 } }}
              onClick={() => setCurrentView('liquid-glass')}
              className="group relative h-96 rounded-3xl border border-white/10 bg-[#0a0a0c] overflow-hidden flex flex-col justify-between p-8 cursor-pointer shadow-2xl transition-all hover:border-purple-500/40 hover:shadow-purple-500/5 select-none"
            >
              {/* Beautiful blurred glass style preview */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-purple-500/10 opacity-30 group-hover:opacity-60 transition-all pointer-events-none" />
              
              <div className="absolute -top-16 -right-16 size-44 rounded-full bg-purple-500/10 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

              {/* Card Header Info */}
              <div className="flex items-start justify-between relative z-10">
                <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-md">
                  <Layers className="size-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="size-3" /> Active Tool
                </span>
              </div>

              {/* Card Content & Features */}
              <div className="space-y-4 relative z-10 text-right" style={{ direction: 'rtl' }}>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    افکت شیشه مایع (Liquid Glass)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    شبیه‌ساز و ادیتور زنده شکست نور شیشه‌ای، انحرافات رنگی (Chromatic Aberration)، لبه ضخیم و جریان فلوئید جیوه‌ای.
                  </p>
                </div>

                {/* Badges list */}
                <div className="flex flex-wrap gap-1.5 justify-end pt-1">
                  {['Acrylic Refraction', 'Fluid Dynamics', 'Glow Shadows'].map((b) => (
                    <span key={b} className="text-[9px] font-mono text-purple-200 bg-purple-500/5 border border-purple-500/15 py-0.5 px-2 rounded">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer action button */}
              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4 relative z-10">
                <span className="font-mono text-[10px]">// liquid-glass.tsx</span>
                <span className="text-purple-300 font-bold flex items-center gap-1 group-hover:gap-2 transition-all font-sans text-xs">
                  ورود به بخش شیشه مایع
                  <ChevronRight className="size-4" />
                </span>
              </div>
            </motion.div>

          </div>

          {/* Core Info Banner Box */}
          <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-4 w-full flex items-center justify-between text-xs gap-4 font-sans text-right" style={{ direction: 'rtl' }}>
            <div className="flex items-center gap-2">
              <Compass className="size-5 text-indigo-400 hidden sm:block shrink-0" />
              <p className="text-slate-300 leading-relaxed">
                <strong>راهنمای گام اول:</strong> ساختار کلی سایت بازنویسی شد. کدهای پس‌زمینه نقطه‌ای به یک فایل کامپوننت ماژولار منتقل شد تا سایت از نو خراب نشود. پوسته Liquid Glass نیز به عنوان فاز دوم آماده دستور کار شماست.
              </p>
            </div>
            <div className="hidden md:block shrink-0 font-mono text-slate-500 text-[10px]">
              RENDER_TIME: ~14ms
            </div>
          </div>

        </main>

        {/* Footer System Bar */}
        <footer className="h-8 px-8 border-t border-white/5 bg-[#050505] flex items-center justify-between text-[9px] font-mono text-slate-600 relative z-10">
          <div>ENGINE: ANTIGRAVITY-BUILDER // v2.0</div>
          <div className="flex gap-4">
            <span>REGION: TEH-NODE-1</span>
            <span className="text-indigo-400 font-bold">CORE READY</span>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#090a0b] overflow-hidden">
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderHomeView()}
          </motion.div>
        )}

        {currentView === 'dots-bg' && (
          <motion.div
            key="dots-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DotsBgGenerator onBack={() => setCurrentView('home')} />
          </motion.div>
        )}

        {currentView === 'liquid-glass' && (
          <motion.div
            key="liquid-glass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LiquidGlassGenerator onBack={() => setCurrentView('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

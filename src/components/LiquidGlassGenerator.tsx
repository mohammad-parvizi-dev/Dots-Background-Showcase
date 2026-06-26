import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  Code, 
  Eye, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Terminal,
  FileCode,
  CheckCircle2,
  ChevronRight,
  Monitor,
  Maximize2,
  X,
  Layers,
  Sparkle,
  Compass,
  Menu,
  MousePointerClick,
  Info,
  ChevronDown,
  LayoutDashboard,
  Home,
  Activity,
  Upload,
  Download
} from 'lucide-react';
import { FluidGlass } from './ui/fluid-glass';

interface LiquidGlassGeneratorProps {
  onBack: () => void;
}

type GlassMode = 'lens' | 'fluid' | 'ripples' | 'acrylic';
type PreviewLayout = 'showcase' | 'button' | 'box' | 'hamburger';

export default function LiquidGlassGenerator({ onBack }: LiquidGlassGeneratorProps) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code-component' | 'code-usage'>('preview');
  const [copiedText, setCopiedText] = useState<'component' | 'usage' | 'install' | null>(null);
  
  // Interactive layout inside preview
  const [previewLayout, setPreviewLayout] = useState<PreviewLayout>('showcase');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Safe load of saved settings from localStorage on initial render
  const savedSettings = (() => {
    try {
      const saved = localStorage.getItem('liquid_glass_generator_settings_v1');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading saved settings:', e);
      return null;
    }
  })();

  // Main state matching the screenshot fields
  const [mode, setMode] = useState<GlassMode>(savedSettings?.mode ?? 'lens');
  const [scale, setScale] = useState<number>(savedSettings?.scale ?? 0.25);
  const [ior, setIor] = useState<number>(savedSettings?.ior ?? 1.15);
  const [thickness, setThickness] = useState<number>(savedSettings?.thickness ?? 2.0);
  const [chromaticAberration, setChromaticAberration] = useState<number>(savedSettings?.chromaticAberration ?? 0.05);
  const [anisotropy, setAnisotropy] = useState<number>(savedSettings?.anisotropy ?? 0.01);
  const [bevelWidth, setBevelWidth] = useState<number>(savedSettings?.bevelWidth ?? 0.015);
  const [blur, setBlur] = useState<number>(savedSettings?.blur ?? 1.2);
  const [transmission, setTransmission] = useState<number>(savedSettings?.transmission ?? 0.9);
  const [roughness, setRoughness] = useState<number>(savedSettings?.roughness ?? 0.3);

  // Sync settings to localStorage
  useEffect(() => {
    const settings = {
      mode,
      scale,
      ior,
      thickness,
      chromaticAberration,
      anisotropy,
      bevelWidth,
      blur,
      transmission,
      roughness
    };
    try {
      localStorage.setItem('liquid_glass_generator_settings_v1', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [mode, scale, ior, thickness, chromaticAberration, anisotropy, bevelWidth, blur, transmission, roughness]);

  // Import/Export States & Refs
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 4000);
  };

  const handleExportSettings = () => {
    const settings = {
      mode,
      scale,
      ior,
      thickness,
      chromaticAberration,
      anisotropy,
      bevelWidth,
      blur,
      transmission,
      roughness
    };
    try {
      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `liquid-glass-settings.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('تنظیمات با موفقیت صادر و دانلود شد!', 'success');
    } catch (e) {
      console.error(e);
      showToast('خطا در صادر کردن تنظیمات', 'error');
    }
  };

  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.mode !== undefined) setMode(data.mode as GlassMode);
        if (data.scale !== undefined) setScale(Number(data.scale));
        if (data.ior !== undefined) setIor(Number(data.ior));
        if (data.thickness !== undefined) setThickness(Number(data.thickness));
        if (data.chromaticAberration !== undefined) setChromaticAberration(Number(data.chromaticAberration));
        if (data.anisotropy !== undefined) setAnisotropy(Number(data.anisotropy));
        if (data.bevelWidth !== undefined) setBevelWidth(Number(data.bevelWidth));
        if (data.blur !== undefined) setBlur(Number(data.blur));
        if (data.transmission !== undefined) setTransmission(Number(data.transmission));
        if (data.roughness !== undefined) setRoughness(Number(data.roughness));
        
        showToast('تنظیمات با موفقیت وارد شد!', 'success');
      } catch (err) {
        console.error('Error importing settings:', err);
        showToast('خطا در خواندن فایل تنظیمات. لطفاً از صحت فرمت فایل مطمئن شوید.', 'error');
      }
    };
    reader.readAsText(file);
    if (e.target) {
      e.target.value = '';
    }
  };

  // Preset definitions
  const presets = [
    {
      name: 'عدسی بلوری (Crystal Lens)',
      mode: 'lens' as GlassMode,
      scale: 0.25,
      ior: 1.15,
      thickness: 2.0,
      chromaticAberration: 0.05,
      anisotropy: 0.01,
      bevelWidth: 0.015,
      blur: 0.0,
      transmission: 0.95,
      roughness: 0.0,
      comment: 'عدسی کروی محدب شفاف با انکسار نوری خالص و بدون بلر'
    },
    {
      name: 'سیال جیوه‌ای (Mercury Fluid)',
      mode: 'fluid' as GlassMode,
      scale: 0.35,
      ior: 1.35,
      thickness: 3.2,
      chromaticAberration: 0.16,
      anisotropy: 0.04,
      bevelWidth: 0.02,
      blur: 0.8,
      transmission: 0.75,
      roughness: 0.2,
      comment: 'متابال‌های شیشه‌ای متحرک جیوه‌ای شکل با شکست نور شدید و بلر ملایم'
    },
    {
      name: 'امواج صوتی (Sonic Ripples)',
      mode: 'ripples' as GlassMode,
      scale: 0.55,
      ior: 1.09,
      thickness: 1.6,
      chromaticAberration: 0.03,
      anisotropy: 0.0,
      bevelWidth: 0.012,
      blur: 0.4,
      transmission: 0.9,
      roughness: 0.1,
      comment: 'امواج نوری دوار با ضربان‌های موج‌گون و بازتاب شفاف'
    },
    {
      name: 'اکریلیک مات (Frosted Acrylic)',
      mode: 'acrylic' as GlassMode,
      scale: 0.75,
      ior: 1.06,
      thickness: 2.2,
      chromaticAberration: 0.08,
      anisotropy: 0.06,
      bevelWidth: 0.025,
      blur: 2.4,
      transmission: 0.60,
      roughness: 0.60,
      comment: 'بافت شیشه‌ای نیمه‌شفاف و مات با پخش نور قوی و محوشدگی عمیق'
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setMode(preset.mode);
    setScale(preset.scale);
    setIor(preset.ior);
    setThickness(preset.thickness);
    setChromaticAberration(preset.chromaticAberration);
    setAnisotropy(preset.anisotropy);
    setBevelWidth(preset.bevelWidth);
    setBlur(preset.blur);
    setTransmission(preset.transmission);
    setRoughness(preset.roughness);
  };

  const renderPreviewLayout = (layout: PreviewLayout, isForFullscreen: boolean = false) => {
    switch (layout) {
      case 'showcase':
        return (
          <motion.div
            key="showcase"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`w-full h-full flex flex-col justify-between gap-4 py-2 ${isForFullscreen ? 'max-w-4xl max-h-[85vh] justify-center' : ''}`}
          >
            {/* TOP: Refractive Capsule Navbar */}
            <div className="flex justify-center w-full pointer-events-auto">
              <div 
                data-glass="true" 
                className="rounded-full border border-white/15 px-10 py-3.5 flex items-center gap-8 text-white/90 shadow-2xl transition-all hover:border-white/30 select-none bg-white/[0.02]"
              >
                <span className="text-xs font-semibold hover:text-purple-300 transition-colors cursor-pointer">Home</span>
                <span className="text-xs font-semibold hover:text-purple-300 transition-colors cursor-pointer">About</span>
                <span className="text-xs font-semibold hover:text-purple-300 transition-colors cursor-pointer">Services</span>
                <span className="text-xs font-semibold hover:text-purple-300 transition-colors cursor-pointer">Contact</span>
              </div>
            </div>

            {/* CENTER: Grid with multiple refractive glass blocks */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center mx-auto w-full pointer-events-auto ${isForFullscreen ? 'max-w-4xl flex-initial my-8' : 'max-w-2xl flex-1'}`}>
              {/* Left: Rounded refractive card box */}
              <div 
                data-glass="true" 
                className="rounded-[32px] border border-white/15 p-6 h-48 flex flex-col justify-between shadow-2xl transition-all hover:border-white/25 text-left"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-widest">// REFRACTIVE DESIGN</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-md font-bold text-white tracking-wide leading-tight">
                    Refractive Box
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-sans leading-relaxed">
                    این باکس شیشه‌ای با متد شکست نور واقعی WebGL، ستون‌های بنفش و اعداد پشت خود را منحرف و منکسر می‌کند.
                  </p>
                </div>
                <div className="text-[9px] font-mono text-zinc-500 pt-2 border-t border-white/5 flex justify-between">
                  <span>IOR: {ior.toFixed(2)}</span>
                  <span>BEVEL: {bevelWidth.toFixed(3)}</span>
                </div>
              </div>

              {/* Right: Quick action panel inside a glass block */}
              <div 
                data-glass="true" 
                className="rounded-[32px] border border-white/15 p-6 h-48 flex flex-col justify-between shadow-2xl transition-all hover:border-white/25 text-right"
                style={{ direction: 'rtl' }}
              >
                <div>
                  <span className="text-[9px] font-mono text-pink-400 font-bold uppercase tracking-widest">// کنترل زنده پوسته</span>
                  <h4 className="text-md font-bold text-white mt-1">پیش‌نمایش تعاملی</h4>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-sans leading-relaxed">
                    با حرکت ماوس روی کارت‌ها، انحرافات نوری لبه‌ها (Chromatic Aberration) را تماشا کنید. تمام لایه‌ها واقعی هستند!
                  </p>
                </div>
                <div className="flex gap-2 pointer-events-auto">
                  <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-[9px] text-white rounded-lg border border-white/10 font-bold transition-all cursor-pointer">کپی متد</button>
                  <button className="flex-1 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-[9px] text-purple-300 rounded-lg border border-purple-500/20 font-bold transition-all cursor-pointer">تغییر افکت</button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'button':
        return (
          <motion.div
            key="button"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`flex flex-col items-center gap-6 text-center w-full pointer-events-auto justify-center ${isForFullscreen ? 'max-w-4xl h-full' : 'max-w-xl'}`}
            style={{ direction: 'rtl' }}
          >
            {/* Header Text without blur background */}
            <div className="space-y-2 mb-2 text-center px-4">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">// نمونه‌های تجربی دکمه‌های شیشه‌ای واقعی</span>
              <h3 className="text-xl font-bold text-white tracking-wide font-sans">انواع دکمه با انکسار نوری خالص</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed max-w-md mx-auto font-sans">
                تمامی دکمه‌های زیر فاقد هرگونه پس‌زمینه بلور نیمه‌کدر (Backdrop Blur) هستند تا افکت انکسار منکسرکننده‌ی فیزیکی WebGL را مستقیماً روی خطوط پس‌زمینه به تمیزترین شکل ممکن لمس کنید.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4">
              {/* Button Style 1: Primary Glass Action */}
              <div className="flex flex-col items-center gap-2 p-4 rounded-[28px] border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                <span className="text-[9px] font-mono text-purple-300 font-medium">۱. طرح کپسولی درخشان (Pill)</span>
                <button 
                  data-glass="true" 
                  className="relative group w-full py-3.5 px-6 text-white font-bold rounded-full border border-white/15 transition-all cursor-pointer shadow-lg active:scale-95 text-xs overflow-hidden flex items-center justify-center gap-2 hover:border-white/30 hover:scale-[1.02] bg-transparent"
                >
                  <Sparkles className="size-4 text-purple-400 group-hover:animate-pulse" />
                  <span className="font-semibold tracking-wider font-sans">تایید و شروع جادوی شیشه</span>
                </button>
              </div>

              {/* Button Style 2: Elegant Rounded Tech */}
              <div className="flex flex-col items-center gap-2 p-4 rounded-[28px] border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                <span className="text-[9px] font-mono text-pink-300 font-medium">۲. طرح مدرن کاملا گرد (Fully Rounded)</span>
                <button 
                  data-glass="true" 
                  className="relative group w-full py-3.5 px-6 text-slate-200 hover:text-white font-bold rounded-full border border-white/10 transition-all cursor-pointer text-xs overflow-hidden flex items-center justify-center gap-2 hover:border-purple-400/30 hover:scale-[1.02] bg-transparent"
                >
                  <MousePointerClick className="size-4 text-pink-400" />
                  <span className="font-semibold font-sans">کلیک و بارگذاری مجدد</span>
                </button>
              </div>

              {/* Button Style 3: Retro Tech Monospaced */}
              <div className="flex flex-col items-center gap-2 p-4 rounded-[28px] border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                <span className="text-[9px] font-mono text-cyan-300 font-medium">۳. طرح ریترو کاملا گرد (Retro Pill)</span>
                <button 
                  data-glass="true" 
                  className="relative group w-full py-3.5 px-6 text-cyan-300 font-bold rounded-full border border-cyan-500/15 transition-all cursor-pointer text-xs overflow-hidden flex items-center justify-center gap-2 hover:border-cyan-400/40 hover:scale-[1.02] bg-transparent font-mono"
                >
                  <Code className="size-3.5" />
                  <span className="tracking-widest text-[10px]">GET_SOURCE_CODE // 01</span>
                </button>
              </div>

              {/* Button Style 4: Minimal Ghost Glass */}
              <div className="flex flex-col items-center gap-2 p-4 rounded-[28px] border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                <span className="text-[9px] font-mono text-emerald-300 font-medium">۴. طرح مینیمال کاملا گرد (Ghost Pill)</span>
                <button 
                  data-glass="true" 
                  className="relative group w-full py-3.5 px-6 text-zinc-350 hover:text-emerald-300 rounded-full border border-white/5 transition-all cursor-pointer text-xs overflow-hidden flex items-center justify-center gap-2 hover:border-emerald-500/20 hover:scale-[1.02] bg-transparent"
                >
                  <span className="font-semibold font-sans">انصراف و بازگشت</span>
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'box':
        return (
          <motion.div
            key="box"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className={`w-full pointer-events-auto shadow-2xl relative overflow-hidden flex justify-center items-center ${isForFullscreen ? 'max-w-2xl h-full' : 'max-w-sm'}`}
          >
            <div 
              data-glass="true" 
              className="rounded-[40px] border border-white/20 p-8 flex flex-col justify-between h-64 text-left shadow-2xl w-full"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-mono text-purple-300">// GLASS_MEMBER_CARD</div>
                  <h3 className="text-lg font-bold text-white tracking-wide mt-0.5 font-sans">کارت رفراکتیو لایه‌ای</h3>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[8px] font-mono text-purple-300 uppercase tracking-widest">
                  Active Shader
                </div>
              </div>

              <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5 text-right" style={{ direction: 'rtl' }}>
                <p className="text-xs text-slate-300 leading-normal font-sans">
                  باکس‌های شیشه‌ای WebGL به عنوان ویجت‌های فوق‌العاده مدرن در طراحی فرانت‌اند لندینگ پیج‌ها، دکمه‌های ناوبری و منوهای معلق استفاده می‌شوند.
                </p>
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                  <span>THICKNESS: {thickness.toFixed(1)}</span>
                  <span>BEVEL: {bevelWidth.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'hamburger':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`w-full flex gap-4 pointer-events-auto justify-center ${isForFullscreen ? 'max-w-4xl h-[450px] my-auto' : 'h-full'}`}
            style={{ direction: 'rtl' }}
          >
            {/* Elegant Glass Sidebar */}
            <div 
              data-glass="true" 
              className="w-48 h-full rounded-[24px] border border-white/15 p-4 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-white">
                  <LayoutDashboard className="size-4 text-purple-400" />
                  <span className="text-xs font-bold tracking-wider font-mono">گلس‌پنل // GP</span>
                </div>
                
                <nav className="flex flex-col gap-1.5">
                  {[
                    { label: 'داشبورد اصلی', icon: Home, active: true },
                    { label: 'آنالیز انکسار', icon: Activity },
                    { label: 'تنظیمات شیشه', icon: Sliders },
                    { label: 'کدهای سیستم', icon: Terminal }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button 
                        key={i} 
                        className={`py-2 px-3 rounded-xl flex items-center gap-2 text-right transition-all cursor-pointer ${
                          item.active 
                            ? 'bg-purple-500/10 border border-purple-500/25 text-purple-200' 
                            : 'hover:bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className={`size-3.5 ${item.active ? 'text-purple-400' : 'text-slate-400'}`} />
                        <span className="text-[10px] font-bold font-sans">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-2 border-t border-white/5 text-center">
                <span className="text-[8px] font-mono text-zinc-500">v2.1.0 SHADER // ONLINE</span>
              </div>
            </div>

            {/* Main Glass Dashboard Content Area */}
            <div className="flex-1 h-full flex flex-col justify-between">
              {/* Top bar with glass search / profile indicators */}
              <div 
                data-glass="true" 
                className="w-full h-11 rounded-2xl border border-white/10 px-4 flex items-center justify-between text-zinc-400"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-zinc-400">سیستم وب‌جی‌ال آنلاین</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span className="text-[9px] font-mono">مهمان // GUEST</span>
                </div>
              </div>

              {/* Central Grid cards */}
              <div className="grid grid-cols-3 gap-3 my-3 flex-1">
                {[
                  { label: 'ضریب شکست (IOR)', value: ior.toFixed(2), unit: 'n_idx', color: 'text-purple-400' },
                  { label: 'ضخامت (Edge)', value: thickness.toFixed(1), unit: 'px_val', color: 'text-pink-400' },
                  { label: 'زبری (Roughness)', value: roughness.toFixed(2), unit: 'frosted', color: 'text-cyan-400' }
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    data-glass="true" 
                    className="rounded-2xl border border-white/10 p-3 flex flex-col justify-between shadow-lg"
                  >
                    <span className="text-[8px] text-zinc-400 font-sans">{stat.label}</span>
                    <div>
                      <div className={`text-sm font-black font-mono tracking-tight ${stat.color}`}>{stat.value}</div>
                      <div className="text-[7px] font-mono text-zinc-500">{stat.unit}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom notice */}
              <div 
                data-glass="true" 
                className="w-full rounded-2xl border border-white/5 p-2 text-center"
              >
                <p className="text-[9px] text-slate-400 font-sans leading-none">
                  برای تغییر آنی آمارهای فوق، اسلایدرهای پنل سمت راست را تغییر دهید.
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const codeComponentString = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Component: FluidGlass (WebGL-Powered Refraction & Reflection Glass Shader)
 * Description: High-performance interactive liquid glass refraction rendering
 *              engine utilizing custom fragment shaders, chromatic aberration channels,
 *              specular Highlights, and anisotropic specular stretching.
 */
import React, { useRef, useEffect } from 'react';

export interface FluidGlassProps extends React.ComponentProps<'div'> {
  mode?: 'lens' | 'fluid' | 'ripples' | 'acrylic';
  scale?: number;
  ior?: number;
  thickness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
}

export function FluidGlass({
  mode = 'lens',
  scale = 0.25,
  ior = 1.15,
  thickness = 2.0,
  chromaticAberration = 0.05,
  anisotropy = 0.01,
  interactive = true,
  className,
  children,
  ...props
}: FluidGlassProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const pArray: Particle[] = [];
    for (let i = 0; i < 10; i++) {
      pArray.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.003,
        radius: 0.05 + Math.random() * 0.06,
        targetRadius: 0.05 + Math.random() * 0.06,
      });
    }
    particlesRef.current = pArray;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => { mouseRef.current.active = false; };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;

    const vsSource = \`
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    \`;

    const fsSource = \`
      precision highp float;
      varying vec2 vUv;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform int u_mode;
      uniform float u_scale;
      uniform float u_ior;
      uniform float u_thickness;
      uniform float u_chromatic_aberration;
      uniform float u_anisotropy;
      uniform vec3 u_particles[10];

      vec3 getBgGradient(vec2 uv) {
        vec3 col1 = vec3(0.043, 0.047, 0.063);
        vec3 col2 = vec3(0.08, 0.06, 0.16);
        vec3 col3 = vec3(0.01, 0.09, 0.10);
        float mixVal = 0.5 + 0.5 * sin(u_time * 0.4 + uv.y);
        vec3 col = mix(col1, col2, uv.y * mixVal);
        col = mix(col, col3, uv.x * (1.0 - uv.y) * (1.0 - mixVal));
        float d1 = distance(uv, vec2(0.3 + sin(u_time * 0.3) * 0.1, 0.7 + cos(u_time * 0.2) * 0.1));
        col += vec3(0.12, 0.08, 0.24) * exp(-d1 * 4.5);
        return col;
      }

      vec3 renderBackground(vec2 uv) {
        vec3 col = getBgGradient(uv);
        vec2 gridUv = uv * vec2(36.0 * (u_resolution.x / u_resolution.y), 36.0);
        vec2 dots = abs(sin(gridUv * 3.14159));
        float dotStrength = smoothstep(0.965, 0.985, dots.x * dots.y);
        return mix(col, vec3(1.0) * 0.15, dotStrength);
      }

      float getHeight(vec2 uv) {
        float h = 0.0;
        if (u_mode == 0) {
          float d = distance(uv, u_mouse);
          float rad = u_scale * 0.8;
          if (d < rad) h = pow(1.0 - (d / rad), 2.0) * u_thickness * 1.5;
        } else if (u_mode == 1) {
          for (int i = 0; i < 10; i++) {
            float d = distance(uv, u_particles[i].xy);
            float r = u_particles[i].z * u_scale * 2.5;
            h += (r * r) / (d * d + 0.002);
          }
          h = smoothstep(0.18, 0.45, h * 0.08) * u_thickness;
        } else if (u_mode == 2) {
          float d = distance(uv, u_mouse);
          h = max(0.0, sin(d * 42.0 - u_time * 6.5) * exp(-d * (5.5 / u_scale)) * u_thickness * 0.45);
        } else if (u_mode == 3) {
          h = (sin(uv.x * 5.0 + u_time * 0.5) * cos(uv.y * 4.0 - u_time * 0.3) * 0.5 + 0.5) * u_thickness * 0.4 * u_scale;
        }
        return h;
      }

      void main() {
        vec2 eps = vec2(0.0035, 0.0);
        vec3 normal = normalize(vec3(
          getHeight(vUv - eps.xy) - getHeight(vUv + eps.xy),
          getHeight(vUv - eps.yx) - getHeight(vUv + eps.yx),
          1.0 / 1.2
        ));
        float refractFactor = (u_ior - 1.0) * 0.35;
        vec3 finalColor = vec3(
          renderBackground(vUv + normal.xy * (refractFactor + u_chromatic_aberration * 0.12)).r,
          renderBackground(vUv + normal.xy * refractFactor).g,
          renderBackground(vUv + normal.xy * (refractFactor - u_chromatic_aberration * 0.12)).b
        );
        vec3 lightDir = normalize(vec3(1.5, 1.5, 2.5));
        float specPower = max(2.5, 28.0 - u_anisotropy * 240.0 * abs(normal.x));
        finalColor += vec3(1.0) * pow(max(0.0, dot(normal, normalize(lightDir + vec3(0.0, 0.0, 1.0)))), specPower) * 0.42 * u_thickness;
        float h = getHeight(vUv);
        finalColor += vec3(1.0) * smoothstep(0.08, 0.0, h) * smoothstep(0.0, 0.04, h) * 0.15 * u_thickness;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    \`;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMode = gl.getUniformLocation(prog, 'u_mode');
    const uScale = gl.getUniformLocation(prog, 'u_scale');
    const uIor = gl.getUniformLocation(prog, 'u_ior');
    const uThickness = gl.getUniformLocation(prog, 'u_thickness');
    const uChromaticAberration = gl.getUniformLocation(prog, 'u_chromatic_aberration');
    const uAnisotropy = gl.getUniformLocation(prog, 'u_anisotropy');
    const uParticles = gl.getUniformLocation(prog, 'u_particles');

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    let mX = 0.5, mY = 0.5, start = Date.now();
    const loop = () => {
      const t = (Date.now() - start) / 1000.0;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      mX += ((mouseRef.current.active ? mouseRef.current.x : 0.5 + Math.sin(t*0.8)*0.2) - mX) * 0.08;
      mY += ((mouseRef.current.active ? mouseRef.current.y : 0.5 + Math.cos(t*0.6)*0.2) - mY) * 0.08;
      gl.uniform2f(uMouse, mX, mY);
      gl.uniform1f(uTime, t);
      gl.uniform1i(uMode, { lens: 0, fluid: 1, ripples: 2, acrylic: 3 }[mode]);
      gl.uniform1f(uScale, scale);
      gl.uniform1f(uIor, ior);
      gl.uniform1f(uThickness, thickness);
      gl.uniform1f(uChromaticAberration, chromaticAberration);
      gl.uniform1f(uAnisotropy, anisotropy);

      const parts = particlesRef.current;
      const uArray = new Float32Array(10 * 3);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy;
        p.radius += (p.targetRadius - p.radius) * 0.01;
        if (Math.abs(p.radius - p.targetRadius) < 0.005) p.targetRadius = 0.04 + Math.random()*0.08;
        
        const dx = (mouseRef.current.active ? mouseRef.current.x : 0.5) - p.x;
        const dy = (mouseRef.current.active ? mouseRef.current.y : 0.5) - p.y;
        p.vx = Math.max(-0.004, Math.min(0.004, p.vx + dx * 0.0001));
        p.vy = Math.max(-0.004, Math.min(0.004, p.vy + dy * 0.0001));

        if (p.x < 0.05 || p.x > 0.95) p.vx *= -1.0;
        if (p.y < 0.05 || p.y > 0.95) p.vy *= -1.0;

        uArray[i*3] = p.x; uArray[i*3+1] = p.y; uArray[i*3+2] = p.radius;
      }
      gl.uniform3fv(uParticles, uArray);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animationFrameId.current!);
      gl.deleteBuffer(buf);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(prog);
    };
  }, [mode, scale, ior, thickness, chromaticAberration, anisotropy]);

  return (
    <div ref={containerRef} className={cn('relative w-full h-full overflow-hidden select-none', className)} {...props}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none z-0" />
      <div className="relative z-10 w-full h-full pointer-events-none">{children}</div>
    </div>
  );
}`;

  const codeUsageString = `import React from 'react';
import { FluidGlass } from '@/components/ui/fluid-glass';

export default function AppShowcase() {
  return (
    <div className="relative w-full h-screen bg-[#090a0b] flex flex-col justify-center items-center overflow-hidden">
      {/* Background Refraction Layer */}
      <FluidGlass 
        mode="${mode}" 
        scale={${scale}} 
        ior={${ior}} 
        thickness={${thickness}} 
        chromaticAberration={${chromaticAberration}} 
        anisotropy={${anisotropy}}
        bevelWidth={${bevelWidth}}
        blur={${blur}}
        transmission={${transmission}}
        roughness={${roughness}}
        interactive={true}
        className="absolute inset-0 z-0"
      />

      {/* Futuristic Interface overlaid on top of glass */}
      <div className="relative z-10 text-center max-w-xl px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
          LIQUID GLASS
        </h1>
        <p className="mt-4 text-slate-300 text-sm leading-relaxed">
          WebGL-powered realistic refraction effects with live Index of Refraction (IOR),
          specular reflections, and chromatic aberration colors.
        </p>
      </div>
    </div>
  );
}`;

  const copyToClipboard = (text: string, type: 'component' | 'usage' | 'install') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="h-screen lg:overflow-hidden overflow-y-auto flex flex-col bg-[#090a0b] text-slate-200 select-none font-sans" id="liquid-glass-showcase-container">
      {/* Background glow and subtle dots mesh */}
      <div className="absolute inset-0 bg-radial-gradient(ellipse at center, transparent, #090a0b) pointer-events-none z-0" />

      {/* Header Navigation mimicking dots-bg perfectly */}
      <header className="relative z-20 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md px-8 py-4" id="view-header">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Sleek back button */}
            <button
              onClick={onBack}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/10 transition-all flex items-center gap-2 cursor-pointer font-sans text-xs group"
            >
              <ChevronRight className="size-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
              <span>بازگشت به کتابخانه</span>
            </button>
            
            <div className="h-6 w-[1px] bg-white/10 hidden md:block" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight uppercase text-white">Fluid Glass (شیشه مایع)</h1>
                <span className="text-[10px] text-purple-500 font-mono tracking-widest uppercase">v2.1.0 // components / fluid-glass.tsx</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-sans" style={{ direction: 'rtl' }}>
                افکت بازتاب مایع شیشه‌ای متحرک با فلوئیدهای آکریلیک و انحرافات نوری شکست نور شبیه‌سازی شده تحت وب‌جی‌ال (WebGL).
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 self-start md:self-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20 text-[10px] font-medium text-purple-400 tracking-wider font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse font-mono"></span> WEBGL PIPELINE ACTIVE
            </div>
            <span className="text-[11px] font-mono text-zinc-500">// REACTBITS PORT</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Grid - Bento Layout */}
      <main className="relative z-10 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 w-full max-w-none lg:overflow-hidden" id="main-content">
        
        {/* Left Side: Live Sandbox & Presets (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6 h-full" id="left-sandbox">
          
          {/* Active Preset Quick-Select - Bento Panel */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Sparkles className="size-3.5 text-purple-400" />
                PRESETS CATALOG / کاتالوگ حالات شیشه مایع
              </span>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImportSettings} 
                  accept=".json" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-mono tracking-wider text-purple-400 hover:text-white flex items-center gap-1 transition-colors bg-purple-500/10 hover:bg-purple-500/20 px-2 py-1 rounded border border-purple-500/20 cursor-pointer"
                  title="وارد کردن تنظیمات از فایل JSON"
                >
                  <Upload className="size-3" />
                  IMPORT JSON
                </button>
                <button
                  type="button"
                  onClick={handleExportSettings}
                  className="text-[10px] font-mono tracking-wider text-emerald-400 hover:text-white flex items-center gap-1 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/20 cursor-pointer"
                  title="دانلود تنظیمات فعلی به عنوان فایل JSON"
                >
                  <Download className="size-3" />
                  EXPORT JSON
                </button>
                <button 
                  type="button"
                  onClick={() => handleApplyPreset(presets[0])}
                  className="text-[10px] font-mono tracking-wider text-zinc-500 hover:text-white flex items-center gap-1 transition-colors bg-white/5 px-2 py-1 rounded border border-white/5 cursor-pointer"
                  title="ریست به حالت اولیه"
                >
                  <RotateCcw className="size-3" />
                  RESET
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presets.map((p, idx) => {
                const isActive = mode === p.mode && Math.abs(scale - p.scale) < 0.01 && Math.abs(ior - p.ior) < 0.01 && Math.abs(thickness - p.thickness) < 0.01;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`text-left p-3 rounded-2xl text-xs border transition-all ${
                      isActive 
                        ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/10'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className={`font-mono text-[9px] mb-1 tracking-widest ${isActive ? 'text-purple-200' : 'text-zinc-500'}`}>
                      {`// PRESET 0${idx + 1}`}
                    </div>
                    <span className="truncate block font-semibold text-xs">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Component Showcase - High Tech Bento Preview Panel */}
          <div className="flex-1 min-h-[480px] relative rounded-3xl border border-white/10 overflow-hidden flex flex-col group shadow-2xl transition-colors duration-300 bg-[#060608]">
            
            {/* The actual FluidGlass previewing live */}
            <FluidGlass 
              mode={mode}
              scale={scale}
              ior={ior}
              thickness={thickness}
              chromaticAberration={chromaticAberration}
              anisotropy={anisotropy}
              bevelWidth={bevelWidth}
              blur={blur}
              transmission={transmission}
              roughness={roughness}
              interactive={true}
              className="absolute inset-0 z-0"
            />

            {/* Top custom bar with preview selectors to showcase Buttons, Boxes, Hamburger menu */}
            <div className="absolute top-0 left-0 right-0 h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-15">
              {/* Preview selectors inside preview box */}
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <span className="text-[10px] font-mono text-zinc-500 tracking-wider mr-2 uppercase hidden sm:inline-block">PREVIEW LAYOUT:</span>
                {[
                  { id: 'showcase', label: 'طراحی ترکیبی (Showcase)' },
                  { id: 'button', label: 'دکمه شیشه‌ای (Button)' },
                  { id: 'box', label: 'کارت لایه‌ای (Box)' },
                  { id: 'hamburger', label: 'داشبورد گلس (Dashboard)' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setPreviewLayout(btn.id as PreviewLayout)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      previewLayout === btn.id 
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-purple-200 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 rounded-xl transition-all cursor-pointer hover:border-purple-500/45 active:scale-95"
                >
                  <Maximize2 className="size-3 text-purple-400" />
                  <span>تمام‌صفحه (Fullscreen)</span>
                </button>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 border border-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 border border-white/10" />
                </div>
              </div>
            </div>

            {/* Dynamic Content overlays depending on selected layout state */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 z-10 pointer-events-none mt-14 mb-10">
              <AnimatePresence mode="wait">
                {renderPreviewLayout(previewLayout, false)}
              </AnimatePresence>
            </div>

            {/* Absolute bottom measurements/metadata block overlay */}
            <div className="absolute bottom-4 left-6 flex gap-6 text-[10px] font-mono text-zinc-500 pointer-events-none z-10">
              <span>SHADER: WebGL Fragment Program</span>
              <span>RENDER_ENGINE: Liquid Refraction v2</span>
              <span>BEVEL_WIDTH: {bevelWidth.toFixed(3)}</span>
              <span>IOR_INDEX: {ior.toFixed(2)}</span>
            </div>

            {/* Bottom active tag absolute indicator overlay */}
            <div className="absolute bottom-4 right-6 pointer-events-none z-10 font-mono text-[9px]">
              <div className="bg-black/60 border border-white/10 rounded-lg py-1 px-2.5 pointer-events-auto">
                <code className="text-purple-400">
                  {`// HTML: <div data-glass="true">...</div>`}
                </code>
              </div>
            </div>

          </div>
        </section>

        {/* Right Side: Control Sliders and Code Library Tabs (5 cols) - Unified Card */}
        <section 
          className="lg:col-span-5 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl lg:h-full lg:max-h-full lg:overflow-y-auto flex flex-col gap-6 scrollbar-thin scrollbar-thumb-white/10 pb-16" 
          id="right-controls" 
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Part 1: Customization Controls */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 font-mono">
              <Sliders className="size-4 text-purple-400" />
              <span>CONFIGURATION PARAMETERS / تنظیمات نوری شیشه</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              
              {/* Card 1: Mode (Styled as custom segmented controls to avoid browser dropdown bugs) */}
              <div className="bg-[#12101a]/40 border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center justify-between gap-4 h-14 hover:border-white/[0.12] hover:bg-[#12101a]/60 transition-all shadow-md sm:col-span-2">
                <div className="flex flex-col">
                  <span className="text-slate-300 font-semibold text-xs tracking-wide">Glass Mode</span>
                  <span className="text-[9px] text-slate-500 font-sans">افکت پویایی شیشه</span>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 gap-1">
                  {(['lens', 'fluid', 'ripples', 'acrylic'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all capitalize cursor-pointer ${
                        mode === m
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 3: IOR */}
              <div className="bg-[#12101a]/40 border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center justify-between gap-4 h-14 hover:border-white/[0.12] hover:bg-[#12101a]/60 transition-all shadow-md">
                <div className="flex flex-col min-w-[70px]">
                  <span className="text-slate-300 font-semibold text-xs tracking-wide">IOR</span>
                  <span className="text-[9px] text-slate-500 font-sans">شکست نور</span>
                </div>
                <input 
                  type="range"
                  min="1.00"
                  max="3.00"
                  step="0.01"
                  value={ior}
                  onChange={(e) => setIor(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow"
                />
                <span className="text-xs font-mono text-white font-medium min-w-[2.5rem] text-right">{ior.toFixed(2)}</span>
              </div>

              {/* Card 4: Thickness */}
              <div className="bg-[#12101a]/40 border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center justify-between gap-4 h-14 hover:border-white/[0.12] hover:bg-[#12101a]/60 transition-all shadow-md">
                <div className="flex flex-col min-w-[70px]">
                  <span className="text-slate-300 font-semibold text-xs tracking-wide">Thickness</span>
                  <span className="text-[9px] text-slate-500 font-sans">ضخامت شکست</span>
                </div>
                <input 
                  type="range"
                  min="0.0"
                  max="25.0"
                  step="0.1"
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow"
                />
                <span className="text-xs font-mono text-white font-medium min-w-[2.5rem] text-right">{thickness.toFixed(1)}</span>
              </div>

              {/* Card 5: Chromatic Aberration */}
              <div className="bg-[#12101a]/40 border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center justify-between gap-4 h-14 hover:border-white/[0.12] hover:bg-[#12101a]/60 transition-all shadow-md">
                <div className="flex flex-col min-w-[70px]">
                  <span className="text-slate-300 font-semibold text-xs tracking-wide">Aberration</span>
                  <span className="text-[9px] text-slate-500 font-sans">انحراف منشوری</span>
                </div>
                <input 
                  type="range"
                  min="0.00"
                  max="0.80"
                  step="0.01"
                  value={chromaticAberration}
                  onChange={(e) => setChromaticAberration(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow"
                />
                <span className="text-xs font-mono text-white font-medium min-w-[2.5rem] text-right">{chromaticAberration.toFixed(2)}</span>
              </div>

              {/* Card 6: Anisotropy */}
              <div className="bg-[#12101a]/40 border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center justify-between gap-4 h-14 hover:border-white/[0.12] hover:bg-[#12101a]/60 transition-all shadow-md">
                <div className="flex flex-col min-w-[70px]">
                  <span className="text-slate-300 font-semibold text-xs tracking-wide">Anisotropy</span>
                  <span className="text-[9px] text-slate-500 font-sans">کشیدگی بازتاب</span>
                </div>
                <input 
                  type="range"
                  min="0.00"
                  max="0.20"
                  step="0.01"
                  value={anisotropy}
                  onChange={(e) => setAnisotropy(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow"
                />
                <span className="text-xs font-mono text-white font-medium min-w-[2.5rem] text-right">{anisotropy.toFixed(2)}</span>
              </div>

              {/* Card 7: Transmission */}
              <div className="bg-[#12101a]/40 border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center justify-between gap-4 h-14 hover:border-white/[0.12] hover:bg-[#12101a]/60 transition-all shadow-md">
                <div className="flex flex-col min-w-[70px]">
                  <span className="text-slate-300 font-semibold text-xs tracking-wide">Transmission</span>
                  <span className="text-[9px] text-slate-500 font-sans">شفافیت شیشه</span>
                </div>
                <input 
                  type="range"
                  min="0.00"
                  max="1.00"
                  step="0.05"
                  value={transmission}
                  onChange={(e) => setTransmission(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow"
                />
                <span className="text-xs font-mono text-white font-medium min-w-[2.5rem] text-right">{transmission.toFixed(2)}</span>
              </div>

              {/* Card 8: Roughness */}
              <div className="bg-[#12101a]/40 border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center justify-between gap-4 h-14 hover:border-white/[0.12] hover:bg-[#12101a]/60 transition-all shadow-md">
                <div className="flex flex-col min-w-[70px]">
                  <span className="text-slate-300 font-semibold text-xs tracking-wide">Roughness</span>
                  <span className="text-[9px] text-slate-500 font-sans">زبری و نویز سطح شیشه</span>
                </div>
                <input 
                  type="range"
                  min="0.00"
                  max="1.00"
                  step="0.05"
                  value={roughness}
                  onChange={(e) => setRoughness(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow"
                />
                <span className="text-xs font-mono text-white font-medium min-w-[2.5rem] text-right">{roughness.toFixed(2)}</span>
              </div>

              {/* Card 9: Bevel Width */}
              <div className="bg-[#12101a]/40 border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center justify-between gap-4 h-14 hover:border-white/[0.12] hover:bg-[#12101a]/60 transition-all shadow-md">
                <div className="flex flex-col min-w-[70px]">
                  <span className="text-slate-300 font-semibold text-xs tracking-wide">Bevel Width</span>
                  <span className="text-[9px] text-slate-500 font-sans">پهنای لبه پخ</span>
                </div>
                <input 
                  type="range"
                  min="0.001"
                  max="0.15"
                  step="0.001"
                  value={bevelWidth}
                  onChange={(e) => setBevelWidth(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow"
                />
                <span className="text-xs font-mono text-white font-medium min-w-[2.5rem] text-right">{bevelWidth.toFixed(3)}</span>
              </div>

              {/* Card 10: Blur */}
              <div className="bg-[#12101a]/40 border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center justify-between gap-4 h-14 hover:border-white/[0.12] hover:bg-[#12101a]/60 transition-all shadow-md">
                <div className="flex flex-col min-w-[70px]">
                  <span className="text-slate-300 font-semibold text-xs tracking-wide">Glass Blur</span>
                  <span className="text-[9px] text-slate-500 font-sans">مات‌شدگی زمینه</span>
                </div>
                <input 
                  type="range"
                  min="0.0"
                  max="8.0"
                  step="0.1"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow"
                />
                <span className="text-xs font-mono text-white font-medium min-w-[2.5rem] text-right">{blur.toFixed(1)}</span>
              </div>

            </div>
          </div>

          {/* Part 2: Developer Code Copy Station */}
          <div className="flex-1 flex flex-col border-t border-white/10 pt-4 gap-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 font-mono">
              <Code className="size-4 text-purple-400" />
              <span>DEVELOPER INTEGRATION CODES / کدهای توسعه</span>
            </span>

            {/* Code Navigation Tabs */}
            <div className="flex bg-[#0d0d0f] p-1.5 rounded-2xl border border-white/5 w-full">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'preview' 
                    ? 'bg-white/10 text-white border border-white/10' 
                    : 'text-zinc-500 hover:text-slate-300'
                }`}
              >
                راهنما
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code-component')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'code-component' 
                    ? 'bg-white/10 text-white border border-white/10' 
                    : 'text-zinc-500 hover:text-slate-300'
                }`}
              >
                <FileCode className="size-3.5" />
                <span>fluid-glass.tsx</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code-usage')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'code-usage' 
                    ? 'bg-white/10 text-white border border-white/10' 
                    : 'text-zinc-500 hover:text-slate-300'
                }`}
              >
                <Terminal className="size-3.5" />
                <span>نحوه استفاده</span>
              </button>
            </div>

            {/* Tab content area */}
            <div className="flex-1 bg-[#050506] rounded-2xl border border-white/5 p-4 overflow-x-auto min-h-[200px] relative">
              {activeTab === 'preview' && (
                <div className="space-y-4 text-slate-300 text-xs font-sans leading-relaxed text-right p-2" style={{ direction: 'rtl' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="size-4 text-purple-400" />
                    <h4 className="font-bold text-white text-sm">نحوه پیاده‌سازی افکت شیشه مایع</h4>
                  </div>
                  <p>
                    این کامپوننت با قدرت رندرینگ سخت‌افزاری <strong>WebGL</strong> اجرا شده و از یک شیدر قطعه (Fragment Shader) کاملاً سفارشی جهت بازتاب نور طبیعی و رنگ‌های شکست منشور استفاده می‌کند.
                  </p>
                  
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-left leading-normal" style={{ direction: 'ltr' }}>
                    <span className="text-purple-400">// Step 1: Install packages if needed</span>
                    <br />
                    <span>npm install motion</span>
                  </div>

                  <ul className="list-disc list-inside space-y-1 text-slate-400 pr-2">
                    <li>عدم استفاده از کتابخانه‌های سنگین خارجی مانند Three.js، رندر کامپوننت را ۱۰۰٪ سبک و مستقل کرده است.</li>
                    <li>پشتیبانی از مدیریت هوشمند ریسایز و تعامل لمسی در موبایل.</li>
                    <li>قابلیت استفاده به عنوان پوشش پس‌زمینه کامل یا قرار دادن روی دکمه‌ها و فرم‌ها.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'code-component' && (
                <div className="font-mono text-[10.5px] leading-relaxed text-slate-300 h-full max-h-[300px]">
                  <button
                    onClick={() => copyToClipboard(codeComponentString, 'component')}
                    className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 text-white text-[10px] flex items-center gap-1 transition-all"
                  >
                    {copiedText === 'component' ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span className="text-emerald-400">کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>کپی کامپوننت</span>
                      </>
                    )}
                  </button>
                  <pre className="text-left select-text p-2 pt-8 whitespace-pre overflow-auto max-h-[250px] scrollbar-thin scrollbar-thumb-white/10">
                    {codeComponentString}
                  </pre>
                </div>
              )}

              {activeTab === 'code-usage' && (
                <div className="font-mono text-[10.5px] leading-relaxed text-slate-300 h-full max-h-[300px]">
                  <button
                    onClick={() => copyToClipboard(codeUsageString, 'usage')}
                    className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 text-white text-[10px] flex items-center gap-1 transition-all"
                  >
                    {copiedText === 'usage' ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span className="text-emerald-400">کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>کپی کد استفاده</span>
                      </>
                    )}
                  </button>
                  <pre className="text-left select-text p-2 pt-8 whitespace-pre overflow-auto max-h-[250px] scrollbar-thin scrollbar-thumb-white/10">
                    {codeUsageString}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Fullscreen Overlay with elegant fade animation */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#090a0b] flex flex-col"
          >
            {/* Fullscreen Background refraction */}
            <FluidGlass 
              mode={mode}
              scale={scale}
              ior={ior}
              thickness={thickness}
              chromaticAberration={chromaticAberration}
              anisotropy={anisotropy}
              bevelWidth={bevelWidth}
              blur={blur}
              transmission={transmission}
              roughness={roughness}
              interactive={true}
              className="absolute inset-0 z-0"
            />

            {/* Top Close bar */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
              <div className="bg-black/35 backdrop-blur-md border border-white/10 rounded-2xl py-2 px-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-xs font-mono text-zinc-350 uppercase">FULLSCREEN LIVE SANDBOX PREVIEW</span>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all cursor-pointer shadow-lg"
              >
                <X className="size-4" />
                <span>خروج از تمام‌صفحه</span>
              </button>
            </div>

            {/* Active Preview Elements inside fullscreen layout */}
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 z-10 pointer-events-none mt-20 mb-10">
              <div className="w-full max-w-5xl h-full flex items-center justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                  {renderPreviewLayout(previewLayout, true)}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom watermark inside fullscreen */}
            <div className="absolute bottom-6 left-6 text-[10px] font-mono text-zinc-500">
              PRESS ESCAPE OR CLICK CLOSE TO EXIT PREVIEW
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer System Bar */}
      <footer className="h-8 px-8 border-t border-white/5 bg-[#050505] flex items-center justify-between text-[9px] font-mono text-slate-600 relative z-10">
        <div>ENGINE: LIQUID_GLASS_RENDER_SERVICE // active</div>
        <div className="flex gap-4">
          <span>PORT: 3000 // STANDALONE READY</span>
          <span className="text-purple-400 font-bold">READY FOR DEPLOY</span>
        </div>
      </footer>

      {/* Toast Notification for Import/Export feedbacks */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-12 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border shadow-2xl font-sans text-xs font-semibold backdrop-blur-md ${
              toastType === 'success'
                ? 'bg-[#0a0a0a]/90 border-emerald-500/30 text-emerald-200'
                : 'bg-[#0a0a0a]/90 border-red-500/30 text-red-200'
            }`}
            style={{ direction: 'rtl' }}
          >
            {toastType === 'success' ? (
              <CheckCircle2 className="size-4.5 text-emerald-400 shrink-0" />
            ) : (
              <X className="size-4.5 text-red-400 shrink-0" />
            )}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

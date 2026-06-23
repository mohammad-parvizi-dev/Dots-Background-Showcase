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
  Info,
  Maximize2,
  X,
  MousePointerClick,
  Download
} from 'lucide-react';
import { BGPattern } from './components/ui/bg-pattern';

export default function App() {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Safe load of saved settings from localStorage on initial render
  const savedSettings = (() => {
    try {
      const saved = localStorage.getItem('dot_bg_generator_settings_v1');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading saved settings:', e);
      return null;
    }
  })();
  
  // Mouse interactive controls
  const [interactive, setInteractive] = useState<boolean>(savedSettings?.interactive ?? true);
  const [mouseRadius, setMouseRadius] = useState<number>(savedSettings?.mouseRadius ?? 200);
  const [mouseStrength, setMouseStrength] = useState<number>(savedSettings?.mouseStrength ?? 8);

  // Preset themes
  const presets = [
    {
      name: 'Default Dark Charcoal',
      size: 24,
      dotSize: 1,
      fill: 'rgba(255, 255, 255, 0.15)',
      maskColor: '#090a0b',
      text: 'Slate Carbon Theme'
    },
    {
      name: 'Neo Mint Matrix',
      size: 32,
      dotSize: 1.5,
      fill: 'rgba(52, 211, 153, 0.25)',
      maskColor: '#022c22',
      text: 'Emerald Terminal Theme'
    },
    {
      name: 'Indigo Cyberpunk Aura',
      size: 20,
      dotSize: 1.2,
      fill: 'rgba(129, 140, 248, 0.3)',
      maskColor: '#0b0f19',
      text: 'Cyberpunk Midnight Theme'
    },
    {
      name: 'Elegant Studio Light',
      size: 28,
      dotSize: 1.2,
      fill: 'rgba(15, 23, 42, 0.12)',
      maskColor: '#ffffff',
      text: 'Minimalist Clean Paper Theme'
    }
  ];

  // Pattern parameters state
  const [size, setSize] = useState<number>(savedSettings?.size ?? 24);
  const [dotSize, setDotSize] = useState<number>(savedSettings?.dotSize ?? 2.4);
  const [fill, setFill] = useState<string>(savedSettings?.fill ?? 'rgba(255, 255, 255, 0.15)');
  const [maskColor, setMaskColor] = useState<string>(savedSettings?.maskColor ?? '#090a0b');
  const [showGlow, setShowGlow] = useState<boolean>(savedSettings?.showGlow ?? true);
  const [glowColor, setGlowColor] = useState<string>(savedSettings?.glowColor ?? 'rgba(36, 79, 212, 0.22)'); // #244FD4 at ~22% opacity
  const [maskPosition, setMaskPosition] = useState<'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>(savedSettings?.maskPosition ?? 'center');
  const [maskStart, setMaskStart] = useState<number>(savedSettings?.maskStart ?? 10);
  const [maskEnd, setMaskEnd] = useState<number>(savedSettings?.maskEnd ?? 80);
  const [glowSize, setGlowSize] = useState<number>(savedSettings?.glowSize ?? 125);
  const [glowSpread, setGlowSpread] = useState<number>(savedSettings?.glowSpread ?? 40);

  // Background Export State Settings
  const [exportWidth, setExportWidth] = useState<number>(1920);
  const [exportHeight, setExportHeight] = useState<number>(1080);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');

  // Automatically sync settings to localStorage
  useEffect(() => {
    const settings = {
      size,
      dotSize,
      fill,
      maskColor,
      showGlow,
      glowColor,
      maskPosition,
      maskStart,
      maskEnd,
      glowSize,
      glowSpread,
      interactive,
      mouseRadius,
      mouseStrength
    };
    try {
      localStorage.setItem('dot_bg_generator_settings_v1', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }
  }, [
    size,
    dotSize,
    fill,
    maskColor,
    showGlow,
    glowColor,
    maskPosition,
    maskStart,
    maskEnd,
    glowSize,
    glowSpread,
    interactive,
    mouseRadius,
    mouseStrength
  ]);

  // Interactive controls
  const [activeTab, setActiveTab] = useState<'preview' | 'code-component' | 'code-usage'>('preview');
  const [copiedText, setCopiedText] = useState<'component' | 'usage' | 'install' | null>(null);

  // Quick preset loader helper
  const handleApplyPreset = (preset: typeof presets[0]) => {
    setSize(preset.size);
    setDotSize(preset.dotSize);
    setFill(preset.fill);
    setMaskColor(preset.maskColor);
  };

  // Image exporter matching standard CSS overlays
  const handleExportImage = (exportW: number, exportH: number, format: 'png' | 'jpeg') => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = exportW;
      canvas.height = exportH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill background matching solid maskColor
      ctx.fillStyle = maskColor;
      ctx.fillRect(0, 0, exportW, exportH);

      // Rendering glowing back layers if enabled
      if (showGlow) {
        const cx = exportW / 2;
        const cy = -exportH * 0.5;
        const radius = Math.max(exportW, exportH) * (glowSize / 100);
        const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        glowGrad.addColorStop(0, glowColor);
        glowGrad.addColorStop(glowSpread / 100, glowColor);
        glowGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, exportW, exportH);
      }

      // Create dots layer
      const dotsCanvas = document.createElement('canvas');
      dotsCanvas.width = exportW;
      dotsCanvas.height = exportH;
      const dotsCtx = dotsCanvas.getContext('2d');
      
      if (dotsCtx) {
        const offsetX = (exportW % size) / 2;
        const offsetY = (exportH % size) / 2;

        dotsCtx.fillStyle = fill;
        for (let x = offsetX; x < exportW + size; x += size) {
          for (let y = offsetY; y < exportH + size; y += size) {
            dotsCtx.beginPath();
            dotsCtx.arc(x, y, dotSize, 0, Math.PI * 2);
            dotsCtx.fill();
          }
        }

        // Apply masking gradient matching standard UI
        let maskX = exportW / 2;
        let maskY = exportH / 2;
        let rEnd = Math.sqrt(exportW * exportW + exportH * exportH) / 2;

        if (maskPosition === 'top') { maskX = exportW / 2; maskY = 0; rEnd = exportH; }
        else if (maskPosition === 'bottom') { maskX = exportW / 2; maskY = exportH; rEnd = exportH; }
        else if (maskPosition === 'left') { maskX = 0; maskY = exportH / 2; rEnd = exportW; }
        else if (maskPosition === 'right') { maskX = exportW; maskY = exportH / 2; rEnd = exportW; }
        else if (maskPosition === 'top-left') { maskX = 0; maskY = 0; rEnd = Math.sqrt(exportW * exportW + exportH * exportH); }
        else if (maskPosition === 'top-right') { maskX = exportW; maskY = 0; rEnd = Math.sqrt(exportW * exportW + exportH * exportH); }
        else if (maskPosition === 'bottom-left') { maskX = 0; maskY = exportH ; rEnd = Math.sqrt(exportW * exportW + exportH * exportH); }
        else if (maskPosition === 'bottom-right') { maskX = exportW; maskY = exportH; rEnd = Math.sqrt(exportW * exportW + exportH * exportH); }

        const rStart = rEnd * (maskStart / 100);
        const rEndFinal = rEnd * (maskEnd / 100);

        const maskGrad = dotsCtx.createRadialGradient(
          maskX, maskY, rStart,
          maskX, maskY, Math.max(rStart + 1, rEndFinal)
        );

        maskGrad.addColorStop(0, 'rgba(0,0,0,0)');
        maskGrad.addColorStop(1, 'rgba(0,0,0,1)');

        dotsCtx.globalCompositeOperation = 'destination-in';
        dotsCtx.fillStyle = maskGrad;
        dotsCtx.fillRect(0, 0, exportW, exportH);

        // Blit layers together
        ctx.drawImage(dotsCanvas, 0, 0);
      }

      // Download file
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const extension = format === 'jpeg' ? 'jpg' : 'png';
      const dataUrl = canvas.toDataURL(mimeType, 1.0);
      
      const link = document.createElement('a');
      link.download = `dot-pattern-bg-${exportW}x${exportH}.${extension}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image export:', err);
    }
  };

  const codeComponentString = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Component: BGPattern (Canvas-Powered Dots & Center-Fade Pattern + Glow Background)
 * Description: Fully optimized dot pattern background with high-performance CSS fades,
 *              an integrated glowing radial-gradient back layer, and GPU-accelerated
 *              Canvas mouse inertial tracking for magnetic/concave distortion effects.
 */
import React, { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export interface BGPatternProps extends React.ComponentProps<'div'> {
  /** Size of each grid cell (spacing between dots) */
  size?: number;
  /** Size of each dot in pixels */
  dotSize?: number;
  /** Color of the dots */
  fill?: string;
  /** Background color to fade into at the center */
  maskColor?: string;
  /** Position of the fade mask circle (e.g. 'center', 'top', 'bottom', 'top-left') */
  maskPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Start percentage of transparency fade mask (Default: 10) */
  maskStart?: number;
  /** End percentage of transparency fade mask (Default: 80) */
  maskEnd?: number;
  /** Whether to show the top-center glowing radial background */
  showGlow?: boolean;
  /** Custom color for the glowing radial background */
  glowColor?: string;
  /** Glow layer size percentage (Default: 125) */
  glowSize?: number;
  /** Glow layer spread core percentage (Default: 40) */
  glowSpread?: number;
  /** Whether to enable interactive mouse warping/distortion */
  interactive?: boolean;
  /** Magnetic/Interactive radius around mouse */
  mouseRadius?: number;
  /** Max warping deflection/strength */
  mouseStrength?: number;
}

const BGPattern = React.forwardRef<HTMLDivElement, BGPatternProps>(
  (
    {
      size = 24,
      dotSize = 2.4,
      fill = 'rgba(156, 163, 175, 0.15)',
      maskColor = '#090a0b',
      maskPosition = 'center',
      maskStart = 10,
      maskEnd = 80,
      showGlow = true,
      glowColor = 'rgba(36, 79, 212, 0.22)',
      glowSize = 125,
      glowSpread = 40,
      interactive = false,
      mouseRadius = 200,
      mouseStrength = 8,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const mouseRef = useRef({ x: -2000, y: -2000, active: false });
    const lerpedMouse = useRef({ x: -2000, y: -2000, opacity: 0 });

    useEffect(() => {
      if (!interactive) return;

      const handleMouseMove = (e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        mouseRef.current.active = true;
      };

      const handleMouseLeave = () => {
        mouseRef.current.active = false;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [interactive]);

    useEffect(() => {
      if (!interactive) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationId: number;
      let width = 0;
      let height = 0;

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        width = rect.width;
        height = rect.height;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
      };

      resize();

      const resizeObserver = new ResizeObserver(() => {
        resize();
      });
      if (canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
      }

      const drawLoop = () => {
        ctx.clearRect(0, 0, width, height);

        const targetOpacity = mouseRef.current.active ? 1 : 0;
        lerpedMouse.current.opacity += (targetOpacity - lerpedMouse.current.opacity) * 0.08;

        if (mouseRef.current.active) {
          if (lerpedMouse.current.x < -1000) {
            lerpedMouse.current.x = mouseRef.current.x;
            lerpedMouse.current.y = mouseRef.current.y;
          } else {
            lerpedMouse.current.x += (mouseRef.current.x - lerpedMouse.current.x) * 0.12;
            lerpedMouse.current.y += (mouseRef.current.y - lerpedMouse.current.y) * 0.12;
          }
        }

        const offsetX = (width % size) / 2;
        const offsetY = (height % size) / 2;

        ctx.fillStyle = fill;

        const mX = lerpedMouse.current.x;
        const mY = lerpedMouse.current.y;
        const currentOpacity = lerpedMouse.current.opacity;
        const isInteracting = currentOpacity > 0.01;

        for (let x = offsetX; x < width + size; x += size) {
          for (let y = offsetY; y < height + size; y += size) {
            let drawX = x;
            let drawY = y;
            let currentDotSize = dotSize;

            if (isInteracting) {
              const dx = mX - x;
              const dy = mY - y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < mouseRadius) {
                const t = 1 - dist / mouseRadius;
                const easeValue = Math.sin(t * Math.PI / 2);
                const shiftDist = easeValue * mouseStrength * currentOpacity;

                drawX = x - (dx / (dist || 1)) * shiftDist;
                drawY = y - (dy / (dist || 1)) * shiftDist;
                currentDotSize = dotSize * (1 + t * 1.5 * currentOpacity);
              }
            }

            ctx.beginPath();
            ctx.arc(drawX, drawY, Math.max(0.2, currentDotSize), 0, Math.PI * 2);
            ctx.fill();
          }
        }

        animationId = requestAnimationFrame(drawLoop);
      };

      drawLoop();

      return () => {
        cancelAnimationFrame(animationId);
        resizeObserver.disconnect();
      };
    }, [interactive, size, dotSize, fill, mouseRadius, mouseStrength]);

    const positionMap = {
      'center': 'circle at center',
      'top': 'circle at top',
      'bottom': 'circle at bottom',
      'left': 'circle at left',
      'right': 'circle at right',
      'top-left': 'circle at top left',
      'top-right': 'circle at top right',
      'bottom-left': 'circle at bottom left',
      'bottom-right': 'circle at bottom right',
    };

    const gradientPosition = positionMap[maskPosition] || 'circle at center';
    return (
      <div
        ref={ref}
        className={cn('absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden', className)}
        style={{
          backgroundColor: maskColor,
          ...style,
        }}
        {...props}
      >
        {showGlow && (
          <div 
            className="absolute inset-0 w-full h-full z-0 transition-all duration-300 pointer-events-none"
            style={{
              background: \`radial-gradient(\${glowSize}% \${glowSize}% at 50% -50%, \${glowColor} \${glowSpread}%, transparent 100%)\`
            }}
          />
        )}

        {!interactive ? (
          <div 
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            style={{
              backgroundImage: \`radial-gradient(circle, \${fill} \${dotSize}px, transparent \${dotSize + 0.6}px)\`,
              backgroundSize: \`\${size}px \${size}px\`,
              backgroundPosition: 'center',
              maskImage: \`radial-gradient(\${gradientPosition}, transparent \${maskStart}%, \${maskColor} \${maskEnd}%)\`,
              WebkitMaskImage: \`radial-gradient(\${gradientPosition}, transparent \${maskStart}%, \${maskColor} \${maskEnd}%)\`,
            }}
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10 pointer-events-none block"
            style={{
              maskImage: \`radial-gradient(\${gradientPosition}, transparent \${maskStart}%, \${maskColor} \${maskEnd}%)\`,
              WebkitMaskImage: \`radial-gradient(\${gradientPosition}, transparent \${maskStart}%, \${maskColor} \${maskEnd}%)\`,
            }}
          />
        )}
      </div>
    );
  }
);

BGPattern.displayName = 'BGPattern';

export { BGPattern };`;

  const codeUsageString = `import React from 'react';
import { BGPattern } from '@/components/ui/bg-pattern';

export default function LandingView() {
  return (
    // Make sure the parent container is relative and shares the exact same background color
    <div className="relative min-h-screen bg-[#090a0b] flex flex-col justify-center items-center overflow-hidden p-6 text-slate-200">
      
      {/* 1. Insert compound pattern with the #244FD4 underlay glow and custom fade mask position */}
      <BGPattern 
        size={${size}} 
        dotSize={${dotSize}} 
        fill="${fill}" 
        maskColor="${maskColor}" 
        maskPosition="${maskPosition}"
        maskStart={${maskStart}}
        maskEnd={${maskEnd}}
        showGlow={${showGlow}}
        glowColor="${glowColor}"
        glowSize={${glowSize}}
        glowSpread={${glowSpread}}
        interactive={${interactive}}
        mouseRadius={${mouseRadius}}
        mouseStrength={${mouseStrength}}
      />

      {/* 2. Page focal-point typography */}
      <div className="relative z-10 text-center max-w-xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase">
          DENSITY & DEPTH
        </h1>
        <p className="mt-4 text-slate-400">
          The custom mask position (${maskPosition}) blocks dots in the specified area, enhancing contrast and typography readability.
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

  // Determine if maskColor is bright or dark to shift preview container text color
  const isLightBackground = () => {
    // Quick hex/rgba brightness estimation
    if (maskColor.toLowerCase() === '#ffffff') return true;
    if (maskColor.startsWith('rgba') && maskColor.includes('255, 255, 255')) return true;
    return false;
  };

  return (
    <div className="h-screen lg:overflow-hidden overflow-y-auto flex flex-col bg-[#090a0b] text-slate-200 select-none font-sans" id="dots-showcase-container">
      {/* Visual background grid pattern for whole page */}
      <div className="absolute inset-0 bg-radial-gradient(ellipse at center, transparent, #090a0b) pointer-events-none z-0" />

      {/* Header Navigation in Bento style */}
      <header className="relative z-20 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md px-8 py-4" id="view-header">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-indigo-650 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">BG</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight uppercase text-white">Core UI Library</h1>
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">v1.4.2 // components / bg-pattern.tsx</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                این پروژه برای ارائه مستقیم به برنامه‌نویس جهت استفاده در پروژه‌ها طراحی شده است.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 self-start md:self-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-medium text-emerald-400 tracking-wider font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse font-mono"></span> READY FOR CODESPACE
            </div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-slate-250 transition-colors uppercase tracking-wider flex items-center gap-1 font-sans"
            >
              <Info className="size-3.5" />
              <span>راهنمای توسعه‌دهنده</span>
            </a>
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
                <Sparkles className="size-3.5 text-indigo-400" />
                PRESET CATALOG / تم‌های پیشنهادی توسعه
              </span>
              <button 
                onClick={() => handleApplyPreset(presets[0])}
                className="text-[10px] font-mono tracking-wider text-zinc-500 hover:text-white flex items-center gap-1 transition-colors bg-white/5 px-2 py-0.5 rounded border border-white/5"
                title="ریست به حالت اولیه"
              >
                <RotateCcw className="size-3" />
                RESET PRESETS
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presets.map((p, idx) => {
                const isActive = size === p.size && dotSize === p.dotSize && fill === p.fill && maskColor === p.maskColor;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`text-left p-3 rounded-2xl text-xs border transition-all ${
                      isActive 
                        ? 'bg-white text-black border-white shadow-lg'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className={`font-mono text-[9px] mb-1 tracking-widest ${isActive ? 'text-zinc-700' : 'text-zinc-500'}`}>
                      {`// PRESET 0${idx + 1}`}
                    </div>
                    <span className="truncate block font-semibold text-xs">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Component Showcase - High Tech Bento Preview Panel */}
          <div className="flex-1 min-h-[480px] relative rounded-3xl border border-white/10 overflow-hidden flex flex-col group shadow-2xl transition-colors duration-300" 
               style={{ backgroundColor: maskColor }}>
            
            {/* The actual BGPattern previewing live */}
            <BGPattern 
              size={size}
              dotSize={dotSize}
              fill={fill}
              maskColor={maskColor}
              maskPosition={maskPosition}
              maskStart={maskStart}
              maskEnd={maskEnd}
              showGlow={showGlow}
              glowColor={glowColor}
              glowSize={glowSize}
              glowSpread={glowSpread}
              interactive={interactive}
              mouseRadius={mouseRadius}
              mouseStrength={mouseStrength}
            />

            {/* Top custom bar for measurements/preview info overlay */}
            <div className="absolute top-0 left-0 right-0 h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a]/40 backdrop-blur-sm z-10 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">COMPONENT PREVIEW:</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Dots Background (fade-center)</span>
              </div>
              <div className="flex items-center gap-3 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-indigo-200 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 rounded-xl transition-all cursor-pointer hover:border-indigo-500/45 active:scale-95"
                  title="نمایش تمام‌صفحه پیش‌نمایش"
                >
                  <Maximize2 className="size-3 text-indigo-400" />
                  <span>تمام‌صفحه (Fullscreen)</span>
                </button>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 border border-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 border border-white/10" />
                </div>
              </div>
            </div>

            {/* Content inside the preview - DENSITY & DEPTH centered bento visual */}
            <div className="m-auto max-w-md w-full relative z-10 px-6 py-12 pointer-events-auto text-center space-y-5">
              <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-white/5 border border-white/10 text-white shadow-xl backdrop-blur">
                <Monitor className="size-5 text-indigo-400" />
              </div>
              
              <h2 className={`text-4xl font-extrabold tracking-tight ${isLightBackground() ? 'text-zinc-900' : 'text-white'}`}>
                DENSITY & DEPTH
              </h2>
              
              <p className={`text-sm ${isLightBackground() ? 'text-zinc-650' : 'text-slate-300'} leading-relaxed font-sans`}>
                همانطور که مشاهده می‌کنید در وسط صفحه نقطه وجود ندارد. ماسک اختصاصی <strong>(fade-center)</strong> باعث فید شدن نقطه‌ها در مرکز می‌شود تا المان‌های اصلی بدون هیچ شلوغی بصری بدرخشند.
              </p>

              <div className="pt-2 flex justify-center gap-2">
                <span className={`text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-white/5 border border-white/10 ${isLightBackground() ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  variant="dots"
                </span>
                <span className={`text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 ${isLightBackground() ? 'text-indigo-800' : 'text-indigo-300'}`}>
                  mask="fade-center"
                </span>
              </div>
            </div>

            {/* Absolute bottom measurements/metadata block overlay */}
            <div className="absolute bottom-4 left-6 flex gap-6 text-[10px] font-mono text-slate-500 pointer-events-none z-10">
              <span>SCALE: {size}px</span>
              <span>DOT WEIGHT: {dotSize}px</span>
              <span>OPACITY: {(fill.includes('0.') || fill.includes('1')) ? 'DYN' : '1.0'}</span>
              <span>RENDER: CSS RADIAL LAYER</span>
            </div>

            {/* Bottom active tag absolute indicator overlay */}
            <div className="absolute bottom-4 right-6 pointer-events-none z-10">
              <div className="bg-[#0a0a0a]/80 backdrop-blur border border-white/10 rounded-lg py-1 px-2.5 pointer-events-auto">
                <code className="text-[10px] font-mono text-indigo-450">
                  {`<BGPattern size={${size}} />`}
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-550 flex items-center gap-2 font-mono">
              <Sliders className="size-4 text-indigo-400" />
              <span>CONFIGURATION PARAMETERS / تنظیمات پس‌زمینه</span>
            </span>

            <div className="space-y-4 mt-2">
              {/* Spacing Size slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">فاصله بین نقطه‌ها (Spacing)</span>
                  <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-white">{size}px Grid</span>
                </div>
                <input 
                  type="range"
                  min="12"
                  max="80"
                  step="2"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
                />
              </div>

              {/* Dot Size slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">اندازه / ضخامت نقطه‌ها (Dot Radius)</span>
                  <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-white">{dotSize}px</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.1"
                  value={dotSize}
                  onChange={(e) => setDotSize(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
                />
              </div>

              {/* Dot Color (fill) */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">رنگ یا غلظت نقطه‌ها (Color Fill)</span>
                  <span className="font-mono text-slate-500 text-[10px] truncate max-w-[150px]">{fill}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
                    { label: 'سفید ملایم', value: 'rgba(255, 255, 255, 0.15)' },
                    { label: 'سفید روشن', value: 'rgba(255, 255, 255, 0.35)' },
                    { label: 'سبز پررنگ', value: 'rgba(52, 211, 153, 0.25)' },
                    { label: 'آبی ایندیگو', value: 'rgba(129, 140, 248, 0.3)' }
                  ].map((colorOpt) => (
                    <button
                      key={colorOpt.value}
                      type="button"
                      onClick={() => setFill(colorOpt.value)}
                      className={`text-[10px] py-1 px-1.5 rounded-lg border transition-all text-center ${
                        fill === colorOpt.value 
                          ? 'bg-white text-black border-white font-medium' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {colorOpt.label}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={fill}
                  onChange={(e) => setFill(e.target.value)}
                  placeholder="e.g. rgba(255,255,255,0.15) or #555555"
                  className="w-full text-xs font-mono px-3 py-1.5 rounded-xl bg-[#0f0f12] border border-white/10 focus:outline-none focus:border-white text-zinc-300"
                />
              </div>

              {/* Mask Background Color */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">رنگ پس‌زمینه فید (Mask Color)</span>
                  <span className="font-mono text-slate-500 text-[10px]">{maskColor}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
                    { label: 'تاریک ذغالی', value: '#090a0b' },
                    { label: 'شوالیه سیاه', value: '#022c22' },
                    { label: 'سورمه‌ای تیره', value: '#0b0f19' },
                    { label: 'سفید استودیو', value: '#ffffff' }
                  ].map((bgOpt) => (
                    <button
                      key={bgOpt.value}
                      type="button"
                      onClick={() => setMaskColor(bgOpt.value)}
                      className={`text-[10px] py-1 px-1.5 rounded-lg border transition-all text-center truncate ${
                        maskColor === bgOpt.value 
                          ? 'bg-white text-black border-white font-medium' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {bgOpt.label}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={maskColor}
                  onChange={(e) => setMaskColor(e.target.value)}
                  placeholder="e.g. #090a0b or white"
                  className="w-full text-xs font-mono px-3 py-1.5 rounded-xl bg-[#0f0f12] border border-white/10 focus:outline-none focus:border-white text-zinc-300"
                />
              </div>

              {/* Mask Position / Direction setup */}
              <div className="border-t border-white/10 pt-3 mt-1">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">جهت و موقعیت فید (Mask Position / Direction)</span>
                  <span className="font-mono text-indigo-400 text-[10px] uppercase font-bold">{maskPosition}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {[
                    { label: 'وسط (Center)', value: 'center' },
                    { label: 'بالا (Top)', value: 'top' },
                    { label: 'پایین (Bottom)', value: 'bottom' },
                    { label: 'چپ (Left)', value: 'left' },
                    { label: 'راست (Right)', value: 'right' },
                    { label: 'بالا چپ', value: 'top-left' },
                    { label: 'بالا راست', value: 'top-right' },
                    { label: 'پایین چپ', value: 'bottom-left' },
                    { label: 'پایین راست', value: 'bottom-right' },
                  ].map((posOpt) => (
                    <button
                      key={posOpt.value}
                      type="button"
                      onClick={() => setMaskPosition(posOpt.value as any)}
                      className={`text-[9.5px] py-1 px-1 rounded-lg border transition-all text-center truncate ${
                        maskPosition === posOpt.value 
                          ? 'bg-indigo-650 text-white border-indigo-500 font-medium' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {posOpt.label}
                    </button>
                  ))}
                </div>

                {/* Fade start range */}
                <div className="space-y-3 mb-1">
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-400 font-medium">شروع محدوده محوشدگی (Fade Start Area)</span>
                      <span className="text-xs font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">{maskStart}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={maskStart}
                      onChange={(e) => setMaskStart(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Fade end range */}
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-400 font-medium">پایان محدوده محوشدگی (Fade End Border)</span>
                      <span className="text-xs font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">{maskEnd}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={maskEnd}
                      onChange={(e) => setMaskEnd(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Luxury radial glow controls */}
              <div className="border-t border-white/10 pt-3 mt-1 text-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-400">افکت هاله نوری پس‌زمینه (Dual BG Glow)</span>
                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${showGlow ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                    {showGlow ? `Active (${glowColor.length > 15 ? glowColor.substring(0, 15) + '...' : glowColor})` : 'Deactivated'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => { setShowGlow(true); setGlowColor('rgba(36, 79, 212, 0.22)'); }}
                      className={`text-[9px] py-1 px-2.5 rounded-lg border transition-all text-center ${
                        showGlow && glowColor.includes('36, 79, 212') 
                          ? 'bg-indigo-600 border-indigo-505 text-white font-medium' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      #244FD4 آبی نئون
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowGlow(true); setGlowColor('rgba(99, 102, 241, 0.22)'); }}
                      className={`text-[9px] py-1 px-2.5 rounded-lg border transition-all text-center ${
                        showGlow && glowColor.includes('99, 102, 241') 
                          ? 'bg-[#4f46e5]/40 border-indigo-505 text-white font-medium' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      #6366F1 بنفش
                    </button>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={showGlow} 
                      onChange={() => setShowGlow(!showGlow)} 
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-500 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-500 peer-checked:after:bg-white"></div>
                  </label>
                </div>
                
                {/* Manual color input for glow effect */}
                <input 
                  type="text" 
                  value={glowColor}
                  onChange={(e) => {
                    setShowGlow(true);
                    setGlowColor(e.target.value);
                  }}
                  placeholder="e.g. rgba(36, 79, 212, 0.22) or #244FD4"
                  className="w-full text-xs font-mono px-3 py-1.5 rounded-xl bg-[#0f0f12] border border-white/10 focus:outline-none focus:border-white text-zinc-300 mt-1.5"
                />

                {/* Glow interactive scaling controls */}
                <div className="space-y-3 mt-3">
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-400 font-medium">اندازه شعاع هاله نوری (Glow Radius)</span>
                      <span className="text-xs font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">{glowSize}%</span>
                    </div>
                    <input 
                      type="range"
                      min="50"
                      max="300"
                      step="5"
                      value={glowSize}
                      onChange={(e) => {
                        setShowGlow(true);
                        setGlowSize(Number(e.target.value));
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-400 font-medium">مرکز و میزان پخش نوری (Glow Spread)</span>
                      <span className="text-xs font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">{glowSpread}%</span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="100"
                      step="1"
                      value={glowSpread}
                      onChange={(e) => {
                        setShowGlow(true);
                        setGlowSpread(Number(e.target.value));
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Mouse Distortion Controls */}
              <div className="border-t border-white/10 pt-3 mt-1 text-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-400">انیمیشن و انحراف ماوس (Mouse Distortion)</span>
                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${interactive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-zinc-805 text-zinc-400'}`}>
                    {interactive ? 'فعال (Interactive)' : 'غیرفعال'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-[11px] text-slate-500 font-sans">اعوجاج عدسی مقعر اطراف اشاره‌گر ماوس (با جابجایی تجمعی نقطه‌ها)</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={interactive} 
                      onChange={() => setInteractive(!interactive)} 
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-500 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-500 peer-checked:after:bg-white cursor-pointer"></div>
                  </label>
                </div>

                {interactive && (
                  <div className="space-y-3 mt-3">
                    <div>
                      <div className="flex justify-between items-center text-[11px] mb-1">
                        <span className="text-slate-400 font-medium font-sans">محدوده شعاع اثر دور ماوس (Interactive Radius)</span>
                        <span className="text-xs font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">{mouseRadius}px</span>
                      </div>
                      <input 
                        type="range"
                        min="80"
                        max="350"
                        step="10"
                        value={mouseRadius}
                        onChange={(e) => setMouseRadius(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[11px] mb-1 font-sans">
                        <span className="text-slate-400 font-medium">میزان فرو رفتگی و اعوجاج نقطه‌ها (Lens Distortion)</span>
                        <span className="text-xs font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">{mouseStrength}px</span>
                      </div>
                      <input 
                        type="range"
                        min="5"
                        max="60"
                        step="1"
                        value={mouseStrength}
                        onChange={(e) => setMouseStrength(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Export Section */}
            <div className="border-t border-white/10 pt-4 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 font-mono mb-3">
                <Download className="size-4 text-indigo-400" />
                <span>EXPORT BACKGROUND IMAGE / خروجی گرفتن تصویری پس‌زمینه</span>
              </span>

              <div className="bg-[#0f0f12] border border-white/5 rounded-2xl p-4 space-y-4">
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed text-right" style={{ direction: 'rtl' }}>
                  طرح پس‌زمینه نهایی خود را بدون پنل‌ها و به صورت تصویر خام با ابعاد دلخواه دانلود کنید.
                </p>

                {/* Dimension Inputs */}
                <div className="grid grid-cols-2 gap-3 font-sans">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">عرض تصویر (Width)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={exportWidth}
                        onChange={(e) => setExportWidth(Math.max(10, Number(e.target.value)))}
                        className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-[#08080a] border border-white/10 focus:outline-none focus:border-indigo-500 text-white text-center"
                        placeholder="1920"
                      />
                      <span className="absolute right-3 top-2 text-[9px] text-slate-500 font-mono">px</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">ارتفاع تصویر (Height)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={exportHeight}
                        onChange={(e) => setExportHeight(Math.max(10, Number(e.target.value)))}
                        className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-[#08080a] border border-white/10 focus:outline-none focus:border-indigo-500 text-white text-center"
                        placeholder="1080"
                      />
                      <span className="absolute right-3 top-2 text-[9px] text-slate-550 font-mono">px</span>
                    </div>
                  </div>
                </div>

                {/* Presets Grid */}
                <div className="grid grid-cols-4 gap-1.5 font-sans">
                  {[
                    { label: "HD (16:9)", w: 1920, h: 1080 },
                    { label: "Mobile (9:16)", w: 1080, h: 1920 },
                    { label: "4K (16:9)", w: 3840, h: 2160 },
                    { label: "Square (1:1)", w: 1080, h: 1080 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setExportWidth(preset.w);
                        setExportHeight(preset.h);
                      }}
                      className={`text-[9px] py-1 border rounded-lg transition-all text-center leading-normal break-words ${
                        exportWidth === preset.w && exportHeight === preset.h
                          ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-medium'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-350'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Formats and Export Button */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex bg-[#08080a] border border-white/10 rounded-xl p-0.5">
                    <button
                      type="button"
                      onClick={() => setExportFormat('png')}
                      className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg transition-all ${
                        exportFormat === 'png' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      PNG
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportFormat('jpeg')}
                      className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg transition-all ${
                        exportFormat === 'jpeg' ? 'bg-white/10 text-white' : 'text-slate-505 hover:text-slate-400'
                      }`}
                    >
                      JPG
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleExportImage(exportWidth, exportHeight, exportFormat)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 font-bold text-xs"
                  >
                    <Download className="size-4" />
                    <span>دانلود فایل تصویری پس‌زمینه</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Elegant separation divider */}
          <div className="border-t border-white/10 pt-4 mt-2" />

          {/* Part 2: Developer Source Code Tabs */}
          <div className="flex flex-col gap-4">
            {/* Header Tabs with Title and format indicator */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#cbd5e1] flex items-center gap-2">
                <FileCode className="size-4 text-indigo-400" />
                <span>IMPLEMENTATION & EXPORT SOURCES / کدهای توسعه‌دهنده</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#60a5fa] bg-indigo-500/10 border border-indigo-550 px-2 py-0.5 rounded">
                TSX // COMPONENT
              </span>
            </div>

            {/* Inner tab buttons */}
            <div className="bg-[#0a0a0a]/50 border border-white/5 rounded-2xl flex p-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-xl transition-all font-sans ${
                  activeTab === 'preview' ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sliders className="size-3.5" />
                <span>لینک‌های کپی سریع</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code-component')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-xl transition-all font-mono ${
                  activeTab === 'code-component' ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                BGPattern.tsx
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code-usage')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-xl transition-all font-mono ${
                  activeTab === 'code-usage' ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Usage.tsx
              </button>
            </div>

            {/* Inner TSX Code Content Viewer */}
            <div className="relative bg-[#0f0f12] p-5 rounded-2xl border border-white/5 font-mono text-[11px] overflow-hidden">
              
              <AnimatePresence mode="wait">
                {activeTab === 'preview' && (
                  <motion.div
                    key="preview-tab"
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4 text-zinc-300 font-sans"
                  >
                    <div className="bg-[#0a0a0a] p-4 rounded-2xl border border-white/5">
                      <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1">
                        <Terminal className="size-3.5 text-indigo-400" />
                        نحوه نصب و استفاده در پروژه‌ها
                      </h4>
                      <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                        کدهای کامپوننت بهینه‌سازی شده و بر پایه استانداردهای مدرن فرانت‌اند هستند. بدون نیاز به هیچ پکیج اضافی می‌توانید از کدهایی با عملکرد ۱۰۰٪ سریع استفاده کنید.
                      </p>
                      
                      <div className="space-y-2">
                        {/* Copy Option 1 */}
                        <div className="flex items-center justify-between bg-[#0f0f12] p-2.5 rounded-xl border border-white/5">
                          <span className="font-mono text-[11px] text-zinc-400">1. کدهای هسته کامپوننت (Component)</span>
                          <button
                            onClick={() => copyToClipboard(codeComponentString, 'component')}
                            className="bg-white hover:bg-slate-200 text-black font-semibold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
                          >
                            {copiedText === 'component' ? <Check className="size-3" /> : <Copy className="size-3" />}
                            <span>{copiedText === 'component' ? 'کپی شد!' : 'کپی'}</span>
                          </button>
                        </div>

                        {/* Copy Option 2 */}
                        <div className="flex items-center justify-between bg-[#0f0f12] p-2.5 rounded-xl border border-white/5">
                          <span className="font-mono text-[11px] text-zinc-400">2. کدهای نمونه استفاده (Usage Node)</span>
                          <button
                            onClick={() => copyToClipboard(codeUsageString, 'usage')}
                            className="bg-white/5 hover:bg-white/10 text-white text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors border border-white/10"
                          >
                            {copiedText === 'usage' ? <Check className="size-3" /> : <Copy className="size-3" />}
                            <span>{copiedText === 'usage' ? 'کپی شد!' : 'کپی'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-zinc-400">
                      <h5 className="font-semibold text-zinc-300 text-xs">نکات کلیدی برای برنامه‌نویس:</h5>
                      <ul className="list-disc pl-4 space-y-1.5 text-[11px] leading-relaxed">
                        <li>
                          مستقیماً در هر تگ با والد <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-white text-[10px]">relative overflow-hidden</code> کار می‌کند.
                        </li>
                        <li>
                          خاصیت جدید <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-white text-[10px]">maskColor</code> جهت تطبیق کامل رنگ فید با پس‌زمینه پروژه تعبیه شده است.
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'code-component' && (
                  <motion.div
                    key="comp-tab"
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative"
                  >
                    <button
                      onClick={() => copyToClipboard(codeComponentString, 'component')}
                      className="absolute top-1 right-1 bg-[#0a0a0a] hover:bg-zinc-850 text-zinc-300 border border-white/10 p-2 rounded-lg flex items-center gap-1 transition-colors z-10"
                      title="کپی کردن کل کد"
                    >
                      {copiedText === 'component' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                      <span className="text-[10px]">{copiedText === 'component' ? 'کپی شد!' : ''}</span>
                    </button>
                    <pre className="text-zinc-300 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre p-2 bg-[#0f0f12] rounded-lg">
                      {codeComponentString}
                    </pre>
                  </motion.div>
                )}

                {activeTab === 'code-usage' && (
                  <motion.div
                    key="usage-tab"
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative"
                  >
                    <button
                      onClick={() => copyToClipboard(codeUsageString, 'usage')}
                      className="absolute top-1 right-1 bg-[#0a0a0a] hover:bg-zinc-850 text-zinc-300 border border-white/10 p-2 rounded-lg flex items-center gap-1 transition-colors z-10"
                      title="کپی کردن کل کد"
                    >
                      {copiedText === 'usage' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                      <span className="text-[10px]">{copiedText === 'usage' ? 'کپی شد!' : ''}</span>
                    </button>
                    <pre className="text-zinc-300 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre p-2 bg-[#0f0f12] rounded-lg">
                      {codeUsageString}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </section>

      </main>

      {/* Footer System Bar in Bento style */}
      <footer className="h-8 px-8 border-t border-white/5 bg-[#050505] flex items-center justify-between text-[9px] font-mono text-slate-600 relative z-10">
        <div>STATUS: VIEWPORT_RENDER_OK</div>
        <div className="flex gap-4">
          <span>LATENCY: 12ms</span>
          <span>REGION: GLOBAL-NODE</span>
          <span className="text-indigo-400 font-bold">CONNECTED TO PRODUCTION</span>
        </div>
      </footer>

      {/* Fullscreen Pattern Viewer Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden cursor-default select-none transition-colors duration-300"
            style={{ backgroundColor: maskColor }}
          >
            {/* Live BG Pattern rendering in full screen */}
            <BGPattern
              size={size}
              dotSize={dotSize}
              fill={fill}
              maskColor={maskColor}
              maskPosition={maskPosition}
              maskStart={maskStart}
              maskEnd={maskEnd}
              showGlow={showGlow}
              glowColor={glowColor}
              glowSize={glowSize}
              glowSpread={glowSpread}
              interactive={interactive}
              mouseRadius={mouseRadius}
              mouseStrength={mouseStrength}
            />

            {/* Header controls inside fullscreen view */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50 pointer-events-none">
              <div className="bg-[#0a0a0a]/85 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-2xl pointer-events-auto">
                <div className="size-2 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-xs font-mono text-slate-200 tracking-wider font-semibold">پیش‌نمایش زنده و تمام‌صفحه / LIVE FULLSCREEN PREVIEW</span>
              </div>
              
              <div className="flex gap-3 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-2xl text-xs font-bold font-sans cursor-pointer backdrop-blur-md active:scale-95"
                >
                  <X className="size-4" />
                  <span>خروج (Close)</span>
                </button>
              </div>
            </div>

            {/* Bottom info card inside fullscreen */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-center justify-between gap-4 z-50 bg-[#0a0a0a]/85 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl max-w-4xl mx-auto w-[calc(100%-3rem)] pointer-events-auto">
              <div className="flex flex-col gap-1.5 text-right w-full md:w-auto">
                <div className="text-sm font-bold text-slate-100 font-sans flex items-center gap-2 justify-start">
                  <span className="size-2.5 rounded-full bg-emerald-500/80 border border-emerald-500/30" />
                  <span>شما در حال مشاهده طرح در ابعاد بزرگ هستید</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono tracking-wide leading-relaxed">
                  Spacing: <span className="text-indigo-400 font-bold">{size}px</span> | 
                  Dot Weight: <span className="text-indigo-400 font-bold">{dotSize}px</span> | 
                  Mask: <span className="text-indigo-400 font-bold">{maskPosition}</span> ({maskStart}% - {maskEnd}%) | 
                  Glow: <span className="text-indigo-400 font-bold">{showGlow ? `Enabled (${glowSize}px)` : 'Disabled'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/20 px-6 py-3 rounded-2xl text-xs font-bold font-sans transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/20 active:scale-95 text-center"
                >
                  برگشت به ویرایشگر
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

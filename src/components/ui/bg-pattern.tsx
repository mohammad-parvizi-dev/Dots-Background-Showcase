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
      fill = 'rgba(156, 163, 175, 0.15)', // elegant muted gray by default
      maskColor = '#090a0b', // dark charcoal background default
      maskPosition = 'center',
      maskStart = 10,
      maskEnd = 80,
      showGlow = true,
      glowColor = 'rgba(36, 79, 212, 0.22)', // #244FD4 at ~22% opacity
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
    
    // Mutable refs to track real-time mouse states without triggering React re-renders (prevents lag)
    const mouseRef = useRef({ x: -2000, y: -2000, active: false });
    const lerpedMouse = useRef({ x: -2000, y: -2000, opacity: 0 });

    // Track mouse coordinates on window to ensure seamless moves across overlays
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

    // High performance animation loop
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

        // Smoothly interpolate opacity of interactive distortion based on active state (fade in/out on enter/leave)
        const targetOpacity = mouseRef.current.active ? 1 : 0;
        lerpedMouse.current.opacity += (targetOpacity - lerpedMouse.current.opacity) * 0.08;

        // Smoothly interpolate position for premium inertial effect
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

        // If interaction opacity is basically 0, draw static grid for maximum efficacy
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
                const t = 1 - dist / mouseRadius; // 1 at mouse center, 0 at boundary
                
                // 1. Concave warping curve: push grid items outward smoothly
                const easeValue = Math.sin(t * Math.PI / 2); // buttery smooth sine easing
                const shiftDist = easeValue * mouseStrength * currentOpacity;

                drawX = x - (dx / (dist || 1)) * shiftDist;
                drawY = y - (dy / (dist || 1)) * shiftDist;

                // 2. Thickening / Bolding closer to mouse
                currentDotSize = dotSize * (1 + t * 1.5 * currentOpacity);
              }
            }

            // Draw the anti-aliased clean dot
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

    // Map position types to CSS circle placement
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
        {/* Glow Layer */}
        {showGlow && (
          <div 
            className="absolute inset-0 w-full h-full z-0 transition-all duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(${glowSize}% ${glowSize}% at 50% -50%, ${glowColor} ${glowSpread}%, transparent 100%)`
            }}
          />
        )}

        {/* Dynamic Pattern Layer */}
        {!interactive ? (
          /* Passive zero-overhead CSS rendering path */
          <div 
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, ${fill} ${dotSize}px, transparent ${dotSize + 0.6}px)`,
              backgroundSize: `${size}px ${size}px`,
              backgroundPosition: 'center',
              maskImage: `radial-gradient(${gradientPosition}, transparent ${maskStart}%, ${maskColor} ${maskEnd}%)`,
              WebkitMaskImage: `radial-gradient(${gradientPosition}, transparent ${maskStart}%, ${maskColor} ${maskEnd}%)`,
            }}
          />
        ) : (
          /* Fluid accelerated Canvas drawing path with CSS mask compositing */
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10 pointer-events-none block"
            style={{
              maskImage: `radial-gradient(${gradientPosition}, transparent ${maskStart}%, ${maskColor} ${maskEnd}%)`,
              WebkitMaskImage: `radial-gradient(${gradientPosition}, transparent ${maskStart}%, ${maskColor} ${maskEnd}%)`,
            }}
          />
        )}
      </div>
    );
  }
);

BGPattern.displayName = 'BGPattern';

export { BGPattern };

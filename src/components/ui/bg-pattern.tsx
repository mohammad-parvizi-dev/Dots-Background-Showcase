import React from 'react';
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
      className,
      style,
      ...props
    },
    ref
  ) => {
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
        {/* Glow Layer (radial-gradient at 50% -50% with the developer glow) */}
        {showGlow && (
          <div 
            className="absolute inset-0 w-full h-full z-0 transition-all duration-300"
            style={{
              background: `radial-gradient(${glowSize}% ${glowSize}% at 50% -50%, ${glowColor} ${glowSpread}%, transparent 100%)`
            }}
          />
        )}

        {/* Dots Pattern Layer (masked at center) */}
        <div 
          className="absolute inset-0 w-full h-full z-10"
          style={{
            backgroundImage: `radial-gradient(${fill} ${dotSize}px, transparent ${dotSize}px)`,
            backgroundSize: `${size}px ${size}px`,
            backgroundPosition: 'center',
            // Core Fade-Center/Custom masking for premium typography contrast
            maskImage: `radial-gradient(${gradientPosition}, transparent ${maskStart}%, ${maskColor} ${maskEnd}%)`,
            WebkitMaskImage: `radial-gradient(${gradientPosition}, transparent ${maskStart}%, ${maskColor} ${maskEnd}%)`,
          }}
        />
      </div>
    );
  }
);

BGPattern.displayName = 'BGPattern';

export { BGPattern };


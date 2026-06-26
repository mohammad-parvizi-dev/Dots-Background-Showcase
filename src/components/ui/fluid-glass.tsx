import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export interface FluidGlassProps {
  /** Mode of the glass effect (fallback when no HTML glass elements exist): 'lens' | 'fluid' | 'ripples' | 'acrylic' */
  mode?: 'lens' | 'fluid' | 'ripples' | 'acrylic';
  /** Scale of the effect/particles (0.05 to 1.0) */
  scale?: number;
  /** Index of Refraction (1.0 to 2.0) */
  ior?: number;
  /** Thickness of the glass edges / specular highlight (0.5 to 5.0) */
  thickness?: number;
  /** Chromatic Aberration strength (0.0 to 0.3) */
  chromaticAberration?: number;
  /** Anisotropy specular stretching (0.0 to 0.1) */
  anisotropy?: number;
  /** Width of the glass edge bevel (0.005 to 0.08) */
  bevelWidth?: number;
  /** Amount of frosting blur (0.0 to 4.0) */
  blur?: number;
  /** Transmission of light / transparency (0.0 to 1.0) */
  transmission?: number;
  /** Surface roughness of the glass (0.0 to 1.0) */
  roughness?: number;
  /** Whether the glass is interactive (follows mouse) */
  interactive?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Nested elements */
  children?: React.ReactNode;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
}

interface GlassRect {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

export function FluidGlass({
  mode = 'lens',
  scale = 0.25,
  ior = 1.15,
  thickness = 2.0,
  chromaticAberration = 0.05,
  anisotropy = 0.01,
  bevelWidth = 0.015,
  blur = 1.2,
  transmission = 0.9,
  roughness = 0.3,
  interactive = true,
  className,
  children,
  ...props
}: FluidGlassProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Keep mouse coords normalized [0, 1] relative to canvas
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false, rx: 0.5, ry: 0.5 });
  
  // State for particles (fallback mode)
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  
  // Dynamic glass elements bounding rects
  const glassRectsRef = useRef<GlassRect[]>([]);

  // Initialize particles once
  useEffect(() => {
    const count = 10;
    const pArray: Particle[] = [];
    for (let i = 0; i < count; i++) {
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

  // Track DOM glass elements dynamically
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateRects = () => {
      const containerRect = container.getBoundingClientRect();
      if (containerRect.width === 0 || containerRect.height === 0) return;

      const searchRoot = container.parentElement || container;
      const elements = searchRoot.querySelectorAll('[data-glass="true"]');
      const rects: GlassRect[] = [];

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const borderRadiusPx = parseFloat(style.borderRadius) || 0;
        
        // Clamp physical border radius to at most half of the element's shorter dimension to prevent SDF distortion
        const maxRadius = Math.min(rect.width, rect.height) / 2.0;
        const clampedRadius = Math.min(borderRadiusPx, maxRadius);
        
        // Normalize coordinates relative to the WebGL container viewport
        const x = (rect.left - containerRect.left) / containerRect.width;
        // WebGL Y-axis is inverted (0 is bottom, 1 is top)
        const y = 1.0 - (rect.bottom - containerRect.top) / containerRect.height;
        const w = rect.width / containerRect.width;
        const h = rect.height / containerRect.height;
        
        // Normalize corner radius relative to the shorter axis of the container
        const shorterAxis = Math.min(containerRect.width, containerRect.height);
        const r = shorterAxis > 0 ? clampedRadius / shorterAxis : 0;

        rects.push({ x, y, w, h, r });
      });

      glassRectsRef.current = rects;
    };

    updateRects();

    // Resize observer to update on layouts shifts
    const resizeObserver = new ResizeObserver(() => {
      updateRects();
    });
    resizeObserver.observe(container);

    // Keep polling positions for animations, transitions or dragging
    let active = true;
    const trackingLoop = () => {
      if (!active) return;
      updateRects();
      requestAnimationFrame(trackingLoop);
    };
    requestAnimationFrame(trackingLoop);

    return () => {
      active = false;
      resizeObserver.disconnect();
    };
  }, []);

  // Handle mouse move
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = 1.0 - (touch.clientY - rect.top) / rect.height;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    container.addEventListener('touchend', handleMouseLeave, { passive: true });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchend', handleMouseLeave);
    };
  }, []);

  // WebGL Renderer Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) {
      console.error('WebGL is not supported in this environment');
      return;
    }

    // Vertex Shader
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader
    const fsSource = `
      precision highp float;
      varying vec2 vUv;

      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      
      uniform int u_mode; // 0: lens, 1: fluid, 2: ripples, 3: acrylic
      uniform float u_scale;
      uniform float u_ior;
      uniform float u_thickness;
      uniform float u_chromatic_aberration;
      uniform float u_anisotropy;
      uniform float u_bevel_width;
      uniform float u_blur;
      uniform float u_transmission;
      uniform float u_roughness;

      // HTML/DOM Glass rects (max 8)
      uniform vec4 u_glass_rects[8]; // x, y, w, h
      uniform float u_glass_radii[8]; // normalized r
      uniform int u_glass_count;

      // Particles data (max 10) for fallback
      uniform vec3 u_particles[10];

      // Segment drawer helper to draw digits "1", "2", "3" and lines
      float sdSegment(vec2 p, vec2 a, vec2 b) {
        vec2 pa = p - a, ba = b - a;
        float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h);
      }

      // Procedural generator for stylized big numbers "3", "1", "2" behind the glass
      float getBackgroundGlyphs(vec2 uv) {
        float minDist = 999.0;
        
        // Digit "3" near Column 1 (positioned around x = 0.22)
        vec2 c3 = vec2(0.22, 0.5 + sin(u_time * 0.5) * 0.06);
        vec2 p3 = uv - c3;
        float d3_upper = abs(length(p3 - vec2(0.0, 0.038)) - 0.038);
        float d3_lower = abs(length(p3 - vec2(0.0, -0.038)) - 0.038);
        if (p3.x < -0.015) { d3_upper = 999.0; d3_lower = 999.0; }
        float d3_tick1 = sdSegment(uv, c3 + vec2(-0.035, 0.076), c3 + vec2(0.0, 0.076));
        float d3_tick2 = sdSegment(uv, c3 + vec2(-0.015, 0.0), c3 + vec2(0.0, 0.0));
        float d3_tick3 = sdSegment(uv, c3 + vec2(-0.035, -0.076), c3 + vec2(0.0, -0.076));
        float d3 = min(min(d3_upper, d3_lower), min(d3_tick1, min(d3_tick2, d3_tick3)));
        minDist = min(minDist, d3);
        
        // Digit "1" near Column 2 (positioned around x = 0.5)
        vec2 c1 = vec2(0.5, 0.5 + cos(u_time * 0.4) * 0.06);
        float d1_body = sdSegment(uv, c1 + vec2(0.0, -0.076), c1 + vec2(0.0, 0.076));
        float d1_serif = sdSegment(uv, c1 + vec2(-0.025, 0.048), c1 + vec2(0.0, 0.076));
        float d1_base = sdSegment(uv, c1 + vec2(-0.035, -0.076), c1 + vec2(0.035, -0.076));
        float d1 = min(d1_body, min(d1_serif, d1_base));
        minDist = min(minDist, d1);
        
        // Digit "2" near Column 3 (positioned around x = 0.78)
        vec2 c2 = vec2(0.78, 0.5 + sin(u_time * 0.6) * 0.06);
        vec2 p2 = uv - c2;
        float d2_loop = abs(length(p2 - vec2(0.0, 0.038)) - 0.038);
        if (p2.y < 0.038 || p2.x < -0.038) { d2_loop = 999.0; }
        float d2_slash = sdSegment(uv, c2 + vec2(0.038, 0.038), c2 + vec2(-0.038, -0.076));
        float d2_base = sdSegment(uv, c2 + vec2(-0.038, -0.076), c2 + vec2(0.038, -0.076));
        float d2 = min(d2_loop, min(d2_slash, d2_base));
        minDist = min(minDist, d2);
        
        return minDist;
      }

      // Background mesh gradient generator
      vec3 getBgGradient(vec2 uv) {
        vec3 col = vec3(0.015, 0.012, 0.025); // very dark deep space black/purple
        
        // Vertical neon bars/stripes (matching the reference design exactly)
        float colX1 = 0.22;
        float colX2 = 0.5;
        float colX3 = 0.78;
        
        float dCol1 = abs(uv.x - colX1) - 0.032;
        float dCol2 = abs(uv.x - colX2) - 0.032;
        float dCol3 = abs(uv.x - colX3) - 0.032;
        
        float p1 = smoothstep(0.015, 0.0, dCol1);
        float p2 = smoothstep(0.015, 0.0, dCol2);
        float p3 = smoothstep(0.015, 0.0, dCol3);
        
        vec3 pillarCol = vec3(0.38, 0.12, 0.98); // radiant electric purple
        col = mix(col, pillarCol, p1 * 0.85);
        col = mix(col, pillarCol, p2 * 0.85);
        col = mix(col, pillarCol, p3 * 0.85);
        
        // Render big glowing interactive numbers 3, 1, 2
        float glyphDist = getBackgroundGlyphs(uv);
        float glyphGlow = exp(-glyphDist * 16.0) * 0.82 + smoothstep(0.015, 0.0, glyphDist) * 1.0;
        
        // Purple-violet glowing digits color
        vec3 glyphCol = vec3(0.55, 0.22, 1.0);
        col += glyphCol * glyphGlow;
        
        // Background organic deep neon space blobs removed as requested to keep background clean and static

        // Subtle ambient dot grid
        vec2 gridUv = uv * vec2(32.0 * (u_resolution.x / u_resolution.y), 32.0);
        vec2 dots = abs(sin(gridUv * 3.14159));
        float dotStrength = smoothstep(0.97, 0.988, dots.x * dots.y);
        col = mix(col, vec3(1.0) * 0.1, dotStrength);

        return col;
      }

      // Draw the overall background
      vec3 renderBackground(vec2 uv) {
        return getBgGradient(uv);
      }

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // Multi-tap frosted glass procedural blur
      vec3 getBlurredBg(vec2 uv, float blurAmount) {
        if (blurAmount <= 0.0) {
          return getBgGradient(uv);
        }
        
        // Use high-frequency grain noise to simulate micro-frosting (fully modulated by u_roughness!)
        float noise = hash(uv * 1350.0);
        float noiseMultiplier = mix(1.0, 0.6 + 0.8 * noise, u_roughness);
        float step = blurAmount * 0.015 * noiseMultiplier;
        
        // 9-tap blur kernel with jittered offsets
        vec3 col = getBgGradient(uv) * 0.22;
        
        col += getBgGradient(uv + vec2(-step, -step * 1.5)) * 0.09;
        col += getBgGradient(uv + vec2(0.0, -step * 1.2)) * 0.10;
        col += getBgGradient(uv + vec2(step, -step * 1.5)) * 0.09;
        
        col += getBgGradient(uv + vec2(-step * 1.2, 0.0)) * 0.10;
        col += getBgGradient(uv + vec2(step * 1.2, 0.0)) * 0.10;
        
        col += getBgGradient(uv + vec2(-step, step * 1.5)) * 0.09;
        col += getBgGradient(uv + vec2(0.0, step * 1.2)) * 0.10;
        col += getBgGradient(uv + vec2(step, step * 1.5)) * 0.09;
        
        return col;
      }

      // Aspect ratio-corrected Rounded Rectangle SDF
      float sdRoundedBox(vec2 p, vec2 b, float r, vec2 aspect) {
        vec2 p_arr = p * aspect;
        vec2 b_arr = b * aspect;
        float actual_r = min(r, min(b_arr.x, b_arr.y));
        vec2 q = abs(p_arr) - b_arr + actual_r;
        return (min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - actual_r) / aspect.y;
      }

      // Compute height field of the glass surfaces
      float getHeight(vec2 uv) {
        float maxH = 0.0;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

        if (u_glass_count > 0) {
          // Render glass distortion inside active HTML divs
          for (int i = 0; i < 8; i++) {
            if (i >= u_glass_count) break;
            
            vec4 rect = u_glass_rects[i];
            float radius = u_glass_radii[i];
            
            vec2 center = rect.xy + rect.zw * 0.5;
            vec2 halfSize = rect.zw * 0.5;
            
            vec2 p = uv - center;
            float d = sdRoundedBox(p, halfSize, radius, aspect);
            
            if (d < 0.0) {
              float borderDist = -d;
              
              // 1. Crisp edge bevel profile (dynamically capped to prevent center-face creasing/distortion)
              float maxBevel = min(halfSize.x, halfSize.y) * 0.35;
              float actualBevel = min(u_bevel_width, maxBevel);
              float bevel = smoothstep(0.0, actualBevel, borderDist);
              
              // 2. Smooth, crease-free 3D cushion dome across the entire card body
              // Quadratic-based cosine mapping has a flat slope at the center, completely eliminating any cross crease artifacts!
              float normSqX = (p.x * p.x) / max(0.0001, halfSize.x * halfSize.x);
              float normSqY = (p.y * p.y) / max(0.0001, halfSize.y * halfSize.y);
              float cx = cos(clamp(normSqX, 0.0, 1.0) * 1.57079632);
              float cy = cos(clamp(normSqY, 0.0, 1.0) * 1.57079632);
              float dome = cx * cy;
              
              // Multiply dome by bevel to prevent any tray-like hollow dips in the middle!
              float boxH = dome * bevel;
              
              // 3. Dynamic surface modes applied directly to active card shapes
              if (u_mode == 0) {
                // Convex lens with subtle micro waves
                float surfaceWaves = sin(p.x * 24.0) * cos(p.y * 24.0) * 0.012;
                boxH += surfaceWaves * smoothstep(0.0, 0.04, borderDist);
              } else if (u_mode == 1) {
                // Interactive fluid/liquid flow inside the cards
                float fluidPattern = sin(p.x * 16.0 + u_time * 1.6) * cos(p.y * 16.0 - u_time * 1.3) * 0.16;
                fluidPattern += sin(p.y * 32.0 + u_time * 2.4) * 0.04;
                boxH += fluidPattern * smoothstep(0.0, 0.05, borderDist);
              } else if (u_mode == 2) {
                // Ripple waves emanating from the cursor
                float dMouse = distance(uv, u_mouse);
                float ripple = sin(dMouse * 45.0 - u_time * 7.5) * 0.15;
                float damping = exp(-dMouse * 3.8);
                boxH += ripple * damping * smoothstep(0.0, 0.04, borderDist);
              } else if (u_mode == 3) {
                // Highly textured wavy organic acrylic
                float acrylicWaves = sin(p.x * 38.0 + u_time * 0.5) * cos(p.y * 32.0 - u_time * 0.35) * 0.12;
                acrylicWaves += sin(p.y * 68.0 + u_time * 0.95) * 0.03;
                boxH += acrylicWaves * smoothstep(0.0, 0.04, borderDist);
              }
              
              boxH = max(0.0, boxH);
              maxH = max(maxH, boxH * u_thickness);
            }
          }
        } 
        else {
          // Fallback to sandbox mode if no data-glass HTML elements are defined
          if (u_mode == 0) {
            float d = distance(uv, u_mouse);
            float rad = u_scale * 0.8;
            if (d < rad) {
              float t = 1.0 - (d / rad);
              maxH = t * t * u_thickness * 1.5;
            }
          } 
          else if (u_mode == 1) {
            float h = 0.0;
            for (int i = 0; i < 10; i++) {
              float d = distance(uv, u_particles[i].xy);
              float r = u_particles[i].z * u_scale * 2.5;
              h += (r * r) / (d * d + 0.002);
            }
            maxH = smoothstep(0.18, 0.45, h * 0.08) * u_thickness;
          } 
          else if (u_mode == 2) {
            float d = distance(uv, u_mouse);
            float wave = sin(d * 42.0 - u_time * 6.5);
            float damping = exp(-d * (5.5 / u_scale));
            maxH = max(0.0, wave * damping * u_thickness * 0.45);
          } 
          else if (u_mode == 3) {
            float n1 = sin(uv.x * 5.0 + u_time * 0.5) * cos(uv.y * 4.0 - u_time * 0.3);
            float n2 = sin(uv.y * 8.0 - u_time * 0.7) * cos(uv.x * 6.0 + u_time * 0.4);
            maxH = (n1 * 0.5 + n2 * 0.5 + 1.0) * 0.5 * u_thickness * 0.6 * u_scale;
          }
        }

        return maxH;
      }

      void main() {
        vec2 uv = vUv;
        float currentHeight = getHeight(uv);

        // Central difference step for computing shader normals
        vec2 eps = vec2(0.003, 0.0);
        float hL = getHeight(uv - eps.xy);
        float hR = getHeight(uv + eps.xy);
        float hD = getHeight(uv - eps.yx);
        float hU = getHeight(uv + eps.yx);

        // Calculate surface normal
        vec3 normal = normalize(vec3((hL - hR) * 1.5, (hD - hU) * 1.5, 1.0));

        // Perturb normal with high-frequency grain noise based on u_roughness (physical sandblasted frosting!)
        vec3 noisyNormal = normal;
        if (currentHeight > 0.0 && u_roughness > 0.0) {
          float grainX = hash(uv * 1450.0) * 2.0 - 1.0;
          float grainY = hash(uv * 1450.0 + 15.0) * 2.0 - 1.0;
          noisyNormal = normalize(normal + vec3(grainX * 0.16 * u_roughness, grainY * 0.16 * u_roughness, 0.0));
        }

        // Refraction displacement scale
        float refractFactor = (u_ior - 1.0) * 0.35;

        // Chromatic Aberration color shifting using perturbed noisy normal for sandblasted scatter
        vec2 refractR = uv + noisyNormal.xy * (refractFactor + u_chromatic_aberration * 0.12);
        vec2 refractG = uv + noisyNormal.xy * refractFactor;
        vec2 refractB = uv + noisyNormal.xy * (refractFactor - u_chromatic_aberration * 0.12);

        // Fetch refracted background colors (frosted/blurred inside glass shapes)
        float blurStrength = currentHeight > 0.0 ? u_blur : 0.0;

        float colR = getBlurredBg(refractR, blurStrength).r;
        float colG = getBlurredBg(refractG, blurStrength).g;
        float colB = getBlurredBg(refractB, blurStrength).b;
        vec3 refractedColor = vec3(colR, colG, colB);

        // Specular highlight (shininess) calculation using noisyNormal for sparkling glints
        vec3 lightDir = normalize(vec3(1.2, 1.2, 2.5));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfVec = normalize(lightDir + viewDir);

        float specBase = max(0.0, dot(noisyNormal, halfVec));

        // Apply anisotropy specular stretching
        float specPower = 28.0 - u_anisotropy * 240.0 * abs(normal.x);
        
        // PBR Roughness: Higher roughness spreads and dims the specular reflection
        specPower = specPower * mix(1.0, 0.1, u_roughness);
        specPower = max(1.5, specPower);
        
        // Specular and Gloss intensity calculations
        float specIntensity = mix(0.48, 0.06, u_roughness);
        float edgeFactor = 1.0 - normal.z * normal.z;
        float specular = pow(specBase, specPower) * specIntensity * (edgeFactor * 2.0);

        // Gloss highlight (sheen) on the upward-facing facets of the glass
        float gloss = max(0.0, normal.y) * 0.06 * mix(1.0, 0.2, u_roughness);

        // Determine final pixel color based on whether we are inside or outside glass cards
        vec3 finalColor;
        if (currentHeight > 0.0) {
          float normHeight = clamp(currentHeight / max(0.001, u_thickness), 0.0, 1.0);

          // Completely eliminate white specular haze in the flat middle of the card!
          // normHeight is 1.0 in the flat center, and 0.0 at the curved edges.
          // slopeFactor is 1.0 at curved edges and 0.0 in the flat center.
          float slopeFactor = 1.0 - pow(normHeight, 4.0);
          float finalSpec = specular * slopeFactor;
          float finalGloss = gloss * slopeFactor;

          // 1. Real-world physical glass body absorption (Beer-Lambert model for elegant smoked glass)
          // u_transmission = 1.0 -> perfectly clear and transparent
          // u_transmission = 0.0 -> elegant dark smoked glass (darker neutral attenuation instead of flat, muddy opacity)
          vec3 glassTint = mix(vec3(0.12, 0.09, 0.18), vec3(1.0), u_transmission);
          vec3 baseColor = refractedColor * glassTint;
          
          // 2. Micro-scattering (frosted glass satin sheen)
          // If transmission is low AND roughness is high, scatter light for that gorgeous frosted-white satin look!
          vec3 whiteScattering = vec3(0.24, 0.22, 0.27) * u_roughness * (1.0 - u_transmission) * normHeight;
          
          vec3 finalGlassColor = baseColor + whiteScattering;
          
          finalColor = finalGlassColor;
          
          // Add slope-attenuated specular and gloss (no white center haze!)
          finalColor += vec3(1.0) * finalSpec;
          finalColor += vec3(1.0) * finalGloss;
          
          // Draw glass rim outline for tactile glass-like thickness (crisp border!)
          float rim = smoothstep(0.08, 0.0, normHeight) * smoothstep(0.0, 0.04, normHeight);
          finalColor += vec3(1.0) * rim * 0.16;

          // Dark ambient drop shadow behind glass elements (using normalized height!)
          float shadow = smoothstep(0.0, 0.15, normHeight);
          finalColor = mix(finalColor * 0.85, finalColor, shadow);
        } else {
          // Outside glass elements, or standalone canvas fallback
          if (u_glass_count > 0) {
            // We are outside targeted DOM cards, render raw background without any lighting
            finalColor = getBlurredBg(uv, 0.0);
          } else {
            // Standalone mode (fullscreen glass canvas)
            vec3 glassTint = mix(vec3(0.12, 0.09, 0.18), vec3(1.0), u_transmission);
            vec3 baseColor = refractedColor * glassTint;
            
            vec3 whiteScattering = vec3(0.24, 0.22, 0.27) * u_roughness * (1.0 - u_transmission) * currentHeight;
            
            // In fullscreen mode, keep specular slightly broader for organic metaballs 3D feel
            float edgeFactorFull = 1.0 - normal.z * normal.z;
            float specularFull = pow(specBase, specPower) * specIntensity * (edgeFactorFull * 1.5 + 0.3);
            
            finalColor = baseColor + whiteScattering;
            finalColor += vec3(1.0) * specularFull;
            finalColor += vec3(1.0) * gloss;
          }
        }

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Create shader helper
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    // Create shader program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Bind vertices
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMode = gl.getUniformLocation(program, 'u_mode');
    const uScale = gl.getUniformLocation(program, 'u_scale');
    const uIor = gl.getUniformLocation(program, 'u_ior');
    const uThickness = gl.getUniformLocation(program, 'u_thickness');
    const uChromaticAberration = gl.getUniformLocation(program, 'u_chromatic_aberration');
    const uAnisotropy = gl.getUniformLocation(program, 'u_anisotropy');
    const uBevelWidth = gl.getUniformLocation(program, 'u_bevel_width');
    const uBlur = gl.getUniformLocation(program, 'u_blur');
    const uTransmission = gl.getUniformLocation(program, 'u_transmission');
    const uRoughness = gl.getUniformLocation(program, 'u_roughness');
    const uParticles = gl.getUniformLocation(program, 'u_particles');
    
    // Glass elements uniforms
    const uGlassRects = gl.getUniformLocation(program, 'u_glass_rects');
    const uGlassRadii = gl.getUniformLocation(program, 'u_glass_radii');
    const uGlassCount = gl.getUniformLocation(program, 'u_glass_count');

    // Resize canvas to element size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(canvas);

    // Initialize lerp mouse positioning
    let mouseLerpX = 0.5;
    let mouseLerpY = 0.5;
    let startTime = Date.now();

    // Render loop
    const render = () => {
      const timeSec = (Date.now() - startTime) / 1000.0;

      // Update resolution uniform
      gl.uniform2f(uResolution, canvas.width, canvas.height);

      // Lerp mouse coordinate following for organic delay feel
      const targetMouseX = mouseRef.current.active ? mouseRef.current.x : 0.5 + Math.sin(timeSec * 0.8) * 0.2;
      const targetMouseY = mouseRef.current.active ? mouseRef.current.y : 0.5 + Math.cos(timeSec * 0.6) * 0.2;

      mouseLerpX += (targetMouseX - mouseLerpX) * 0.08;
      mouseLerpY += (targetMouseY - mouseLerpY) * 0.08;
      
      gl.uniform2f(uMouse, mouseLerpX, mouseLerpY);
      gl.uniform1f(uTime, timeSec);

      // Set options uniforms
      const modeMap = { lens: 0, fluid: 1, ripples: 2, acrylic: 3 };
      gl.uniform1i(uMode, modeMap[mode]);
      gl.uniform1f(uScale, scale);
      gl.uniform1f(uIor, ior);
      gl.uniform1f(uThickness, thickness);
      gl.uniform1f(uChromaticAberration, chromaticAberration);
      gl.uniform1f(uAnisotropy, anisotropy);
      gl.uniform1f(uBevelWidth, bevelWidth);
      gl.uniform1f(uBlur, blur);
      gl.uniform1f(uTransmission, transmission);
      gl.uniform1f(uRoughness, roughness);

      // Bind data-glass elements if any exist
      const rectsData = new Float32Array(8 * 4);
      const radiiData = new Float32Array(8);
      const activeRects = glassRectsRef.current.slice(0, 8);

      for (let i = 0; i < 8; i++) {
        if (i < activeRects.length) {
          rectsData[i * 4 + 0] = activeRects[i].x;
          rectsData[i * 4 + 1] = activeRects[i].y;
          rectsData[i * 4 + 2] = activeRects[i].w;
          rectsData[i * 4 + 3] = activeRects[i].h;
          radiiData[i] = activeRects[i].r;
        } else {
          rectsData[i * 4 + 0] = 0;
          rectsData[i * 4 + 1] = 0;
          rectsData[i * 4 + 2] = 0;
          rectsData[i * 4 + 3] = 0;
          radiiData[i] = 0;
        }
      }

      gl.uniform4fv(uGlassRects, rectsData);
      gl.uniform1fv(uGlassRadii, radiiData);
      gl.uniform1i(uGlassCount, activeRects.length);

      // Animate fallback particles
      const particles = particlesRef.current;
      const particleUniforms = new Float32Array(10 * 3);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Slowly drift particles
        p.x += p.vx;
        p.y += p.vy;

        // Slowly breathe radius
        p.radius += (p.targetRadius - p.radius) * 0.01;
        if (Math.abs(p.radius - p.targetRadius) < 0.005) {
          p.targetRadius = 0.04 + Math.random() * 0.08;
        }

        // Pull particles slowly towards mouse if mouse is active
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          p.vx += dx * 0.0001;
          p.vy += dy * 0.0001;
        } else {
          // Slowly pull to center
          const dx = 0.5 - p.x;
          const dy = 0.5 - p.y;
          p.vx += dx * 0.00005;
          p.vy += dy * 0.00005;
        }

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 0.004;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Boundary bounce
        if (p.x < 0.05 || p.x > 0.95) {
          p.vx *= -1.0;
          p.x = Math.max(0.05, Math.min(0.95, p.x));
        }
        if (p.y < 0.05 || p.y > 0.95) {
          p.vy *= -1.0;
          p.y = Math.max(0.05, Math.min(0.95, p.y));
        }

        // Load into fallback uniform array
        particleUniforms[i * 3 + 0] = p.x;
        particleUniforms[i * 3 + 1] = p.y;
        particleUniforms[i * 3 + 2] = p.radius;
      }

      gl.uniform3fv(uParticles, particleUniforms);

      // Draw background + distorted glass
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      resizeObserver.disconnect();
      gl.deleteBuffer(positionBuffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
    };
  }, [mode, scale, ior, thickness, chromaticAberration, anisotropy, bevelWidth, blur, transmission, roughness]);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full overflow-hidden select-none', className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none z-0"
      />
      {/* Content overlays */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

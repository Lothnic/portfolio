"use client";

import { useEffect, useRef } from "react";

type HeroCanvasProps = {
  theme: "light" | "dark";
  /** Skip the drifting petal/spark particles — keeps only the sun glow + ripples. */
  quiet?: boolean;
};

export function HeroCanvas({ theme, quiet = false }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId: number;
    let W = 0;
    let H = 0;
    let DPR = 1;
    let t = 0;

    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Color Palettes (Aligned with current sandstone & moss themes) ---
    const palettes = {
      light: {
        dark: "#111111",      // --hw-fg
        accent: "#d35400",    // --hw-accent
        petal: "#d35400",     // Warm rust petals
        spark: "#d35400",
        ripples: ["#111111", "#d35400", "#111111", "#d35400"],
      },
      dark: {
        dark: "#e8f0ec",      // --hw-fg
        accent: "#d0ff54",    // --hw-accent
        petal: "#d0ff54",     // Bright mint-lime petals
        spark: "#e8f0ec",
        ripples: ["#e8f0ec", "#d0ff54", "#e8f0ec", "#d0ff54"],
      },
    };

    const palette = palettes[theme];

    // --- Particle System (Drifting petals & pollen sparks) ---
    type Particle = {
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      phase: number;
      freq: number;
      kind: "petal" | "spark";
      alpha: number;
    };

    const particles: Particle[] = [];

    const makeParticle = (spawnAnywhere = false): Particle => {
      const isPetal = Math.random() < 0.55;
      return {
        x: Math.random() * W,
        y: spawnAnywhere ? Math.random() * H : H + Math.random() * 60,
        r: isPetal ? 1.6 + Math.random() * 2.2 : 0.8 + Math.random() * 1.2,
        vy: -(0.12 + Math.random() * 0.35),
        vx: (Math.random() - 0.5) * 0.25,
        phase: Math.random() * Math.PI * 2,
        freq: 0.004 + Math.random() * 0.01,
        kind: isPetal ? "petal" : "spark",
        alpha: 0.35 + Math.random() * 0.5,
      };
    };

    const seedParticles = () => {
      particles.length = 0;
      if (quiet) return; // no drifting particles on reading pages
      const count = Math.min(60, Math.floor((W * H) / 24000));
      for (let i = 0; i < count; i++) {
        particles.push(makeParticle(true));
      }
    };

    // --- Ripple definition (Horizontal sine bands at the bottom) ---
    const ripples = [
      { y: 0.78, amp: 10, len: 0.0055, speed: 0.012, alpha: 0.07, thick: 1.0 },
      { y: 0.84, amp: 14, len: 0.0042, speed: 0.009, alpha: 0.09, thick: 1.2 },
      { y: 0.90, amp: 18, len: 0.0035, speed: 0.014, alpha: 0.11, thick: 1.4 },
      { y: 0.96, amp: 22, len: 0.0028, speed: 0.008, alpha: 0.13, thick: 1.6 },
    ];

    const resize = () => {
      if (typeof window === "undefined") return;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seedParticles();
    };

    window.addEventListener("resize", resize);
    resize();

    // Helper to format RGBA from Hex
    const hexA = (hex: string, a: number) => {
      const h = hex.replace("#", "");
      const n = parseInt(h, 16);
      const r = (n >> 16) & 255;
      const g = (n >> 8) & 255;
      const b = n & 255;
      return `rgba(${r},${g},${b},${a})`;
    };

    const drawSun = () => {
      const isDark = theme === "dark";
      const glowRadius = Math.max(W, H) * 0.55;
      const g = ctx.createRadialGradient(W * 0.18, H * 0.12, 0, W * 0.18, H * 0.12, glowRadius);

      if (isDark) {
        g.addColorStop(0, "rgba(208, 255, 84, 0.06)"); // Glow from accent lime
        g.addColorStop(0.4, "rgba(232, 240, 236, 0.03)"); // Soft light green
        g.addColorStop(1, "rgba(17, 26, 22, 0.0)");
      } else {
        g.addColorStop(0, "rgba(253, 250, 225, 0.50)"); // Warm cream sunlight
        g.addColorStop(0.4, "rgba(211, 84, 0, 0.06)"); // Soft orange glow
        g.addColorStop(1, "rgba(237, 234, 228, 0.0)");
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    const drawRipples = () => {
      ripples.forEach((r, idx) => {
        const rippleColor = palette.ripples[idx];
        ctx.strokeStyle = hexA(rippleColor, r.alpha);
        ctx.lineWidth = r.thick;
        ctx.beginPath();
        const yBase = H * r.y;
        for (let x = 0; x <= W; x += 6) {
          const y =
            yBase +
            Math.sin(x * r.len + t * r.speed) * r.amp +
            Math.sin(x * r.len * 2.3 + t * r.speed * 0.6) * (r.amp * 0.35);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    };

    const drawParticles = () => {
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(t * p.freq + p.phase) * 0.4;

        if (p.y < -10 || p.x < -20 || p.x > W + 20) {
          Object.assign(p, makeParticle(false));
        }

        if (p.kind === "petal") {
          ctx.fillStyle = hexA(palette.petal, p.alpha);
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.r * 1.4, p.r * 0.7, p.phase + t * 0.002, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = hexA(palette.spark, p.alpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      drawSun();
      drawRipples();
      drawParticles();
      if (!reduceMotion) t += 1;
      animationId = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0"
      aria-hidden="true"
    />
  );
}

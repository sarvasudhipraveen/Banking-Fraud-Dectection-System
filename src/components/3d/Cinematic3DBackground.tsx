import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';

export const Cinematic3DBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Particle nodes for cyber grid constellation
    const nodeCount = 42;
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulse: number;
      pulseSpeed: number;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.4 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02
      });
    }

    // GSAP scanning light beam
    const scanState = { beamY: 0, glowIntensity: 0.4 };
    const scanTween = gsap.to(scanState, {
      beamY: height,
      repeat: -1,
      duration: 10,
      ease: 'none'
    });

    const glowTween = gsap.to(scanState, {
      glowIntensity: 0.8,
      repeat: -1,
      yoyo: true,
      duration: 4,
      ease: 'sine.inOut'
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // 3D Perspective Digital Floor Grid
      const horizonY = height * 0.65;
      ctx.save();
      ctx.strokeStyle = 'rgba(14, 52, 118, 0.12)';
      ctx.lineWidth = 1;

      // Perspective vertical grid radiating from vanishing point
      const vpX = mouseRef.current.x;
      const vpY = horizonY * 0.7;
      const rays = 24;
      for (let i = 0; i <= rays; i++) {
        const bottomX = (width / rays) * i;
        ctx.beginPath();
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizontal perspective rings
      for (let y = horizonY; y < height; y += (height - y) * 0.18 + 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Scanline Beam across the screen
      const beamGrad = ctx.createLinearGradient(0, scanState.beamY - 40, 0, scanState.beamY + 40);
      beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      beamGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.04)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, scanState.beamY - 40, width, 80);

      // Connecting lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.22;
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Cursor connection to closest nodes
      for (let i = 0; i < nodes.length; i++) {
        const mdx = nodes[i].x - mouseRef.current.x;
        const mdy = nodes[i].y - mouseRef.current.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 160) {
          const mOpacity = (1 - mDist / 160) * 0.25;
          ctx.strokeStyle = `rgba(125, 211, 252, ${mOpacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }
      }

      // Render Nodes with dynamic pulsing
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        node.pulse += node.pulseSpeed;
        const currentAlpha = node.alpha + Math.sin(node.pulse) * 0.15;

        // Node Glow
        ctx.fillStyle = `rgba(56, 189, 248, ${Math.max(0.1, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra highlight on larger nodes
        if (node.radius > 2.0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      scanTween.kill();
      glowTween.kill();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. Deep Space Base Radial Ambient Glows */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/20 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] -right-[15%] w-[55vw] h-[55vw] rounded-full bg-cyan-900/20 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-indigo-950/30 blur-[140px] pointer-events-none" />

      {/* 2. GSAP Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />

      {/* 3. Framer Motion 3D Floating Holographic Rings & Vault Circles */}
      <div className="absolute inset-0 perspective-1000 flex items-center justify-center">
        {/* Large 3D Gyroscope Ring 1 */}
        <motion.div
          animate={{
            rotateX: [25, 45, 25],
            rotateY: [0, 360],
            rotateZ: [0, 180, 360]
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="absolute w-[580px] h-[580px] rounded-full border border-cyan-500/15 shadow-[0_0_50px_rgba(56,189,248,0.06)] opacity-40 pointer-events-none"
        >
          {/* Satellite Node on Ring */}
          <div className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
        </motion.div>

        {/* Medium 3D Gyroscope Ring 2 */}
        <motion.div
          animate={{
            rotateX: [60, 30, 60],
            rotateY: [360, 0],
            rotateZ: [360, 0]
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="absolute w-[420px] h-[420px] rounded-full border border-blue-400/20 shadow-[0_0_40px_rgba(96,165,250,0.08)] opacity-35 pointer-events-none"
        >
          {/* Satellite Node */}
          <div className="absolute -bottom-1 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
        </motion.div>

        {/* Small Fast Counter-Rotating Ring 3 */}
        <motion.div
          animate={{
            rotateX: [-35, -55, -35],
            rotateY: [0, -360],
            rotateZ: [0, 360]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="absolute w-[280px] h-[280px] rounded-full border border-cyan-300/25 border-dashed opacity-30 pointer-events-none"
        />
      </div>

      {/* 4. Cinematic Anamorphic Horizontal Flare Sweep */}
      <motion.div
        animate={{
          x: ['-100%', '200%']
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-1/4 left-0 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-[1px] opacity-40 pointer-events-none"
      />

      <motion.div
        animate={{
          x: ['200%', '-100%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4
        }}
        className="absolute top-2/3 left-0 w-3/4 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/25 to-transparent blur-[1px] opacity-35 pointer-events-none"
      />

      {/* 5. Vignette Overlay for Cinematic Depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#020919]/40 to-[#020919]/90 pointer-events-none" />
    </div>
  );
};

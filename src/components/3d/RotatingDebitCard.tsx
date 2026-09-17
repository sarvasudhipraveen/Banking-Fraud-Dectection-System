import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Wifi, ShieldCheck, RefreshCw, Sparkles, Cpu } from 'lucide-react';

interface RotatingDebitCardProps {
  cardHolder?: string;
  accountNumber?: string;
  expiry?: string;
  bankName?: string;
  isFlipped?: boolean;
  onFlip?: () => void;
}

export const RotatingDebitCard: React.FC<RotatingDebitCardProps> = ({
  cardHolder = 'VIKRAMADITYA RAO',
  accountNumber = '4892 •••• •••• 8821',
  expiry = '09/29',
  bankName = 'APEX PREMIER BANK',
  isFlipped: controlledFlipped,
  onFlip
}) => {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;
  const toggleFlip = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

  // 3D Tilt calculations
  const cardRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative perspective-1000 w-full max-w-[380px] mx-auto select-none">
      {/* 3D Container with spring tilt */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isFlipped ? '0deg' : rotateX,
          rotateY: isFlipped ? '180deg' : rotateY,
          transformStyle: 'preserve-3d'
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative h-[220px] sm:h-[235px] w-full rounded-2xl cursor-pointer shadow-2xl transition-shadow duration-500 hover:shadow-cyan-500/20"
        onClick={toggleFlip}
      >
        {/* ================= FRONT OF CARD ================= */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between overflow-hidden backface-hidden border border-cyan-400/40 shadow-2xl ${
            isFlipped ? 'pointer-events-none' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, #071a3e 0%, #0c2b64 45%, #051433 100%)',
            transform: 'rotateY(0deg)'
          }}
        >
          {/* Holographic Sheen Layer */}
          <motion.div
            className="pointer-events-none absolute -inset-[100%] opacity-30 holographic-sheen animate-hologram"
            style={{
              translateX: glareX,
              translateY: glareY
            }}
          />

          {/* Top Row: Bank Brand & Contactless Icon */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <span className="font-extrabold tracking-wider text-xs sm:text-sm text-white font-mono block">
                  {bankName}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-cyan-300/80 font-mono">
                  Apex Reserve Private Client
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300">
              <Wifi className="w-4 h-4 rotate-90" />
            </div>
          </div>

          {/* Middle Row: EMV Chip & Hologram */}
          <div className="flex items-center justify-between z-10 my-1">
            {/* Metallic Gold EMV Chip */}
            <div className="w-11 h-9 rounded-md bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-300/80 shadow-md relative overflow-hidden flex items-center justify-center">
              <Cpu className="w-6 h-6 text-amber-900/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>

            {/* AI Fraud Shield Hologram */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[10px] font-mono text-cyan-300">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>AI Shield 2026</span>
            </div>
          </div>

          {/* Bottom Row: Number, Name, Expiry */}
          <div className="z-10 space-y-2">
            <div className="font-mono text-base sm:text-lg font-bold tracking-[0.2em] text-white drop-shadow-md">
              {accountNumber}
            </div>
            <div className="flex items-end justify-between text-[11px] font-mono">
              <div>
                <div className="text-[9px] text-blue-300/70 tracking-wider uppercase">Cardholder</div>
                <div className="font-bold text-slate-100 tracking-wider uppercase">{cardHolder}</div>
              </div>
              <div>
                <div className="text-[9px] text-blue-300/70 tracking-wider uppercase">Expires</div>
                <div className="font-bold text-slate-100 tracking-wider">{expiry}</div>
              </div>
              <div className="flex items-center -space-x-2">
                <div className="w-6 h-6 rounded-full bg-rose-500/80" />
                <div className="w-6 h-6 rounded-full bg-amber-500/80" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= BACK OF CARD ================= */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl py-6 flex flex-col justify-between overflow-hidden backface-hidden border border-blue-400/30 shadow-2xl ${
            !isFlipped ? 'pointer-events-none' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, #051433 0%, #08204d 50%, #040e24 100%)',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Black Magnetic Stripe */}
          <div className="w-full h-10 bg-black/95 shadow-inner" />

          {/* Signature Strip & CVV */}
          <div className="px-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-400 font-mono">AUTHORIZED SIGNATURE</span>
              <span className="text-[9px] text-cyan-300 font-mono">SECURITY CODE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-8 bg-slate-200 rounded flex items-center px-3 text-slate-800 font-serif italic text-xs tracking-wider">
                {cardHolder}
              </div>
              <div className="w-14 h-8 bg-white/90 rounded flex items-center justify-center font-mono font-black text-slate-900 text-xs tracking-widest">
                821
              </div>
            </div>
          </div>

          {/* Bank Security Notice & Toll-Free */}
          <div className="px-6 text-[9px] text-slate-400 font-mono space-y-1">
            <div className="flex justify-between items-center text-cyan-400">
              <span>24x7 Global Toll-Free: 1800 419 8888</span>
              <span>SWIFT: APEXINBBXXX</span>
            </div>
            <p className="text-[8px] text-slate-500 leading-tight">
              Issued under RBI 2026 ML Fraud Protection Framework. This card is protected by real-time behavioral biometric anomaly detection.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Flip Prompt */}
      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-blue-300/80 font-mono">
        <button
          onClick={toggleFlip}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/30 text-cyan-300 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Click card to {isFlipped ? 'view front' : 'view back & CVV'}</span>
        </button>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
  gradientSize?: number;
  gradientOpacity?: number;
  tilt?: boolean;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className = '',
  gradientColor = 'rgba(56, 189, 248, 0.25)',
  gradientSize = 250,
  gradientOpacity = 0.8,
  tilt = true
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: -gradientSize, y: -gradientSize });
  const [opacity, setOpacity] = useState(0);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
    setOpacity(gradientOpacity);

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      setTiltStyle({ rotateX, rotateY });
    }
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    if (tilt) {
      setTiltStyle({ rotateX: 0, rotateY: 0 });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tiltStyle.rotateX,
        rotateY: tiltStyle.rotateY
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative overflow-hidden rounded-2xl border border-blue-500/25 bg-[#08183a]/85 backdrop-blur-xl shadow-xl transition-colors duration-300 hover:border-cyan-400/50 ${className}`}
    >
      {/* Radial cursor spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${gradientSize}px circle at ${position.x}px ${position.y}px, ${gradientColor}, transparent 80%)`
        }}
      />
      {children}
    </motion.div>
  );
};

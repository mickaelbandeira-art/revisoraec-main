
import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl'
  };

  const shadowStyle = {
    textShadow: `
      0 1px 0 #0099cc,
      0 2px 0 #0088bb,
      0 3px 0 #0077aa,
      0 4px 0 #006699,
      0 5px 10px rgba(0,0,0,0.2)
    `,
    background: 'linear-gradient(to bottom, #00BFFF, #0047AB)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 900,
  };

  return (
    <div 
      className={`logo-container inline-block ${className}`} 
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        style={{ 
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d'
        }} 
        className={`flex flex-col items-center leading-none cursor-pointer select-none ${sizeClasses[size]}`}
      >
        <span style={shadowStyle} className="italic tracking-tighter">Revisor</span>
        <span style={{...shadowStyle, marginTop: '-0.1em'}} className="lowercase tracking-widest opacity-90">aeC</span>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .logo-container { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

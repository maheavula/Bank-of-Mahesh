import React from 'react';

interface SpatialCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glow?: 'emerald' | 'cyan' | 'gold' | 'purple' | 'none';
  onClick?: () => void;
}

export const SpatialCard: React.FC<SpatialCardProps> = ({
  children,
  className = '',
  hoverable = false,
  glow = 'none',
  onClick
}) => {
  const glowStyle =
    glow === 'emerald'
      ? 'glow-emerald'
      : glow === 'cyan'
      ? 'glow-cyan'
      : glow === 'gold'
      ? 'glow-gold'
      : glow === 'purple'
      ? 'glow-purple'
      : '';

  return (
    <div
      onClick={onClick}
      className={`spatial-card p-6 ${hoverable ? 'spatial-card-hover cursor-pointer' : ''} ${glowStyle} ${className}`}
    >
      {children}
    </div>
  );
};

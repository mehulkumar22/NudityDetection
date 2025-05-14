import React from 'react';
import { MapPin } from 'lucide-react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 24, className = '' }) => {
  return (
    <div className={`text-primary-600 dark:text-primary-400 ${className}`}>
      <MapPin size={size} strokeWidth={2} fill="currentColor" />
    </div>
  );
};

export default Logo;
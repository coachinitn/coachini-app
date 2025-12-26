'use client';

import React, { ElementType } from 'react';
import Image from 'next/image';
import { cn } from '@/core/utils';

export interface IconProps {
  icon: ElementType | string;
  className?: string;
  size?: number;
  alt?: string;
  isActive?: boolean;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function Icon({ 
  icon, 
  className, 
  size = 24, 
  alt = 'icon',
  isActive,
  activeClassName = 'text-primary',
  inactiveClassName = 'text-muted-foreground'
}: IconProps) {
  // Compute the combined class based on active state
  const computedClassName = cn(
    className,
    isActive !== undefined ? (isActive ? activeClassName : inactiveClassName) : ''
  );

  // Check if the icon is a component or a string path
  const isComponent = typeof icon !== 'string';

  if (isComponent) {
    const IconComponent = icon as ElementType;
    return (
      <IconComponent 
        className={computedClassName}
        width={size}
        height={size}
      />
    );
  }

  // If it's a string, treat it as an image path
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={icon as string}
        alt={alt}
        width={size}
        height={size}
        className={computedClassName}
      />
      {isActive && (
        <div
          className="absolute inset-0 bg-primary-900 rounded-inherit mix-blend-color"
          aria-hidden="true"
        />
      )}
    </div>
  );
} 
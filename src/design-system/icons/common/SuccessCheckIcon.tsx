import React from 'react';
import { cn } from '@/core/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {}

const SuccessCheckIcon = React.forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => (
  <svg 
    ref={ref}
    {...props}
    className={cn('', className)}
    width="108"
    height="108"
    viewBox="0 0 108 108" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="108" height="108" rx="54" fill="#4EBF31"/>
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M45.2811 78C43.7965 78 42.2963 77.4273 41.1614 76.274L22.7081 57.657C20.4306 55.3584 20.4306 51.6397 22.7081 49.341C24.9856 47.0423 28.6701 47.0423 30.9476 49.341L45.2811 63.7921L78.0524 30.724C80.3299 28.4253 84.0144 28.4253 86.2919 30.724C88.5694 33.0227 88.5694 36.7414 86.2919 39.0401L49.4009 76.274C48.266 77.4273 46.7736 78 45.2811 78Z" 
      fill="#FCFBF7"
    />
  </svg>
));

SuccessCheckIcon.displayName = 'SuccessCheckIcon';
export default SuccessCheckIcon;
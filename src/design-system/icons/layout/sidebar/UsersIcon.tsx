import React from 'react';
import { cn } from '@/core/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {}

const UsersIcon = React.forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => (
  <svg 
    ref={ref} 
    {...props}
    className={cn('', className)}
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M17.8877 10.9739C19.2827 10.7779 20.3567 9.58187 20.3597 8.13287C20.3597 6.70487 19.3187 5.52088 17.9537 5.29688" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M19.7285 14.3281C21.0795 14.5301 22.0225 15.0031 22.0225 15.9781C22.0225 16.6491 21.5785 17.0851 20.8605 17.3591" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M11.8867 14.7422C8.67273 14.7422 5.92773 15.2292 5.92773 17.1742C5.92773 19.1182 8.65573 19.6192 11.8867 19.6192C15.1007 19.6192 17.8447 19.1372 17.8447 17.1912C17.8447 15.2452 15.1177 14.7422 11.8867 14.7422Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M11.8864 11.9661C13.9954 11.9661 15.7054 10.2571 15.7054 8.14713C15.7054 6.03813 13.9954 4.32812 11.8864 4.32812C9.77741 4.32812 8.06741 6.03813 8.06741 8.14713C8.05941 10.2491 9.75641 11.9591 11.8584 11.9661H11.8864Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M5.88509 10.9739C4.48909 10.7779 3.41609 9.58187 3.41309 8.13287C3.41309 6.70487 4.45409 5.52088 5.81909 5.29688" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M4.044 14.3281C2.693 14.5301 1.75 15.0031 1.75 15.9781C1.75 16.6491 2.194 17.0851 2.912 17.3591" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
));

UsersIcon.displayName = 'UsersIcon';
export default UsersIcon;

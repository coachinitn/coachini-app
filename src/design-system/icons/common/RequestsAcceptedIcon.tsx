import React from 'react';
import { cn } from '@/core/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {}

const RequestsAcceptedIcon = React.forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => (
  <svg 
    ref={ref} 
    {...props}
    className={cn('', className)}
    width="32"
    height="33"
    viewBox="0 0 32 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M23.8496 15.0303C25.7096 14.7689 27.1416 13.1743 27.1456 11.2423C27.1456 9.33827 25.7576 7.7596 23.9376 7.46094" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M26.3047 19.5C28.106 19.7693 29.3634 20.4 29.3634 21.7C29.3634 22.5947 28.7714 23.176 27.814 23.5413" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M15.8487 20.0469C11.5633 20.0469 7.90332 20.6962 7.90332 23.2895C7.90332 25.8815 11.5407 26.5495 15.8487 26.5495C20.134 26.5495 23.7927 25.9069 23.7927 23.3122C23.7927 20.7175 20.1567 20.0469 15.8487 20.0469Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M15.8489 16.3481C18.6609 16.3481 20.9409 14.0694 20.9409 11.2561C20.9409 8.44406 18.6609 6.16406 15.8489 6.16406C13.0369 6.16406 10.7569 8.44406 10.7569 11.2561C10.7462 14.0587 13.0089 16.3387 15.8115 16.3481H15.8489Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M7.8458 15.0303C5.98447 14.7689 4.5538 13.1743 4.5498 11.2423C4.5498 9.33827 5.9378 7.7596 7.7578 7.46094" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M5.39167 19.5C3.59034 19.7693 2.33301 20.4 2.33301 21.7C2.33301 22.5947 2.92501 23.176 3.88234 23.5413" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
));

RequestsAcceptedIcon.displayName = 'RequestsAcceptedIcon';
export default RequestsAcceptedIcon;

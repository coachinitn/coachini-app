import React from 'react';
import { cn } from '@/core/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {}

const TotalRequestsIcon = React.forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => (
  <svg 
    ref={ref} 
    {...props}
    className={cn('', className)}
    width="26"
    height="27"
    viewBox="0 0 26 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M8.30408 4.28906C5.56324 4.28906 3.79199 6.16648 3.79199 9.07306V17.9217C3.79199 20.8283 5.56324 22.7057 8.30408 22.7057H17.6944C20.4363 22.7057 22.2087 20.8283 22.2087 17.9217V9.07306C22.2087 6.16648 20.4374 4.28906 17.6955 4.28906H8.30408ZM17.6944 24.3307H8.30408C4.63266 24.3307 2.16699 21.7546 2.16699 17.9217V9.07306C2.16699 5.24023 4.63266 2.66406 8.30408 2.66406H17.6955C21.3669 2.66406 23.8337 5.24023 23.8337 9.07306V17.9217C23.8337 21.7546 21.3669 24.3307 17.6944 24.3307Z" 
      fill="currentColor"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M16.6726 16.4941C16.5307 16.4941 16.3877 16.4573 16.2566 16.3804L12.583 14.1888C12.3382 14.0415 12.1865 13.776 12.1865 13.4911V8.76562C12.1865 8.31713 12.5505 7.95312 12.999 7.95312C13.4475 7.95312 13.8115 8.31713 13.8115 8.76562V13.0296L17.0897 14.9829C17.4743 15.2136 17.601 15.712 17.3714 16.0976C17.2186 16.3522 16.9489 16.4941 16.6726 16.4941Z" 
      fill="currentColor"
    />
  </svg>
));

TotalRequestsIcon.displayName = 'TotalRequestsIcon';
export default TotalRequestsIcon;

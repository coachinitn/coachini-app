import React from 'react';
import { cn } from '@/core/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {}

const BusinessRequestsIcon = React.forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => (
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
      d="M8.30408 4.28906C5.56324 4.28906 3.79199 6.16648 3.79199 9.07306V17.9217C3.79199 20.8283 5.56324 22.7057 8.30408 22.7057H17.6944C20.4363 22.7057 22.2087 20.8283 22.2087 17.9217V9.07306C22.2087 6.16648 20.4363 4.28906 17.6955 4.28906H8.30408ZM17.6944 24.3307H8.30408C4.63266 24.3307 2.16699 21.7546 2.16699 17.9217V9.07306C2.16699 5.24023 4.63266 2.66406 8.30408 2.66406H17.6955C21.3669 2.66406 23.8337 5.24023 23.8337 9.07306V17.9217C23.8337 21.7546 21.3669 24.3307 17.6944 24.3307Z" 
      fill="currentColor"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M11.7151 16.8834C11.5082 16.8834 11.2991 16.8043 11.141 16.6451L8.56912 14.0743C8.2517 13.7569 8.2517 13.2434 8.56912 12.926C8.88653 12.6086 9.40003 12.6086 9.71745 12.926L11.7151 14.9215L16.2824 10.3552C16.5999 10.0378 17.1134 10.0378 17.4308 10.3552C17.7482 10.6727 17.7482 11.1862 17.4308 11.5036L12.2893 16.6451C12.1311 16.8043 11.9231 16.8834 11.7151 16.8834Z" 
      fill="currentColor"
    />
  </svg>
));

BusinessRequestsIcon.displayName = 'BusinessRequestsIcon';
export default BusinessRequestsIcon;

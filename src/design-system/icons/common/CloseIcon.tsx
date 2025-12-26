import React from 'react';
import { cn } from '@/core/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {}

const CloseIcon = React.forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => (
  <svg 
    ref={ref} 
    {...props}
    className={cn('', className)}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M9.60247 15.1355C9.41047 15.1355 9.21847 15.0625 9.07247 14.9155C8.77947 14.6225 8.77947 14.1485 9.07247 13.8555L13.8645 9.0635C14.1575 8.7705 14.6315 8.7705 14.9245 9.0635C15.2175 9.3565 15.2175 9.8305 14.9245 10.1235L10.1325 14.9155C9.98647 15.0625 9.79447 15.1355 9.60247 15.1355Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M14.3965 15.1405C14.2045 15.1405 14.0125 15.0675 13.8665 14.9205L9.07052 10.1235C8.77752 9.8305 8.77752 9.3565 9.07052 9.0635C9.36452 8.7705 9.83852 8.7705 10.1305 9.0635L14.9265 13.8605C15.2195 14.1535 15.2195 14.6275 14.9265 14.9205C14.7805 15.0675 14.5875 15.1405 14.3965 15.1405Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7.665 3.5C5.135 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.135 20.5 7.665 20.5H16.333C18.864 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.864 3.5 16.334 3.5H7.665ZM16.333 22H7.665C4.276 22 2 19.622 2 16.084V7.916C2 4.378 4.276 2 7.665 2H16.334C19.723 2 22 4.378 22 7.916V16.084C22 19.622 19.723 22 16.333 22Z" fill="currentColor" />
  </svg>
));

CloseIcon.displayName = 'CloseIcon';
export default CloseIcon; 
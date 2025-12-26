import React from 'react';
import { cn } from '@/core/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {}

const RequestsIcon = React.forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => (
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
    <mask id="mask0_40000317_105841" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="3" y="2" width="18" height="20">
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M3 2.08594H20.0527V21.9394H3V2.08594Z" 
        fill="white"
      />
    </mask>
    <g mask="url(#mask0_40000317_105841)">
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M7.5731 3.58594C5.9161 3.58594 4.5401 4.92794 4.5011 6.58294V17.2779C4.4641 18.9909 5.8141 20.4019 7.5101 20.4399H15.5741C17.2431 20.3709 18.5651 18.9839 18.5531 17.2839V8.41394L13.9181 3.58594H7.5851H7.5731ZM7.5851 21.9399H7.4761C4.9541 21.8829 2.9461 19.7849 3.0011 17.2619V6.56494C3.0591 4.08394 5.1081 2.08594 7.5711 2.08594H7.5881H14.2381C14.4421 2.08594 14.6371 2.16894 14.7791 2.31594L19.8441 7.59294C19.9781 7.73194 20.0531 7.91894 20.0531 8.11194V17.2779C20.0711 19.7869 18.1171 21.8369 15.6041 21.9389L7.5851 21.9399Z" 
        fill="currentColor"
      />
    </g>
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M19.2986 9.06213H16.5436C14.7136 9.05713 13.2256 7.56512 13.2256 5.73712V2.82812C13.2256 2.41412 13.5616 2.07812 13.9756 2.07812C14.3896 2.07812 14.7256 2.41412 14.7256 2.82812V5.73712C14.7256 6.74113 15.5426 7.55913 16.5456 7.56213H19.2986C19.7126 7.56213 20.0486 7.89813 20.0486 8.31213C20.0486 8.72613 19.7126 9.06213 19.2986 9.06213Z" 
      fill="currentColor"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M13.7887 16.1875H8.38867C7.97467 16.1875 7.63867 15.8515 7.63867 15.4375C7.63867 15.0235 7.97467 14.6875 8.38867 14.6875H13.7887C14.2027 14.6875 14.5387 15.0235 14.5387 15.4375C14.5387 15.8515 14.2027 16.1875 13.7887 16.1875Z" 
      fill="currentColor"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M11.7437 12.4375H8.3877C7.9737 12.4375 7.6377 12.1015 7.6377 11.6875C7.6377 11.2735 7.9737 10.9375 8.3877 10.9375H11.7437C12.1577 10.9375 12.4937 11.2735 12.4937 11.6875C12.4937 12.1015 12.1577 12.4375 11.7437 12.4375Z" 
      fill="currentColor"
    />
  </svg>
));

RequestsIcon.displayName = 'RequestsIcon';
export default RequestsIcon;

import React from 'react';
import { cn } from '@/core/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {}

const ReportsIcon = React.forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => (
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
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M7.21653 16.0832C7.05653 16.0832 6.89553 16.0322 6.75953 15.9282C6.43153 15.6752 6.36953 15.2042 6.62253 14.8762L9.61553 10.9862C9.73753 10.8272 9.91853 10.7242 10.1165 10.6992C10.3185 10.6732 10.5165 10.7292 10.6735 10.8542L13.4935 13.0692L15.9605 9.88619C16.2145 9.55719 16.6845 9.49619 17.0125 9.75219C17.3405 10.0062 17.4005 10.4772 17.1465 10.8042L14.2165 14.5842C14.0945 14.7422 13.9145 14.8452 13.7165 14.8692C13.5165 14.8962 13.3185 14.8382 13.1605 14.7152L10.3425 12.5012L7.81153 15.7902C7.66353 15.9822 7.44153 16.0832 7.21653 16.0832Z" 
      fill="currentColor"
    />
    <mask id="mask0_40000317_105805" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="17" y="2" width="6" height="6">
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M17.2949 2.07812H22.6389V7.42303H17.2949V2.07812Z" 
        fill="white"
      />
    </mask>
    <g mask="url(#mask0_40000317_105805)">
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M19.9669 3.57812C19.3209 3.57812 18.7949 4.10313 18.7949 4.75012C18.7949 5.39613 19.3209 5.92313 19.9669 5.92313C20.6129 5.92313 21.1389 5.39613 21.1389 4.75012C21.1389 4.10313 20.6129 3.57812 19.9669 3.57812ZM19.9669 7.42312C18.4939 7.42312 17.2949 6.22412 17.2949 4.75012C17.2949 3.27612 18.4939 2.07812 19.9669 2.07812C21.4409 2.07812 22.6389 3.27612 22.6389 4.75012C22.6389 6.22412 21.4409 7.42312 19.9669 7.42312Z" 
        fill="currentColor"
      />
    </g>
    <mask id="mask1_40000317_105805" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="2" y="2" width="20" height="21">
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M2 2.92188H21.8619V22.7829H2V2.92188Z" 
        fill="white"
      />
    </mask>
    <g mask="url(#mask1_40000317_105805)">
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M16.233 22.7829H7.629C4.262 22.7829 2 20.4179 2 16.8979V8.81588C2 5.29087 4.262 2.92188 7.629 2.92188H14.897C15.311 2.92188 15.647 3.25787 15.647 3.67188C15.647 4.08588 15.311 4.42188 14.897 4.42188H7.629C5.121 4.42188 3.5 6.14587 3.5 8.81588V16.8979C3.5 19.6029 5.082 21.2829 7.629 21.2829H16.233C18.741 21.2829 20.362 19.5619 20.362 16.8979V9.85887C20.362 9.44487 20.698 9.10887 21.112 9.10887C21.526 9.10887 21.862 9.44487 21.862 9.85887V16.8979C21.862 20.4179 19.6 22.7829 16.233 22.7829Z" 
        fill="currentColor"
      />
    </g>
  </svg>
));

ReportsIcon.displayName = 'ReportsIcon';
export default ReportsIcon;

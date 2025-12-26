import React from 'react';

interface ArrowCtaIconProps extends React.SVGProps<SVGSVGElement> {
  // You can add specific props here if needed, for example, for accessibility
  title?: string;
}

const ArrowCtaIcon: React.FC<ArrowCtaIconProps> = ({ title, ...props }) => {
  return (
    <svg 
      width="32" 
      height="30" 
      viewBox="0 0 32 30" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={title ? 'arrow-cta-title' : undefined}
      {...props}
    >
      {title && <title id="arrow-cta-title">{title}</title>}
      <rect width="32" height="30" rx="6" fill="#094BA4" />
      <path d="M17.083 9.45964L22.9163 15.0013L17.083 20.543" stroke="#FCFBF7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.08301 9.45964L14.9163 15.0013L9.08301 20.543" stroke="#FCFBF7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default ArrowCtaIcon;

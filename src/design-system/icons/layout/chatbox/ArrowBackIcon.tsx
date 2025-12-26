import React, { forwardRef } from "react"
import type { ComponentPropsWithoutRef } from "react"

export interface IconProps extends ComponentPropsWithoutRef<"svg"> {
  size?: number
}

export const ArrowBackIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 32, className = "", ...props }, ref) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        ref={ref}
        {...props}
      >
        <path
          d="M21.3736 6.46086C21.7286 6.81588 21.7609 7.37144 21.4704 7.76292L21.3736 7.87508L12.7478 16.5013L21.3736 25.1275C21.7286 25.4826 21.7609 26.0381 21.4704 26.4296L21.3736 26.5417C21.0186 26.8968 20.463 26.929 20.0716 26.6386L19.9594 26.5417L10.6261 17.2084C10.271 16.8534 10.2388 16.2978 10.5292 15.9064L10.6261 15.7942L19.9594 6.46086C20.3499 6.07034 20.9831 6.07034 21.3736 6.46086Z"
          fill="currentColor"
        />
      </svg>
    )
  }
)

ArrowBackIcon.displayName = "ArrowBackIcon" 
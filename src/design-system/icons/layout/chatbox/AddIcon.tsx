import React, { forwardRef } from "react"
import type { ComponentPropsWithoutRef } from "react"

export interface IconProps extends ComponentPropsWithoutRef<"svg"> {
  size?: number
}

export const AddIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className = "", ...props }, ref) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        ref={ref}
        {...props}
      >
        <path
          d="M12 0C5.376 0 0 5.376 0 12C0 18.624 5.376 24 12 24C18.624 24 24 18.624 24 12C24 5.376 18.624 0 12 0ZM18 12C18 12.6627 17.4627 13.2 16.8 13.2H13.2V16.8C13.2 17.4627 12.6627 18 12 18C11.3373 18 10.8 17.4627 10.8 16.8V13.2H7.2C6.53726 13.2 6 12.6627 6 12C6 11.3373 6.53726 10.8 7.2 10.8H10.8V7.2C10.8 6.53726 11.3373 6 12 6C12.6627 6 13.2 6.53726 13.2 7.2V10.8H16.8C17.4627 10.8 18 11.3373 18 12Z"
          fill="currentColor"
        />
      </svg>
    )
  }
)

AddIcon.displayName = "AddIcon" 
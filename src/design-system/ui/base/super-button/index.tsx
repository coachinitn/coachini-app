import * as React from "react"
import { Loader } from "lucide-react"
import { cn } from "../../../../core/utils"

export interface SuperButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "status" | "action" | "pill" | "icon"
  status?: "scheduled" | "won" | "pending" | "hold" | "lost"
  intent?: "primary" | "secondary"
  theme?: "success" | "outline" | "primary"
  size?: "sm" | "md" | "lg" | "xl"
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  isLoading?: boolean
  loadingText?: string
  filled?: boolean
  preserveColorWhenDisabled?: boolean
  children: React.ReactNode
}

const SuperButton = React.forwardRef<HTMLButtonElement, SuperButtonProps>(
  ({ 
    className, 
    variant = "action", 
    status = "scheduled",
    intent = "primary",
    theme = "primary",
    size = "md",
    icon,
    iconPosition = "left",
    isLoading = false,
    loadingText,
    filled = true,
    preserveColorWhenDisabled = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    
    const statusVariants = {
      scheduled: {
        filled: "bg-[#999] text-slate-50 border border-[#999] hover:bg-[#888] hover:border-[#888]",
        outlined: "bg-transparent text-[#999] border border-[#999] hover:bg-[#999]/10"
      },
      won: {
        filled: "bg-[#4EBF31] text-[#FCFBF7] border border-[#4EBF31] hover:bg-[#45a82c] hover:border-[#45a82c]",
        outlined: "bg-transparent text-[#4EBF31] border border-[#4EBF31] hover:bg-[#4EBF31]/10"
      },
      pending: {
        filled: "bg-[#FF8C00] text-[#FCFBF7] border border-[#FF8C00] hover:bg-[#e67e00] hover:border-[#e67e00]",
        outlined: "bg-transparent text-[#FF8C00] border border-[#FF8C00] hover:bg-[#FF8C00]/10"
      },
      hold: {
        filled: "bg-[#5381BF] text-[#FCFBF7] border border-[#5381BF] hover:bg-[#4a74ac] hover:border-[#4a74ac]",
        outlined: "bg-transparent text-[#5381BF] border border-[#5381BF] hover:bg-[#5381BF]/10"
      },
      lost: {
        filled: "bg-[#FF3100] text-[#FCFBF7] border border-[#FF3100] hover:bg-[#e62c00] hover:border-[#e62c00]",
        outlined: "bg-transparent text-[#FF3100] border border-[#FF3100] hover:bg-[#FF3100]/10"
      }
    }

    const intentVariants = {
      primary: {
        filled: "bg-[#094BA4] text-slate-50 border border-[#094BA4] hover:bg-[#083d8a] hover:border-[#083d8a]",
        outlined: "bg-transparent text-[#094BA4] border border-[#094BA4] hover:bg-[#094BA4]/10"
      },
      secondary: {
        filled: "bg-[#EFEFEF] text-[#094BA4] border border-[#EFEFEF] hover:bg-[#e0e0e0] hover:border-[#e0e0e0]",
        outlined: "bg-transparent text-[#094BA4] border border-[#094BA4] hover:bg-[#094BA4]/5"
      }
    }

    const themeVariants = {
      success: {
        filled: "bg-[rgba(74,222,128,0.64)] text-[rgba(252,251,247,1)] border-2 border-[rgba(74,222,128,0.64)] hover:bg-[rgba(74,222,128,0.8)] hover:border-[rgba(74,222,128,0.8)]",
        outlined: "bg-[rgba(252,251,247,1)] text-[rgba(74,222,128,1)] border-2 border-[rgba(74,222,128,1)] hover:bg-[rgba(74,222,128,0.1)]"
      },
      outline: {
        filled: "bg-[rgba(9,75,164,1)] text-[rgba(252,251,247,1)] border-2 border-[rgba(9,75,164,1)] hover:bg-[rgba(8,61,138,1)] hover:border-[rgba(8,61,138,1)]",
        outlined: "bg-[rgba(252,251,247,1)] text-[rgba(9,75,164,1)] border-2 border-[rgba(9,75,164,1)] hover:bg-[rgba(9,75,164,0.1)]"
      },
      primary: {
        filled: "bg-[rgba(9,75,164,1)] text-[rgba(252,251,247,1)] border-2 border-[rgba(9,75,164,1)] hover:bg-[rgba(8,61,138,1)] hover:border-[rgba(8,61,138,1)]",
        outlined: "bg-[rgba(252,251,247,1)] text-[rgba(9,75,164,1)] border-2 border-[rgba(9,75,164,1)] hover:bg-[rgba(9,75,164,0.1)]"
      }
    }

    // Enhanced size variants for different button types
    const actionSizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-8 py-4 text-base",
      lg: "px-8 py-4 text-lg min-w-60",
      xl: "px-12 py-6 text-xl min-w-72"
    }

    const pillSizes = {
      sm: "px-4 py-2 text-sm min-h-[35px]",
      md: "px-6 py-3 text-base min-h-[43px]",
      lg: "px-8 py-4 text-lg min-h-[51px]",
      xl: "px-10 py-5 text-xl min-h-[59px]"
    }

    const statusSizes = {
      sm: "px-4 py-1.5 text-xs min-h-6",
      md: "px-8 py-[9px] text-sm min-h-8",
      lg: "px-10 py-3 text-base min-h-10",
      xl: "px-12 py-4 text-lg min-h-12"
    }

    const iconSizes = {
      sm: "px-2 py-1.5 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-2.5 text-base",
      xl: "px-5 py-3 text-lg"
    }

    const getIconSize = () => {
      switch (size) {
        case "sm": return 16
        case "md": return 18
        case "lg": return 20
        case "xl": return 24
        default: return 18
      }
    }

    const getIconSpacing = () => {
      switch (size) {
        case "sm": return iconPosition === "left" ? "mr-1.5" : "ml-1.5"
        case "md": return iconPosition === "left" ? "mr-2" : "ml-2"
        case "lg": return iconPosition === "left" ? "mr-2.5" : "ml-2.5"
        case "xl": return iconPosition === "left" ? "mr-3" : "ml-3"
        default: return iconPosition === "left" ? "mr-2" : "ml-2"
      }
    }

    const isDisabled = disabled || isLoading

    const getDisabledStyles = () => {
      if (!isDisabled) return ""
      
      if (preserveColorWhenDisabled) {
        return "cursor-not-allowed"
      } else {
        return "opacity-50 cursor-not-allowed"
      }
    }

    const getVariantStyles = () => {
      const baseStyles = "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shadow-[0px_2px_4px_0px_rgba(136,144,194,0.20),0px_5px_15px_0px_rgba(37,44,97,0.15)]"
      
      switch (variant) {
        case "status":
          const statusStyle = statusVariants[status][filled ? "filled" : "outlined"]
          return cn(
            "w-full gap-2.5 overflow-hidden flex-1 shrink basis-[0%] rounded-[10px] font-medium capitalize leading-none border-solid max-md:px-5 relative",
            baseStyles,
            statusStyle,
            statusSizes[size],
            !isDisabled && "hover:shadow-[0px_4px_8px_0px_rgba(136,144,194,0.30),0px_8px_20px_0px_rgba(37,44,97,0.20)]"
          )
        case "action":
          const intentStyle = intentVariants[intent][filled ? "filled" : "outlined"]
          return cn(
            "gap-2.5 overflow-hidden rounded-[10px] font-medium capitalize leading-none max-md:px-5 relative",
            baseStyles,
            intentStyle,
            actionSizes[size],
            !isDisabled && "hover:shadow-[0px_4px_8px_0px_rgba(136,144,194,0.30),0px_8px_20px_0px_rgba(37,44,97,0.20)]"
          )
        case "pill":
          const themeStyle = themeVariants[theme][filled ? "filled" : "outlined"]
          return cn(
            "shadow-[0px_2px_4px_rgba(136,144,194,0.2)] gap-[9px] overflow-hidden rounded-[50px] border-solid text-center font-medium relative",
            baseStyles,
            themeStyle,
            pillSizes[size],
            !isDisabled && "hover:shadow-[0px_4px_8px_rgba(136,144,194,0.3)]"
          )
        case "icon":
          return cn(
            "text-[#094BA4] shadow-[0px_2px_4px_0px_rgba(136,144,194,0.20),0px_5px_15px_0px_rgba(37,44,97,0.15)] gap-2.5 overflow-hidden bg-[#E6EDF6] rounded-[10px] font-medium capitalize leading-none relative border border-[#E6EDF6]",
            baseStyles,
            iconSizes[size],
            !isDisabled && "hover:bg-[#d9e5f4] hover:border-[#d9e5f4] hover:shadow-[0px_4px_8px_0px_rgba(136,144,194,0.30),0px_8px_20px_0px_rgba(37,44,97,0.20)]"
          )
        default:
          return ""
      }
    }

    const buttonContent = (
      <>
        {isLoading && !loadingText && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader
              className="animate-spin"
              size={getIconSize()}
            />
          </span>
        )}
        <span className={cn("flex justify-center items-center", isLoading && !loadingText && "invisible")}>
          {icon && iconPosition === "left" && !isLoading && (
            <span className={getIconSpacing()}>
              {icon}
            </span>
          )}
          {isLoading && loadingText ? loadingText : children}
          {icon && iconPosition === "right" && !isLoading && (
            <span className={getIconSpacing()}>
              {icon}
            </span>
          )}
        </span>
      </>
    )

    if (variant === "icon") {
      return (
        <div className="flex items-stretch gap-[5px]">
          {icon && iconPosition === "left" && !isLoading && (
            <div className="flex min-h-[25px] flex-col items-center justify-center my-auto p-1">
              {icon}
            </div>
          )}
          <button
            className={cn(
              getVariantStyles(), 
              getDisabledStyles(),
              className
            )}
            disabled={isDisabled}
            ref={ref}
            {...props}
          >
            {buttonContent}
          </button>
          {icon && iconPosition === "right" && !isLoading && (
            <div className="flex min-h-[25px] flex-col items-center justify-center my-auto p-1">
              {icon}
            </div>
          )}
        </div>
      )
    }

    return (
      <button
        className={cn(
          getVariantStyles(),
          getDisabledStyles(),
          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)
SuperButton.displayName = "SuperButton"

export default SuperButton

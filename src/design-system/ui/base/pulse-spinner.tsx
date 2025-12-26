import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/core/utils';

const pulseSpinnerVariants = cva(
  "relative flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "w-6 h-6",
        md: "w-10 h-10", 
        lg: "w-12 h-12",
        xl: "w-16 h-16"
      },
      variant: {
        default: "",
        muted: "",
        accent: ""
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
);

const pulseRingVariants = cva(
  "absolute inset-0 rounded-full border-2 animate-ping",
  {
    variants: {
      variant: {
        default: "border-primary/20",
        muted: "border-muted-foreground/20", 
        accent: "border-accent/20"
      },
      ring: {
        outer: "",
        middle: "inset-1 border-primary/30",
        inner: ""
      }
    },
    compoundVariants: [
      {
        variant: "default",
        ring: "middle",
        className: "border-primary/30"
      },
      {
        variant: "muted", 
        ring: "middle",
        className: "border-muted-foreground/30"
      },
      {
        variant: "accent",
        ring: "middle", 
        className: "border-accent/30"
      }
    ]
  }
);

const pulseCircleVariants = cva(
  "relative rounded-full border-2 flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-12 h-12", 
        xl: "w-16 h-16"
      },
      variant: {
        default: "bg-primary/10 border-primary/40",
        muted: "bg-muted/10 border-muted-foreground/40",
        accent: "bg-accent/10 border-accent/40"
      }
    }
  }
);

const pulseDotVariants = cva(
  "rounded-full animate-pulse",
  {
    variants: {
      size: {
        sm: "w-2 h-2",
        md: "w-3 h-3", 
        lg: "w-4 h-4",
        xl: "w-5 h-5"
      },
      variant: {
        default: "bg-primary",
        muted: "bg-muted-foreground",
        accent: "bg-accent"
      }
    }
  }
);

export interface PulseSpinnerProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pulseSpinnerVariants> {
  showRings?: boolean;
}

const PulseSpinner = React.forwardRef<HTMLDivElement, PulseSpinnerProps>(
  ({ className, size, variant, showRings = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(pulseSpinnerVariants({ size, variant, className }))}
        {...props}
      >
        {showRings && (
          <>
            {/* Outer pulse ring */}
            <div className={cn(pulseRingVariants({ variant, ring: "outer" }))} />
            {/* Middle pulse ring */}
            <div 
              className={cn(pulseRingVariants({ variant, ring: "middle" }))}
              style={{ animationDelay: '0.2s' }}
            />
          </>
        )}
        {/* Inner solid circle */}
        <div className={cn(pulseCircleVariants({ size, variant }))}>
          <div className={cn(pulseDotVariants({ size, variant }))} />
        </div>
      </div>
    );
  }
);

PulseSpinner.displayName = "PulseSpinner";

export { PulseSpinner, pulseSpinnerVariants };

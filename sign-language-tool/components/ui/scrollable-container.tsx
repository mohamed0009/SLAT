'use client';

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ScrollableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string;
  fadeEdges?: boolean;
  glass?: boolean;
  glassDark?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "thin" | "hidden";
}

const ScrollableContainer = forwardRef<HTMLDivElement, ScrollableContainerProps>(
  ({ 
    className, 
    children, 
    maxHeight = "300px", 
    fadeEdges = false,
    glass = false,
    glassDark = false,
    padding = "md",
    variant = "default",
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(
          "relative overflow-hidden",
          {
            "mask-fade-edges": fadeEdges,
            "glass": glass,
            "glass-dark": glassDark,
            "p-0": padding === "none",
            "p-2": padding === "sm",
            "p-4": padding === "md",
            "p-6": padding === "lg",
            "rounded-lg": glass || glassDark,
          },
          className
        )}
        {...props}
      >
        <div
          ref={ref}
          className={cn(
            "overflow-y-auto",
            {
              "scrollbar-default": variant === "default",
              "scrollbar-thin": variant === "thin",
              "scrollbar-hidden": variant === "hidden",
            }
          )}
          style={{ maxHeight }}
        >
          {children}
        </div>
      </div>
    );
  }
);

ScrollableContainer.displayName = "ScrollableContainer";

export { ScrollableContainer }; 
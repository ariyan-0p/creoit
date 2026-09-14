"use client";

/**
 * Button — components/ui/Button.tsx
 *
 * CREOIT primary button with multiple variants and built-in
 * Framer Motion hover animation.
 *
 * Variants:
 *   primary  — filled accent background (default)
 *   secondary — outlined with transparent bg
 *   ghost    — text-only with underline reveal
 *   arrow    — text with animated arrow (→)
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "arrow";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  asChild?: boolean;
  href?: string;
  className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-xs tracking-widest",
  md: "px-8 py-4 text-sm tracking-widest",
  lg: "px-10 py-5 text-base tracking-widest",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--creoit-accent)] text-white border border-[var(--creoit-accent)] hover:bg-transparent hover:text-[var(--creoit-accent)]",
  secondary:
    "bg-transparent text-[var(--creoit-off-white)] border border-[rgba(255,255,255,0.25)] hover:border-[var(--creoit-accent)] hover:text-[var(--creoit-accent)]",
  ghost:
    "bg-transparent text-[var(--creoit-off-white)] border-none p-0 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[var(--creoit-accent)] after:transition-all after:duration-300 hover:after:w-full hover:text-[var(--creoit-accent)]",
  arrow:
    "bg-transparent text-[var(--creoit-off-white)] border-none p-0 flex items-center gap-2 group hover:text-[var(--creoit-accent)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isArrow = variant === "arrow";

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: isArrow ? 1 : 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "font-display font-semibold uppercase tracking-widest",
          "inline-flex items-center justify-center",
          "transition-colors duration-300",
          "cursor-pointer select-none",
          variant !== "ghost" && variant !== "arrow" && "rounded-none",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
        {isArrow && (
          <motion.span
            className="inline-block"
            initial={{ x: 0 }}
            whileHover={{ x: 6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            →
          </motion.span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;

"use client";

/**
 * PageTransition — components/layout/PageTransition.tsx
 *
 * Wraps page content with Framer Motion enter/exit animations.
 * Uses AnimatePresence (in the layout) with opacity + y slide.
 *
 * Usage (in individual pages):
 *   export default function Page() {
 *     return (
 *       <PageTransition>
 *         <main>...</main>
 *       </PageTransition>
 *     );
 *   }
 */

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.3,
      ease: "easeIn" as const,
    },
  },
};

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;

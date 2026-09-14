"use client";

/**
 * AnimatedText — components/ui/AnimatedText.tsx
 *
 * Reveals text by animating each word upward from a clipped container.
 * Driven by Framer Motion with configurable delay and stagger.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

interface AnimatedTextProps {
  text: string;
  /** Split mode: word (default) or character */
  splitBy?: "word" | "character";
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
  /** Element to render as */
  as?: HeadingTag;
  /** id attribute for accessibility (aria-labelledby) */
  id?: string;
  /** Trigger once (default: true) */
  once?: boolean;
  /** Threshold to trigger in view (default: 0.2) */
  threshold?: number;
}

// Framer Motion compatible ease array type
type EaseTuple = [number, number, number, number];

const EXPO_OUT: EaseTuple = [0.16, 1, 0.3, 1];

export function AnimatedText({
  text,
  splitBy = "word",
  delay = 0,
  stagger = 0.04,
  duration = 0.7,
  className,
  as: Tag = "p",
  id,
  once = true,
  threshold = 0.2,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once,
    amount: threshold,
  });

  const items = splitBy === "word" ? text.split(" ") : text.split("");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { y: "110%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration,
        ease: EXPO_OUT,
      } as { duration: number; ease: [number, number, number, number] },
    },
  };

  const TagEl = Tag as React.ElementType;

  return (
    <TagEl ref={ref} className={className} id={id}>
      <motion.span
        style={{ display: "inline-block", width: "100%" }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {items.map((item, index) => (
          <span
            key={index}
            style={{ overflow: "hidden", display: "inline-block" }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              variants={itemVariants}
            >
              {item}
              {splitBy === "word" && index < items.length - 1 && "\u00A0"}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </TagEl>
  );
}

export default AnimatedText;

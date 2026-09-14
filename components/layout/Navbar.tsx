"use client";

/**
 * Navbar — components/layout/Navbar.tsx
 *
 * Fixed navigation bar with:
 * - CREOIT logo
 * - Nav links with hover underline reveal
 * - Primary CTA button
 * - Transparent → dark background on scroll
 * - Hamburger menu for mobile
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { NavLink } from "@/types";

const navLinks: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "About", href: "/about" },
  { label: "Thinking", href: "/thinking" },
  { label: "Careers", href: "/careers" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[var(--z-nav)]",
          "flex items-center justify-between",
          "px-[clamp(1.25rem,5vw,5rem)] py-5",
          "transition-all duration-500",
          scrolled
            ? "bg-[rgba(10,10,10,0.92)] backdrop-blur-md border-b border-[var(--border)]"
            : "bg-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="relative z-10 flex-shrink-0">
          <Image
            src="/images/logo/creoit-logo-white.png"
            alt="CREOIT"
            width={130}
            height={36}
            priority
            className="object-contain"
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative font-display font-medium text-sm uppercase tracking-widest",
                "text-[var(--creoit-grey-light)] hover:text-[var(--creoit-white)]",
                "transition-colors duration-300",
                "after:content-[''] after:absolute after:-bottom-0.5 after:left-0",
                "after:h-px after:w-0 after:bg-[var(--creoit-accent)]",
                "after:transition-[width] after:duration-300",
                "hover:after:w-full"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-4">
          <MagneticButton className="hidden lg:block">
            <Link
              href="/contact"
              className={cn(
                "font-display font-semibold text-xs uppercase tracking-widest",
                "px-7 py-3.5",
                "border border-[var(--creoit-accent)] text-[var(--creoit-accent)]",
                "hover:bg-[var(--creoit-accent)] hover:text-white",
                "transition-all duration-300",
                "whitespace-nowrap"
              )}
            >
              Let&apos;s Create
            </Link>
          </MagneticButton>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-[var(--creoit-off-white)] p-1"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed inset-0 z-[calc(var(--z-nav)-1)]",
              "bg-[var(--creoit-black)] flex flex-col",
              "px-8 pt-28 pb-12"
            )}
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display font-bold text-4xl text-[var(--creoit-off-white)] hover:text-[var(--creoit-accent)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-auto"
            >
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-display font-semibold text-sm uppercase tracking-widest",
                  "inline-flex px-8 py-4",
                  "bg-[var(--creoit-accent)] text-white",
                  "w-full justify-center"
                )}
              >
                Let&apos;s Create
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;

"use client";

/**
 * Footer — components/layout/Footer.tsx
 *
 * Full-width footer with:
 * - CREOIT logo + brand tagline
 * - Quick links
 * - Social media links
 * - Contact info
 * - Copyright
 */

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "About", href: "/about" },
  { label: "Thinking", href: "/thinking" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/creoit" },
  { label: "LinkedIn", href: "https://linkedin.com/company/creoit" },
  { label: "YouTube", href: "https://youtube.com/@creoit" },
  { label: "Facebook", href: "https://facebook.com/creoit" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-[var(--creoit-dark)] border-t border-[var(--border)]")}>
      {/* ── Main Footer Content ── */}
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo/creoit-logo-white.png"
                alt="CREOIT"
                width={120}
                height={32}
                className="object-contain"
              />
            </Link>
            <p className={cn(
              "font-display font-medium text-sm uppercase tracking-widest leading-loose",
              "text-[var(--creoit-grey-light)]"
            )}>
              Be Consistent.<br />
              Be Creative.<br />
              Be Loud.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={cn(
              "font-display font-semibold text-xs uppercase tracking-widest",
              "text-[var(--creoit-accent)] mb-6"
            )}>
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "font-body text-sm text-[var(--creoit-grey-light)]",
                      "hover:text-[var(--creoit-white)] transition-colors duration-300"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className={cn(
              "font-display font-semibold text-xs uppercase tracking-widest",
              "text-[var(--creoit-accent)] mb-6"
            )}>
              Follow Us
            </h3>
            <ul className="flex flex-col gap-4">
              {socialLinks.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-3 group",
                      "text-[var(--creoit-grey-light)] hover:text-[var(--creoit-white)]",
                      "transition-colors duration-300"
                    )}
                  >
                    <ExternalLink
                      size={14}
                      className="group-hover:text-[var(--creoit-accent)] transition-colors duration-300"
                    />
                    <span className="font-body text-sm">{social.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={cn(
              "font-display font-semibold text-xs uppercase tracking-widest",
              "text-[var(--creoit-accent)] mb-6"
            )}>
              Contact
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-[var(--creoit-grey-light)]">
              <li>
                <a
                  href="mailto:hello@creoit.in"
                  className="hover:text-[var(--creoit-white)] transition-colors duration-300"
                >
                  hello@creoit.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="hover:text-[var(--creoit-white)] transition-colors duration-300"
                >
                  +91 XXXX XXX XXX
                </a>
              </li>
              <li className="text-[var(--creoit-grey-mid)]">Bhopal, India</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className={cn(
        "container py-6",
        "flex flex-col md:flex-row items-center justify-between gap-4",
        "border-t border-[var(--border)]"
      )}>
        <p className="font-body text-xs text-[var(--creoit-grey-mid)]">
          © {currentYear} CREOIT. All rights reserved.
        </p>
        <p className="font-body text-xs text-[var(--creoit-grey-mid)]">
          360° Creative Marketing Company · Bhopal, India
        </p>
      </div>
    </footer>
  );
}

export default Footer;

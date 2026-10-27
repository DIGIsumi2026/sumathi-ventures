'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
export function AnimatedButton({ href, children, dark = false, className = '' }: { href: string; children: ReactNode; dark?: boolean; className?: string }) {
 return (
  <Link href={href} className={`sv-button ${dark ? 'sv-button--dark' : ''} ${className}`}>
   <span className="sv-button__label">{children}</span>
   <span aria-hidden="true" className="sv-button__spot"><span className="sv-button__dot"/><ArrowUpRight size={16} className="sv-button__arrow"/></span>
  </Link>
 );
}

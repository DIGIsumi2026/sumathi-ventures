'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';
import { sectors, site } from '@/lib/site';
export function Navbar() {
 const [scrolled, setScrolled] = useState(false);
 const [open, setOpen] = useState(false);
 const [focusOpen, setFocusOpen] = useState(false);
 const pathname = usePathname();
 const isCurrent = (href:string) => pathname === href || pathname === href.replace(/\/$/, '');
 useEffect(() => {
  const onScroll=()=>setScrolled(window.scrollY>36);
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
  return ()=>window.removeEventListener('scroll',onScroll);
 },[]);
 useEffect(()=>{setOpen(false);setFocusOpen(false);},[pathname]);
 useEffect(()=>{
  if(!open) return;
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};
  document.addEventListener('keydown',onKey);
  return ()=>document.removeEventListener('keydown',onKey);
 },[open]);
 return <>
  <a className="skip-link" href="#main-content">Skip to content</a>
  <header className={`sv-header ${scrolled?'sv-header--scrolled':''}`}>
   <div className="sv-header__inner">
    <Link href="/" aria-label="Sumathi Ventures home" className="sv-wordmark"><span className="sv-wordmark__symbol">↗</span><span>Sumathi<span className="sv-wordmark__thin"> Ventures</span></span></Link>
    <nav aria-label="Main navigation" className="sv-desktop-nav">
     {site.links.map(item => item.label==='Investment Focus' ?
      <div key={item.href} className="sv-nav-dropdown" onMouseEnter={()=>setFocusOpen(true)} onMouseLeave={()=>setFocusOpen(false)}>
       <Link href={item.href} className={`sv-nav-link ${isCurrent(item.href)?'is-active':''}`} onFocus={()=>setFocusOpen(true)} aria-expanded={focusOpen}>{item.label}<ChevronDown size={13}/></Link>
       <div className={`sv-megamenu ${focusOpen?'is-open':''}`}>
        <div className="sv-megamenu__intro"><span>OUR THREE PILLARS</span><strong>Focused on opportunity.</strong><p>Explore the sectors shaping our partnership approach.</p><Link href="/investment-focus/" onClick={()=>setFocusOpen(false)}>View overview <ArrowUpRight size={15}/></Link></div>
        <div className="sv-megamenu__links">{sectors.map(s=><Link key={s.slug} href={`/investment-focus/${s.slug}/`} onClick={()=>setFocusOpen(false)}><span>{s.number}</span><strong>{s.title}</strong><ArrowUpRight size={16}/></Link>)}</div>
       </div>
      </div>
      : <Link key={item.href} className={`sv-nav-link ${isCurrent(item.href)?'is-active':''}`} href={item.href}>{item.label}</Link>)}
    </nav>
    <div className="sv-header__actions"><AnimatedButton href="/contact/">Partner With Us</AnimatedButton><button className="sv-menu-trigger" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu/></button></div>
   </div>
  </header>
  {open && <div className="sv-drawer-mask" onClick={()=>setOpen(false)} aria-hidden="true"/>}
  <aside className={`sv-drawer ${open?'is-open':''}`} aria-label="Extended menu" aria-hidden={!open} inert={!open}>
   <div className="sv-drawer__top"><span>SUMATHI VENTURES</span><button onClick={()=>setOpen(false)} aria-label="Close menu"><X/></button></div>
   <p className="sv-drawer__intro">Building Partnerships.<br/>Creating Lasting Value.</p>
   <nav>{site.links.map(x=><Link key={x.href} href={x.href} onClick={()=>setOpen(false)}>{x.label}<ArrowUpRight size={17}/></Link>)}<Link href="/contact/" onClick={()=>setOpen(false)}>Contact<ArrowUpRight size={17}/></Link></nav>
   <div className="sv-drawer__bottom"><span>{site.location}</span><a href={`mailto:${site.email}`}>{site.email}</a></div>
  </aside>
 </>;
}

'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function ScrollReveals(){
 const route=usePathname();
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const ctx=gsap.context(()=>{
   gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>{
    gsap.fromTo(el,{y:32,opacity:0},{y:0,opacity:1,duration:0.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 91%',once:true}});
   });
  });
  return ()=>ctx.revert();
 },[route]);
 return null;
}

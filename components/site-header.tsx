'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { XMark } from '@/components/x-mark'
import { withXGlyph } from '@/components/x-glyph'
import { NavPrompt } from '@/components/nav-prompt'
import { useLockBodyScroll } from '@/lib/use-lock-body-scroll'
import { GradientMenuIcon } from '@/components/gradient-menu-icon'

const links=[
  {label:'Visual.X',href:'/visual-x',kind:'visualx' as const},
  {label:'Store',href:'/store',kind:'single' as const},
  {label:'Coming Soon',href:'/coming-soon',kind:'coming' as const},
  {label:'Beta Testing',href:'/beta',kind:'beta' as const},
  {label:'StudyHive',href:'/studyhive',kind:'single' as const},
  {label:'X Factor Music',href:'/music',kind:'music' as const},
  {label:'About',href:'/about',kind:'single' as const},
]

type Kind=(typeof links)[number]['kind']
function DesktopNavLabel({kind,label}:{kind:Kind;label:string}){
  if(kind==='coming')return <span className="flex flex-col items-center justify-center leading-[1.02]"><span>Coming</span><span>Soon</span></span>
  if(kind==='beta')return <span className="flex flex-col items-center justify-center leading-[1.02]"><span>Beta</span><span>Testing</span></span>
  if(kind==='music')return <span className="flex flex-col items-center justify-center leading-[1.02]"><span className="inline-flex items-center justify-center whitespace-nowrap"><span className="mr-0.5 inline-flex size-[1.08em] items-center justify-center"><Image src="/brand/uppercase_X_transparent.png" alt="X" width={1600} height={1600} className="size-full object-contain"/></span>Factor</span><span>Music</span></span>
  return <span className="whitespace-nowrap">{withXGlyph(label,true)}</span>
}

export function SiteHeader(){
  const [open,setOpen]=useState(false)
  const pathname=usePathname()
  useLockBodyScroll(open)
  const active=(href:string)=>href==='/'?pathname==='/':pathname===href||pathname.startsWith(`${href}/`)
  return <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md"><div className="mx-auto flex w-full max-w-7xl items-stretch"><Link href="/" className="flex shrink-0 items-center px-4 py-2 md:px-5 lg:px-6" aria-label="planet.X home"><Image src="/brand/planet-x-wordmark-transparent.png" alt="planet.X" width={802} height={298} priority className="h-14 w-auto md:h-16 lg:h-20"/></Link><div className="flex min-w-0 flex-1 items-center border-b border-l border-border px-2 py-1 md:px-3 lg:px-4"><nav aria-label="Main" className="hidden min-w-0 flex-1 md:block"><ul className="flex min-w-0 items-stretch justify-between gap-1 font-mono text-base font-semibold tracking-[0.05em] uppercase lg:text-[1.08rem] xl:text-[1.18rem]"><>{links.map(link=>{const isActive=active(link.href);return <li key={link.href} className={`flex min-w-0 flex-1 items-stretch ${link.href==='/studyhive'?'ml-2 lg:ml-3':''}`}><Link href={link.href} aria-current={isActive?'page':undefined} className={`group relative flex min-h-12 w-full items-center justify-center px-1.5 py-2 text-center transition-colors lg:px-2 ${isActive?'text-foreground':'text-muted-foreground hover:text-foreground'}`}><DesktopNavLabel kind={link.kind} label={link.label}/>{isActive?<span aria-hidden="true" className="absolute bottom-1 left-1/2 size-2 -translate-x-1/2 bg-gradient-to-br from-[#ff2e9f] via-[#9b5cff] to-[#00eaff] shadow-[0_0_12px_rgba(0,234,255,.55)]"/>:null}</Link></li>})}</></ul></nav><div className="flex flex-1 items-center justify-end gap-2 md:hidden"><NavPrompt open={open}/><button type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="mobile-nav" className="flex size-12 shrink-0 items-center justify-center border-2 border-primary/60 bg-black/40"><span className="sr-only">{open?'Close menu':'Open menu'}</span><GradientMenuIcon open={open}/></button></div></div></div>{open?<nav id="mobile-nav" aria-label="Mobile" className="border-t-2 border-primary/50 bg-black md:hidden"><div className="mx-3 mb-3 mt-3 border-2 border-accent/40 bg-background/60"><ul className="flex flex-col font-mono text-base font-bold tracking-[0.14em] uppercase">{links.map((link,i)=>{const isActive=active(link.href);return <li key={link.href} className={i>0?'border-t border-accent/20':''}><Link href={link.href} aria-current={isActive?'page':undefined} onClick={()=>setOpen(false)} className={`flex items-center gap-3 px-5 py-4 transition-colors active:bg-primary/10 ${isActive?'text-white':'text-foreground/90'}`}>{isActive?<span className="size-2.5 shrink-0 bg-gradient-to-br from-[#ff2e9f] via-[#9b5cff] to-[#00eaff]"/>:<XMark className="size-2.5 shrink-0 text-primary"/>}{link.kind==='music'?<span className="inline-flex items-center"><Image src="/brand/uppercase_X_transparent.png" alt="X" width={1600} height={1600} className="mr-1 size-5 object-contain"/>Factor Music</span>:withXGlyph(link.label,true)}</Link></li>})}</ul></div></nav>:null}</header>
}

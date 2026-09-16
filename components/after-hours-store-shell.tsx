'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { afterHoursProducts, type AfterHoursProductImage } from '@/lib/after-hours-store-data'

const AGE_KEY = 'planetx-after-hours-18'

export function AfterHoursStoreShell() {
  const [confirmed, setConfirmed] = useState(false)
  const [safeMode, setSafeMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedId, setSelectedId] = useState(afterHoursProducts[0]?.id ?? '')
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    try { setConfirmed(window.sessionStorage.getItem(AGE_KEY) === 'yes') } catch { setConfirmed(false) }
  }, [])

  const categories = useMemo(() => ['All', ...Array.from(new Set(afterHoursProducts.map((product) => product.category)))], [])
  const visibleProducts = useMemo(() => selectedCategory === 'All' ? afterHoursProducts : afterHoursProducts.filter((product) => product.category === selectedCategory), [selectedCategory])
  const selected = afterHoursProducts.find((product) => product.id === selectedId) ?? visibleProducts[0] ?? afterHoursProducts[0]
  const selectedImages = selected ? [selected.image, ...(selected.gallery ?? [])].filter((image): image is AfterHoursProductImage => Boolean(image)) : []

  useEffect(() => {
    if (!visibleProducts.length) return
    if (!visibleProducts.some((product) => product.id === selectedId)) {
      setSelectedId(visibleProducts[0].id)
      setImageIndex(0)
    }
  }, [selectedCategory, selectedId, visibleProducts])

  useEffect(() => setImageIndex(0), [selected?.id])

  const confirmAdult = () => {
    try { window.sessionStorage.setItem(AGE_KEY, 'yes') } catch {}
    setConfirmed(true)
  }

  if (!confirmed) {
    return (
      <section className="ah-surface ah-age-gate">
        <div className="ah-noise" aria-hidden="true" />
        <div className="ah-spotlight ah-spotlight-left" aria-hidden="true" />
        <div className="ah-spotlight ah-spotlight-right" aria-hidden="true" />
        <div className="ah-age-card">
          <div className="ah-eyebrow"><LockKeyhole className="size-3.5" aria-hidden="true" /> Restricted collection / 18+</div>
          <div className="ah-age-rule" />
          <p className="ah-kicker">OBSIDIAN // PRIVATE COLLECTION</p>
          <h1 className="ah-gate-title">After Hours</h1>
          <p className="ah-gate-copy">A private adult novelty collection presented separately from the public planet.X and Xupply catalogs.</p>
          <div className="ah-gate-actions">
            <button type="button" onClick={confirmAdult} className="ah-primary-button">Enter the collection <ArrowRight className="size-4" aria-hidden="true" /></button>
            <Link href="/store" className="ah-secondary-button">Return to store</Link>
          </div>
          <div className="ah-age-foot"><ShieldCheck className="size-3.5" aria-hidden="true" /><span>By entering, you confirm that you are at least 18 years old.</span></div>
        </div>
      </section>
    )
  }

  const selectedTitle = selected ? (safeMode ? selected.safeName ?? 'Private Item' : selected.name) : ''
  const selectedDescription = selected ? (safeMode ? selected.safeDescription ?? 'Private collection item. Product details are concealed while SAFE WORD privacy mode is active.' : selected.description) : ''

  return (
    <section className={`ah-surface ah-store ${safeMode ? 'ah-safe' : ''}`}>
      <div className="ah-noise" aria-hidden="true" />
      <div className="ah-spotlight ah-spotlight-left" aria-hidden="true" />
      <div className="ah-spotlight ah-spotlight-right" aria-hidden="true" />
      <div className="ah-container">
        <header className="ah-header">
          <div>
            <Link href="/store" className="ah-back-link"><ArrowLeft className="size-3.5" aria-hidden="true" /> planet.X store</Link>
            <div className="ah-brand-row"><h1 className="ah-brand-title">After Hours</h1><span className="ah-edition">Obsidian</span></div>
            <p className="ah-brand-subtitle">PRIVATE COLLECTION // ADULT NOVELTIES</p>
          </div>
          <button type="button" onClick={() => setSafeMode((value) => !value)} aria-pressed={safeMode} className={`ah-safe-button ${safeMode ? 'active' : ''}`}>
            <EyeOff className="size-3.5" aria-hidden="true" /> {safeMode ? '[ SAFE WORD ACKNOWLEDGED ]' : '[ SAFE WORD ]'}
          </button>
        </header>

        <div className="ah-meta-strip">
          <span>Adults 18+ only</span><span className="ah-meta-dot" /><span>Private catalog</span><span className="ah-meta-dot" /><span>{afterHoursProducts.length} AWD demo listings</span><span className="ah-meta-fill" /><span className="ah-live-mark"><span /> DEMO / ACTIVE</span>
        </div>

        <nav className="ah-category-nav" aria-label="After Hours categories">
          {categories.map((category) => <button key={category} type="button" onClick={() => setSelectedCategory(category)} aria-pressed={category === selectedCategory} className={category === selectedCategory ? 'active' : ''}>{category}</button>)}
        </nav>

        <div className="ah-layout">
          <aside className="ah-manifest" aria-label="Product manifest">
            <div className="ah-section-label"><span>Manifest</span><span>{visibleProducts.length.toString().padStart(2, '0')}</span></div>
            {visibleProducts.map((product, index) => {
              const active = selected?.id === product.id
              return (
                <button key={product.id} type="button" onClick={() => setSelectedId(product.id)} aria-pressed={active} className={`ah-manifest-item ${active ? 'active' : ''}`}>
                  <span className="ah-manifest-accent" aria-hidden="true" />
                  <span className="ah-manifest-copy"><span className="ah-item-number">{String(index + 1).padStart(2, '0')} // {safeMode ? 'PRIVATE' : product.category.toUpperCase()}</span><span className="ah-item-name">{safeMode ? product.safeName ?? 'Private Item' : product.name}</span></span>
                  <span className="ah-item-price">{safeMode ? '—' : product.price}</span>
                </button>
              )
            })}
          </aside>

          <div className="ah-showcase">
            {selected ? <>
              <div className="ah-hero">
                {selectedImages[imageIndex] ? <img key={`${selected.id}-${imageIndex}`} src={selectedImages[imageIndex].src} alt={safeMode ? '' : selectedImages[imageIndex].alt} className="ah-hero-image" /> : null}
                <div className="ah-hero-vignette" aria-hidden="true" />
                <div className="ah-hero-copy"><p className="ah-item-number">{safeMode ? 'PRIVATE DISPLAY' : `${selected.category} // ${selected.status ?? 'DEMO'}`}</p><h2>{selectedTitle}</h2><p>{selectedDescription}</p></div>
              </div>
              {selectedImages.length > 1 ? <div className="ah-gallery">{selectedImages.map((image, index) => <button key={`${selected.id}-${image.src}`} type="button" onClick={() => setImageIndex(index)} aria-label={safeMode ? `Private image ${index + 1}` : image.label ?? `Show ${image.alt}`} aria-pressed={imageIndex === index} className={imageIndex === index ? 'active' : ''}><img src={image.src} alt="" loading="lazy" /></button>)}</div> : null}
              <div className="ah-command-bar">
                <div><span className="ah-price-label">{safeMode ? 'PRIVATE COLLECTION' : selected.priceNote ?? 'Supplier price'}</span><strong>{safeMode ? '—' : selected.price}</strong></div>
                {selected.href ? <a href={selected.href} className="ah-acquire-button" rel="noopener noreferrer" target="_blank">{selected.ctaLabel ?? 'View item'} <ArrowRight className="size-4" aria-hidden="true" /></a> : <span className="ah-unavailable">DETAILS PENDING</span>}
              </div>
              <p className="ah-demo-note">Demo inventory uses verified public AWD catalog names and stock snapshots. Temporary illustrations are not supplier product photography; wholesale pricing and licensed assets will replace them when the private feed is approved.</p>
            </> : null}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ah-surface{--ah-bg:#050505;--ah-panel:#0b0b0c;--ah-panel-soft:#101011;--ah-crimson:#981118;--ah-crimson-bright:#b6131d;--ah-ivory:#f1eee8;--ah-steel:#b5b0aa;--ah-muted:#716c67;--ah-line:#232223;position:relative;overflow:hidden;background:radial-gradient(circle at 68% 20%,rgba(82,17,21,.13),transparent 31rem),radial-gradient(circle at 16% 74%,rgba(255,255,255,.025),transparent 26rem),var(--ah-bg);color:var(--ah-ivory);font-family:var(--font-after-hours-ui),sans-serif}.ah-noise{pointer-events:none;position:absolute;inset:0;z-index:0;opacity:.18;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.17'/%3E%3C/svg%3E");mix-blend-mode:soft-light}.ah-spotlight{pointer-events:none;position:absolute;z-index:0;border-radius:999px;filter:blur(110px)}.ah-spotlight-left{left:-12rem;top:11rem;width:30rem;height:30rem;background:rgba(122,15,21,.1)}.ah-spotlight-right{right:-14rem;top:30rem;width:34rem;height:34rem;background:rgba(255,255,255,.028)}.ah-age-gate{min-height:72vh;display:grid;place-items:center;padding:5rem 1.25rem}.ah-age-card{position:relative;z-index:1;width:min(100%,46rem);border:1px solid var(--ah-line);background:linear-gradient(145deg,rgba(17,17,18,.96),rgba(6,6,6,.96));padding:clamp(2rem,6vw,4.25rem);box-shadow:0 35px 100px rgba(0,0,0,.58)}.ah-eyebrow,.ah-back-link,.ah-kicker,.ah-brand-subtitle,.ah-meta-strip,.ah-section-label,.ah-item-number,.ah-price-label{font-family:var(--font-after-hours-ui),sans-serif;text-transform:uppercase;letter-spacing:.19em}.ah-eyebrow{display:flex;align-items:center;gap:.6rem;color:var(--ah-steel);font-size:.64rem;font-weight:600}.ah-age-rule{width:4.5rem;height:1px;margin:1.5rem 0 2.5rem;background:linear-gradient(90deg,var(--ah-crimson),transparent)}.ah-kicker{font-size:.62rem;color:#9d171e}.ah-gate-title,.ah-brand-title{font-family:var(--font-after-hours-display),serif;font-weight:400}.ah-gate-title{margin-top:.65rem;font-size:clamp(3.4rem,10vw,6.8rem);line-height:.86}.ah-gate-copy{margin-top:1.8rem;max-width:35rem;color:#97908a;font-size:.95rem;line-height:1.8}.ah-gate-actions{margin-top:2.1rem;display:flex;flex-wrap:wrap;gap:.8rem}.ah-primary-button,.ah-secondary-button,.ah-acquire-button{display:inline-flex;min-height:3rem;align-items:center;justify-content:center;gap:.6rem;padding:.8rem 1.15rem;text-transform:uppercase;letter-spacing:.15em;font-size:.65rem;font-weight:700}.ah-primary-button,.ah-acquire-button{background:var(--ah-crimson);color:white}.ah-primary-button:hover,.ah-acquire-button:hover{background:var(--ah-crimson-bright)}.ah-secondary-button{border:1px solid #373334;color:#aaa39d}.ah-age-foot{margin-top:2rem;padding-top:1.1rem;border-top:1px solid var(--ah-line);display:flex;gap:.55rem;color:#716c67;font-size:.72rem}.ah-container{position:relative;z-index:1;width:min(100% - 2rem,92rem);margin:0 auto;padding:clamp(3rem,6vw,5.4rem) 0 5rem}.ah-header{display:flex;gap:2rem;align-items:flex-end;justify-content:space-between}.ah-back-link{display:inline-flex;align-items:center;gap:.4rem;color:#766f69;font-size:.6rem}.ah-brand-row{margin-top:1.2rem;display:flex;align-items:baseline;gap:1rem}.ah-brand-title{font-size:clamp(3.4rem,7vw,6.4rem);line-height:.88}.ah-edition{font-family:var(--font-after-hours-display),serif;color:#8f171d;font-style:italic}.ah-brand-subtitle{margin-top:.8rem;font-size:.62rem;color:#77706a}.ah-safe-button{border:1px solid #373334;background:#0c0c0d;color:#77706a;padding:.75rem 1rem;font-size:.58rem;letter-spacing:.12em}.ah-safe-button.active{border-color:#6b171b;color:#c6beb7}.ah-meta-strip{margin-top:2rem;display:flex;align-items:center;gap:.7rem;border-block:1px solid var(--ah-line);padding:.75rem 0;color:#625d59;font-size:.55rem}.ah-meta-dot{width:2px;height:2px;background:#7c161c}.ah-meta-fill{flex:1}.ah-live-mark{display:flex;align-items:center;gap:.45rem;color:#8d8780}.ah-live-mark>span{width:.35rem;height:.35rem;border-radius:999px;background:#a9161e;box-shadow:0 0 12px #a9161e}.ah-category-nav{display:flex;gap:.4rem;overflow:auto;padding:1rem 0}.ah-category-nav button{border:1px solid #272526;background:#090909;color:#736d67;padding:.6rem .85rem;white-space:nowrap;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase}.ah-category-nav button.active{border-color:#6b171b;color:#eee9e3;background:#15090b}.ah-layout{display:grid;grid-template-columns:minmax(16rem,24rem) 1fr;gap:1rem}.ah-manifest,.ah-showcase{border:1px solid var(--ah-line);background:rgba(7,7,8,.88)}.ah-section-label{display:flex;justify-content:space-between;padding:1rem 1.1rem;border-bottom:1px solid var(--ah-line);font-size:.55rem;color:#69635e}.ah-manifest-item{position:relative;display:grid;width:100%;grid-template-columns:3px 1fr auto;gap:.8rem;align-items:center;border-bottom:1px solid #171718;padding:1rem;text-align:left;background:transparent}.ah-manifest-item:hover,.ah-manifest-item.active{background:#100a0b}.ah-manifest-accent{height:100%;background:#2b2021}.ah-manifest-item.active .ah-manifest-accent{background:var(--ah-crimson)}.ah-manifest-copy{min-width:0}.ah-item-number{display:block;font-size:.48rem;color:#6e6762}.ah-item-name{display:block;margin-top:.35rem;font-family:var(--font-after-hours-display),serif;font-size:1rem;color:#d7d1ca}.ah-item-price{font-size:.62rem;color:#8e8780}.ah-showcase{min-width:0}.ah-hero{position:relative;min-height:34rem;overflow:hidden;background:#0b0b0c}.ah-hero-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.ah-hero-vignette{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.82),rgba(0,0,0,.2) 70%),linear-gradient(0deg,rgba(0,0,0,.82),transparent 55%)}.ah-hero-copy{position:absolute;left:clamp(1.4rem,4vw,3.3rem);bottom:clamp(1.4rem,4vw,3.1rem);max-width:37rem}.ah-hero-copy h2{margin-top:.55rem;font-family:var(--font-after-hours-display),serif;font-size:clamp(2.2rem,5vw,4.5rem);font-weight:400;line-height:.95}.ah-hero-copy p:last-child{margin-top:1rem;color:#b0a9a2;line-height:1.7;font-size:.86rem}.ah-gallery{display:flex;gap:.45rem;padding:.8rem;border-top:1px solid var(--ah-line);overflow:auto}.ah-gallery button{width:7rem;height:4.5rem;flex:0 0 auto;border:1px solid #292728;opacity:.6}.ah-gallery button.active{border-color:#8f171d;opacity:1}.ah-gallery img{width:100%;height:100%;object-fit:cover}.ah-command-bar{display:flex;justify-content:space-between;align-items:center;gap:1rem;border-top:1px solid var(--ah-line);padding:1.1rem 1.25rem}.ah-price-label{display:block;color:#69635e;font-size:.49rem}.ah-command-bar strong{display:block;margin-top:.25rem;font-family:var(--font-after-hours-display),serif;font-size:1.45rem;font-weight:400}.ah-unavailable{font-size:.6rem;letter-spacing:.12em;color:#706963}.ah-demo-note{border-top:1px solid var(--ah-line);padding:1rem 1.25rem;color:#6f6963;font-size:.66rem;line-height:1.6}.ah-safe .ah-hero-image{filter:blur(28px) brightness(.35)}
        @media(max-width:900px){.ah-header{align-items:flex-start;flex-direction:column}.ah-layout{grid-template-columns:1fr}.ah-manifest{max-height:20rem;overflow:auto}.ah-hero{min-height:31rem}.ah-meta-strip{flex-wrap:wrap}.ah-meta-fill{display:none}}
        @media(max-width:560px){.ah-container{width:min(100% - 1rem,92rem)}.ah-brand-row{display:block}.ah-edition{display:block;margin-top:.55rem}.ah-command-bar{align-items:stretch;flex-direction:column}.ah-acquire-button{width:100%}.ah-hero{min-height:28rem}.ah-gate-actions>*{width:100%}}
      `}</style>
    </section>
  )
}

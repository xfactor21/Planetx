'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import {
  afterHoursProducts,
  type AfterHoursProductImage,
} from '@/lib/after-hours-store-data'

const AGE_KEY = 'planetx-after-hours-18'

export function AfterHoursStoreShell() {
  const [confirmed, setConfirmed] = useState(false)
  const [safeMode, setSafeMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedId, setSelectedId] = useState(afterHoursProducts[0]?.id ?? '')
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    try {
      setConfirmed(window.sessionStorage.getItem(AGE_KEY) === 'yes')
    } catch {
      setConfirmed(false)
    }
  }, [])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(afterHoursProducts.map((product) => product.category)))],
    [],
  )

  const visibleProducts = useMemo(
    () => selectedCategory === 'All'
      ? afterHoursProducts
      : afterHoursProducts.filter((product) => product.category === selectedCategory),
    [selectedCategory],
  )

  const selected = afterHoursProducts.find((product) => product.id === selectedId)
    ?? visibleProducts[0]
    ?? afterHoursProducts[0]

  const selectedImages = selected
    ? [selected.image, ...(selected.gallery ?? [])].filter((image): image is AfterHoursProductImage => Boolean(image))
    : []

  useEffect(() => {
    if (!visibleProducts.length) return
    if (!visibleProducts.some((product) => product.id === selectedId)) {
      setSelectedId(visibleProducts[0].id)
      setImageIndex(0)
    }
  }, [selectedCategory, selectedId, visibleProducts])

  useEffect(() => setImageIndex(0), [selected?.id])

  const confirmAdult = () => {
    try {
      window.sessionStorage.setItem(AGE_KEY, 'yes')
    } catch {
      // Session persistence is optional; access should still work.
    }
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
            <button type="button" onClick={confirmAdult} className="ah-primary-button">
              Enter the collection <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <Link href="/store" className="ah-secondary-button">Return to store</Link>
          </div>
          <div className="ah-age-foot">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            <span>By entering, you confirm that you are at least 18 years old.</span>
          </div>
        </div>
      </section>
    )
  }

  const selectedTitle = selected
    ? safeMode
      ? selected.safeName ?? `Private Item ${String(Math.max(1, afterHoursProducts.findIndex((item) => item.id === selected.id) + 1)).padStart(2, '0')}`
      : selected.name
    : ''

  const selectedDescription = selected
    ? safeMode
      ? selected.safeDescription ?? 'Private collection item. Product details are concealed while SAFE WORD privacy mode is active.'
      : selected.description
    : ''

  return (
    <section className={`ah-surface ah-store ${safeMode ? 'ah-safe' : ''}`}>
      <div className="ah-noise" aria-hidden="true" />
      <div className="ah-spotlight ah-spotlight-left" aria-hidden="true" />
      <div className="ah-spotlight ah-spotlight-right" aria-hidden="true" />

      <div className="ah-container">
        <header className="ah-header">
          <div>
            <Link href="/store" className="ah-back-link"><ArrowLeft className="size-3.5" aria-hidden="true" /> planet.X store</Link>
            <div className="ah-brand-row">
              <h1 className="ah-brand-title">After Hours</h1>
              <span className="ah-edition">Obsidian</span>
            </div>
            <p className="ah-brand-subtitle">PRIVATE COLLECTION // ADULT NOVELTIES</p>
          </div>

          <button
            type="button"
            onClick={() => setSafeMode((value) => !value)}
            aria-pressed={safeMode}
            className={`ah-safe-button ${safeMode ? 'active' : ''}`}
          >
            <EyeOff className="size-3.5" aria-hidden="true" />
            {safeMode ? '[ SAFE WORD ACKNOWLEDGED ]' : '[ SAFE WORD ]'}
          </button>
        </header>

        <div className="ah-meta-strip">
          <span>Adults 18+ only</span>
          <span className="ah-meta-dot" />
          <span>Private catalog</span>
          <span className="ah-meta-dot" />
          <span>{afterHoursProducts.length ? `${afterHoursProducts.length} published` : 'Inventory connection ready'}</span>
          <span className="ah-meta-fill" />
          <span className="ah-live-mark"><span /> OBSIDIAN / ACTIVE</span>
        </div>

        {categories.length > 1 ? (
          <nav className="ah-category-nav" aria-label="After Hours categories">
            {categories.map((category) => {
              const active = category === selectedCategory
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={active}
                  className={active ? 'active' : ''}
                >
                  {category}
                </button>
              )
            })}
          </nav>
        ) : null}

        <div className="ah-layout">
          <aside className="ah-manifest" aria-label="Product manifest">
            <div className="ah-section-label">
              <span>Manifest</span>
              <span>{visibleProducts.length.toString().padStart(2, '0')}</span>
            </div>

            {visibleProducts.length ? visibleProducts.map((product, index) => {
              const active = selected?.id === product.id
              const discreetName = product.safeName ?? `Private Item ${String(index + 1).padStart(2, '0')}`
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedId(product.id)}
                  aria-pressed={active}
                  className={`ah-manifest-item ${active ? 'active' : ''}`}
                >
                  <span className="ah-manifest-accent" aria-hidden="true" />
                  <span className="ah-manifest-copy">
                    <span className="ah-item-number">{String(index + 1).padStart(2, '0')} // {safeMode ? 'PRIVATE' : product.category.toUpperCase()}</span>
                    <span className="ah-item-name">{safeMode ? discreetName : product.name}</span>
                  </span>
                  <span className="ah-item-price">{safeMode ? '—' : product.price}</span>
                </button>
              )
            }) : (
              <div className="ah-manifest-empty">
                <span className="ah-empty-index">00 // STAGING</span>
                <p>Inventory source connected.</p>
                <span>Published items will populate this manifest automatically.</span>
              </div>
            )}
          </aside>

          <div className="ah-showcase">
            {selected ? (
              <>
                <div className="ah-hero">
                  {selectedImages[imageIndex] ? (
                    <img
                      key={`${selected.id}-${imageIndex}`}
                      src={selectedImages[imageIndex].src}
                      alt={safeMode ? '' : selectedImages[imageIndex].alt}
                      className="ah-hero-image"
                    />
                  ) : (
                    <div className="ah-hero-placeholder" aria-hidden="true">
                      <span>OBSIDIAN</span>
                      <strong>{String(afterHoursProducts.findIndex((item) => item.id === selected.id) + 1).padStart(2, '0')}</strong>
                    </div>
                  )}
                  <div className="ah-hero-vignette" aria-hidden="true" />
                  <div className="ah-hero-copy">
                    <p className="ah-item-number">{safeMode ? 'PRIVATE DISPLAY' : `${selected.category} // ${selected.status ?? 'COLLECTION'}`}</p>
                    <h2>{selectedTitle}</h2>
                    <p>{selectedDescription}</p>
                  </div>
                </div>

                {selected.metrics?.length ? (
                  <div className="ah-metrics">
                    {selected.metrics.slice(0, 4).map((metric) => (
                      <div key={metric.label} className="ah-metric">
                        <div className="ah-metric-head"><span>{metric.label}</span><span>{safeMode ? '—' : `${Math.max(0, Math.min(100, metric.value))}%`}</span></div>
                        <div className="ah-metric-track"><span style={{ width: safeMode ? '0%' : `${Math.max(0, Math.min(100, metric.value))}%` }} /></div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {selectedImages.length > 1 ? (
                  <div className="ah-gallery">
                    {selectedImages.map((image, index) => (
                      <button
                        key={`${selected.id}-${image.src}`}
                        type="button"
                        onClick={() => setImageIndex(index)}
                        aria-label={safeMode ? `Private image ${index + 1}` : image.label ?? `Show ${image.alt}`}
                        aria-pressed={imageIndex === index}
                        className={imageIndex === index ? 'active' : ''}
                      >
                        <img src={image.src} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="ah-command-bar">
                  <div>
                    <span className="ah-price-label">{safeMode ? 'PRIVATE COLLECTION' : selected.priceNote ?? 'Collection price'}</span>
                    <strong>{safeMode ? '—' : selected.price}</strong>
                  </div>
                  {selected.href ? (
                    selected.href.startsWith('/') ? (
                      <Link href={selected.href} className="ah-acquire-button">{selected.ctaLabel ?? 'View item'} <ArrowRight className="size-4" aria-hidden="true" /></Link>
                    ) : (
                      <a href={selected.href} className="ah-acquire-button" rel="noopener noreferrer">{selected.ctaLabel ?? 'View item'} <ArrowRight className="size-4" aria-hidden="true" /></a>
                    )
                  ) : (
                    <span className="ah-unavailable">DETAILS PENDING</span>
                  )}
                </div>
              </>
            ) : (
              <div className="ah-empty-showcase">
                <div className="ah-empty-sigil" aria-hidden="true">X</div>
                <p className="ah-kicker">OBSIDIAN // COLLECTION STAGING</p>
                <h2>The armory is prepared.</h2>
                <p>The premium storefront, privacy mode, manifest, gallery system, product metrics, and detail presentation are ready for real inventory. Nothing has been fabricated just to fill the shelves.</p>
                <div className="ah-empty-rule" />
                <div className="ah-empty-facts">
                  <span><b>01</b> Separate adult inventory</span>
                  <span><b>02</b> Discreet SAFE WORD mode</span>
                  <span><b>03</b> Premium editorial product view</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ah-surface {
          --ah-bg: #050505;
          --ah-panel: #0b0b0c;
          --ah-panel-soft: #101011;
          --ah-crimson: #981118;
          --ah-crimson-bright: #b6131d;
          --ah-crimson-glow: rgba(152,17,24,.28);
          --ah-ivory: #f1eee8;
          --ah-steel: #b5b0aa;
          --ah-muted: #716c67;
          --ah-line: #232223;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 68% 20%, rgba(82, 17, 21, .13), transparent 31rem),
            radial-gradient(circle at 16% 74%, rgba(255,255,255,.025), transparent 26rem),
            var(--ah-bg);
          color: var(--ah-ivory);
          font-family: var(--font-after-hours-ui), sans-serif;
        }

        .ah-noise {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: .18;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.17'/%3E%3C/svg%3E");
          mix-blend-mode: soft-light;
        }

        .ah-spotlight {
          pointer-events: none;
          position: absolute;
          z-index: 0;
          border-radius: 999px;
          filter: blur(110px);
        }
        .ah-spotlight-left { left: -12rem; top: 11rem; width: 30rem; height: 30rem; background: rgba(122,15,21,.1); }
        .ah-spotlight-right { right: -14rem; top: 30rem; width: 34rem; height: 34rem; background: rgba(255,255,255,.028); }

        .ah-age-gate { min-height: 72vh; display: grid; place-items: center; padding: 5rem 1.25rem; }
        .ah-age-card {
          position: relative;
          z-index: 1;
          width: min(100%, 46rem);
          border: 1px solid var(--ah-line);
          background: linear-gradient(145deg, rgba(17,17,18,.96), rgba(6,6,6,.96));
          padding: clamp(2rem, 6vw, 4.25rem);
          box-shadow: 0 35px 100px rgba(0,0,0,.58), inset 0 1px 0 rgba(255,255,255,.025);
          animation: ah-rise .8s cubic-bezier(.2,.7,.2,1) both;
        }
        .ah-eyebrow, .ah-back-link, .ah-kicker, .ah-brand-subtitle, .ah-meta-strip, .ah-section-label, .ah-item-number, .ah-price-label {
          font-family: var(--font-after-hours-ui), sans-serif;
          text-transform: uppercase;
          letter-spacing: .19em;
        }
        .ah-eyebrow { display: flex; align-items: center; gap: .6rem; color: var(--ah-steel); font-size: .64rem; font-weight: 600; }
        .ah-age-rule { width: 4.5rem; height: 1px; margin: 1.5rem 0 2.5rem; background: linear-gradient(90deg, var(--ah-crimson), transparent); }
        .ah-kicker { color: var(--ah-crimson-bright); font-size: .65rem; font-weight: 600; }
        .ah-gate-title, .ah-brand-title, .ah-hero-copy h2, .ah-empty-showcase h2 {
          font-family: var(--font-after-hours-display), Georgia, serif;
          font-weight: 400;
        }
        .ah-gate-title { margin: .7rem 0 0; font-size: clamp(3.2rem, 9vw, 6.8rem); line-height: .92; letter-spacing: -.045em; }
        .ah-gate-copy { max-width: 35rem; margin-top: 1.5rem; color: var(--ah-steel); font-size: .94rem; font-weight: 200; line-height: 1.85; }
        .ah-gate-actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2.2rem; }
        .ah-primary-button, .ah-secondary-button, .ah-acquire-button {
          min-height: 3.25rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: .65rem;
          padding: .9rem 1.4rem;
          font-size: .66rem;
          font-weight: 600;
          letter-spacing: .16em;
          text-transform: uppercase;
          transition: transform .25s ease, border-color .25s ease, background .25s ease, box-shadow .25s ease, color .25s ease;
        }
        .ah-primary-button, .ah-acquire-button { background: var(--ah-crimson); color: white; box-shadow: 0 12px 38px rgba(82,8,12,.2); }
        .ah-primary-button:hover, .ah-acquire-button:hover { transform: translateY(-2px); background: var(--ah-crimson-bright); box-shadow: 0 15px 45px var(--ah-crimson-glow); }
        .ah-secondary-button { border: 1px solid #302e2e; color: var(--ah-muted); }
        .ah-secondary-button:hover { color: var(--ah-ivory); border-color: #595555; }
        .ah-age-foot { display: flex; gap: .55rem; align-items: center; margin-top: 2rem; color: #5f5b57; font-size: .68rem; line-height: 1.5; }

        .ah-store { min-height: 80vh; padding: 2rem 1rem 5rem; }
        .ah-container { position: relative; z-index: 1; width: min(100%, 88rem); margin: 0 auto; }
        .ah-header { display: flex; justify-content: space-between; gap: 2rem; align-items: flex-end; padding: 1.5rem 0 1.35rem; border-bottom: 1px solid var(--ah-line); }
        .ah-back-link { display: inline-flex; align-items: center; gap: .45rem; color: #615c58; font-size: .58rem; font-weight: 600; transition: color .2s; }
        .ah-back-link:hover { color: var(--ah-steel); }
        .ah-brand-row { display: flex; flex-wrap: wrap; align-items: flex-end; gap: .9rem; margin-top: .85rem; }
        .ah-brand-title { font-size: clamp(2.4rem, 6vw, 4.5rem); line-height: .9; letter-spacing: -.035em; }
        .ah-edition { margin-bottom: .28rem; border-left: 1px solid var(--ah-crimson); padding-left: .85rem; color: #79736e; font-family: var(--font-after-hours-display), Georgia, serif; font-size: 1rem; font-style: italic; }
        .ah-brand-subtitle { margin-top: .85rem; color: var(--ah-crimson-bright); font-size: .6rem; font-weight: 600; letter-spacing: .34em; }
        .ah-safe-button { display: inline-flex; align-items: center; gap: .55rem; min-height: 2.75rem; border: 1px solid #393637; padding: .75rem 1rem; color: #6a6561; font-size: .58rem; font-weight: 600; letter-spacing: .16em; transition: all .3s ease; }
        .ah-safe-button:hover { color: var(--ah-ivory); border-color: #6a6461; }
        .ah-safe-button.active { border-color: #75cdb9; color: #8ee0cc; background: rgba(62,146,125,.055); box-shadow: 0 0 24px rgba(79,199,170,.08); }

        .ah-meta-strip { display: flex; align-items: center; gap: .7rem; min-height: 2.8rem; border-bottom: 1px solid #171717; color: #4f4b48; font-size: .52rem; font-weight: 600; }
        .ah-meta-dot { width: 2px; height: 2px; border-radius: 999px; background: #504b48; }
        .ah-meta-fill { flex: 1; }
        .ah-live-mark { display: inline-flex; align-items: center; gap: .45rem; color: #6d6863; }
        .ah-live-mark > span { width: 4px; height: 4px; border-radius: 999px; background: var(--ah-crimson); box-shadow: 0 0 9px var(--ah-crimson); animation: ah-pulse 2.2s ease-in-out infinite; }

        .ah-category-nav { display: flex; gap: .45rem; overflow-x: auto; padding: 1rem 0; border-bottom: 1px solid #171717; }
        .ah-category-nav button { flex: 0 0 auto; border: 1px solid #282627; padding: .55rem .9rem; color: #66615d; font-size: .55rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; transition: all .25s; }
        .ah-category-nav button:hover, .ah-category-nav button.active { color: var(--ah-ivory); border-color: #5a171a; background: rgba(152,17,24,.055); }

        .ah-layout { display: grid; grid-template-columns: minmax(17rem, 24rem) minmax(0, 1fr); gap: clamp(1.5rem, 4vw, 3.2rem); padding-top: 2.8rem; }
        .ah-manifest { min-width: 0; }
        .ah-section-label { display: flex; justify-content: space-between; padding: 0 1rem .8rem; color: #4f4b48; font-size: .55rem; font-weight: 600; }
        .ah-manifest-item { position: relative; width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem; overflow: hidden; border-bottom: 1px solid var(--ah-line); padding: 1.35rem 1rem; text-align: left; transition: padding .3s cubic-bezier(.8,0,.2,1), background .3s ease; }
        .ah-manifest-item:hover, .ah-manifest-item.active { padding-left: 1.55rem; background: rgba(152,17,24,.035); }
        .ah-manifest-accent { position: absolute; inset: 0 auto 0 0; width: 2px; background: var(--ah-crimson); transform: scaleY(0); transform-origin: top; transition: transform .32s cubic-bezier(.8,0,.2,1); box-shadow: 0 0 12px var(--ah-crimson-glow); }
        .ah-manifest-item:hover .ah-manifest-accent, .ah-manifest-item.active .ah-manifest-accent { transform: scaleY(1); }
        .ah-manifest-copy { min-width: 0; display: grid; gap: .45rem; }
        .ah-item-number { color: var(--ah-crimson-bright); font-size: .51rem; font-weight: 600; }
        .ah-item-name { color: #9d9892; font-family: var(--font-after-hours-display), Georgia, serif; font-size: 1.23rem; transition: color .25s; }
        .ah-manifest-item.active .ah-item-name { color: var(--ah-ivory); }
        .ah-item-price { flex: 0 0 auto; color: #65605c; font-size: .72rem; font-weight: 400; }
        .ah-manifest-empty { border: 1px solid var(--ah-line); border-left: 2px solid #511014; background: rgba(255,255,255,.012); padding: 1.6rem; }
        .ah-manifest-empty p { margin-top: .75rem; color: #aba6a0; font-family: var(--font-after-hours-display), Georgia, serif; font-size: 1.15rem; }
        .ah-manifest-empty > span:last-child { display: block; margin-top: .65rem; color: #55514e; font-size: .68rem; line-height: 1.7; }
        .ah-empty-index { color: var(--ah-crimson-bright); font-size: .52rem; font-weight: 600; letter-spacing: .17em; }

        .ah-showcase { min-width: 0; border: 1px solid var(--ah-line); background: var(--ah-panel); box-shadow: 0 30px 80px rgba(0,0,0,.34); }
        .ah-hero { position: relative; min-height: clamp(24rem, 50vw, 34rem); overflow: hidden; display: flex; align-items: flex-end; background: #090909; }
        .ah-hero-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(.74) contrast(1.06); animation: ah-image-in .65s ease both; transition: filter .45s ease, transform .8s ease; }
        .ah-hero:hover .ah-hero-image { transform: scale(1.015); }
        .ah-hero-vignette { position: absolute; inset: 0; background: linear-gradient(to top, rgba(5,5,5,.98) 0%, rgba(5,5,5,.48) 34%, rgba(5,5,5,.08) 70%), linear-gradient(90deg, rgba(5,5,5,.32), transparent 42%); }
        .ah-hero-copy { position: relative; z-index: 1; max-width: 46rem; padding: clamp(1.6rem, 4vw, 2.6rem); }
        .ah-hero-copy h2 { margin-top: .65rem; font-size: clamp(2.4rem, 5vw, 4.1rem); line-height: 1.02; letter-spacing: -.035em; }
        .ah-hero-copy > p:last-child { max-width: 39rem; margin-top: 1rem; color: #a8a39d; font-size: .84rem; font-weight: 200; line-height: 1.85; }
        .ah-hero-placeholder { position: absolute; inset: 0; display: grid; place-items: center; overflow: hidden; background: radial-gradient(circle at 50% 45%, #171213 0%, #0a0a0b 44%, #060606 80%); }
        .ah-hero-placeholder::before { content: ''; position: absolute; width: 32rem; height: 32rem; border: 1px solid rgba(152,17,24,.12); transform: rotate(45deg); animation: ah-orbit 18s linear infinite; }
        .ah-hero-placeholder span { position: absolute; top: 2rem; left: 2rem; color: #363132; font-size: .6rem; font-weight: 600; letter-spacing: .38em; }
        .ah-hero-placeholder strong { color: rgba(152,17,24,.07); font-family: var(--font-after-hours-display), Georgia, serif; font-size: clamp(10rem, 28vw, 22rem); font-weight: 400; line-height: 1; }

        .ah-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.35rem 2rem; border-top: 1px solid var(--ah-line); border-bottom: 1px solid var(--ah-line); padding: 1.6rem 2.25rem; background: #070707; }
        .ah-metric { display: grid; gap: .55rem; }
        .ah-metric-head { display: flex; justify-content: space-between; gap: 1rem; color: #8d8882; font-size: .54rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; }
        .ah-metric-head span:last-child { color: #5e5955; }
        .ah-metric-track { height: 2px; overflow: hidden; background: #252223; }
        .ah-metric-track span { display: block; height: 100%; background: var(--ah-crimson); box-shadow: 0 0 10px var(--ah-crimson-glow); transition: width .8s cubic-bezier(.9,0,.1,1); }

        .ah-gallery { display: flex; gap: .75rem; overflow-x: auto; padding: 1.15rem 2rem; border-bottom: 1px solid var(--ah-line); }
        .ah-gallery button { width: 4.7rem; height: 4.7rem; flex: 0 0 auto; overflow: hidden; border: 1px solid #282627; opacity: .34; filter: grayscale(1); transition: all .28s ease; }
        .ah-gallery button:hover, .ah-gallery button.active { opacity: 1; filter: grayscale(.15); border-color: #6f161a; }
        .ah-gallery img { width: 100%; height: 100%; object-fit: cover; }

        .ah-command-bar { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding: 1.7rem 2.25rem; background: #070707; }
        .ah-command-bar > div { display: grid; gap: .3rem; }
        .ah-price-label { color: #5e5955; font-size: .51rem; font-weight: 600; }
        .ah-command-bar strong { color: var(--ah-ivory); font-family: var(--font-after-hours-display), Georgia, serif; font-size: 2rem; font-weight: 400; }
        .ah-unavailable { border: 1px solid #302d2e; padding: .85rem 1rem; color: #56514e; font-size: .58rem; font-weight: 600; letter-spacing: .14em; }

        .ah-empty-showcase { position: relative; min-height: 40rem; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; padding: clamp(2rem, 5vw, 4rem); background: radial-gradient(circle at 70% 24%, rgba(152,17,24,.09), transparent 21rem), linear-gradient(145deg, #0d0d0e, #070707); }
        .ah-empty-sigil { position: absolute; right: clamp(-1rem, 2vw, 2rem); top: -2rem; color: rgba(152,17,24,.045); font-family: var(--font-after-hours-display), Georgia, serif; font-size: clamp(20rem, 44vw, 39rem); line-height: 1; transform: rotate(-8deg); user-select: none; }
        .ah-empty-showcase h2 { position: relative; margin-top: .8rem; max-width: 35rem; font-size: clamp(2.7rem, 6vw, 5.1rem); line-height: .95; letter-spacing: -.04em; }
        .ah-empty-showcase > p:nth-of-type(2) { position: relative; max-width: 37rem; margin-top: 1.4rem; color: #938e88; font-size: .82rem; font-weight: 200; line-height: 1.9; }
        .ah-empty-rule { position: relative; width: min(100%, 38rem); height: 1px; margin: 2.2rem 0 1.4rem; background: linear-gradient(90deg, #4f1014, #242121 60%, transparent); }
        .ah-empty-facts { position: relative; display: flex; flex-wrap: wrap; gap: .75rem 1.4rem; color: #5c5753; font-size: .58rem; font-weight: 600; letter-spacing: .11em; text-transform: uppercase; }
        .ah-empty-facts b { margin-right: .35rem; color: #8d171c; font-weight: 600; }

        .ah-safe .ah-hero-image, .ah-safe .ah-gallery img { filter: blur(18px) grayscale(1) brightness(.55); transform: scale(1.08); }
        .ah-safe .ah-item-name { letter-spacing: .03em; }

        @keyframes ah-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ah-image-in { from { opacity: .25; transform: scale(1.025); } to { opacity: 1; transform: scale(1); } }
        @keyframes ah-pulse { 0%,100% { opacity: .45; } 50% { opacity: 1; box-shadow: 0 0 14px var(--ah-crimson); } }
        @keyframes ah-orbit { to { transform: rotate(405deg); } }

        @media (max-width: 900px) {
          .ah-store { padding-top: 1rem; }
          .ah-header { align-items: flex-start; flex-direction: column; }
          .ah-safe-button { align-self: stretch; justify-content: center; }
          .ah-meta-strip { flex-wrap: wrap; padding: .8rem 0; }
          .ah-meta-fill { display: none; }
          .ah-layout { grid-template-columns: 1fr; padding-top: 1.6rem; }
          .ah-manifest { order: 2; }
          .ah-showcase { order: 1; }
          .ah-hero { min-height: 28rem; }
          .ah-manifest-item { padding-inline: .7rem; }
        }

        @media (max-width: 560px) {
          .ah-age-gate { padding: 2rem .8rem; }
          .ah-age-card { padding: 2rem 1.35rem; }
          .ah-store { padding-inline: .8rem; }
          .ah-brand-subtitle { letter-spacing: .22em; line-height: 1.7; }
          .ah-meta-strip { gap: .45rem; }
          .ah-live-mark { width: 100%; margin-top: .15rem; }
          .ah-hero { min-height: 25rem; }
          .ah-hero-copy { padding: 1.3rem; }
          .ah-metrics { grid-template-columns: 1fr; padding: 1.35rem; }
          .ah-gallery { padding-inline: 1.25rem; }
          .ah-command-bar { align-items: stretch; flex-direction: column; padding: 1.35rem; }
          .ah-acquire-button { width: 100%; }
          .ah-empty-showcase { min-height: 34rem; padding: 1.6rem; }
          .ah-empty-facts { display: grid; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ah-surface *, .ah-surface *::before, .ah-surface *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .001ms !important; }
        }
      `}</style>
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Share2 } from 'lucide-react'

type SocialNetwork = {
  network: string
  connected: boolean
  handle?: string | null
  summary?: Record<string, number>
  content?: Record<string, unknown>[]
}

type SocialData = {
  status: string
  provider?: string
  fetchedAt?: string
  networks?: SocialNetwork[]
}

const socialOrder = ['pinterest', 'facebook', 'instagram', 'tiktok', 'linkedin', 'youtube']
const socialNames: Record<string, string> = {
  pinterest: 'Pinterest',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
}

const fmt = (value: number | undefined) => new Intl.NumberFormat().format(Number(value || 0))

function metric(network: SocialNetwork | undefined, ...keys: string[]) {
  for (const key of keys) {
    const value = network?.summary?.[key]
    if (typeof value === 'number' && value !== 0) return value
  }
  return 0
}

function text(row: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function navButton(label: string) {
  return [...document.querySelectorAll<HTMLButtonElement>('.cc-nav button')]
    .find(button => button.textContent?.trim().toLowerCase() === label.toLowerCase())
}

function go(label: string) {
  navButton(label)?.click()
}

function currentView() {
  return document.querySelector('.cc-title h1')?.textContent?.trim() || 'Overview'
}

function currentRange() {
  const label = [...document.querySelectorAll<HTMLButtonElement>('.cc-ranges button')]
    .find(button => button.classList.contains('active'))?.textContent?.trim().toLowerCase()
  if (label === '24h' || label === '7d' || label === '30d' || label === '90d') return label
  return '90d'
}

function targetForKpi(view: string, label: string) {
  if (view === 'Overview') {
    if (label === 'Visitors') return 'Live Pulse'
    if (label === 'Search impressions') return 'Search'
    if (label === 'Store intent') return 'Store'
    if (label === 'Worlds created') return 'Visual.X'
    if (label === 'App events') return 'Apps'
  }
  if (view === 'Search') return 'Search'
  if (view === 'Social') return 'Social'
  if (view === 'Store') return 'Store'
  if (view === 'Visual.X') return 'Visual.X'
  if (view === 'Apps') return 'Apps'
  if (view === 'Live Pulse') return 'Live Pulse'
  return ''
}

function localSiteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  if (!path.startsWith('/')) return ''
  return `https://www.planet-x.co${path}`
}

export default function CommandCenterInteractions() {
  const [host, setHost] = useState<HTMLElement | null>(null)
  const [social, setSocial] = useState<SocialData | null>(null)
  const [view, setView] = useState('Overview')
  const [range, setRange] = useState('30d')

  useEffect(() => {
    const workspace = document.querySelector('.cc-workspace')
    const topbar = document.querySelector('.cc-topbar')
    if (!workspace || !topbar) return
    const node = document.createElement('div')
    node.className = 'cc-social-ribbon-host'
    topbar.insertAdjacentElement('afterend', node)
    setHost(node)
    return () => node.remove()
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch(`/api/social?range=${range}`, { cache: 'no-store' })
      .then(response => response.ok ? response.json() : Promise.reject(new Error(String(response.status))))
      .then(payload => { if (!cancelled) setSocial(payload as SocialData) })
      .catch(() => { if (!cancelled) setSocial(null) })
    return () => { cancelled = true }
  }, [range])

  useEffect(() => {
    const sync = () => {
      setView(currentView())
      setRange(currentRange())
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const decorate = () => {
      const page = currentView()
      document.querySelectorAll<HTMLElement>('.cc-kpi').forEach(card => {
        const label = card.querySelector('.cc-kpi-head span')?.textContent?.trim() || ''
        const destination = targetForKpi(page, label)
        if (destination && destination !== page) {
          card.classList.add('cc-actionable')
          card.dataset.ccNav = destination
          card.tabIndex = 0
          card.setAttribute('role', 'button')
          card.setAttribute('aria-label', `Open ${destination} detail for ${label}`)
        } else {
          card.classList.remove('cc-actionable')
          delete card.dataset.ccNav
          card.removeAttribute('tabindex')
          card.removeAttribute('role')
          card.removeAttribute('aria-label')
        }
      })

      document.querySelectorAll<HTMLElement>('.cc-panel').forEach(panel => {
        const action = panel.querySelector<HTMLButtonElement>(':scope > header button')
        panel.classList.toggle('cc-panel-actionable', Boolean(action))
      })

      document.querySelectorAll<HTMLElement>('.cc-search-rows > div, .cc-indexing article').forEach(row => {
        const candidate = row.querySelector('span, b')?.textContent?.trim() || ''
        if (localSiteUrl(candidate)) {
          row.classList.add('cc-actionable-row')
          row.dataset.ccUrl = localSiteUrl(candidate)
          row.tabIndex = 0
        }
      })

      document.querySelectorAll<HTMLElement>('.cc-product-table > div:not(.head)').forEach(row => {
        row.classList.add('cc-actionable-row')
        row.dataset.ccUrl = 'https://www.planet-x.co/store'
        row.tabIndex = 0
      })

      document.querySelectorAll<HTMLElement>('.cc-pulse-list > div').forEach(row => {
        const detail = row.querySelector('span')?.textContent || ''
        const path = detail.split('·').pop()?.trim() || ''
        const url = localSiteUrl(path)
        if (url) {
          row.classList.add('cc-actionable-row')
          row.dataset.ccUrl = url
          row.tabIndex = 0
        }
      })
    }

    const activate = (element: HTMLElement) => {
      const destination = element.dataset.ccNav
      if (destination) {
        go(destination)
        return true
      }
      const url = element.dataset.ccUrl
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
        return true
      }
      return false
    }

    const click = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const interactive = target.closest('button, a, input, select, textarea')
      const card = target.closest('.cc-kpi.cc-actionable') as HTMLElement | null
      if (card && !interactive) {
        activate(card)
        return
      }
      const row = target.closest('.cc-actionable-row') as HTMLElement | null
      if (row && !interactive) {
        activate(row)
        return
      }
      const header = target.closest('.cc-panel-actionable > header') as HTMLElement | null
      if (header && !interactive) {
        header.querySelector<HTMLButtonElement>('button')?.click()
        return
      }
      const contentRow = target.closest('.cc-content-table article') as HTMLElement | null
      if (contentRow && !interactive) {
        const active = document.querySelector('.cc-network.active b')?.textContent?.trim().toLowerCase() || ''
        const network = social?.networks?.find(item => (socialNames[item.network] || item.network).toLowerCase() === active)
        const label = contentRow.querySelector('b')?.textContent?.trim() || ''
        const match = network?.content?.find(row => text(row, 'title', 'content', 'post_text', 'caption', 'name') === label)
        const url = match ? text(match, 'content_url', 'url', 'permalink') : ''
        if (url) window.open(url, '_blank', 'noopener,noreferrer')
      }
    }

    const keydown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      const target = event.target as HTMLElement
      if (target.matches('.cc-actionable, .cc-actionable-row')) {
        event.preventDefault()
        activate(target)
      }
    }

    decorate()
    const observer = new MutationObserver(decorate)
    observer.observe(document.body, { childList: true, subtree: true })
    document.addEventListener('click', click)
    document.addEventListener('keydown', keydown)
    return () => {
      observer.disconnect()
      document.removeEventListener('click', click)
      document.removeEventListener('keydown', keydown)
    }
  }, [social])

  const networks = useMemo(() => socialOrder
    .map(name => social?.networks?.find(network => network.network === name))
    .filter(Boolean) as SocialNetwork[], [social])

  const openNetwork = (name: string) => {
    go('Social')
    window.setTimeout(() => {
      const label = socialNames[name] || name
      const button = [...document.querySelectorAll<HTMLButtonElement>('.cc-network')]
        .find(item => item.querySelector('b')?.textContent?.trim() === label)
      button?.click()
    }, 80)
  }

  if (!host || view !== 'Overview') return null

  return createPortal(
    <section className='cc-social-ribbon' aria-label='Live social analytics summary'>
      <header>
        <div>
          <span><Share2 /> SOCIAL // LIVE ARCHIVE</span>
          <strong>{networks.filter(network => network.connected).length || 0} connected networks</strong>
          <small>{social?.provider || 'Metricool MCP archive'} · {range.toUpperCase()}</small>
        </div>
        <button onClick={() => go('Social')}>Open Social <ArrowUpRight /></button>
      </header>
      <div className='cc-social-ribbon-grid'>
        {networks.length ? networks.map(network => {
          const visibility = metric(network, 'views', 'impressions', 'reach')
          const interactions = metric(network, 'interactions', 'reelInteractions')
          const followers = metric(network, 'followers')
          return <button key={network.network} onClick={() => openNetwork(network.network)}>
            <span>{socialNames[network.network] || network.network}</span>
            <strong>{fmt(visibility)}</strong>
            <small>visibility · {fmt(interactions)} interactions · {fmt(followers)} followers</small>
          </button>
        }) : <div className='cc-social-ribbon-empty'>Loading social archive…</div>}
      </div>
    </section>,
    host,
  )
}

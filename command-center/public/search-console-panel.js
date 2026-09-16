(()=>{
  const STYLE_ID='px-search-console-style';
  const OVERLAY_ID='px-search-console-overlay';
  const fmt=n=>new Intl.NumberFormat().format(Number(n||0));
  const pct=n=>`${Number(n||0).toFixed(2)}%`;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const signed=n=>`${Number(n||0)>0?'+':''}${Number(n||0).toFixed(1)}%`;
  const posDelta=n=>`${Number(n||0)>0?'+':''}${Number(n||0).toFixed(1)}`;
  function styles(){
    if(document.getElementById(STYLE_ID))return;
    const el=document.createElement('style');el.id=STYLE_ID;el.textContent=`
      #px-search-console-launch{position:fixed;right:18px;bottom:64px;z-index:80;border:1px solid rgba(255,255,255,.14);background:linear-gradient(135deg,rgba(54,209,220,.96),rgba(139,92,246,.96));color:#fff;border-radius:999px;padding:11px 15px;font:700 12px/1 system-ui,-apple-system,sans-serif;letter-spacing:.04em;box-shadow:0 14px 40px rgba(0,0,0,.35);cursor:pointer}
      #${OVERLAY_ID}{position:fixed;inset:0;z-index:91;background:rgba(3,3,9,.82);backdrop-filter:blur(14px);display:none;align-items:flex-start;justify-content:center;padding:24px 14px;overflow:auto}
      #${OVERLAY_ID}.open{display:flex}.px-sc-shell{width:min(1180px,100%);background:radial-gradient(circle at 14% 0%,rgba(255,43,166,.12),transparent 34%),radial-gradient(circle at 86% 0%,rgba(54,209,220,.12),transparent 32%),linear-gradient(180deg,#10101b,#08080e 58%,#06060b);border:1px solid rgba(255,255,255,.11);border-radius:24px;box-shadow:0 32px 100px rgba(0,0,0,.58);overflow:hidden;color:#f7f7fb;font-family:system-ui,-apple-system,sans-serif}
      .px-sc-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:24px;border-bottom:1px solid rgba(255,255,255,.08)}.px-sc-head p,.px-sc-head h2{margin:0}.px-sc-head p{font-size:11px;letter-spacing:.14em;color:#5fe8f2;font-weight:800}.px-sc-head h2{font-size:28px;margin-top:5px}.px-sc-head small{display:block;color:#9999ad;margin-top:7px;max-width:720px}
      .px-sc-close{border:0;background:rgba(255,255,255,.07);color:#fff;width:38px;height:38px;border-radius:12px;font-size:21px;cursor:pointer;flex:0 0 auto}
      .px-sc-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:14px 24px;border-bottom:1px solid rgba(255,255,255,.07)}.px-sc-toolbar button{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.035);color:#bdbdd0;border-radius:10px;padding:8px 11px;font:700 11px system-ui;cursor:pointer}.px-sc-toolbar button.on{background:linear-gradient(135deg,rgba(255,43,166,.18),rgba(54,209,220,.17));border-color:rgba(95,232,242,.35);color:#fff}.px-sc-toolbar span{margin-left:auto;color:#77778c;font-size:11px}
      .px-sc-body{padding:20px 24px 28px}.px-sc-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.px-sc-card{padding:15px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.03)}.px-sc-card label{display:block;color:#8c8ca1;font-size:10px;text-transform:uppercase;letter-spacing:.09em}.px-sc-card b{display:block;font-size:25px;margin-top:5px}.px-sc-card small{display:block;margin-top:5px;color:#8debf2;font-size:10px}.px-sc-card small.down{color:#ff87c7}
      .px-sc-split{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:14px}.px-sc-section{border:1px solid rgba(255,255,255,.08);border-radius:18px;background:rgba(255,255,255,.025);padding:17px;min-width:0}.px-sc-section.wide{grid-column:1/-1}.px-sc-section h3{margin:0;font-size:15px}.px-sc-section>p{margin:5px 0 12px;color:#848499;font-size:11px;line-height:1.5}
      .px-sc-table{width:100%;border-collapse:collapse;font-size:11px}.px-sc-table th{text-align:right;color:#76768b;font-size:9px;text-transform:uppercase;letter-spacing:.07em;padding:8px 6px;border-bottom:1px solid rgba(255,255,255,.08)}.px-sc-table th:first-child,.px-sc-table td:first-child{text-align:left}.px-sc-table td{text-align:right;padding:9px 6px;border-bottom:1px solid rgba(255,255,255,.055);color:#d7d7e2;vertical-align:top}.px-sc-table tr:last-child td{border-bottom:0}.px-sc-table .key{max-width:330px;word-break:break-word;color:#fff;font-weight:650}.px-sc-tag{display:inline-block;padding:4px 7px;border-radius:999px;background:rgba(95,232,242,.1);color:#9cf4fa;font-size:9px;font-weight:800}.px-sc-tag.warn{background:rgba(255,43,166,.1);color:#ff91cb}
      .px-sc-bars{display:grid;gap:8px}.px-sc-bar{display:grid;grid-template-columns:minmax(120px,1fr) 2fr auto;align-items:center;gap:9px;font-size:11px}.px-sc-bar span:first-child{color:#cfcfda;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.px-sc-track{height:7px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}.px-sc-fill{height:100%;background:linear-gradient(90deg,#ff2ba6,#8b5cf6,#36d1dc);border-radius:99px}.px-sc-bar b{font-size:10px;color:#9d9db2;min-width:34px;text-align:right}
      .px-sc-index{display:grid;gap:8px}.px-sc-index-row{display:grid;grid-template-columns:minmax(120px,1fr) auto auto;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.055);font-size:11px}.px-sc-index-row:last-child{border-bottom:0}.px-sc-index-row b{overflow:hidden;text-overflow:ellipsis}.px-sc-index-row small{color:#818196}.px-sc-good{color:#8ff7bd}.px-sc-warn{color:#ff91cb}.px-sc-empty{color:#85859a;font-size:12px;padding:12px 0}.px-sc-error{margin:20px 24px 26px;padding:18px;border:1px solid rgba(255,74,155,.24);background:rgba(255,43,166,.07);border-radius:14px;color:#ffc4e2;font-size:12px;line-height:1.6}
      @media(max-width:820px){#px-search-console-launch{right:12px;bottom:60px}.px-sc-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.px-sc-split{grid-template-columns:1fr}.px-sc-section.wide{grid-column:auto}.px-sc-head,.px-sc-toolbar,.px-sc-body{padding-left:16px;padding-right:16px}.px-sc-shell{border-radius:18px}.px-sc-toolbar span{width:100%;margin-left:0}.px-sc-table{font-size:10px}.px-sc-table th,.px-sc-table td{padding-left:4px;padding-right:4px}.px-sc-table .key{max-width:165px}.px-sc-bar{grid-template-columns:minmax(92px,1fr) 1.4fr auto}}
    `;document.head.appendChild(el)
  }
  function shell(){
    if(document.getElementById(OVERLAY_ID))return;
    const launch=document.createElement('button');launch.id='px-search-console-launch';launch.type='button';launch.textContent='Search ↗';launch.setAttribute('aria-haspopup','dialog');
    const overlay=document.createElement('div');overlay.id=OVERLAY_ID;overlay.setAttribute('aria-hidden','true');overlay.innerHTML=`
      <section class="px-sc-shell" role="dialog" aria-modal="true" aria-labelledby="px-sc-title">
        <header class="px-sc-head"><div><p>SEARCH INTELLIGENCE</p><h2 id="px-sc-title">Google Search Console</h2><small id="px-sc-subtitle">Organic discovery, indexing, crawl health and SEO opportunities for planet.X.</small></div><button class="px-sc-close" type="button" aria-label="Close Search Console intelligence">×</button></header>
        <div class="px-sc-toolbar"><button data-days="7">7D</button><button class="on" data-days="28">28D</button><button data-days="90">90D</button><span id="px-sc-freshness">Loading finalized Search Console data…</span></div>
        <div id="px-sc-content" class="px-sc-body"><div class="px-sc-empty">Loading search intelligence…</div></div>
      </section>`;
    document.body.append(launch,overlay);
    const close=()=>{overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true')};
    launch.addEventListener('click',()=>{overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');load(28)});
    overlay.querySelector('.px-sc-close')?.addEventListener('click',close);
    overlay.addEventListener('click',event=>{if(event.target===overlay)close()});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&overlay.classList.contains('open'))close()});
    overlay.querySelectorAll('[data-days]').forEach(button=>button.addEventListener('click',()=>{overlay.querySelectorAll('[data-days]').forEach(x=>x.classList.remove('on'));button.classList.add('on');load(Number(button.getAttribute('data-days')||28))}))
  }
  const table=(rows,limit=10)=>!rows?.length?'<div class="px-sc-empty">No data in this window.</div>':`<table class="px-sc-table"><thead><tr><th>Item</th><th>Clicks</th><th>Impr.</th><th>CTR</th><th>Pos.</th></tr></thead><tbody>${rows.slice(0,limit).map(r=>`<tr><td class="key">${esc(r.label||r.name)}</td><td>${fmt(r.clicks)}</td><td>${fmt(r.impressions)}</td><td>${pct(r.ctr)}</td><td>${Number(r.position||0).toFixed(1)}</td></tr>`).join('')}</tbody></table>`;
  const bars=rows=>{const max=Math.max(1,...(rows||[]).map(x=>Number(x.impressions||0)));return!rows?.length?'<div class="px-sc-empty">No data in this window.</div>':`<div class="px-sc-bars">${rows.map(r=>`<div class="px-sc-bar"><span title="${esc(r.label||r.name)}">${esc(r.label||r.name)}</span><div class="px-sc-track"><div class="px-sc-fill" style="width:${Math.max(2,Number(r.impressions||0)/max*100)}%"></div></div><b>${fmt(r.impressions)}</b></div>`).join('')}</div>`};
  function render(d){
    const change=d.change||{},t=d.totals||{},hour=d.hourly?.totals||{};
    const changeClass=n=>Number(n)<0?'down':'';
    const opportunities=(d.opportunities||[]).map(r=>`<tr><td class="key">${esc(r.label)}</td><td>${fmt(r.impressions)}</td><td>${pct(r.ctr)}</td><td>${Number(r.position||0).toFixed(1)}</td><td><span class="px-sc-tag ${r.ctr<1?'warn':''}">${esc(r.reason)}</span></td></tr>`).join('');
    const indexing=(d.indexing||[]).map(r=>{const good=String(r.verdict).toUpperCase()==='PASS';return`<div class="px-sc-index-row"><b>${esc(r.path)}</b><span class="${good?'px-sc-good':'px-sc-warn'}">${esc(r.verdict)}</span><small>${esc(r.coverageState)}</small></div>`}).join('');
    const sitemap=(d.sitemaps||[]).map(s=>{const counts=(s.contents||[]).map(c=>`${fmt(c.indexed)}/${fmt(c.submitted)} indexed`).join(' · ');return`<div class="px-sc-index-row"><b>${esc(s.path)}</b><span class="${s.errors?'px-sc-warn':'px-sc-good'}">${s.errors?`${fmt(s.errors)} errors`:'No errors'}</span><small>${esc(counts||'Submitted')}</small></div>`}).join('');
    return `
      <div class="px-sc-grid">
        <article class="px-sc-card"><label>Clicks</label><b>${fmt(t.clicks)}</b><small class="${changeClass(change.clicks)}">${signed(change.clicks)} vs previous</small></article>
        <article class="px-sc-card"><label>Impressions</label><b>${fmt(t.impressions)}</b><small class="${changeClass(change.impressions)}">${signed(change.impressions)} vs previous</small></article>
        <article class="px-sc-card"><label>CTR</label><b>${pct(t.ctr)}</b><small class="${changeClass(change.ctr)}">${signed(change.ctr)} relative change</small></article>
        <article class="px-sc-card"><label>Avg position</label><b>${Number(t.position||0).toFixed(1)}</b><small>${posDelta(change.position)} positions vs previous</small></article>
        <article class="px-sc-card"><label>Fresh 24H impressions</label><b>${fmt(hour.impressions)}</b><small>${esc(d.hourly?.status==='partial'?'Partial / still settling':'Unavailable')}</small></article>
        <article class="px-sc-card"><label>Fresh 24H clicks</label><b>${fmt(hour.clicks)}</b><small>Not used in finalized comparison</small></article>
        <article class="px-sc-card"><label>Tracked priority URLs</label><b>${fmt((d.indexing||[]).length)}</b><small>Live URL inspection</small></article>
        <article class="px-sc-card"><label>SEO opportunities</label><b>${fmt((d.opportunities||[]).length)}</b><small>Near page one / low CTR</small></article>
      </div>
      <div class="px-sc-split">
        <section class="px-sc-section"><h3>Top search queries</h3><p>What people typed before planet.X appeared.</p>${table(d.queries,12)}</section>
        <section class="px-sc-section"><h3>Top Google landing pages</h3><p>Which pages are earning organic visibility.</p>${table(d.pages,12)}</section>
        <section class="px-sc-section wide"><h3>Opportunity queue</h3><p>Pages Google is already testing that have a realistic CTR or position improvement opportunity.</p>${opportunities?`<table class="px-sc-table"><thead><tr><th>Page</th><th>Impr.</th><th>CTR</th><th>Pos.</th><th>Why</th></tr></thead><tbody>${opportunities}</tbody></table>`:'<div class="px-sc-empty">No opportunity rows in this period yet.</div>'}</section>
        <section class="px-sc-section"><h3>planet.X page groups</h3><p>Store, music, apps and discovery content separated into useful business areas.</p>${table(d.pageGroups,8)}</section>
        <section class="px-sc-section"><h3>Tracked topic clusters</h3><p>Brand, xFactor music, product discovery and Chrome extension demand.</p>${table(d.topicClusters,8)}</section>
        <section class="px-sc-section"><h3>Devices</h3><p>Where Google search visibility is happening.</p>${bars(d.devices)}</section>
        <section class="px-sc-section"><h3>Countries</h3><p>Top geographic search visibility in this period.</p>${bars((d.countries||[]).slice(0,10))}</section>
        <section class="px-sc-section"><h3>Priority indexing</h3><p>Google's current URL Inspection verdict for high-value pages.</p><div class="px-sc-index">${indexing||'<div class="px-sc-empty">No URL inspection results.</div>'}</div></section>
        <section class="px-sc-section"><h3>Sitemap health</h3><p>Submitted sitemap status. Individual URL inspection remains the better confirmation of a specific page.</p><div class="px-sc-index">${sitemap||'<div class="px-sc-empty">No sitemap rows returned.</div>'}</div></section>
        <section class="px-sc-section wide"><h3>Search appearance</h3><p>How Google classifies the result features producing impressions.</p>${table(d.searchAppearance,12)}</section>
      </div>`
  }
  async function load(days){
    const content=document.getElementById('px-sc-content'),fresh=document.getElementById('px-sc-freshness');if(!content)return;
    content.innerHTML='<div class="px-sc-empty">Loading Search Console intelligence…</div>';
    try{
      const response=await fetch(`/api/search-console?days=${days}`,{cache:'no-store'}),data=await response.json();if(!response.ok)throw new Error(data?.error||`Search Console returned ${response.status}`);
      content.innerHTML=render(data);if(fresh)fresh.textContent=`Finalized through ${data.freshness?.finalizedThrough||'latest settled day'} · ${data.days}D vs previous ${data.days}D · refreshed ${new Date(data.fetchedAt).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}`;
    }catch(error){content.innerHTML=`<div class="px-sc-error"><b>Search Console feed needs attention.</b><br>${esc(error?.message||error)}<br><small>The rest of Command Center remains available.</small></div>`;if(fresh)fresh.textContent='Search Console unavailable'}
  }
  styles();shell();
})();
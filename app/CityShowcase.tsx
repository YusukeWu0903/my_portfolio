'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, MapPin, X } from 'lucide-react';
import type { PortfolioProject } from './data/projects';
import styles from './CityShowcase.module.css';

type Layout = 'city' | 'showcase' | 'retro' | 'cyberpunk' | 'editorial';
type Anchor = { id: string; x: number; y: number };
type District = 'works' | 'expansion';
const modes: [Layout, string][] = [['city', '作品街區'], ['showcase', '作品優先 · 輪播'], ['retro', 'Retro Arcade'], ['cyberpunk', 'Cyberpunk Launcher'], ['editorial', 'Fashion Editorial']];
const names: Record<string, string> = { 'hex-grid': 'Hex Grid 戰棋', 'visual-novel': 'AI 視覺小說', pivotlens: 'PivotLens', 'material-library': 'AI 影音素材庫', miffy: 'Miffy', mimi: 'Mimi', eris: 'Eris', 'water-sort': '倒水遊戲' };
const categories = { games: '遊戲開發', tools: '工具開發', art: 'AI 美術' };

export default function CityShowcase({ projects, onSwitch }: { projects: PortfolioProject[]; onSwitch: (mode: Layout) => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement>(null);
  const districtRef = useRef<District>('works');
  const [district, setDistrict] = useState<District>('works');
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [menu, setMenu] = useState(false);
  const active = projects.find(project => project.id === selected);

  useEffect(() => {
    const initialize = () => frame.current?.contentWindow?.postMessage({ type: 'portfolio-city:init', district: districtRef.current, projects: projects.map(({ id, category }) => ({ id, category })) }, window.location.origin);
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === 'portfolio-city:ready') initialize();
      if (event.data?.type === 'portfolio-city:anchors' && Array.isArray(event.data.anchors)) {
        setAnchors(event.data.anchors);
        setReady(true);
      }
      if (event.data?.type === 'portfolio-city:select') setSelected(projects.some(p => p.id === event.data.id) ? event.data.id : null);
      if (event.data?.type === 'portfolio-city:error') setFailed(true);
    };
    window.addEventListener('message', receive);
    initialize();
    const timeout = window.setTimeout(() => setFailed(value => value || !frame.current?.dataset.ready), 20000);
    return () => { window.removeEventListener('message', receive); window.clearTimeout(timeout); };
  }, [projects]);

  useEffect(() => {
    if (ready && frame.current) frame.current.dataset.ready = 'true';
    if (ready && scroller.current && window.innerWidth < 760) {
      scroller.current.scrollLeft = (scroller.current.scrollWidth - scroller.current.clientWidth) / 2;
    }
  }, [ready]);

  const choose = (id: string, fromList = false) => {
    setSelected(id);
    frame.current?.contentWindow?.postMessage({ type: 'portfolio-city:highlight', id }, window.location.origin);
    if (fromList) {
      const anchor = anchors.find(a => a.id === id);
      if (anchor && scroller.current) scroller.current.scrollTo({ left: anchor.x * scroller.current.scrollWidth / 100 - scroller.current.clientWidth / 2, behavior: 'smooth' });
    }
    if (fromList && window.innerWidth < 760) requestAnimationFrame(() => card.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };
  const dismiss = () => {
    setSelected(null);
    frame.current?.contentWindow?.postMessage({ type: 'portfolio-city:highlight', id: null }, window.location.origin);
    if (window.innerWidth < 760) scroller.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const switchDistrict = (next: District) => {
    districtRef.current = next;
    setDistrict(next);
    setSelected(null);
    frame.current?.contentWindow?.postMessage({ type: 'portfolio-city:district', district: next }, window.location.origin);
    if (scroller.current) scroller.current.scrollLeft = (scroller.current.scrollWidth - scroller.current.clientWidth) / 2;
  };

  return (
    <main className={styles.page}>
      <header className={styles.header} onKeyDown={event => { if (event.key === 'Escape') setMenu(false); }}>
        <a className={styles.brand} href="#projects"><span className={styles.brandMark}>Y.</span><span>YUSUKE<span className={styles.brandSmall}>CREATIVE DEVELOPER</span></span></a>
        <div className={styles.switcher}>
          <button className={styles.switchButton} type="button" aria-expanded={menu} aria-controls="city-layout-menu" onClick={() => setMenu(!menu)}>版型：作品街區 <ChevronDown size={14} /></button>
          {menu && <div className={styles.menu} id="city-layout-menu">{modes.map(([mode, label]) => <button key={mode} type="button" onClick={() => { setMenu(false); onSwitch(mode); }}>{label}{mode === 'city' ? ' ✓' : ''}</button>)}</div>}
        </div>
      </header>
      <section id="projects" aria-label="互動作品街區" className={styles.section}>
        <div className={styles.intro}><div><p className={styles.eyebrow}>A NEIGHBORHOOD OF IDEAS</p><h1>在街角，遇見作品<span>。</span></h1><p>遊戲、工具與 AI 美術。每一棟地標，都有一個故事。</p></div><span className={styles.mapHint}><MapPin size={15} /> {district === 'works' ? `${projects.length} 個作品地標` : '下一個街區'} <i /> {district === 'works' ? '移入預覽 · 點擊開啟' : '擴建中…'}</span></div>
        <div className={styles.districtBar} role="group" aria-label="街區切換">
          <button type="button" aria-pressed={district === 'works'} onClick={() => switchDistrict('works')}><small>01</small>作品街區</button>
          <button type="button" aria-pressed={district === 'expansion'} onClick={() => switchDistrict('expansion')}><small>02</small>擴建預定地<span>COMING SOON</span></button>
        </div>
        <p className={styles.srOnly} role="status">{district === 'works' ? `作品街區，${projects.length} 個作品地標` : '擴建預定地，擴建中…'}</p>
        <div className={styles.mapShell} onKeyDown={event => { if (event.key === 'Escape') dismiss(); }}>
          <div className={styles.mapTop}><span><span className={styles.liveDot} /> {district === 'works' ? 'YUSUKE CREATIVE DISTRICT' : 'THE NEXT NEIGHBORHOOD'}</span><span>{district === 'works' ? <>遊戲 <i className={styles.gameDot} /> 工具 <i className={styles.toolDot} /> 美術 <i className={styles.artDot} /></> : 'COMING SOON'}</span></div>
          <div className={styles.mapScroll} ref={scroller}>
            <div className={styles.scene}>
              <iframe ref={frame} title="作品街區 3D 地圖" src="/portfolio-city/index.html" className={styles.frame} tabIndex={-1} />
              {ready && district === 'works' && anchors.map(anchor => {
                const project = projects.find(p => p.id === anchor.id);
                return project ? <a key={project.id} href={`/open/${project.id}`} target="_blank" rel="noopener noreferrer" className={`${styles.label} ${selected === project.id ? styles.labelActive : ''}`} style={{ left: `${anchor.x}%`, top: `${anchor.y}%`, '--accent': project.category === 'games' ? '#c89b3a' : project.category === 'tools' ? '#378f8f' : '#ac79ab' } as React.CSSProperties} onPointerEnter={event => { if (event.pointerType === 'mouse') choose(project.id); }} onFocus={() => choose(project.id)} aria-controls="city-project-card"><span />{names[project.id] || project.title}<ArrowUpRight size={11} /></a> : null;
              })}
            </div>
          </div>
          {!ready && !failed && <div className={styles.loading} role="status"><span className={styles.loader} />正在走進作品街區…<small>準備建築與道路</small></div>}
          {failed && !ready && <div className={styles.loading} role="status">地圖暫時無法顯示<small>仍可從下方選擇所有作品。</small></div>}
          {district === 'works' && active && <article ref={card} id="city-project-card" className={styles.card} key={active.id} aria-label={`${active.title}作品卡片`}>
            <div className={styles.cardImage}><Image src={active.image} alt={active.imageAlt} fill sizes="(max-width: 760px) 90vw, 340px" className={active.imageFit === 'contain' ? styles.contain : styles.cover} style={{ objectPosition: active.imagePosition === 'left' ? 'left' : 'center' }} /><span className={styles.category}>{categories[active.category]}</span><button type="button" className={styles.close} aria-label="關閉作品卡片" onClick={dismiss}><X size={16} /></button></div>
            <div className={styles.cardBody}><p className={styles.cardKicker}>PROJECT / {String(projects.indexOf(active) + 1).padStart(2, '0')}</p><h2>{active.title}</h2><p>{active.description}</p><div className={styles.tags}>{active.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div><a href={`/open/${active.id}`} target="_blank" rel="noopener noreferrer">查看作品 <ArrowUpRight size={17} /></a></div>
          </article>}
          <div className={styles.mapBottom}><span>{district === 'works' ? '沿著街道，探索每一個想法。' : '新的作品，將在這裡發生。'}</span><span>{district === 'works' ? '移入預覽 · 點擊建築或標籤開啟作品' : '擴建預定地 · 敬請期待'} <span className={styles.mobileHint}> · 左右滑動地圖</span></span></div>
        </div>
        {district === 'works' ? <nav className={styles.projectList} aria-label="所有作品入口"><span className={styles.listTitle}>街區索引 <span>{projects.length}</span></span>{projects.map(project => <button key={project.id} type="button" aria-pressed={selected === project.id} className={selected === project.id ? styles.indexActive : ''} onClick={() => choose(project.id, true)}>{names[project.id] || project.title}<ArrowUpRight size={12} /></button>)}</nav> : <div className={styles.expansionNote}><span>下一個街區，正在準備中。</span><button type="button" onClick={() => switchDistrict('works')}>回作品街區 <ArrowUpRight size={13} /></button></div>}
      </section>
      <footer className={styles.footer}><span>© 2026 YUSUKE</span><span>BUILT WITH CURIOSITY, OPEN TO EXPLORE.</span></footer>
    </main>
  );
}

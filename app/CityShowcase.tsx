'use client';

import Image from 'next/image';
import Link from 'next/link';
import PortfolioDetails from './PortfolioDetails';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, MapPin, X } from 'lucide-react';
import { getCityDistrict, type PortfolioProject } from './data/projects';
import styles from './CityShowcase.module.css';
import { useIdleProjectPreview } from './useIdleProjectPreview';

type Layout = 'city' | 'showcase' | 'retro' | 'cyberpunk' | 'editorial';
type Anchor = { id: string; x: number; y: number };
type District = 'works' | 'expansion';
const modes: [Layout, string][] = [['city', '作品街區'], ['showcase', '作品優先 · 輪播'], ['retro', 'Retro Arcade'], ['cyberpunk', 'Cyberpunk Launcher'], ['editorial', 'Fashion Editorial']];
const names: Record<string, string> = { 'hex-grid': 'Hex Grid 戰棋', 'visual-novel': 'AI 視覺小說', pivotlens: '台股選股', 'material-library': 'AI 影音素材庫', miffy: 'Miffy', mimi: 'Mimi', eris: 'Eris', 'fruit-slot': '水果盤', 'water-sort': '倒水遊戲' };
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
  const districtProjects = useMemo(() => projects.filter(project => getCityDistrict(project) === district), [projects, district]);
  const districtIds = useMemo(() => districtProjects.map(project => project.id), [districtProjects]);
  const active = districtProjects.find(project => project.id === selected);
  const hasProjects = districtProjects.length > 0;
  const districtLabel = district === 'works' ? '第一街區' : '第二街區';
  const { hold, recordActivity } = useIdleProjectPreview(districtIds, ready && !menu, id => {
    setSelected(id);
    frame.current?.contentWindow?.postMessage({ type: 'portfolio-city:highlight', id }, window.location.origin);
  });

  useEffect(() => {
    const initialize = () => frame.current?.contentWindow?.postMessage({ type: 'portfolio-city:init', district: districtRef.current, projects: projects.map(({ id, category, cityDistrict, citySlot }) => ({ id, category, cityDistrict, citySlot })) }, window.location.origin);
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === 'portfolio-city:ready') initialize();
      if (event.data?.type === 'portfolio-city:anchors' && Array.isArray(event.data.anchors)) {
        if (event.data.district !== districtRef.current) return;
        setAnchors(event.data.anchors);
        setReady(true);
      }
      if (event.data?.type === 'portfolio-city:select') {
        if (event.data.district !== districtRef.current) return;
        recordActivity();
        setSelected(projects.some(p => p.id === event.data.id && getCityDistrict(p) === districtRef.current) ? event.data.id : null);
        if (event.data.clicked && event.data.id && window.innerWidth < 760) requestAnimationFrame(() => card.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
      }
      if (event.data?.type === 'portfolio-city:hover' && event.data.district === districtRef.current) hold('building', !!event.data.id);
      if (event.data?.type === 'portfolio-city:error') setFailed(true);
    };
    window.addEventListener('message', receive);
    initialize();
    const timeout = window.setTimeout(() => setFailed(value => value || !frame.current?.dataset.ready), 20000);
    return () => { window.removeEventListener('message', receive); window.clearTimeout(timeout); };
  }, [projects, hold, recordActivity]);

  useEffect(() => {
    if (ready && frame.current) frame.current.dataset.ready = 'true';
    if (ready && scroller.current && window.innerWidth < 760) {
      scroller.current.scrollLeft = (scroller.current.scrollWidth - scroller.current.clientWidth) / 2;
    }
  }, [ready]);

  const choose = (id: string, fromList = false) => {
    if (!districtProjects.some(project => project.id === id)) return;
    recordActivity();
    setSelected(id);
    frame.current?.contentWindow?.postMessage({ type: 'portfolio-city:highlight', id }, window.location.origin);
    if (fromList) {
      const anchor = anchors.find(a => a.id === id);
      if (anchor && scroller.current) scroller.current.scrollTo({ left: anchor.x * scroller.current.scrollWidth / 100 - scroller.current.clientWidth / 2, behavior: 'smooth' });
    }
    if (fromList && window.innerWidth < 760) requestAnimationFrame(() => card.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };
  const dismiss = () => {
    recordActivity();
    hold('card', false);
    setSelected(null);
    frame.current?.contentWindow?.postMessage({ type: 'portfolio-city:highlight', id: null }, window.location.origin);
    if (window.innerWidth < 760) scroller.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const switchDistrict = (next: District) => {
    recordActivity();
    hold('building', false);
    hold('label', false);
    hold('card', false);
    districtRef.current = next;
    setDistrict(next);
    setSelected(null);
    setAnchors([]);
    frame.current?.contentWindow?.postMessage({ type: 'portfolio-city:district', district: next }, window.location.origin);
    if (scroller.current) scroller.current.scrollLeft = (scroller.current.scrollWidth - scroller.current.clientWidth) / 2;
  };

  return (
    <main className={styles.page} onPointerDownCapture={recordActivity} onFocusCapture={event => hold('keyboard', event.target.matches(':focus-visible'))} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) hold('keyboard', false); }}>
      <header className={styles.header} onKeyDown={event => { if (event.key === 'Escape') setMenu(false); }}>
        <a className={styles.brand} href="#projects"><span className={styles.brandMark}>Y.</span><span>YUSUKE<span className={styles.brandSmall}>CREATIVE DEVELOPER</span></span></a>
        <a className={styles.contactShortcut} href="#contact">關於／GitHub</a>
        <div className={styles.switcher}>
          <button className={styles.switchButton} type="button" aria-expanded={menu} aria-controls="city-layout-menu" onClick={() => setMenu(!menu)}>版型：作品街區 <ChevronDown size={14} /></button>
          {menu && <div className={styles.menu} id="city-layout-menu">{modes.map(([mode, label]) => <button key={mode} type="button" onClick={() => { setMenu(false); onSwitch(mode); }}>{label}{mode === 'city' ? ' ✓' : ''}</button>)}</div>}
        </div>
      </header>
      <section id="projects" aria-label="互動作品街區" className={styles.section}>
        <div className={styles.intro}><div><p className={styles.eyebrow}>A NEIGHBORHOOD OF IDEAS</p><h1>在街角，遇見作品<span>。</span></h1><p>遊戲、工具與 AI 美術。每一棟地標，都有一個故事。</p></div><span className={styles.mapHint}><MapPin size={15} /> {`${districtProjects.length} 個作品地標`} <i /> {hasProjects ? '每 5 秒隨機預覽 · 移入暫停' : '擴建中…'}</span></div>
        <div className={styles.districtBar} role="group" aria-label="街區切換">
          <button type="button" aria-pressed={district === 'works'} onClick={() => switchDistrict('works')}><small>01</small>作品街區</button>
          <button type="button" aria-pressed={district === 'expansion'} onClick={() => switchDistrict('expansion')}><small>02</small>第二街區<span>{projects.filter(project => getCityDistrict(project) === 'expansion').length} 個作品</span></button>
        </div>
        <p className={styles.srOnly} role="status">{`${districtLabel}，${districtProjects.length} 個作品地標`}</p>
        <div className={styles.mapShell} onKeyDown={event => { if (event.key === 'Escape') dismiss(); }}>
          <div className={styles.mapTop}><span><span className={styles.liveDot} /> {district === 'works' ? 'YUSUKE CREATIVE DISTRICT' : 'YUSUKE CREATIVE DISTRICT / 02'}</span><span>{hasProjects ? <>遊戲 <i className={styles.gameDot} /> 工具 <i className={styles.toolDot} /> 美術 <i className={styles.artDot} /></> : 'COMING SOON'}</span></div>
          <div className={styles.mapScroll} ref={scroller}>
            <div className={styles.scene}>
              <iframe ref={frame} title="作品街區 3D 地圖" src="/portfolio-city/index.html?v=20261107-idle" className={styles.frame} tabIndex={-1} />
              {ready && anchors.map(anchor => {
                const project = districtProjects.find(p => p.id === anchor.id);
                return project ? <button key={project.id} type="button" onClick={() => choose(project.id, true)} aria-pressed={selected === project.id} className={`${styles.label} ${selected === project.id ? styles.labelActive : ''}`} style={{ left: `${anchor.x}%`, top: `${anchor.y}%`, '--accent': project.category === 'games' ? '#c89b3a' : project.category === 'tools' ? '#378f8f' : '#ac79ab' } as React.CSSProperties} onPointerEnter={event => { if (event.pointerType === 'mouse') { hold('label', true); choose(project.id); } }} onPointerLeave={() => hold('label', false)} onFocus={() => choose(project.id)} aria-controls="city-project-card"><span />{names[project.id] || project.title}</button> : null;
              })}
            </div>
          </div>
          {!ready && !failed && <div className={styles.loading} role="status"><span className={styles.loader} />正在走進作品街區…<small>準備建築與道路</small></div>}
          {failed && !ready && <div className={styles.loading} role="status">地圖暫時無法顯示<small>仍可從下方選擇所有作品。</small></div>}
          {active && <article ref={card} id="city-project-card" className={styles.card} aria-label={`${active.title}作品卡片`} onPointerEnter={event => { if (event.pointerType === 'mouse') hold('card', true); }} onPointerLeave={() => hold('card', false)}>
            <div className={styles.cardImage}><Image src={active.image} alt={active.imageAlt} fill sizes="(max-width: 760px) 90vw, 340px" className={active.imageFit === 'contain' ? styles.contain : styles.cover} style={{ objectPosition: active.imagePosition === 'left' ? 'left' : 'center' }} /><span className={styles.category}>{categories[active.category]}</span><button type="button" className={styles.close} aria-label="關閉作品卡片" onClick={dismiss}><X size={16} /></button></div>
            <div className={styles.cardBody}><p className={styles.cardKicker}>{active.featured ? '主打專案 / ' : 'PROJECT / '}{String(projects.indexOf(active) + 1).padStart(2, '0')}</p><h2>{active.title}</h2><p>{active.description}</p><div className={styles.tags}>{active.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div><div className={styles.cardActions}>{active.caseStudy && <Link href={active.caseStudy}>專案介紹 <ArrowUpRight size={15} /></Link>}<a href={`/open/${active.id}`} target="_blank" rel="noopener noreferrer">查看作品 <ArrowUpRight size={17} /></a></div></div>
          </article>}
          <div className={styles.mapBottom}><span>{hasProjects ? '沿著街道，探索每一個想法。' : '新的作品，將在這裡發生。'}</span><span>{hasProjects ? '點選建築或標籤預覽 · 從卡片查看作品' : '擴建預定地 · 敬請期待'} <span className={styles.mobileHint}> · 左右滑動地圖</span></span></div>
        </div>
        {hasProjects ? <nav className={styles.projectList} aria-label={`${districtLabel}作品入口`} onPointerEnter={event => { if (event.pointerType === 'mouse') hold('index', true); }} onPointerLeave={() => hold('index', false)}><span className={styles.listTitle}>街區索引 <span>{districtProjects.length}</span></span>{districtProjects.map(project => <button key={project.id} type="button" aria-pressed={selected === project.id} className={selected === project.id ? styles.indexActive : ''} onClick={() => choose(project.id, true)}>{names[project.id] || project.title}<ArrowUpRight size={12} /></button>)}</nav> : <div className={styles.expansionNote}><span>下一個街區，正在準備中。</span><button type="button" onClick={() => switchDistrict('works')}>回作品街區 <ArrowUpRight size={13} /></button></div>}
      </section>
      <PortfolioDetails />
      <footer className={styles.footer}><span>© 2026 YUSUKE</span><span>BUILT WITH CURIOSITY, OPEN TO EXPLORE.</span></footer>
    </main>
  );
}

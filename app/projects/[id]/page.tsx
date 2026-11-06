import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import PortfolioDetails from '../../PortfolioDetails';
import { caseStudies } from '../../data/caseStudies';
import { projects } from '../../data/projects';
import styles from './CaseStudy.module.css';

type Props = { params: Promise<{ id: string }> };

function getStudy(id: string) {
  const study = caseStudies.find(item => item.id === id);
  const project = projects.find(item => item.id === id && item.caseStudy);
  if (!study || !project) notFound();
  return { study, project };
}

export function generateStaticParams() {
  return caseStudies.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { study, project } = getStudy((await params).id);
  return { title: `${project.title}｜專案介紹 · YUSUKE`, description: study.introduction };
}

export default async function ProjectStoryPage({ params }: Props) {
  const { study, project } = getStudy((await params).id);
  const related = projects.filter(item => item.featured && item.caseStudy && item.id !== project.id);
  return <main className={styles.page}>
    <div className={styles.content}>
      <header className={styles.header}><Link href="/#projects" className={styles.back}><ArrowLeft size={16} aria-hidden="true" />回作品街區</Link><a href="#contact" className={styles.contactLink}>關於與聯絡 <ArrowUpRight size={14} aria-hidden="true" /></a></header>
      <article>
        <section className={styles.intro} aria-labelledby="project-title">
          <p className={styles.eyebrow}>{study.discipline} / PROJECT STORY</p>
          <div className={styles.titleRow}><h1 id="project-title">{project.title}</h1><span className={styles.status}>{study.status}</span></div>
          <h2>{study.heading}</h2><p className={styles.lead}>{study.introduction}</p>
          <div className={styles.actions}><a className={styles.primary} href={`/open/${project.id}`} target="_blank" rel="noopener noreferrer">立即體驗 <ArrowUpRight size={17} aria-hidden="true" /></a><a className={styles.secondary} href={study.source.href} target="_blank" rel="noopener noreferrer">{study.source.label}<ArrowUpRight size={15} aria-hidden="true" /></a></div>
        </section>
        <figure className={styles.hero}><div className={styles.heroImage}><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 1100px) 100vw, 1100px" className={styles.preview} priority /></div><figcaption>{project.imageAlt}<span>{project.tags.join(' / ')}</span></figcaption></figure>
        <dl className={styles.facts}>{study.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        <section className={styles.scope} aria-labelledby="scope-title"><div><p className={styles.eyebrow}>01 / SCOPE</p><h2 id="scope-title">這個專案，做了什麼。</h2></div><div><ul>{study.scope.map(item => <li key={item}>{item}</li>)}</ul><p>{study.collaboration}</p></div></section>
        <section className={styles.process} aria-labelledby="process-title"><p className={styles.eyebrow}>02 / DECISIONS</p><h2 id="process-title">問題，與實作選擇。</h2><div>{study.decisions.map((decision, index) => <section key={decision.title} className={styles.decision}><span className={styles.number}>{String(index + 1).padStart(2, '0')}</span><div><h3>{decision.title}</h3><div className={styles.comparison}><div><h4>遇到的問題</h4><p>{decision.problem}</p></div><div><h4>如何處理</h4><p>{decision.approach}</p></div></div></div></section>)}</div></section>
        <section className={styles.outcome} aria-labelledby="outcome-title"><div><p className={styles.eyebrow}>03 / OUTCOME</p><h2 id="outcome-title">目前成果</h2><p>{study.result}</p></div><div><p className={styles.eyebrow}>CURRENT STAGE</p><h2>展示範圍與下一步</h2><p>{study.next}</p></div></section>
        <div className={styles.closing}><p>看過製作過程，也親手試試。</p><a className={styles.primary} href={`/open/${project.id}`} target="_blank" rel="noopener noreferrer">開啟{project.title} <ArrowUpRight size={17} aria-hidden="true" /></a></div>
      </article>
      <nav className={styles.related} aria-label="其他主打專案"><span>繼續看其他專案</span>{related.map(item => <Link key={item.id} href={item.caseStudy!}>{item.title}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}</nav>
      <PortfolioDetails showStudies={false} />
      <footer className={styles.footer}><Link href="/#projects">回作品街區</Link><span>© 2026 YUSUKE</span></footer>
    </div>
  </main>;
}

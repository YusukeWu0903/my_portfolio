import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { creator } from './data/creator';
import { projects } from './data/projects';
import styles from './PortfolioDetails.module.css';

export default function PortfolioDetails({ dark = false, showStudies = true }: { dark?: boolean; showStudies?: boolean }) {
  return (
    <div className={`${styles.details} ${dark ? styles.dark : ''}`}>
      {showStudies && <section className={styles.studies} aria-labelledby="featured-studies-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>SELECTED PROJECT STORIES</p><h2 id="featured-studies-title">作品背後，怎麼做。</h2></div><p>遊戲、選股工具與角色美術，三個不同方向的實作筆記。</p></div>
        <div className={styles.grid}>{projects.filter(project => project.featured && project.caseStudy).map(project => <Link key={project.id} href={project.caseStudy!} className={styles.study}>
          <div className={styles.image}><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 760px) 90vw, 30vw" className={styles.preview} /><span>{project.category === 'games' ? '遊戲開發' : project.category === 'tools' ? '選股分析工具' : '互動角色美術'}</span></div>
          <div className={styles.studyBody}><h3>{project.title}</h3><p>{project.description}</p><span className={styles.read}>專案介紹 <ArrowUpRight size={17} aria-hidden="true" /></span></div>
        </Link>)}</div>
      </section>}
      <section id="contact" aria-labelledby="creator-contact-title" className={styles.contact}>
        <div><p className={styles.eyebrow}>THE PERSON BEHIND THE PROJECTS</p><h2 id="creator-contact-title">{creator.name}<span>從想法，到可以親手體驗的作品。</span></h2><p className={styles.focus}>{creator.focus}</p></div>
        <div className={styles.connect}><p>想看更多開發紀錄，或交流專案想法？</p><a href={creator.github} target="_blank" rel="noopener noreferrer">在 GitHub 找我 <ArrowUpRight size={17} aria-hidden="true" /></a><span>github.com/YusukeWu0903</span></div>
      </section>
    </div>
  );
}

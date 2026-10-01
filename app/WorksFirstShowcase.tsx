'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { PortfolioProject, ProjectCategory } from './data/projects';

const categoryNames: Record<ProjectCategory, string> = {
  games: '遊戲開發',
  tools: '工具開發',
  art: 'AI 美術',
};

const categoryColors: Record<ProjectCategory, string> = {
  games: 'bg-[#FFE500]',
  tools: 'bg-[#00E6A0]',
  art: 'bg-[#D4A5FF]',
};

type Props = { projects: PortfolioProject[] };

export default function WorksFirstShowcase({ projects }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const measure = () => {
      const visible = window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      setVisibleCount(visible);
      setSlideWidth(viewport.clientWidth / visible);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    window.addEventListener('resize', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', update);
    update();
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!projects.length || !slideWidth || hovered || focused || reducedMotion) return;
    const timer = window.setInterval(() => setCurrentIndex(index => index + 1), 5000);
    return () => window.clearInterval(timer);
  }, [projects.length, slideWidth, hovered, focused, reducedMotion]);

  const next = () => {
    if (currentIndex < projects.length) setCurrentIndex(index => index + 1);
  };

  const previous = () => {
    if (currentIndex > 0) {
      setCurrentIndex(index => index - 1);
      return;
    }
    setTransitionEnabled(false);
    setCurrentIndex(projects.length);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTransitionEnabled(true);
      setCurrentIndex(projects.length - 1);
    }));
  };

  const finishSlide = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || currentIndex < projects.length) return;
    setTransitionEnabled(false);
    setCurrentIndex(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setTransitionEnabled(true)));
  };

  const slides = [...projects, ...projects.slice(0, 3)];
  const displayIndex = projects.length ? (currentIndex % projects.length) + 1 : 0;

  return (
    <section
      id="projects"
      className="pt-2"
      aria-label="作品展示"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => setFocused(event.currentTarget.contains(event.relatedTarget))}
    >
      <div className="mb-5 flex flex-col gap-4 md:mb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-neutral-600">YUSUKE / ALL WORKS</p>
          <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">從作品開始認識我。</h1>
          <p className="mt-2 text-sm font-medium text-neutral-700">遊戲、工具與 AI 美術，都可以直接打開體驗。</p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="min-w-16 text-center font-mono text-sm font-bold text-neutral-700" aria-label={`第 ${displayIndex} 個作品，共 ${projects.length} 個`}>
            {String(displayIndex).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <button type="button" onClick={previous} disabled={!projects.length} aria-label="上一個作品" className="grid h-11 w-11 place-items-center rounded-full border-2 border-black bg-white text-black transition-transform hover:-translate-y-0.5 disabled:opacity-40">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={next} disabled={!projects.length} aria-label="下一個作品" className="grid h-11 w-11 place-items-center rounded-full border-2 border-black bg-[#FFE500] text-black transition-transform hover:-translate-y-0.5 disabled:opacity-40">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div>
        <div ref={viewportRef} className="overflow-hidden" aria-roledescription="輪播">
          {projects.length ? (
            <div
              className="flex"
              style={{
                transform: `translate3d(-${currentIndex * slideWidth}px, 0, 0)`,
                transition: transitionEnabled && !reducedMotion ? 'transform 650ms ease-in-out' : 'none',
              }}
              onTransitionEnd={finishSlide}
            >
              {slides.map((project, index) => (
                <div key={`${project.id}-${index}`} className="w-full flex-none px-2 md:w-1/2 xl:w-1/3" aria-hidden={index < currentIndex || index >= currentIndex + visibleCount}>
                  <article className="group h-full overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[5px_5px_0px_#000]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#20232A]">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        loading={index < 3 ? 'eager' : 'lazy'}
                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                        className={`transition-transform duration-500 group-hover:scale-[1.035] ${project.imageFit === 'contain' ? 'object-contain' : 'object-cover'} ${project.imagePosition === 'left' ? 'object-left' : 'object-center'}`}
                      />
                      <span className={`absolute left-4 top-4 rounded-full border-2 border-black px-3 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000] ${categoryColors[project.category]}`}>
                        {categoryNames[project.category]}
                      </span>
                    </div>
                    <div className="flex min-h-52 flex-col p-5">
                      <h2 className="text-xl font-black leading-snug text-black">{project.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-700">{project.description}</p>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" tabIndex={index >= currentIndex && index < currentIndex + visibleCount ? 0 : -1} className="mt-auto inline-flex w-fit items-center gap-2 border-b-2 border-black pt-4 text-sm font-black text-black hover:text-[#5A35B5]">
                        查看作品 <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="作品載入中">
              {[0, 1, 2].map(index => <div key={index} className="aspect-[4/3] animate-pulse rounded-3xl bg-neutral-200" />)}
            </div>
          )}
        </div>
        <p className="mt-5 text-center text-xs font-semibold text-neutral-600">每 5 秒顯示下一個作品 · 滑過或操作時暫停</p>
      </div>
    </section>
  );
}

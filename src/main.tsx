import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Media, Project, moreSocial, projects, skills, steps } from './data';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';
import './redesign.css';
import './refinement.css';
import './final.css';

const asset = '/assets/';
const arrow = <span aria-hidden="true">↗</span>;
const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 26 }, shown: { opacity: 1, y: 0 } };
const softReveal = { hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' }, shown: { opacity: 1, clipPath: 'inset(0 0 0% 0)' } };
const scaleMedia = { hidden: { opacity: 0, scale: .96 }, shown: { opacity: 1, scale: 1 } };
const stagger = { hidden: {}, shown: { transition: { staggerChildren: .13 } } };

const ModalContext = createContext<(media: Media) => void>(() => undefined);

function useSmallScreen() {
  const [small, setSmall] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)');
    const update = () => setSmall(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return small;
}

function useTabletScreen() {
  const [tablet, setTablet] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 761px) and (max-width: 1024px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 761px) and (max-width: 1024px)');
    const update = () => setTablet(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return tablet;
}

function Reveal({ children, className = '', variant = 'fade' }: { children: React.ReactNode; className?: string; variant?: 'fade' | 'clip' | 'scale' }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} variants={variant === 'clip' ? softReveal : variant === 'scale' ? scaleMedia : fadeUp} initial={reduced ? false : 'hidden'} whileInView="shown" viewport={{ once: true, amount: .12 }} transition={{ duration: .68, ease }}>{children}</motion.div>;
}

function ExternalLink({ href, children, className = 'text-link' }: { href: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function ScrollManager() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (hash) {
      let frame = 0;
      let attempts = 0;
      const findTarget = () => {
        const target = document.getElementById(hash.slice(1));
        if (target) target.scrollIntoView();
        else if (attempts++ < 60) frame = requestAnimationFrame(findTarget);
      };
      frame = requestAnimationFrame(findTarget);
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [hash, pathname]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const location = useLocation();
  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
    };
    const onResize = () => { if (window.innerWidth > 900) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (location.pathname !== '/') { setActive(''); return; }
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-15% 0px -56% 0px', threshold: [0, .1, .4] });
    let frame = 0;
    let attempts = 0;
    const observe = () => {
      const elements = ['about', 'education', 'work', 'workflow', 'contact'].map(id => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
      if (elements.length) elements.forEach(el => observer.observe(el));
      else if (attempts++ < 60) frame = requestAnimationFrame(observe);
    };
    observe();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [location.pathname]);
  const links = [['about', 'About'], ['education', 'Education'], ['work', 'Selected work'], ['workflow', 'Process'], ['contact', 'Let’s talk']];
  return <><header className={'header' + (scrolled ? ' is-sticky' : '')}>
    <div className="header-inner">
      <Link className="wordmark" to="/" onClick={() => { if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Nunzia Monaco, torna all’inizio">nunzia monaco<span>.</span></Link>
      <button ref={menuButton} className="menu-button" aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? 'Chiudi −' : 'Menu +'}</button>
      <nav id="navigation" className={'navigation' + (open ? ' open' : '')} aria-label="Navigazione principale">
        {links.map(([id, label]) => <Link key={id} to={'/#' + id} onClick={() => setOpen(false)} className={(id === 'contact' ? 'nav-contact ' : '') + (active === id ? 'active' : '')} aria-current={active === id && location.pathname === '/' ? 'location' : undefined}>{label}{id === 'contact' && arrow}</Link>)}
      </nav>
    </div>
  </header>{open && <button className="menu-backdrop" aria-label="Chiudi menu" onClick={() => setOpen(false)} />}</>;
}

function VideoModal({ media, close }: { media: Media | null; close: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const priorFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!media) return;
    priorFocus.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const dialog = document.querySelector<HTMLElement>('.video-dialog');
        const focusable = [...(dialog?.querySelectorAll<HTMLElement>('button,video,a[href]') ?? [])];
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = previousOverflow; priorFocus.current?.focus(); };
  }, [media, close]);
  return <AnimatePresence>{media && <motion.div className="video-modal" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} onMouseDown={event => { if (event.target === event.currentTarget) close(); }}>
    <motion.div className="video-dialog" role="dialog" aria-modal="true" aria-label={'Video: ' + media.label} initial={{ opacity: 0, y: 14, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .98 }} transition={{ duration: .24, ease }}>
      <div className="modal-top"><span>REEL / {media.label}</span><button ref={closeRef} onClick={close} aria-label="Chiudi video">Chiudi ×</button></div>
      <video src={asset + media.id + '.mp4'} poster={asset + media.id + '.webp'} controls playsInline preload="metadata" aria-label={media.label} />
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

function ParallaxMedia({ media, index = 0 }: { media: Media; index?: number }) {
  const openVideo = useContext(ModalContext);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const small = useSmallScreen();
  const tablet = useTabletScreen();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const amount = index % 3 === 1 ? -20 : index % 3 === 2 ? 12 : 18;
  const y = useTransform(scrollYProgress, [0, 1], [-amount * (tablet ? .5 : 1), amount * (tablet ? .5 : 1)]);
  return <figure ref={ref} className={'media-item' + (media.image ? ' graphic' : '')}>
    <motion.div className="media-motion" style={{ y: reduced || small ? 0 : y }}>
      <Reveal variant="scale" className="media-window">
        {media.image ? <a href={asset + media.id + '.webp'} target="_blank" rel="noopener noreferrer" aria-label={'Apri la grafica: ' + media.label}><img src={asset + media.id + '.webp'} alt={media.label} loading="lazy" width="540" height="960" /><span className="image-expand" aria-hidden="true">↗</span></a>
          : <button className="video-preview" onClick={() => openVideo(media)} aria-label={'Riproduci: ' + media.label}><img src={asset + media.id + '.webp'} alt="" loading="lazy" width="540" height="960" /><span className="play-icon" aria-hidden="true">▶</span><span className="video-label">GUARDA IL REEL <span>↗</span></span></button>}
      </Reveal>
      <figcaption><span>{media.label}</span><span>{media.image ? 'GRAPHIC' : 'REEL · 9:16'}</span></figcaption>
    </motion.div>
  </figure>;
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const small = useSmallScreen();
  const tablet = useTabletScreen();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, tablet ? 18 : 35]);
  const innerY = useTransform(scrollYProgress, [0, 1], [0, tablet ? -12 : -25]);
  const labelY = useTransform(scrollYProgress, [0, 1], [0, tablet ? -7 : -14]);
  return <section className="hero" ref={ref} aria-labelledby="hero-heading">
    <motion.div className="hero-copy" variants={stagger} initial={reduced ? false : 'hidden'} animate="shown">
      <motion.p variants={fadeUp} className="eyebrow"><span className="small-dot" /> SOCIAL MEDIA, WITH INTENTION.</motion.p>
      <h1 id="hero-heading"><span className="title-mask"><motion.span variants={fadeUp}>Nunzia</motion.span></span><span className="title-mask"><motion.span variants={fadeUp}><em>Monaco</em><span className="name-dot">.</span></motion.span></span></h1>
      <motion.h2 variants={fadeUp}>Social Media Manager<br />& Content Creator</motion.h2>
      <motion.p variants={fadeUp} className="hero-description">Creo contenuti social chiari, coerenti e visivamente efficaci, seguendo ogni progetto dalla pianificazione editoriale alla pubblicazione, con particolare attenzione al video editing e alla comunicazione del brand.</motion.p>
      <motion.div variants={fadeUp} className="hero-actions"><Link className="button" to="/#work">Selected work <span>↘</span></Link><Link className="text-link" to="/#contact">Let’s talk {arrow}</Link></motion.div>
      <motion.div variants={fadeUp} className="hero-location"><span>BASED IN NAPLES, ITALY</span><span><i /> Available for hybrid opportunities</span></motion.div>
    </motion.div>
    <motion.div className="hero-visual" style={{ y: reduced || small ? 0 : photoY }} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .16, ease }}>
      <motion.div className="portrait" initial={reduced ? false : { clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.05, delay: .16, ease }}><motion.img style={{ y: reduced || small ? 0 : innerY }} src={asset + 'nunzia.webp'} alt="Nunzia Monaco in un completo azzurro polvere" fetchPriority="high" width="1400" height="933" /></motion.div>
      <motion.div className="portrait-caption" style={{ y: reduced || small ? 0 : labelY }}><span>A creative mind.<br />An editorial eye.</span><span className="asterisk" aria-hidden="true">✳</span></motion.div>
      <span className="photo-index">01 / A LITTLE INTRODUCTION</span>
    </motion.div>
    <motion.div initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .55 }} className="hero-disciplines"><span>AT THE INTERSECTION OF</span><div>Editorial planning <b>✳</b> Video editing <b>✳</b> Social content <b>✳</b> Copywriting</div></motion.div>
  </section>;
}

function About() {
  return <section id="about" className="about section wrap">
    <Reveal className="section-label"><span>01 — ABOUT ME</span><span>STRATEGY MEETS CREATIVITY</span></Reveal>
    <div className="about-grid">
      <div className="about-statement"><h2 className="display"><Reveal variant="clip">Contenuti pensati.</Reveal><Reveal variant="clip"><em>Identità riconoscibili.</em></Reveal></h2><Reveal className="experience"><strong>2<span>+</span></strong><span>YEARS OF<br />EXPERIENCE</span></Reveal><span className="about-side-note">NAPOLI / DIGITAL CONTENT / 2026</span></div>
      <Reveal className="about-text"><p className="lead">Sono Nunzia, Social Media Manager con oltre due anni di esperienza nella gestione di contenuti e piani editoriali per brand appartenenti a settori diversi.</p><p>Mi occupo dell’organizzazione della comunicazione social, del copywriting, della produzione di contenuti e del montaggio video, seguendo il progetto dalla definizione della direzione creativa fino alla programmazione e pubblicazione.</p><p>Ho lavorato principalmente nel settore food, ma anche con realtà appartenenti a mercati tecnici, corporate e lifestyle. Ogni progetto richiede un linguaggio diverso: il mio obiettivo è trovare quello più adatto al brand e trasformarlo in contenuti riconoscibili, coerenti e pensati per i social.</p><div className="sector-pills">{['Food', 'Lifestyle', 'Corporate', 'B2B', 'Niche'].map(item => <span key={item}>{item}</span>)}</div><div className="about-bottom"><span>CREATIVE THINKING, STRUCTURED WORK.</span><span>Naples, Italy ↗</span></div></Reveal>
    </div>
  </section>;
}

function Education() {
  return <section id="education" className="education section wrap" aria-labelledby="education-title">
    <Reveal className="section-label"><span>EDUCATION</span><span>LINGUAGGI / CULTURA / COMUNICAZIONE</span></Reveal>
    <div className="education-layout"><Reveal><h2 id="education-title" className="display">A foundation in <em>communication.</em></h2><p>Un percorso tra linguaggi, cultura e comunicazione che oggi confluisce nel mio lavoro sui contenuti digitali.</p></Reveal><div className="education-list"><Reveal className="education-item"><span>01 / LAUREA TRIENNALE</span><h3>Lingue, culture e letterature moderne europee</h3></Reveal><Reveal className="education-item"><span>02 / LAUREA MAGISTRALE</span><h3>Corporate Communication &amp; Media</h3></Reveal></div></div>
  </section>;
}

function WorkIntro() {
  const [selected, setSelected] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const small = useSmallScreen();
  const tablet = useTabletScreen();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [tablet ? -9 : -18, tablet ? 9 : 18]);
  const project = projects[selected];
  const preview = project.feed ?? project.media[0].id;
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      projects.forEach(item => { const image = new Image(); image.src = asset + (item.feed ?? item.media[0].id) + '.webp'; });
      observer.disconnect();
    }, { rootMargin: '300px 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  return <section id="work" className="work-intro wrap section" ref={ref}>
    <Reveal className="section-label"><span>02 — SELECTED WORK</span><span>FOOD / LIFESTYLE / CORPORATE / B2B</span></Reveal>
    <Reveal className="work-title"><h2 className="display">Selected <em>work.</em></h2><p>Una selezione di progetti, contenuti e formati sviluppati per brand con identità e pubblici differenti.</p></Reveal>
    <div className="work-explorer">
      <nav className="project-index" aria-label="Progetti">{projects.map((p, i) => <a key={p.id} href={'#' + p.id} onMouseEnter={() => setSelected(i)} onFocus={() => setSelected(i)} className={selected === i ? 'selected' : ''}><span>0{i + 1}</span><span className="index-name">{p.name}<small>{p.category}</small></span><img className="index-thumb" src={asset + (p.feed ?? p.media[0].id) + '.webp'} alt="" loading="lazy" width="835" height="746" /><span className="index-arrow">↗</span><span className="index-view">View project ↗</span></a>)}</nav>
      <motion.div className="work-preview" style={{ y: reduced || small ? 0 : y }}><Link to={'/projects/' + project.id} aria-label={'Apri il progetto ' + project.name}><AnimatePresence initial={false}><motion.div key={preview} className="work-preview-slide" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .995 }} transition={{ duration: .35, ease }}><img src={asset + preview + '.webp'} alt={'Feed social di ' + project.name} width="835" height="746" /><span className="preview-label"><span>PROJECT 0{selected + 1} / {project.category}</span><span>{project.name}<small>VIEW PROJECT ↗</small></span></span></motion.div></AnimatePresence></Link></motion.div>
    </div>
  </section>;
}

function SocialLink({ project }: { project: Project }) {
  return project.instagram ? <ExternalLink href={project.instagram} className="social-link">View on Instagram {arrow}</ExternalLink> : null;
}

function FeedVisual({ project, detail = false }: { project: Project; detail?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const small = useSmallScreen();
  const tablet = useTabletScreen();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [tablet ? -8 : -16, tablet ? 8 : 16]);
  if (!project.feed) return null;
  return <figure ref={ref} className={'feed-visual' + (detail ? ' feed-detail' : '')}><motion.div style={{ y: reduced || small ? 0 : y }}><Reveal variant="scale"><a href={asset + project.feed + '.webp'} target="_blank" rel="noopener noreferrer" aria-label={'Apri il feed di ' + project.name}><img src={asset + project.feed + '.webp'} alt={'Selezione di contenuti del feed social di ' + project.name} loading="lazy" width="927" height="827" /></a></Reveal></motion.div><figcaption><span>IL FEED / {project.name}</span><span>UNA VISIONE D’INSIEME ↗</span></figcaption></figure>;
}

function ProjectSection({ project: p, index }: { project: Project; index: number }) {
  return <article className={'project project-' + p.id} id={p.id}><div className="wrap">
    <Reveal className="project-heading"><div><p className="eyebrow">0{index + 1} / {p.category}</p><h3>{p.name}</h3></div><span className="project-arrow" aria-hidden="true">↗</span></Reveal>
    <div className="project-layout"><Reveal className="project-copy"><div className="tags">{p.tags.map(tag => <span key={tag}>{tag}</span>)}</div><p>{p.description}</p><div className="contribution"><span>IL MIO CONTRIBUTO</span><strong>{p.contribution}</strong></div><p className="project-note">{p.note}</p><div className="project-links"><Link className="text-link" to={'/projects/' + p.id}>Esplora il progetto {arrow}</Link><SocialLink project={p} /></div><FeedVisual project={p} /></Reveal><div className={'gallery gallery-' + p.media.length}>{p.media.map((media, i) => <ParallaxMedia media={media} index={i} key={media.id} />)}</div></div>
    {p.id === 'iperboat' && <span className="technical-label" aria-hidden="true">CONTENT / INDUSTRY / B2B — 01</span>}
  </div></article>;
}

function WallTile({ name, category, image, className, href }: { name: string; category: string; image: string; className: string; href?: string }) {
  const destination = href ?? asset + image + '.webp';
  return <Reveal className={'wall-tile ' + className} variant="scale"><a href={destination} target="_blank" rel="noopener noreferrer" aria-label={href ? `Instagram di ${name}` : `Apri la grafica ${name}`}><img src={asset + image + '.webp'} alt={'Contenuti social di ' + name} loading="lazy" width="930" height="827" /><span className="wall-tile-shade" /><span className="wall-tile-copy"><span>{category}</span><strong>{name}</strong><small>{href ? 'Instagram' : 'Graphic content'} ↗</small></span></a></Reveal>;
}

function MoreWork() {
  return <section className="more-work section wrap"><Reveal className="section-label"><span>ALTRI LINGUAGGI, ALTRE STORIE</span><span>MORE WORK — SELECTED CONTENT</span></Reveal><Reveal className="more-heading"><h2 className="display">More <em>perspectives.</em></h2><p>Brand diversi, la stessa attenzione alla coerenza visiva e al messaggio.</p></Reveal>
    <div className="creative-wall"><WallTile name="Gorillas Burger" category="FOOD / SOCIAL CONTENT" image="gorillas-feed" className="wall-gorillas" href={moreSocial[0].instagram} /><WallTile name="Serra Carni" category="FOOD / RETAIL SOCIAL CONTENT" image="serra-feed" className="wall-serra" href={moreSocial[1].instagram} /><WallTile name="Letizia Garden" category="LIFESTYLE / GRAPHIC CONTENT" image="letizia" className="wall-letizia" /><WallTile name="Postural Bed" category="LIFESTYLE / GRAPHIC CONTENT" image="postural" className="wall-postural" /></div>
  </section>;
}

function Workflow() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const small = useSmallScreen();
  const tablet = useTabletScreen();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const starY = useTransform(scrollYProgress, [0, 1], [tablet ? -7.5 : -15, tablet ? 7.5 : 15]);
  useEffect(() => {
    const items = [...(stepsRef.current?.querySelectorAll<HTMLElement>('.step') ?? [])];
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => Math.abs(a.boundingClientRect.top - innerHeight / 2) - Math.abs(b.boundingClientRect.top - innerHeight / 2))[0];
      if (visible) setActive(items.indexOf(visible.target as HTMLElement));
    }, { rootMargin: '-38% 0px -38% 0px', threshold: 0 });
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return <section id="workflow" className="workflow section" ref={sectionRef}><div className="wrap"><Reveal className="section-label"><span>03 — THE PROCESS</span><span>DALL’IDEA ALLA PUBBLICAZIONE</span></Reveal><div className="workflow-layout"><Reveal className="workflow-lead"><h2 className="display">From idea<br /><em>to feed.</em></h2><p className="workflow-intro">Creatività e organizzazione.<br />Un processo chiaro, passo dopo passo.</p><motion.span style={{ y: reduced || small ? 0 : starY }} className="workflow-star" aria-hidden="true">✳</motion.span><div className="process-progress"><span>0{active + 1} / 06</span><div><motion.i animate={{ height: ((active + 1) / 6 * 100) + '%' }} transition={{ duration: .45 }} /></div><span>THE PROCESS</span></div></Reveal><div className="steps" ref={stepsRef}>{steps.map(([name, description], i) => <motion.div className={'step' + (active === i ? ' is-active' : '')} key={name} onMouseEnter={() => setActive(i)} initial={reduced ? false : { opacity: .7, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .5 }}><span className="step-number">0{i + 1}</span><div><h3>{name}</h3><p>{description}</p></div><span aria-hidden="true">↘</span></motion.div>)}</div></div></div></section>;
}

function Skills() {
  const [paused, setPaused] = useState(false);
  return <section className="skills section"><div className="wrap"><Reveal className="section-label"><span>04 — WHAT I DO</span><span>COMPETENZE & STRUMENTI</span></Reveal><Reveal><h2 className="display">What I do<span className="blue">.</span></h2></Reveal><div className="skills-list">{skills.map(([name, description], i) => <Reveal className="skill-row" key={name}><span className="skill-number">0{i + 1}</span><div><h3>{name}</h3><p>{description}</p></div><span className="skill-arrow" aria-hidden="true">↗</span></Reveal>)}</div><div className="tools"><h3>Tools</h3><p>Canva <span>✳</span> Meta Business Suite <span>✳</span> AI-assisted tools</p></div></div><div className="marquee" aria-hidden="true"><div className={paused ? 'paused' : ''}>{[0, 1].map(i => <span key={i}>Ideas into content. <em>Content into connection.</em> Strategy into stories. <em>Stories into attention.</em> ✳&nbsp;</span>)}</div></div><button className="motion-toggle" type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Riprendi animazione' : 'Pausa animazione'} title={paused ? 'Riprendi animazione' : 'Pausa animazione'}>{paused ? '▶' : 'Ⅱ'}</button></section>;
}

function Contact() {
  return <section id="contact" className="contact"><div className="wrap"><div className="section-label"><span>05 — LET’S TALK</span><span><i className="small-dot" /> AVAILABLE FOR HYBRID OPPORTUNITIES</span></div><div className="contact-layout"><Reveal variant="clip"><h2>Let’s create<br />something <em>worth<br className="mobile-break" /> sharing.</em><span className="contact-arrow" aria-hidden="true">↗</span></h2></Reveal><div className="contact-connect"><span>START A CONVERSATION</span><a className="email" href="mailto:monaconunzia97@gmail.com">monaconunzia97@gmail.com {arrow}</a><ExternalLink href="https://www.linkedin.com/in/nunzia-monaco-325aa2274/">LinkedIn {arrow}</ExternalLink><p>Sono disponibile per nuove opportunità professionali, con preferenza per modalità di lavoro ibrida.</p></div></div><div className="contact-meta"><span>NAPLES, ITALY</span><span>Italiano · English · Español</span><a href="#top">Back to top ↑</a></div></div></section>;
}

function Footer() { return <footer className="footer"><div className="wrap footer-inner"><div className="footer-identity"><strong>Nunzia Monaco<span className="blue">.</span></strong><span>Social Media Manager &amp; Content Creator</span></div><div className="footer-links"><a href="mailto:monaconunzia97@gmail.com">Email ↗</a><ExternalLink href="https://www.linkedin.com/in/nunzia-monaco-325aa2274/">LinkedIn ↗</ExternalLink><span>© 2026</span></div></div></footer>; }
function Home() { return <><Hero /><About /><Education /><WorkIntro />{projects.map((p, i) => <ProjectSection project={p} index={i} key={p.id} />)}<MoreWork /><Workflow /><Skills /><Contact /></>; }

function ProjectPage() {
  const { pathname } = useLocation();
  const p = projects.find(item => pathname.endsWith('/' + item.id));
  useEffect(() => { document.title = p ? p.name + ' | Nunzia Monaco' : 'Nunzia Monaco | Social Media Manager & Content Creator'; return () => { document.title = 'Nunzia Monaco | Social Media Manager & Content Creator'; }; }, [p]);
  if (!p) return <section className="wrap section"><h1>Pagina non trovata.</h1><Link className="text-link" to="/">Torna al portfolio ↗</Link></section>;
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return <><section className="detail-intro wrap"><Link className="text-link" to="/#work">← Tutti i progetti</Link><p className="eyebrow">{p.category}</p><h1 className="display">{p.name}</h1><p className="detail-note">{p.note}</p><p className="detail-description">{p.description}</p><div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div><div className="detail-links"><div className="contribution"><span>IL MIO CONTRIBUTO</span><strong>{p.contribution}</strong></div><SocialLink project={p} /></div></section><section className="detail-gallery wrap" aria-label="Contenuti del progetto">{p.media.map((media, i) => <ParallaxMedia key={media.id} index={i} media={media} />)}</section>{p.feed && <div className="detail-feed wrap"><FeedVisual project={p} detail /></div>}<div className="next-project wrap"><span>NEXT PROJECT →</span><Link to={'/projects/' + next.id}>{next.name} {arrow}</Link></div><Contact /></>;
}

function Site() {
  const location = useLocation();
  const [modal, setModal] = useState<Media | null>(null);
  useEffect(() => setModal(null), [location.pathname]);
  return <ModalContext.Provider value={setModal}><ScrollManager /><a className="skip-link" href="#main">Vai al contenuto</a><div id="top" /><Header /><main id="main"><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .24, ease }}><Routes location={location}><Route path="/" element={<Home />} /><Route path="/projects/:id" element={<ProjectPage />} /><Route path="*" element={<ProjectPage />} /></Routes></motion.div></AnimatePresence></main><Footer /><VideoModal media={modal} close={() => setModal(null)} /></ModalContext.Provider>;
}

function App() { return <MotionConfig reducedMotion="user"><BrowserRouter><Site /></BrowserRouter></MotionConfig>; }
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

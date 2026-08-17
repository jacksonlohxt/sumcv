import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  Linkedin,
  Mail,
  Menu,
  Send,
  X,
} from "lucide-react";
import { CONTACT, EDUCATION, EXPERIENCE, FILTERS, PROJECTS, SKILLS } from "./data";
import "./styles.css";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "auto" });

function getRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/work") return { page: "work", path };
  if (path.startsWith("/work/")) {
    const id = path.slice("/work/".length);
    return PROJECTS.some((project) => project.id === id)
      ? { page: "case", id, path }
      : { page: "work", path: "/work" };
  }
  if (path === "/about") return { page: "about", path };
  if (path === "/contact") return { page: "contact", path };
  return { page: "home", path: "/" };
}

function IconArrow({ direction = "right" }) {
  return direction === "left" ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />;
}

function Action({ children, href, onClick, variant = "primary", size = "md", icon, className = "" }) {
  const classes = `button button--${variant} button--${size} ${className}`.trim();
  if (href) {
    return (
      <a className={classes} href={href} onClick={onClick}>
        {children}
        {icon}
      </a>
    );
  }
  return (
    <button className={classes} type="button" onClick={onClick}>
      {children}
      {icon}
    </button>
  );
}

function Badge({ children, tone = "neutral", dot = false }) {
  return (
    <span className={`badge badge--${tone}`}>
      {dot ? <span className="badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

function Tag({ children, selected = false, onClick }) {
  if (onClick) {
    return (
      <button className={`tag ${selected ? "tag--selected" : ""}`} type="button" onClick={onClick} aria-pressed={selected}>
        {children}
      </button>
    );
  }
  return <span className="tag">{children}</span>;
}

function SectionHeading({ overline, title, subtitle, action, titleId }) {
  return (
    <div className="section-heading">
      <div className="section-heading__copy">
        <span className="overline">{overline}</span>
        <h2 id={titleId}>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action ? <div className="section-heading__action">{action}</div> : null}
    </div>
  );
}

function MediaSlot({ label = "Image slot", className = "", caption }) {
  return (
    <figure className={`media-figure ${className}`}>
      <div className="media-slot" role="img" aria-label={`${label}. Real project media will be added later.`}>
        <span className="media-slot__mark" aria-hidden="true">
          +
        </span>
        <span className="media-slot__label">{label}</span>
        <span className="media-slot__note">Future project media</span>
      </div>
      {caption ? <figcaption className="media-caption">{caption}</figcaption> : null}
    </figure>
  );
}

function ProjectCard({ project }) {
  return (
    <a className="project-card" href={`/work/${project.id}`}>
      <div className="project-card__media">
        <MediaSlot label={`${project.kind} image slot`} />
      </div>
      <div className="project-card__content">
        <div className="project-card__title-row">
          <h3>{project.title}</h3>
          <ArrowUpRight className="project-card__arrow" aria-hidden="true" />
        </div>
        <p className="meta project-card__date">{project.date}</p>
        <p className="meta project-card__role">{project.role}</p>
        {project.summary ? <p className="project-card__summary">{project.summary}</p> : null}
        <div className="tag-list" aria-label="Project tools and disciplines">
          {project.tags.slice(0, 4).map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </div>
      </div>
    </a>
  );
}

function StatBlock({ value, label, emphasis = false }) {
  return (
    <div className="stat-block">
      <div className={`stat-block__value ${emphasis ? "stat-block__value--emphasis" : ""}`}>{value}</div>
      <div className="stat-block__label">{label}</div>
    </div>
  );
}

function CountUp({ value, label, emphasis }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const numeric = Number.parseFloat(String(value).replace(/[^0-9.]/g, ""));
    const suffix = String(value).replace(/[0-9.]/g, "");
    if (prefersReducedMotion || Number.isNaN(numeric)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const started = performance.now();
      const duration = 900;
      const tick = (now) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setShown(`${Math.round(numeric * eased)}${suffix}`);
        if (progress < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <div ref={ref}><StatBlock value={shown} label={label} emphasis={emphasis} /></div>;
}

function NavLink({ href, active, children, onNavigate }) {
  const handleClick = (event) => {
    event.preventDefault();
    onNavigate(href);
  };
  return (
    <a className={`nav-link ${active ? "nav-link--active" : ""}`} href={href} onClick={handleClick} aria-current={active ? "page" : undefined}>
      {children}
    </a>
  );
}

function Header({ route, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateFromMenu = (href) => {
    setMenuOpen(false);
    onNavigate(href);
  };

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <div className="nav container">
        <a className="wordmark" href="/" onClick={(event) => { event.preventDefault(); navigateFromMenu("/"); }}>
          <span>Pang Le Xin</span>
          <small>SumCV</small>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav id="primary-navigation" className={`nav__links ${menuOpen ? "nav__links--open" : ""}`} aria-label="Primary navigation">
          <NavLink href="/" active={route.page === "home"} onNavigate={navigateFromMenu}>Home</NavLink>
          <NavLink href="/work" active={route.page === "work" || route.page === "case"} onNavigate={navigateFromMenu}>Work</NavLink>
          <NavLink href="/about" active={route.page === "about"} onNavigate={navigateFromMenu}>About</NavLink>
          <NavLink href="/contact" active={route.page === "contact"} onNavigate={navigateFromMenu}>Contact</NavLink>
          <a className="button button--outline button--sm nav__resume" href="/Pang-Le-Xin-Resume.pdf" download>
            Résumé <Download aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="container footer__top">
        <div>
          <a className="footer__name" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>Pang Le Xin</a>
          <p className="meta footer__descriptor">UI/UX · Immersive media · Singapore</p>
        </div>
        <div className="footer__contact">
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">{CONTACT.linkedinLabel}</a>
          <span className="meta">{CONTACT.phone}</span>
        </div>
      </div>
      <div className="container footer__bottom">
        <span className="meta">© 2026 · built with the SumCV design system</span>
        <button className="text-link text-link--light" type="button" onClick={() => { onNavigate("/"); scrollToTop(); }}>Back to top</button>
      </div>
    </footer>
  );
}

function useReveal(dependency) {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [dependency]);
}

function Hero({ onNavigate }) {
  const heroRef = useRef(null);
  const handlePointerMove = (event) => {
    const element = heroRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = element.getBoundingClientRect();
    element.style.setProperty("--mx", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    element.style.setProperty("--my", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  return (
    <section ref={heroRef} className="hero container" onPointerMove={handlePointerMove}>
      <div className="hero__glow" aria-hidden="true" />
      <Badge tone="accent" dot>Open to UI/UX internships</Badge>
      <h1 className="display display--xl hero__title">
        <span className="hero__line"><span>Interfaces</span></span>
        <span className="hero__line"><span>that</span></span>
        <span className="hero__line"><span><em>hold</em> together</span></span>
      </h1>
      <p className="lead hero__lead">
        I’m Pang Le Xin, a UI/UX and immersive-media designer in Singapore, studying Information Systems at SMU.
        I design AR experiences, game-ready 3D assets and the systems that keep them consistent.
      </p>
      <div className="hero__actions">
        <Action href="/work" onClick={(event) => { event.preventDefault(); onNavigate("/work"); }} icon={<IconArrow />}>See selected work</Action>
        <Action href="/contact" onClick={(event) => { event.preventDefault(); onNavigate("/contact"); }} variant="outline">Get in touch</Action>
      </div>
    </section>
  );
}

function Home({ onNavigate }) {
  useReveal("home");
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <div className="container hero-media-wrap" data-reveal>
        <MediaSlot label="Portfolio hero image slot" caption="Fig. 01 · Future project media will be added here." />
      </div>

      <section className="section container" aria-labelledby="selected-work-title">
        <div data-reveal>
          <SectionHeading
            overline="01 / Work"
            titleId="selected-work-title"
            title="Selected projects"
            subtitle="Four projects across AR, 3D and campaign design."
            action={<a className="text-link" href="/work" onClick={(event) => { event.preventDefault(); onNavigate("/work"); }}>All work <ArrowRight aria-hidden="true" /></a>}
          />
        </div>
        <div className="project-grid project-grid--two">
          {PROJECTS.slice(0, 2).map((project, index) => (
            <div key={project.id} data-reveal style={{ "--reveal-delay": `${index * 90}ms` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </section>

      <section className="section section--grey" aria-labelledby="numbers-title">
        <div className="container">
          <div data-reveal>
            <SectionHeading overline="02 / Numbers" titleId="numbers-title" title="What shipped" subtitle="Outcomes from the work so far." />
          </div>
          <div className="stats-grid">
            <div className="stat-card" data-reveal><CountUp value="9" label="AR experiences designed across 3 products" emphasis /></div>
            <div className="stat-card" data-reveal style={{ "--reveal-delay": "90ms" }}><CountUp value="12" label="Game-ready 3D weapon assets created" /></div>
            <div className="stat-card" data-reveal style={{ "--reveal-delay": "180ms" }}><CountUp value="88K+" label="Instagram views from 18 posts" /></div>
          </div>
        </div>
      </section>

      <section className="section container" aria-labelledby="how-i-work-title">
        <div className="split-layout split-layout--work">
          <div data-reveal>
            <SectionHeading overline="03 / Toolkit" titleId="how-i-work-title" title="How I work" />
            <p className="body-copy">
              Research, flows and wireframes first; then a system – tokens, components and interaction guidelines – so the
              tenth screen costs less than the first. I work between design and production: Figma to Blender to Unreal, and increasingly to code.
            </p>
            <div className="tag-list tag-list--loose" aria-label="Technical skills">
              {SKILLS.Technical.slice(0, 8).map((skill) => <Tag key={skill}>{skill}</Tag>)}
            </div>
          </div>
          <div className="inverse-card" data-reveal style={{ "--reveal-delay": "90ms" }}>
            <span className="overline inverse-card__overline">Currently</span>
            <p className="inverse-card__title">Second-year Information Systems at SMU, designing for the Softball team and looking for a 2027 product-design internship.</p>
            <Action href="/contact" variant="accent" icon={<ArrowUpRight aria-hidden="true" />}>Say hello</Action>
          </div>
        </div>
      </section>
    </>
  );
}

function Work() {
  const [filter, setFilter] = useState(FILTERS[0]);
  const [compact, setCompact] = useState(false);
  useReveal(`work-${filter}-${compact}`);
  const visibleProjects = PROJECTS.filter((project) => filter === FILTERS[0] || project.kind === filter);
  return (
    <section className="section container page-intro" aria-labelledby="work-title">
      <div data-reveal>
        <SectionHeading
          overline="Work"
          title={<span id="work-title">Everything, by <em>discipline</em></span>}
          subtitle="Four projects, 2024 to today."
          action={
            <label className="switch">
              <span>Compact grid</span>
              <input type="checkbox" checked={compact} onChange={(event) => setCompact(event.target.checked)} />
              <span className="switch__track" aria-hidden="true" />
            </label>
          }
        />
      </div>
      <div className="filter-list" aria-label="Filter projects">
        {FILTERS.map((item) => <Tag key={item} selected={filter === item} onClick={() => setFilter(item)}>{item}</Tag>)}
      </div>
      <div className={`project-grid ${compact ? "project-grid--three" : "project-grid--two"}`}>
        {visibleProjects.map((project, index) => (
          <div key={project.id} data-reveal style={{ "--reveal-delay": `${index * 70}ms` }}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Tabs({ items, value, onChange }) {
  const tabRefs = useRef([]);
  const handleKeyDown = (event, index) => {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (index + direction + items.length) % items.length;
    if (direction || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      tabRefs.current[nextIndex]?.focus();
      onChange(items[nextIndex].id);
    }
  };
  return (
    <div className="tabs" role="tablist" aria-label="Case study sections">
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(element) => { tabRefs.current[index] = element; }}
          className={`tabs__tab ${value === item.id ? "tabs__tab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={value === item.id}
          aria-controls={`panel-${item.id}`}
          id={`tab-${item.id}`}
          tabIndex={value === item.id ? 0 : -1}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function CaseStudy({ projectId, onNavigate }) {
  const project = PROJECTS.find((item) => item.id === projectId) || PROJECTS[0];
  const projectIndex = PROJECTS.findIndex((item) => item.id === project.id);
  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];
  const [tab, setTab] = useState("process");
  useReveal(`case-${project.id}-${tab}`);

  return (
    <article className="case-study">
      <div className="container case-study__back" data-reveal>
        <a className="back-link" href="/work" onClick={(event) => { event.preventDefault(); onNavigate("/work"); }}><ArrowLeft aria-hidden="true" /> All work</a>
      </div>
      <header className="container case-study__header" data-reveal>
        <div className="badge-row"><Badge tone="accent">{project.kind}</Badge><Badge>{project.date}</Badge></div>
        <p className="overline case-study__kicker">Case study · selected <em>work</em></p>
        <h1 className="display">{project.title}</h1>
        <p className="lead">{project.summary}</p>
        <p className="meta case-study__role">{project.role}</p>
      </header>
      <div className="container case-study__hero" data-reveal>
        <MediaSlot label={`${project.title} hero image slot`} caption="Fig. 01 · Key screen or render placeholder." />
      </div>
      <section className="section container case-study__details" aria-labelledby="case-details-title">
        <h2 className="sr-only" id="case-details-title">Case study details</h2>
        <div className="case-stats">
          {project.stats.map((stat, index) => <div className="stat-card" key={stat.label} data-reveal><StatBlock value={stat.value} label={stat.label} emphasis={index === 0} /></div>)}
        </div>
        <Tabs
          items={[{ id: "process", label: "Process" }, { id: "outcome", label: "What I did" }, { id: "tools", label: "Tools" }]}
          value={tab}
          onChange={setTab}
        />
        <div className="tab-panel" role="tabpanel" tabIndex="0" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === "process" ? (
            <ol className="detail-list detail-list--ordered">
              {project.process.map((item) => <li key={item}>{item}</li>)}
            </ol>
          ) : null}
          {tab === "outcome" ? (
            <ul className="detail-list">
              {project.bullets.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : null}
          {tab === "tools" ? (
            <div className="tag-list tag-list--loose">{project.tags.map((tool) => <Tag key={tool}>{tool}</Tag>)}</div>
          ) : null}
        </div>
      </section>
      <section className="container detail-media" aria-label="Project media placeholders">
        <MediaSlot label="Project detail image slot" caption="Fig. 02 · Detail media placeholder." />
        <MediaSlot label="Project detail image slot" caption="Fig. 03 · Detail media placeholder." />
      </section>
      <section className="section section--grey next-project" data-reveal>
        <div className="container next-project__inner">
          <div>
            <span className="overline">Next project</span>
            <h2>{nextProject.title}</h2>
            <p className="meta">{nextProject.kind} · {nextProject.date}</p>
          </div>
          <a className="button button--outline" href={`/work/${nextProject.id}`} onClick={(event) => { event.preventDefault(); onNavigate(`/work/${nextProject.id}`); }}>Read case study <ArrowRight aria-hidden="true" /></a>
        </div>
      </section>
    </article>
  );
}

function About({ onNavigate }) {
  useReveal("about");
  return (
    <section className="section container page-intro" aria-labelledby="about-title">
      <div className="split-layout split-layout--about">
        <div data-reveal>
          <h1 id="about-title" className="display">Designer, <em>maker</em>, occasional pitcher</h1>
          <p className="lead">
            I came into product design through immersive media – AR filters, 3D assets, real-time engines – which taught me
            to care about how a thing feels a half-second after you touch it. I now study Information Systems at SMU so the things I design can also be built.
          </p>
          <p className="body-copy">Outside studio hours I run marketing for SMU Softball, shoot club events, and speak at SMU Toastmasters.</p>
          <div className="hero__actions">
            <Action href="/contact" onClick={(event) => { event.preventDefault(); onNavigate("/contact"); }}>Get in touch</Action>
            <a className="button button--outline" href="/Pang-Le-Xin-Resume.pdf" download>Résumé <Download aria-hidden="true" /></a>
          </div>
        </div>
        <div data-reveal style={{ "--reveal-delay": "90ms" }}>
          <MediaSlot label="Portrait image slot" caption="Fig. 01 · Portrait placeholder." className="portrait-slot" />
          <div className="social-links">
            <a className="icon-link" href={`mailto:${CONTACT.email}`} aria-label="Email Pang Le Xin"><Mail aria-hidden="true" /></a>
            <a className="icon-link" href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="Open Pang Le Xin on LinkedIn"><Linkedin aria-hidden="true" /></a>
          </div>
        </div>
      </div>

      <section className="section section--nested" aria-labelledby="experience-title">
        <div data-reveal><SectionHeading overline="Experience" titleId="experience-title" title="Where I’ve worked" /></div>
        <div className="timeline">
          {EXPERIENCE.map((item, index) => (
            <div className="timeline__item" key={item.org} data-reveal style={{ "--reveal-delay": `${index * 70}ms` }}>
              <div className="timeline__date meta">{item.when}</div>
              <div className="timeline__content">
                <h3>{item.org}</h3>
                <p className="meta">{item.title}</p>
                <ul className="detail-list">{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--nested" aria-labelledby="education-title">
        <div data-reveal><SectionHeading overline="Education" titleId="education-title" title="Study" /></div>
        <div className="timeline">
          {EDUCATION.map((item, index) => (
            <div className="timeline__item" key={item.school} data-reveal style={{ "--reveal-delay": `${index * 70}ms` }}>
              <div className="timeline__date meta">{item.when}</div>
              <div className="timeline__content">
                <h3>{item.school}</h3>
                <p>{item.detail}</p>
                {item.notes.length ? <p className="meta">{item.notes.join(" · ")}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--nested" aria-labelledby="skills-title">
        <div data-reveal><SectionHeading overline="Skills & interests" titleId="skills-title" title="Toolkit" /></div>
        <div className="skills-grid">
          {Object.entries(SKILLS).map(([group, skills], index) => (
            <div className="skill-group" key={group} data-reveal style={{ "--reveal-delay": `${index * 70}ms` }}>
              <span className="overline">{group}</span>
              <div className="tag-list tag-list--loose">{skills.map((skill) => <Tag key={skill}>{skill}</Tag>)}</div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const invalidEmail = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (invalidEmail) return;
    setStatus("This MVP form is a preview only and did not send a message. Please email me directly instead.");
  };

  useReveal("contact");
  return (
    <section className="section container contact-page" aria-labelledby="contact-title">
      <div data-reveal>
        <Badge tone="highlight" dot>Contact</Badge>
        <h1 id="contact-title" className="display">Let’s make <em>something</em></h1>
        <p className="lead">Internships, freelance UI work, AR experiments, or a question about immersive media – all welcome.</p>
      </div>
      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit} data-reveal>
          <div className="form-grid">
            <label className="field">
              <span className="field__label">Name</span>
              <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
            </label>
            <label className="field">
              <span className="field__label">Email</span>
              <span className={`field-control ${invalidEmail ? "field-control--invalid" : ""}`}>
                <Mail aria-hidden="true" />
                <input name="email" type="email" autoComplete="email" placeholder="you@studio.com" value={email} onChange={(event) => { setEmail(event.target.value); setStatus(""); }} required aria-invalid={invalidEmail} />
              </span>
              {invalidEmail ? <span className="field__error">That address is missing a valid format.</span> : null}
            </label>
          </div>
          <label className="field">
            <span className="field__label">Type of work</span>
            <span className="field-control field-control--select">
              <select name="type" defaultValue="" required>
                <option value="" disabled>Pick one</option>
                <option>UI/UX design</option>
                <option>AR experience</option>
                <option>3D asset</option>
                <option>Marketing design</option>
                <option>Something else</option>
              </select>
              <span className="select-caret" aria-hidden="true">▾</span>
            </span>
          </label>
          <label className="field">
            <span className="field__label">What are you working on?</span>
            <textarea name="message" rows="5" placeholder="A sentence or two is plenty" required />
          </label>
          <p className="form-note">This is an MVP contact form. No backend is configured, so it will not send or store your message.</p>
          <div className="form-actions">
            <button className="button button--primary button--lg" type="submit">Check message <Send aria-hidden="true" /></button>
            <span className="meta">Or email me directly.</span>
          </div>
          {status ? <p className="form-status" role="status"><Check aria-hidden="true" />{status}</p> : null}
        </form>
        <aside className="contact-direct" data-reveal style={{ "--reveal-delay": "90ms" }} aria-labelledby="direct-title">
          <SectionHeading overline="Direct" titleId="direct-title" title="Elsewhere" />
          <div className="contact-direct__list">
            <a href={`mailto:${CONTACT.email}`}><Mail aria-hidden="true" />{CONTACT.email}</a>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer"><Linkedin aria-hidden="true" />{CONTACT.linkedinLabel}</a>
            <span className="meta">{CONTACT.phone}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRoute());
      scrollToTop();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [route.path]);

  const navigate = (path) => {
    if (path === window.location.pathname) {
      scrollToTop();
      return;
    }
    window.history.pushState({}, "", path);
    setRoute(getRoute());
    scrollToTop();
  };

  let page;
  if (route.page === "work") page = <Work />;
  if (route.page === "case") page = <CaseStudy projectId={route.id} onNavigate={navigate} />;
  if (route.page === "about") page = <About onNavigate={navigate} />;
  if (route.page === "contact") page = <Contact />;
  if (route.page === "home") page = <Home onNavigate={navigate} />;

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      <Header route={route} onNavigate={navigate} />
      <main id="main-content" key={route.path}>{page}</main>
      <Footer onNavigate={navigate} />
    </>
  );
}

if (typeof document !== "undefined") {
  createRoot(document.getElementById("root")).render(<App />);
}

export { getRoute, PROJECTS };
export default App;

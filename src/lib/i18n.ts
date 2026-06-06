// Bilingual content + render helpers for the one-page profile.
// The same render functions are used to server-render the initial HTML
// (in index.astro) and to re-render client-side when the language is toggled,
// so there is a single source of truth for markup.

export type Lang = 'en' | 'de';
export const LANGS: Lang[] = ['en', 'de'];
export const DEFAULT_LANG: Lang = 'en';

interface Role {
  title: string;
  period: string;
  bullets: string[];
}
interface Job {
  company: string;
  location: string;
  url?: string;
  roles: Role[];
}
interface Project {
  name: string;
  url: string;
  role: string;
  period: string;
  bullets: string[];
}
interface Education {
  school: string;
  location: string;
  degree: string;
  period: string;
  bullets: string[];
}
interface SkillGroup {
  label: string;
  items: string[];
}
interface LanguageSkill {
  name: string;
  level?: string;
}

interface SiteData {
  meta: { title: string; description: string };
  ui: {
    downloadCv: string;
    langToggle: string; // label of the language you switch TO
    langToggleAria: string;
    themeToggleAria: string;
    backToTop: string;
  };
  nav: { about: string; experience: string; opensource: string; skills: string; education: string; contact: string };
  hero: { name: string; role: string; tagline: string; location: string };
  sections: {
    about: string;
    experience: string;
    opensource: string;
    skills: string;
    languages: string;
    education: string;
    contact: string;
  };
  about: string[];
  experience: Job[];
  opensource: Project[];
  skills: SkillGroup[];
  languages: LanguageSkill[];
  education: Education[];
  contact: {
    intro: string;
    website: string;
    websiteUrl: string;
    github: string;
    githubUrl: string;
    location: string;
    form: {
      name: string;
      email: string;
      message: string;
      consent: string;
      send: string;
      sending: string;
      success: string;
      error: string;
      privacyLabel: string;
    };
  };
}

const NAME = 'Tareq Jami';

// Self-hosted avatar (downloaded from Gravatar) — no third-party request.
// To refresh it, re-download the Gravatar into public/profile.png.
const AVATAR_URL = '/profile.png';

export const data: Record<Lang, SiteData> = {
  en: {
    meta: {
      title: 'Tareq Jami — Software Engineer',
      description:
        'Tareq Jami, Software Engineer based in Hamburg. Lead Frontend Engineer at Tesla, full-stack developer, and open-source maintainer of ng-openapi.',
    },
    ui: {
      downloadCv: 'Download CV',
      langToggle: 'DE',
      langToggleAria: 'Switch to German',
      themeToggleAria: 'Toggle light/dark theme',
      backToTop: 'Back to top',
    },
    nav: {
      about: 'About',
      experience: 'Experience',
      opensource: 'Open Source',
      skills: 'Skills',
      education: 'Education',
      contact: 'Contact',
    },
    hero: {
      name: NAME,
      role: 'Software Engineer',
      tagline:
        'Lead Frontend Engineer at Tesla, building robust web platforms and open-source tools with Angular, .NET, and the cloud.',
      location: 'Hamburg, Germany',
    },
    sections: {
      about: 'About',
      experience: 'Experience',
      opensource: 'Open Source',
      skills: 'Skills',
      languages: 'Languages',
      education: 'Education',
      contact: 'Contact',
    },
    about: [
      'Software Engineer with 6+ years developing full-stack applications using Angular, .NET, and cloud technologies. Currently driving digital transformation at Tesla.',
      'Open-source maintainer of the ng-openapi library, with proven expertise in frontend architecture, deployment automation, and team mentoring.',
    ],
    experience: [
      {
        company: 'Tesla',
        location: 'Prüm, Germany',
        roles: [
          {
            title: 'Lead Frontend Engineer',
            period: 'Feb 2026 – Present',
            bullets: [
              'Lead frontend architecture and set technical direction across internal tooling projects',
              'Mentor developers and establish frontend standards through code reviews and pair programming',
              'Modernize the codebase with Angular Signals and a reactive, maintainable state architecture',
              'Own planning and prioritization while improving developer experience via tooling and CI pipelines',
            ],
          },
          {
            title: 'Software Engineer',
            period: 'Sep 2024 – Feb 2026',
            bullets: [
              'Led digitalization of internal processes for Tesla Automation worldwide',
              'Developed full-stack solutions with frontend and backend architecture consultation',
              'Conducted requirements analysis and coordinated with stakeholders',
            ],
          },
        ],
      },
      {
        company: 'Jami IT',
        location: 'Hamburg, Germany',
        roles: [
          {
            title: 'Founder & Software Engineer · Freelance',
            period: 'Jun 2024 – Present',
            bullets: [
              'Provide full-stack software development and IT consulting for clients',
              'Deliver custom web and application solutions end to end, from requirements to deployment',
            ],
          },
        ],
      },
      {
        company: 'Public Cloud Group (PCG)',
        location: 'Hamburg, Germany',
        roles: [
          {
            title: 'Software Engineer – Lead Frontend Developer',
            period: 'Sep 2022 – Aug 2024',
            bullets: [
              'Led frontend development initiatives and architectural decisions',
              'Developed cloud-based applications with modern technologies',
              'Implemented CI/CD pipelines and supervised multiple development teams',
            ],
          },
        ],
      },
      {
        company: 'PHÖNIX MAXPOOL Gruppe AG',
        location: 'Hamburg, Germany',
        roles: [
          {
            title: 'Full Stack Developer · Part-time',
            period: 'Oct 2021 – Oct 2023',
            bullets: [
              'Developed frontend/backend applications using Angular and .NET frameworks',
              'Performed system administration, code reviews, and deployment automation',
              'Configured GitLab CI pipelines and provided architecture consulting',
            ],
          },
        ],
      },
      {
        company: 'ETA+ GmbH',
        location: 'Hamburg, Germany',
        roles: [
          {
            title: 'Full Stack Developer',
            period: 'Sep 2020 – Aug 2022',
            bullets: [
              'Built responsive web applications using Angular, TypeScript, and Node.js',
              'Developed backend services with C# .NET, Entity Framework, and MS SQL',
              'Mentored employees and implemented automated deployment pipelines',
            ],
          },
        ],
      },
    ],
    opensource: [
      {
        name: 'ng-openapi',
        url: 'https://ng-openapi.dev',
        role: 'Creator & Maintainer',
        period: 'Jul 2025 – Present',
        bullets: [
          'Angular client-generation library for OpenAPI specifications',
          'Actively maintained project serving developers in the Angular ecosystem',
        ],
      },
    ],
    skills: [
      { label: 'Frontend', items: ['Angular', 'TypeScript / JavaScript', 'Bootstrap', 'Angular Material', 'DevExtreme'] },
      { label: 'Backend', items: ['C# .NET', 'Entity Framework', 'MS SQL', 'Kafka', 'REST APIs', 'GraphQL'] },
      { label: 'DevOps', items: ['Cloud Development', 'Deployment Automation', 'GitLab / GitHub CI/CD'] },
    ],
    languages: [
      { name: 'German', level: 'Native' },
      { name: 'English', level: 'Professional' },
      { name: 'Arabic' },
      { name: 'Persian' },
    ],
    education: [
      {
        school: 'Hochschule Trier',
        location: 'Germany',
        degree: 'Master of Science — Computer Science',
        period: 'Mar 2025 – Present',
        bullets: ['Expected graduation 2028'],
      },
    ],
    contact: {
      intro: "Interested in working together or just want to say hi? I'd love to hear from you.",
      website: 'tareqjami.de',
      websiteUrl: 'https://tareqjami.de',
      github: 'github.com/Mr-Jami',
      githubUrl: 'https://github.com/Mr-Jami',
      location: 'Hamburg, Germany',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        consent:
          'I agree that my details will be stored to process my request',
        send: 'Send message',
        sending: 'Sending…',
        success: 'Thanks! Your message has been sent — I’ll get back to you soon.',
        error: 'Something went wrong. Please try again in a moment.',
        privacyLabel: 'Privacy Policy',
      },
    },
  },

  de: {
    meta: {
      title: 'Tareq Jami — Softwareentwickler',
      description:
        'Tareq Jami, Softwareentwickler aus Hamburg. Leitender Frontend-Entwickler bei Tesla, Full-Stack-Entwickler und Open-Source-Maintainer von ng-openapi.',
    },
    ui: {
      downloadCv: 'Lebenslauf herunterladen',
      langToggle: 'EN',
      langToggleAria: 'Zu Englisch wechseln',
      themeToggleAria: 'Helles/dunkles Design umschalten',
      backToTop: 'Nach oben',
    },
    nav: {
      about: 'Über mich',
      experience: 'Berufserfahrung',
      opensource: 'Open Source',
      skills: 'Kenntnisse',
      education: 'Ausbildung',
      contact: 'Kontakt',
    },
    hero: {
      name: NAME,
      role: 'Softwareentwickler',
      tagline:
        'Leitender Frontend-Entwickler bei Tesla – ich baue robuste Web-Plattformen und Open-Source-Tools mit Angular, .NET und der Cloud.',
      location: 'Hamburg, Deutschland',
    },
    sections: {
      about: 'Über mich',
      experience: 'Berufserfahrung',
      opensource: 'Open Source',
      skills: 'Kenntnisse',
      languages: 'Sprachen',
      education: 'Ausbildung',
      contact: 'Kontakt',
    },
    about: [
      'Softwareentwickler mit über 6 Jahren Erfahrung in der Entwicklung von Full-Stack-Anwendungen mit Angular, .NET und Cloud-Technologien. Treibe aktuell die digitale Transformation bei Tesla voran.',
      'Open-Source-Maintainer der Bibliothek ng-openapi, mit fundierter Expertise in Frontend-Architektur, Deployment-Automatisierung und Team-Mentoring.',
    ],
    experience: [
      {
        company: 'Tesla',
        location: 'Prüm, Deutschland',
        roles: [
          {
            title: 'Leitender Frontend-Entwickler',
            period: 'Feb. 2026 – heute',
            bullets: [
              'Verantworte die Frontend-Architektur und setze die technische Ausrichtung über interne Tooling-Projekte hinweg',
              'Mentoriere Entwickler und etabliere Frontend-Standards durch Code-Reviews und Pair-Programming',
              'Modernisiere die Codebasis mit Angular Signals und einer reaktiven, wartbaren State-Architektur',
              'Verantworte Planung und Priorisierung und verbessere die Developer Experience durch Tooling und CI-Pipelines',
            ],
          },
          {
            title: 'Softwareentwickler',
            period: 'Sept. 2024 – Feb. 2026',
            bullets: [
              'Leitete die Digitalisierung interner Prozesse für Tesla Automation weltweit',
              'Entwickelte Full-Stack-Lösungen inklusive Beratung zu Frontend- und Backend-Architektur',
              'Führte Anforderungsanalysen durch und stimmte mich mit Stakeholdern ab',
            ],
          },
        ],
      },
      {
        company: 'Jami IT',
        location: 'Hamburg, Deutschland',
        roles: [
          {
            title: 'Gründer & Softwareentwickler · Freiberuflich',
            period: 'Juni 2024 – heute',
            bullets: [
              'Biete Full-Stack-Softwareentwicklung und IT-Beratung für Kunden',
              'Liefere maßgeschneiderte Web- und Anwendungslösungen end-to-end, von der Anforderung bis zum Deployment',
            ],
          },
        ],
      },
      {
        company: 'Public Cloud Group (PCG)',
        location: 'Hamburg, Deutschland',
        roles: [
          {
            title: 'Softwareentwickler – Leitender Frontend-Entwickler',
            period: 'Sept. 2022 – Aug. 2024',
            bullets: [
              'Leitete Frontend-Initiativen und traf Architekturentscheidungen',
              'Entwickelte cloudbasierte Anwendungen mit modernen Technologien',
              'Implementierte CI/CD-Pipelines und betreute mehrere Entwicklungsteams',
            ],
          },
        ],
      },
      {
        company: 'PHÖNIX MAXPOOL Gruppe AG',
        location: 'Hamburg, Deutschland',
        roles: [
          {
            title: 'Full-Stack-Entwickler · Teilzeit',
            period: 'Okt. 2021 – Okt. 2023',
            bullets: [
              'Entwickelte Frontend-/Backend-Anwendungen mit Angular und .NET',
              'Übernahm Systemadministration, Code-Reviews und Deployment-Automatisierung',
              'Konfigurierte GitLab-CI-Pipelines und beriet zur Architektur',
            ],
          },
        ],
      },
      {
        company: 'ETA+ GmbH',
        location: 'Hamburg, Deutschland',
        roles: [
          {
            title: 'Full-Stack-Entwickler',
            period: 'Sept. 2020 – Aug. 2022',
            bullets: [
              'Entwickelte responsive Webanwendungen mit Angular, TypeScript und Node.js',
              'Entwickelte Backend-Services mit C# .NET, Entity Framework und MS SQL',
              'Mentorierte Mitarbeitende und implementierte automatisierte Deployment-Pipelines',
            ],
          },
        ],
      },
    ],
    opensource: [
      {
        name: 'ng-openapi',
        url: 'https://ng-openapi.dev',
        role: 'Ersteller & Maintainer',
        period: 'Juli 2025 – heute',
        bullets: [
          'Angular-Bibliothek zur Client-Generierung aus OpenAPI-Spezifikationen',
          'Aktiv gepflegtes Projekt für Entwickler im Angular-Ökosystem',
        ],
      },
    ],
    skills: [
      { label: 'Frontend', items: ['Angular', 'TypeScript / JavaScript', 'Bootstrap', 'Angular Material', 'DevExtreme'] },
      { label: 'Backend', items: ['C# .NET', 'Entity Framework', 'MS SQL', 'Kafka', 'REST APIs', 'GraphQL'] },
      { label: 'DevOps', items: ['Cloud-Entwicklung', 'Deployment-Automatisierung', 'GitLab / GitHub CI/CD'] },
    ],
    languages: [
      { name: 'Deutsch', level: 'Muttersprache' },
      { name: 'Englisch', level: 'Verhandlungssicher' },
      { name: 'Arabisch' },
      { name: 'Persisch' },
    ],
    education: [
      {
        school: 'Hochschule Trier',
        location: 'Deutschland',
        degree: 'Master of Science — Informatik',
        period: 'März 2025 – heute',
        bullets: ['Voraussichtlicher Abschluss 2028'],
      },
    ],
    contact: {
      intro: 'Interesse an einer Zusammenarbeit oder einfach nur Hallo sagen? Ich freue mich, von dir zu hören.',
      website: 'tareqjami.de',
      websiteUrl: 'https://tareqjami.de',
      github: 'github.com/Mr-Jami',
      githubUrl: 'https://github.com/Mr-Jami',
      location: 'Hamburg, Deutschland',
      form: {
        name: 'Name',
        email: 'E-Mail',
        message: 'Nachricht',
        consent:
          'Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden',
        send: 'Nachricht senden',
        sending: 'Wird gesendet…',
        success: 'Danke! Deine Nachricht wurde gesendet – ich melde mich bald.',
        error: 'Etwas ist schiefgelaufen. Bitte versuche es gleich noch einmal.',
        privacyLabel: 'Datenschutzerklärung',
      },
    },
  },
};

// --- helpers -------------------------------------------------------------

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// --- section renderers (return HTML strings) -----------------------------

export function renderHero(d: SiteData): string {
  return `
    <div class="hero-inner">
      <div class="avatar">
        <img class="avatar-img" src="${AVATAR_URL}" alt="${esc(initials(d.hero.name))}" width="92" height="92" loading="eager" decoding="async" />
        <span class="avatar-fallback" aria-hidden="true">${esc(initials(d.hero.name))}</span>
      </div>
      <h1 class="hero-name">${esc(d.hero.name)}</h1>
      <p class="hero-role">${esc(d.hero.role)}</p>
      <p class="hero-tagline">${esc(d.hero.tagline)}</p>
      <p class="hero-location"><span class="ico">📍</span>${esc(d.hero.location)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#contact">${esc(d.nav.contact)}</a>
        <a class="btn btn-ghost" href="/tareq-jami-cv.pdf" download>${esc(d.ui.downloadCv)}</a>
      </div>
    </div>`;
}

export function renderAbout(d: SiteData): string {
  const paras = d.about.map((p) => `<p>${esc(p)}</p>`).join('');
  return `<h2 class="section-title">${esc(d.sections.about)}</h2><div class="prose">${paras}</div>`;
}

export function renderExperience(d: SiteData): string {
  const items = d.experience
    .map((job) => {
      const roles = job.roles
        .map((r) => {
          const bullets = r.bullets.map((b) => `<li>${esc(b)}</li>`).join('');
          return `
            <div class="role">
              <div class="role-head">
                <h4 class="role-title">${esc(r.title)}</h4>
                <span class="role-period">${esc(r.period)}</span>
              </div>
              <ul class="bullets">${bullets}</ul>
            </div>`;
        })
        .join('');
      return `
        <article class="timeline-item">
          <div class="timeline-marker" aria-hidden="true"></div>
          <div class="timeline-body">
            <h3 class="company">${esc(job.company)} <span class="company-loc">· ${esc(job.location)}</span></h3>
            ${roles}
          </div>
        </article>`;
    })
    .join('');
  return `<h2 class="section-title">${esc(d.sections.experience)}</h2><div class="timeline">${items}</div>`;
}

export function renderOpenSource(d: SiteData): string {
  const cards = d.opensource
    .map((p) => {
      const bullets = p.bullets.map((b) => `<li>${esc(b)}</li>`).join('');
      return `
        <article class="card">
          <div class="card-head">
            <h3 class="card-title"><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)} <span class="ext">↗</span></a></h3>
            <span class="role-period">${esc(p.period)}</span>
          </div>
          <p class="card-sub">${esc(p.role)}</p>
          <ul class="bullets">${bullets}</ul>
        </article>`;
    })
    .join('');
  return `<h2 class="section-title">${esc(d.sections.opensource)}</h2><div class="cards">${cards}</div>`;
}

export function renderSkills(d: SiteData): string {
  const groups = d.skills
    .map((g) => {
      const chips = g.items.map((i) => `<li class="chip">${esc(i)}</li>`).join('');
      return `
        <div class="skill-group">
          <h3 class="skill-label">${esc(g.label)}</h3>
          <ul class="chips">${chips}</ul>
        </div>`;
    })
    .join('');
  const langs = d.languages
    .map(
      (l) =>
        `<li class="chip">${esc(l.name)}${l.level ? ` <span class="lvl">${esc(l.level)}</span>` : ''}</li>`,
    )
    .join('');
  return `
    <h2 class="section-title">${esc(d.sections.skills)}</h2>
    <div class="skills">${groups}
      <div class="skill-group">
        <h3 class="skill-label">${esc(d.sections.languages)}</h3>
        <ul class="chips">${langs}</ul>
      </div>
    </div>`;
}

export function renderEducation(d: SiteData): string {
  const items = d.education
    .map((e) => {
      const bullets = e.bullets.map((b) => `<li>${esc(b)}</li>`).join('');
      return `
        <article class="timeline-item">
          <div class="timeline-marker" aria-hidden="true"></div>
          <div class="timeline-body">
            <h3 class="company">${esc(e.school)} <span class="company-loc">· ${esc(e.location)}</span></h3>
            <div class="role">
              <div class="role-head">
                <h4 class="role-title">${esc(e.degree)}</h4>
                <span class="role-period">${esc(e.period)}</span>
              </div>
              <ul class="bullets">${bullets}</ul>
            </div>
          </div>
        </article>`;
    })
    .join('');
  return `<h2 class="section-title">${esc(d.sections.education)}</h2><div class="timeline">${items}</div>`;
}

export function renderContact(d: SiteData): string {
  const f = d.contact.form;
  return `
    <h2 class="section-title">${esc(d.sections.contact)}</h2>
    <p class="prose">${esc(d.contact.intro)}</p>
    <form
      class="contact-form"
      name="contact"
      method="POST"
      action="/success"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p class="hp" aria-hidden="true">
        <label>Leave this field empty <input name="bot-field" tabindex="-1" autocomplete="off" /></label>
      </p>
      <div class="field">
        <label for="cf-name">${esc(f.name)}</label>
        <input id="cf-name" name="name" type="text" required autocomplete="name" />
      </div>
      <div class="field">
        <label for="cf-email">${esc(f.email)}</label>
        <input id="cf-email" name="email" type="email" required autocomplete="email" />
      </div>
      <div class="field">
        <label for="cf-message">${esc(f.message)}</label>
        <textarea id="cf-message" name="message" rows="5" required></textarea>
      </div>
      <label class="consent">
        <input type="checkbox" name="consent" value="yes" required />
        <span>${esc(f.consent)} – <a href="/datenschutz">${esc(f.privacyLabel)}</a></span>
      </label>
      <div class="form-actions">
        <button class="btn btn-primary" type="submit">${esc(f.send)}</button>
      </div>
      <p class="form-status" data-form-status role="status" aria-live="polite" hidden></p>
    </form>`;
}

export function renderNav(d: SiteData): string {
  const links: [string, string][] = [
    ['about', d.nav.about],
    ['experience', d.nav.experience],
    ['opensource', d.nav.opensource],
    ['skills', d.nav.skills],
    ['education', d.nav.education],
    ['contact', d.nav.contact],
  ];
  return links.map(([id, label]) => `<a href="#${id}" class="nav-link">${esc(label)}</a>`).join('');
}

// Render every dynamic region for a language at once.
export function renderAll(lang: Lang): Record<string, string> {
  const d = data[lang];
  return {
    nav: renderNav(d),
    hero: renderHero(d),
    about: renderAbout(d),
    experience: renderExperience(d),
    opensource: renderOpenSource(d),
    skills: renderSkills(d),
    education: renderEducation(d),
    contact: renderContact(d),
  };
}

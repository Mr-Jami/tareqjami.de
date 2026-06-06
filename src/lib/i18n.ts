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

// Social profiles — language-independent, so kept as a single source of truth
// rather than duplicated per locale. Icons are inline brand SVGs (no external
// requests). Email is intentionally omitted in favour of the contact form.
interface Social {
  label: string;
  url: string;
  icon: string;
}

const SOCIAL_ICONS = {
  github:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  medium:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>',
  stackoverflow:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.42 4.798l-.44 2.08 10.473 2.207.44-2.08-10.473-2.206zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.155z"/></svg>',
  discord:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189z"/></svg>',
} as const;

const SOCIALS: Social[] = [
  { label: 'GitHub', url: 'https://github.com/Mr-Jami', icon: SOCIAL_ICONS.github },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/tareqjami', icon: SOCIAL_ICONS.linkedin },
  { label: 'Medium', url: 'https://medium.com/@tareqjami', icon: SOCIAL_ICONS.medium },
  {
    label: 'Stack Overflow',
    url: 'https://stackoverflow.com/users/14259165/t-jami',
    icon: SOCIAL_ICONS.stackoverflow,
  },
  { label: 'Discord', url: 'https://discordapp.com/users/680191868352593938', icon: SOCIAL_ICONS.discord },
];

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
            period: 'Mar 2026 – Present',
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
            title: 'Lead Frontend Engineer',
            period: 'März 2026 – heute',
            bullets: [
              'Leitung der Frontend-Architektur und Festlegung der technischen Ausrichtung über interne Tooling-Projekte hinweg',
              'Mentoring von Entwicklern sowie Etablierung von Frontend-Standards durch Code-Reviews, Pair-Programming und Onboarding',
              'Modernisierung der Codebasis mit Angular Signals und einer reaktiven, wartbaren State-Architektur',
              'Verantwortung für Planung und Priorisierung bei gleichzeitiger Verbesserung der Developer Experience durch Tooling, CI-Pipelines und Build-Optimierung',
            ],
          },
          {
            title: 'Software Engineer',
            period: 'Sept. 2024 – Feb. 2026',
            bullets: [
              'Digitalisierung firmeninterner Prozesse (Tesla Automation weltweit)',
              'Frontend- und Backend-Entwicklung',
              'Beratung zur Frontend-Architektur',
              'Anforderungsanalyse und Abstimmung mit Stakeholdern und Endnutzern',
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
            title: 'Software Engineer – Lead Frontend Developer',
            period: 'Sept. 2022 – Aug. 2024',
            bullets: [
              'Cloud-Entwicklung',
              'Frontend- und Backend-Entwicklung',
              'Bereitstellungsautomatisierung',
              'Projektleitung und Planung',
            ],
          },
        ],
      },
      {
        company: 'PHÖNIX MAXPOOL Gruppe AG',
        location: 'Hamburg, Deutschland',
        roles: [
          {
            title: 'Full Stack Developer · Teilzeit',
            period: 'Okt. 2021 – Okt. 2023',
            bullets: [
              'Frontend- und Backend-Entwicklung (Angular/.NET)',
              'Systemadministration und Codeüberprüfung',
              'GitLab-CI, Bereitstellungsautomatisierung, Serverkonfiguration',
              'Beratung in der Softwarearchitektur',
            ],
          },
        ],
      },
      {
        company: 'ETA+ GmbH',
        location: 'Hamburg, Deutschland',
        roles: [
          {
            title: 'Full Stack Developer',
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

export function renderSocials(): string {
  const items = SOCIALS.map(
    (s) =>
      `<li><a class="social-link" href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}" title="${esc(s.label)}">${s.icon}<span class="social-label">${esc(s.label)}</span></a></li>`,
  ).join('');
  return `<ul class="socials">${items}</ul>`;
}

export function renderContact(d: SiteData): string {
  const f = d.contact.form;
  return `
    <h2 class="section-title">${esc(d.sections.contact)}</h2>
    <p class="prose">${esc(d.contact.intro)}</p>
    ${renderSocials()}
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

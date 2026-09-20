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
interface Talk {
  title: string;
  event: string;
  date: string;
  duration: string;
  url: string;
  image: string;
  description: string;
}
interface Degree {
  degree: string;
  period: string; // empty string hides the date
  bullets: string[];
}
interface Education {
  school: string;
  location: string;
  degrees: Degree[];
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
    cvUrl: string; // per-language PDF built by scripts/build-cv.mjs
    langToggle: string; // label of the language you switch TO
    langToggleAria: string;
    themeToggleAria: string;
    backToTop: string;
    watch: string; // CTA on talk recordings
  };
  nav: {
    about: string;
    experience: string;
    opensource: string;
    talks: string;
    skills: string;
    education: string;
    contact: string;
  };
  hero: { name: string; role: string; tagline: string; location: string };
  sections: {
    about: string;
    experience: string;
    opensource: string;
    talks: string;
    skills: string;
    languages: string;
    education: string;
    contact: string;
  };
  about: string[];
  experience: Job[];
  opensource: Project[];
  talks: Talk[];
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
  youtube:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  medium:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>',
  stackoverflow:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.42 4.798l-.44 2.08 10.473 2.207.44-2.08-10.473-2.206zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.155z"/></svg>',
  discord:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189z"/></svg>',
} as const;

// YouTube channel "Angular Welt" (German-language Angular content).
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@AngularWelt';

// Recorded talks. The recording URL and poster are language-independent; the
// poster is self-hosted (cropped YouTube thumbnail) so the page never loads
// anything from YouTube until the visitor clicks through. The short link
// /talks/strong-types (netlify.toml) forwards to the same recording.
const TALK_STRONG_TYPES = {
  url: 'https://www.youtube.com/watch?v=xdvYpp-MZf4',
  image: '/talks/strong-types-strong-frontends.jpg',
};

const SOCIALS: Social[] = [
  { label: 'GitHub', url: 'https://github.com/Mr-Jami', icon: SOCIAL_ICONS.github },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/tareqjami', icon: SOCIAL_ICONS.linkedin },
  { label: 'YouTube', url: YOUTUBE_CHANNEL_URL, icon: SOCIAL_ICONS.youtube },
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
      title: 'Tareq Jami · Software Engineer',
      description:
        'Tareq Jami, Fullstack Software Engineer based in Hamburg. Lead Frontend Engineer at Tesla Automation, Angular and .NET developer, and open-source maintainer of ng-openapi.',
    },
    ui: {
      downloadCv: 'Download CV',
      cvUrl: '/tareq-jami-cv-en.pdf',
      langToggle: 'DE',
      langToggleAria: 'Switch to German',
      themeToggleAria: 'Toggle light/dark theme',
      backToTop: 'Back to top',
      watch: 'Watch on YouTube',
    },
    nav: {
      about: 'About',
      experience: 'Experience',
      opensource: 'Open Source',
      talks: 'Talks',
      skills: 'Skills',
      education: 'Education',
      contact: 'Contact',
    },
    hero: {
      name: NAME,
      role: 'Fullstack Software Engineer',
      tagline:
        'Lead Frontend Engineer at Tesla, building robust web platforms and open-source tools with Angular, .NET, and the cloud.',
      location: 'Hamburg, Germany',
    },
    sections: {
      about: 'About',
      experience: 'Experience',
      opensource: 'Open Source',
      talks: 'Talks',
      skills: 'Skills',
      languages: 'Languages',
      education: 'Education',
      contact: 'Contact',
    },
    about: [
      'Fullstack Software Engineer with six years of experience building scalable web applications with Angular/TypeScript and C#/.NET. Currently Lead Frontend Engineer at Tesla Automation, responsible for the architecture and technical direction of internal tooling projects.',
      'Focus on RESTful APIs, relational data modelling, CI/CD and cloud (Azure, AWS, Docker, Kubernetes, Terraform). Creator and maintainer of the open-source library ng-openapi with 10,000+ npm downloads per month. Quality-minded through code reviews, automated testing and mentoring; regularly gives training sessions and talks for developers.',
    ],
    experience: [
      {
        company: 'Tesla Automation',
        location: 'Prüm, Germany',
        roles: [
          {
            title: 'Lead Frontend Engineer',
            period: 'Mar 2026 - Present',
            bullets: [
              'Own the architecture and technical direction of several internal tooling projects',
              'Mentor the team; established frontend standards through code reviews and pair programming',
              'Design and deliver internal training sessions for developers',
              'Modernize the codebase with Angular Signals and a reactive, maintainable state model',
              'Plan and prioritize projects; improve developer experience through tooling and CI pipelines',
            ],
          },
          {
            title: 'Software Engineer',
            period: 'Sep 2024 - Feb 2026',
            bullets: [
              'Led an internal digitalization project that is used internationally across Tesla Automation',
              'Developed full-stack solutions (Angular/TypeScript, C#/.NET, REST APIs) and made the key architectural decisions for frontend and backend',
              'Requirements analysis and close coordination with stakeholders and end users at international sites',
            ],
          },
        ],
      },
      {
        company: 'Public Cloud Group (PCG)',
        location: 'Hamburg, Germany',
        roles: [
          {
            title: 'Software Engineer · Lead Frontend Developer',
            period: 'Sep 2022 - Aug 2024',
            bullets: [
              'Technical lead and technical project management (TPM) for a development team in client projects: team coordination, client meetings and project alignment',
              'Lead frontend development with Angular and React; architecture design and alignment; code reviews',
              'Serverless architectures on AWS with Terraform (Infrastructure as Code); backend with C#/.NET and Node.js',
              'Mentored junior developers; onboarded and trained new team members',
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
            period: 'Oct 2021 - Oct 2023',
            bullets: [
              'Frontend and backend development with Angular and C#/.NET',
              'System administration, code reviews and deployment automation',
              'Configured GitLab CI pipelines and servers; software architecture consulting',
            ],
          },
        ],
      },
      {
        company: 'ETA+ GmbH',
        location: 'Hamburg, Germany (from Jan 2022 FESforward GmbH, part of ETA+)',
        roles: [
          {
            title: 'Full Stack Developer',
            period: 'Sep 2020 - Aug 2022',
            bullets: [
              'Energy monitoring platform (smart building) and custom software for business clients: Angular, .NET 5/6, EF Core, MS SQL Server, SignalR',
              'Automated deployment processes and pipelines with GitLab CI/CD; cloud services on Azure and AWS',
              'Client meetings and project alignment; onboarded new team members in frontend and backend',
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
        period: 'Jul 2025 - Present',
        bullets: [
          'Angular-first OpenAPI client generator: type-safe Angular services, models and validation schemas straight from OpenAPI specifications',
          '10,000+ npm downloads per month and 70+ GitHub stars; plugin system (Zod, httpResource), multi-client architecture, HTTP interceptors',
          'Nx monorepo with a Vitest test suite, ESLint/Prettier, GitHub Actions CI and automated releases (release-please, npm publishing)',
        ],
      },
      {
        name: 'Simple Shot Timer',
        url: '/apps/simpleshottimer',
        role: 'Flutter app · Google Play',
        period: 'May 2026 - Present',
        bullets: [
          'Shot timer for sport shooters: microphone shot detection, par drills, splits, local SQLite persistence and CSV export',
          'No ads, no tracking',
        ],
      },
    ],
    talks: [
      {
        ...TALK_STRONG_TYPES,
        title: 'Strong Types, Strong Frontends',
        event: 'HH.js Meetup · Hamburg',
        date: 'Sep 2025',
        duration: '22 min',
        description:
          'How generated, typed API clients keep an Angular frontend in step with its backend: generating clients from OpenAPI specs, and a look at ng-openapi, Hey API and OpenAPI Generator.',
      },
    ],
    skills: [
      { label: 'Frontend', items: ['Angular', 'TypeScript', 'RxJS', 'Astro', 'DevExtreme', 'Angular Material', 'AG Grid', 'Bootstrap'] },
      { label: 'Backend', items: ['C# .NET', 'Entity Framework', 'Node.js', 'NestJS', 'GraphQL'] },
      { label: 'APIs & Integration', items: ['REST APIs', 'OpenAPI / Swagger', 'HTTP Interceptors', 'Zod', 'Kafka'] },
      { label: 'Databases', items: ['MS SQL Server', 'PostgreSQL', 'SQLite', 'Redis', 'Prisma', 'Data Modelling'] },
      { label: 'DevOps & Cloud', items: ['Azure', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Git', 'GitLab CI/CD', 'GitHub Actions', 'Deployment Automation'] },
      { label: 'Testing & Quality', items: ['Vitest', 'Playwright', '.NET Unit Tests', 'Code Reviews', 'Pair Programming', 'ESLint / Prettier', 'Software Architecture', 'Mentoring'] },
      { label: 'AI Development', items: ['Claude Code', 'MCP', 'Skills Development', 'Consulting'] },
      { label: 'Mobile & More', items: ['Flutter / Dart', 'Nx Monorepos'] },
    ],
    languages: [
      { name: 'German', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'Arabic' },
      { name: 'Persian' },
    ],
    education: [
      {
        school: 'Hochschule Trier',
        location: 'Trier, Germany',
        degrees: [
          {
            degree: 'Master of Science, Computer Science',
            period: 'Mar 2025 - Present',
            bullets: ['Expected graduation 2028, alongside full-time work'],
          },
          {
            degree: 'Diploma of Advanced Studies (DAS), Computer Science',
            period: 'Mar 2025 - Jan 2026',
            bullets: [],
          },
        ],
      },
      {
        school: 'Vocational training',
        location: 'IHK qualification',
        degrees: [
          {
            degree: 'IT Specialist for Application Development (Fachinformatiker für Anwendungsentwicklung)',
            period: '',
            bullets: [],
          },
        ],
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
        success: 'Thanks! Your message has been sent. I’ll get back to you soon.',
        error: 'Something went wrong. Please try again in a moment.',
        privacyLabel: 'Privacy Policy',
      },
    },
  },

  de: {
    meta: {
      title: 'Tareq Jami · Softwareentwickler',
      description:
        'Tareq Jami, Fullstack Software Engineer aus Hamburg. Lead Frontend Engineer bei Tesla Automation, Angular- und .NET-Entwickler und Open-Source-Maintainer von ng-openapi.',
    },
    ui: {
      downloadCv: 'Lebenslauf herunterladen',
      cvUrl: '/tareq-jami-cv-de.pdf',
      langToggle: 'EN',
      langToggleAria: 'Zu Englisch wechseln',
      themeToggleAria: 'Helles/dunkles Design umschalten',
      backToTop: 'Nach oben',
      watch: 'Auf YouTube ansehen',
    },
    nav: {
      about: 'Über mich',
      experience: 'Berufserfahrung',
      opensource: 'Open Source',
      talks: 'Vorträge',
      skills: 'Kenntnisse',
      education: 'Ausbildung',
      contact: 'Kontakt',
    },
    hero: {
      name: NAME,
      role: 'Fullstack Software Engineer',
      tagline:
        'Lead Frontend Engineer bei Tesla – ich baue robuste Web-Plattformen und Open-Source-Tools mit Angular, .NET und der Cloud.',
      location: 'Hamburg, Deutschland',
    },
    sections: {
      about: 'Über mich',
      experience: 'Berufserfahrung',
      opensource: 'Open Source',
      talks: 'Vorträge',
      skills: 'Kenntnisse',
      languages: 'Sprachen',
      education: 'Ausbildung',
      contact: 'Kontakt',
    },
    about: [
      'Fullstack Software Engineer mit sechs Jahren Erfahrung in der Entwicklung skalierbarer Webanwendungen mit Angular/TypeScript und C#/.NET. Aktuell Lead Frontend Engineer bei Tesla Automation, verantwortlich für Architektur und technische Ausrichtung interner Tooling-Projekte.',
      'Schwerpunkte: RESTful APIs, relationale Datenmodellierung, CI/CD und Cloud (Azure, AWS, Docker, Kubernetes, Terraform). Creator und Maintainer der Open-Source-Bibliothek ng-openapi mit über 10.000 npm-Downloads pro Monat. Qualitätsbewusst durch Code Reviews, automatisiertes Testing und Mentoring; regelmäßig Schulungen und Vorträge für Entwicklerinnen und Entwickler.',
    ],
    experience: [
      {
        company: 'Tesla Automation',
        location: 'Prüm, Deutschland',
        roles: [
          {
            title: 'Lead Frontend Engineer',
            period: 'März 2026 - heute',
            bullets: [
              'Verantwortung für Architektur und technische Ausrichtung mehrerer interner Tooling-Projekte',
              'Mentoring des Teams; Frontend-Standards durch Code Reviews und Pair Programming etabliert',
              'Interne Schulungen für Entwicklerinnen und Entwickler konzipiert und gehalten',
              'Modernisierung der Codebasis mit Angular Signals und einem reaktiven, wartbaren State-Management',
              'Projektplanung und -priorisierung; bessere Developer Experience durch Tooling und CI-Pipelines',
            ],
          },
          {
            title: 'Software Engineer',
            period: 'Sept. 2024 - Feb. 2026',
            bullets: [
              'Leitung eines internen Digitalisierungsprojekts mit internationalem Einsatz bei Tesla Automation',
              'Entwicklung von Fullstack-Lösungen (Angular/TypeScript, C#/.NET, REST-APIs) mit Verantwortung für die wesentlichen Architekturentscheidungen in Frontend und Backend',
              'Anforderungsanalyse und enge Abstimmung mit Stakeholdern und Endnutzern an internationalen Standorten',
            ],
          },
        ],
      },
      {
        company: 'Public Cloud Group (PCG)',
        location: 'Hamburg, Deutschland',
        roles: [
          {
            title: 'Software Engineer · Lead Frontend Developer',
            period: 'Sept. 2022 - Aug. 2024',
            bullets: [
              'Technical Lead und technisches Projektmanagement (TPM) für ein Entwicklungsteam in Kundenprojekten: Teamkoordination, Kundengespräche und Projektabstimmungen',
              'Lead-Frontend-Entwicklung mit Angular und React; Architekturdesign und -abstimmung; Code Reviews',
              'Serverless-Architekturen auf AWS mit Terraform (Infrastructure as Code); Backend mit C#/.NET und Node.js',
              'Mentoring von Junior-Entwicklern; Onboarding und Schulung neuer Mitarbeitender',
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
            period: 'Okt. 2021 - Okt. 2023',
            bullets: [
              'Frontend- und Backend-Entwicklung mit Angular und C#/.NET',
              'Systemadministration, Code Reviews und Deployment-Automatisierung',
              'Konfiguration von GitLab-CI-Pipelines und Servern; Beratung zur Softwarearchitektur',
            ],
          },
        ],
      },
      {
        company: 'ETA+ GmbH',
        location: 'Hamburg, Deutschland (ab Jan. 2022 FESforward GmbH, Teil der ETA+)',
        roles: [
          {
            title: 'Full Stack Developer',
            period: 'Sept. 2020 - Aug. 2022',
            bullets: [
              'Energie-Monitoring-Plattform (Smart Building) und Individualsoftware für Geschäftskunden: Angular, .NET 5/6, EF Core, MS SQL Server, SignalR',
              'Deployment-Prozesse und Pipelines mit GitLab CI/CD automatisiert; Cloud-Services auf Azure und AWS',
              'Kundengespräche und Projektabstimmungen; Einarbeitung neuer Mitarbeitender in Frontend und Backend',
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
        period: 'Juli 2025 - heute',
        bullets: [
          'Angular-first OpenAPI-Client-Generator: erzeugt typsichere Angular-Services, Modelle und Validierungsschemas direkt aus OpenAPI-Spezifikationen',
          'Über 10.000 npm-Downloads pro Monat und 70+ GitHub-Stars; Plugin-System (Zod, httpResource), Multi-Client-Architektur, HTTP-Interceptors',
          'Nx-Monorepo mit Vitest-Testsuite, ESLint/Prettier, GitHub-Actions-CI und automatisierten Releases (release-please, npm-Publishing)',
        ],
      },
      {
        name: 'Simple Shot Timer',
        url: '/apps/simpleshottimer',
        role: 'Flutter-App · Google Play',
        period: 'Mai 2026 - heute',
        bullets: [
          'Shot-Timer für Sportschützen: Schusserkennung über das Mikrofon, Par-Drills, Splits, lokale SQLite-Persistenz und CSV-Export',
          'Ohne Werbung und Tracking',
        ],
      },
    ],
    talks: [
      {
        ...TALK_STRONG_TYPES,
        title: 'Strong Types, Strong Frontends',
        event: 'HH.js Meetup · Hamburg',
        date: 'Sept. 2025',
        duration: '22 Min.',
        description:
          'Wie generierte, typisierte API-Clients ein Angular-Frontend mit dem Backend im Gleichschritt halten: Client-Generierung aus OpenAPI-Spezifikationen und ein Blick auf ng-openapi, Hey API und OpenAPI Generator.',
      },
    ],
    skills: [
      { label: 'Frontend', items: ['Angular', 'TypeScript', 'RxJS', 'Astro', 'DevExtreme', 'Angular Material', 'AG Grid', 'Bootstrap'] },
      { label: 'Backend', items: ['C# .NET', 'Entity Framework', 'Node.js', 'NestJS', 'GraphQL'] },
      { label: 'APIs & Integration', items: ['REST-APIs', 'OpenAPI / Swagger', 'HTTP-Interceptors', 'Zod', 'Kafka'] },
      { label: 'Datenbanken', items: ['MS SQL Server', 'PostgreSQL', 'SQLite', 'Redis', 'Prisma', 'Datenmodellierung'] },
      { label: 'DevOps & Cloud', items: ['Azure', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Git', 'GitLab CI/CD', 'GitHub Actions', 'Deployment-Automatisierung'] },
      { label: 'Testing & Qualität', items: ['Vitest', 'Playwright', '.NET Unit-Tests', 'Code Reviews', 'Pair Programming', 'ESLint / Prettier', 'Softwarearchitektur', 'Mentoring'] },
      { label: 'KI-Entwicklung', items: ['Claude Code', 'MCP', 'Skills-Entwicklung', 'Beratung'] },
      { label: 'Mobile & Weitere', items: ['Flutter / Dart', 'Nx-Monorepos'] },
    ],
    languages: [
      { name: 'Deutsch', level: 'Muttersprache' },
      { name: 'Englisch', level: 'Fließend' },
      { name: 'Arabisch' },
      { name: 'Persisch' },
    ],
    education: [
      {
        school: 'Hochschule Trier',
        location: 'Trier, Deutschland',
        degrees: [
          {
            degree: 'Master of Science, Informatik',
            period: 'März 2025 - heute',
            bullets: ['Voraussichtlicher Abschluss 2028; Studium parallel zur Berufstätigkeit'],
          },
          {
            degree: 'Diploma of Advanced Studies (DAS), Informatik',
            period: 'März 2025 - Jan. 2026',
            bullets: [],
          },
        ],
      },
      {
        school: 'Berufsausbildung',
        location: 'IHK-Abschluss',
        degrees: [
          {
            degree: 'Fachinformatiker für Anwendungsentwicklung',
            period: '',
            bullets: [],
          },
        ],
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
        success: 'Danke! Deine Nachricht wurde gesendet - ich melde mich bald.',
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
      <div class="hero-copy">
        <p class="hero-eyebrow" data-animate="hero">${esc(d.hero.role)} · ${esc(d.hero.location)}</p>
        <h1 class="hero-name" data-split data-animate="hero">${esc(d.hero.name)}</h1>
        <p class="hero-tagline" data-animate="hero">${esc(d.hero.tagline)}</p>
        <div class="hero-actions" data-animate="hero">
          <a class="btn btn-primary" data-magnetic href="#contact">${esc(d.nav.contact)}</a>
          <a class="btn btn-ghost" data-magnetic href="${esc(d.ui.cvUrl)}" download>${esc(d.ui.downloadCv)}</a>
        </div>
      </div>
      <div class="hero-visual" data-animate="hero">
        <div class="avatar-frame">
          <svg class="avatar-ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
            <circle class="ring-base" cx="100" cy="100" r="97" />
            <circle class="ring-dash" cx="100" cy="100" r="97" />
          </svg>
          <div class="avatar">
            <img class="avatar-img" src="${AVATAR_URL}" alt="${esc(d.hero.name)}" width="220" height="220" loading="eager" decoding="async" />
            <span class="avatar-fallback" aria-hidden="true">${esc(initials(d.hero.name))}</span>
          </div>
        </div>
      </div>
    </div>`;
}

export function renderAbout(d: SiteData): string {
  const paras = d.about
    .map((p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${esc(p)}</p>`)
    .join('');
  return `<h2 class="section-title" data-animate="title">${esc(d.sections.about)}</h2><div class="prose about-prose" data-animate="rise">${paras}</div>`;
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
      // Companies with their own site link out; the rest stay plain text.
      const company = job.url
        ? `<a class="company-link" href="${esc(job.url)}" target="_blank" rel="noopener">${esc(job.company)} <span class="ext">↗</span></a>`
        : esc(job.company);
      return `
        <article class="timeline-item" data-animate="tl">
          <div class="timeline-line" aria-hidden="true"></div>
          <div class="timeline-marker" aria-hidden="true"></div>
          <div class="timeline-body">
            <h3 class="company">${company} <span class="company-loc">· ${esc(job.location)}</span></h3>
            ${roles}
          </div>
        </article>`;
    })
    .join('');
  return `<h2 class="section-title" data-animate="title">${esc(d.sections.experience)}</h2><div class="timeline">${items}</div>`;
}

export function renderOpenSource(d: SiteData): string {
  const cards = d.opensource
    .map((p) => {
      const bullets = p.bullets.map((b) => `<li>${esc(b)}</li>`).join('');
      return `
        <article class="os-card" data-animate="rise" data-tilt>
          <div class="card-head">
            <h3 class="card-title"><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)} <span class="ext">↗</span></a></h3>
            <span class="role-period">${esc(p.period)}</span>
          </div>
          <p class="card-sub">${esc(p.role)}</p>
          <ul class="bullets">${bullets}</ul>
        </article>`;
    })
    .join('');
  return `<h2 class="section-title" data-animate="title">${esc(d.sections.opensource)}</h2><div class="cards">${cards}</div>`;
}

export function renderTalks(d: SiteData): string {
  const cards = d.talks
    .map((t) => {
      const meta = [t.event, t.date, t.duration].map(esc).join(' · ');
      const alt = `${t.title} · ${t.event}`;
      // The poster duplicates the title link, so it is taken out of the tab
      // order and the accessibility tree; keyboard users get the title + CTA.
      return `
        <article class="os-card talk-card" data-animate="rise" data-tilt>
          <a class="talk-poster" href="${esc(t.url)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">
            <img src="${esc(t.image)}" alt="${esc(alt)}" width="640" height="360" loading="lazy" decoding="async" />
            <span class="play"><svg viewBox="0 0 24 24" width="22" height="22" focusable="false"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg></span>
          </a>
          <div class="talk-body">
            <p class="card-sub">${meta}</p>
            <h3 class="card-title"><a href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.title)} <span class="ext">↗</span></a></h3>
            <p class="talk-desc">${esc(t.description)}</p>
            <a class="btn btn-ghost" data-magnetic href="${esc(t.url)}" target="_blank" rel="noopener">${esc(d.ui.watch)} <span class="ext">↗</span></a>
          </div>
        </article>`;
    })
    .join('');
  return `<h2 class="section-title" data-animate="title">${esc(d.sections.talks)}</h2><div class="cards">${cards}</div>`;
}

export function renderSkills(d: SiteData): string {
  const groups = d.skills
    .map((g) => {
      const chips = g.items.map((i) => `<li class="chip">${esc(i)}</li>`).join('');
      return `
        <div class="skill-group" data-animate="rise">
          <h3 class="skill-label">${esc(g.label)}</h3>
          <ul class="chips" data-stagger>${chips}</ul>
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
    <h2 class="section-title" data-animate="title">${esc(d.sections.skills)}</h2>
    <div class="skills">${groups}
      <div class="skill-group" data-animate="rise">
        <h3 class="skill-label">${esc(d.sections.languages)}</h3>
        <ul class="chips" data-stagger>${langs}</ul>
      </div>
    </div>`;
}

export function renderEducation(d: SiteData): string {
  // Same markup as experience roles, so several degrees group under one school.
  const items = d.education
    .map((e) => {
      const degrees = e.degrees
        .map((g) => {
          const bullets = g.bullets.length
            ? `<ul class="bullets">${g.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`
            : '';
          const period = g.period ? `<span class="role-period">${esc(g.period)}</span>` : '';
          return `
            <div class="role">
              <div class="role-head">
                <h4 class="role-title">${esc(g.degree)}</h4>
                ${period}
              </div>
              ${bullets}
            </div>`;
        })
        .join('');
      return `
        <article class="edu-panel" data-animate="rise">
          <h3 class="company">${esc(e.school)} <span class="company-loc">· ${esc(e.location)}</span></h3>
          ${degrees}
        </article>`;
    })
    .join('');
  return `<h2 class="section-title" data-animate="title">${esc(d.sections.education)}</h2><div class="cards">${items}</div>`;
}

export function renderSocials(): string {
  const items = SOCIALS.map(
    (s) =>
      `<li><a class="social-link" href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}" title="${esc(s.label)}">${s.icon}<span class="social-label">${esc(s.label)}</span></a></li>`,
  ).join('');
  return `<ul class="socials" data-stagger>${items}</ul>`;
}

export function renderContact(d: SiteData): string {
  const f = d.contact.form;
  return `
    <h2 class="section-title" data-animate="title">${esc(d.sections.contact)}</h2>
    <div class="contact-grid">
    <div class="contact-side" data-animate="rise">
    <p class="contact-intro">${esc(d.contact.intro)}</p>
    ${renderSocials()}
    </div>
    <form
      data-animate="rise"
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
        <span>${esc(f.consent)} (<a href="/datenschutz">${esc(f.privacyLabel)}</a>)</span>
      </label>
      <div class="form-actions">
        <button class="btn btn-primary" type="submit">${esc(f.send)}</button>
      </div>
      <p class="form-status" data-form-status role="status" aria-live="polite" hidden></p>
    </form>
    </div>`;
}

export function renderNav(d: SiteData): string {
  const links: [string, string][] = [
    ['about', d.nav.about],
    ['experience', d.nav.experience],
    ['opensource', d.nav.opensource],
    ['talks', d.nav.talks],
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
    talks: renderTalks(d),
    skills: renderSkills(d),
    education: renderEducation(d),
    contact: renderContact(d),
  };
}

// Builds the downloadable CVs (public/tareq-jami-cv-en.pdf, -de.pdf) from the
// same data that renders the homepage (src/lib/i18n.ts), so the PDF can never
// drift from the site. Run locally with `npm run cv` — it prints the HTML with
// Microsoft Edge headless, which is why it is not part of the Netlify build.
//
// Layout: A4, black and white, serif, letter-spaced caps section titles,
// grouped roles, three-column skills grid (the established CV design).

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { data, LANGS } from '../src/lib/i18n.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_HTML = resolve(ROOT, '.cache/cv'); // gitignored scratch for the intermediate HTML
const OUT_PDF = resolve(ROOT, 'public');
const SITE = 'https://tareqjami.de';

// CV-only details that the site deliberately does not show (the site uses a
// contact form instead of a mailto link).
const CONTACT = { email: 'info@jami-it.de', website: 'tareqjami.de' };

// The few labels a CV needs that have no counterpart on the site.
const LABELS = {
  en: { title: 'Tareq Jami – CV', profile: 'Profile', projects: 'Open Source & Projects', qualifications: 'Education & Qualifications', recording: 'Recording' },
  de: { title: 'Tareq Jami – Lebenslauf', profile: 'Profil', projects: 'Open Source & Projekte', qualifications: 'Ausbildung & Qualifikationen', recording: 'Aufzeichnung' },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dash = (period) => esc(period.replace(/ - /g, ' – '));
const absUrl = (url) => (url.startsWith('/') ? SITE + url : url);
const linkText = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

const bullets = (items) => (items.length ? `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '');

function role(title, period, items) {
  return `<div class="role">
        <div class="role-head"><span class="title">${title}</span><span class="date">${dash(period)}</span></div>
        ${bullets(items)}
      </div>`;
}

// One employer / school: a single role stands alone, several are grouped
// behind a thin vertical bar.
function entry(org, loc, roles) {
  const body = roles.length > 1 ? `<div class="group">${roles.join('')}</div>` : roles.join('');
  return `<div class="entry">
      <p class="org">${org} <span class="loc">— ${loc}</span></p>
      ${body}
    </div>`;
}

function renderCv(lang) {
  const d = data[lang];
  const L = LABELS[lang];

  const experience = d.experience
    .map((job) => entry(esc(job.company), esc(job.location), job.roles.map((r) => role(esc(r.title), r.period, r.bullets))))
    .join('\n');

  const projects = d.opensource
    .map((p) => {
      const url = absUrl(p.url);
      return entry(esc(p.name), `<a href="${esc(url)}">${esc(linkText(url))}</a>`, [role(esc(p.role), p.period, p.bullets)]);
    })
    .join('\n');

  const talks = d.talks
    .map((t) => {
      const shortLink = `${SITE}/talks/strong-types`;
      const [event, city] = t.event.split(' · ');
      const loc = `${esc(city ?? '')} · ${L.recording}: <a href="${shortLink}">${linkText(shortLink)}</a>`;
      return entry(esc(event), loc, [role(`<a href="${shortLink}">${esc(t.title)}</a>`, `${t.date} · ${t.duration}`, [t.description])]);
    })
    .join('\n');

  // Languages fill the last cell of the 3-column grid (8 skill groups + 1).
  const languages = d.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).join(', ');
  const skills = [
    ...d.skills.map((g) => ({ label: g.label, text: g.items.join(', ') })),
    { label: d.sections.languages, text: languages },
  ]
    .map((g) => `<div><h3>${esc(g.label)}</h3><p>${esc(g.text)}</p></div>`)
    .join('\n    ');

  const education = d.education
    .map((e) => entry(esc(e.school), esc(e.location), e.degrees.map((g) => role(esc(g.degree), g.period, g.bullets))))
    .join('\n');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(L.title)}</title>
<style>
  @page { size: A4; margin: 15mm 18mm 15mm 18mm; }
  * { box-sizing: border-box; }
  html { font-size: 10pt; }
  body { margin: 0; color: #000; background: #fff; font-family: "Liberation Serif", "Times New Roman", Times, serif; line-height: 1.3; }
  a { color: #000; text-decoration: none; }
  p { margin: 0; }
  /* Hyphenated words never break at the hyphen (see script at the end), so
     ATS parsers read "Open-Source", not "OpenSource". */
  .nb { white-space: nowrap; }

  header { text-align: center; padding-bottom: 4mm; margin-bottom: 3mm; border-bottom: 1.6pt solid #000; }
  .name { font-size: 30pt; font-weight: 700; line-height: 1.1; margin: 0; }
  .headline { font-size: 13pt; margin: 2mm 0 2.5mm; }
  .contact { font-size: 10pt; line-height: 1.5; }
  .contact .sep { margin: 0 0.55em; }

  h2 { font-size: 10.5pt; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin: 4.2mm 0 2mm; padding-bottom: 1mm; border-bottom: 0.5pt solid #000; break-after: avoid; }
  section:first-of-type h2 { margin-top: 3.5mm; }
  .profile p { margin-bottom: 1.4mm; }
  .profile p:last-child { margin-bottom: 0; }

  .entry { margin-bottom: 2.5mm; break-inside: avoid; }
  .entry:last-child { margin-bottom: 0; }
  .org { font-weight: 700; font-size: 10.5pt; break-after: avoid; }
  .org .loc { font-weight: 400; }
  .role { break-inside: avoid; }
  .role + .role { margin-top: 2mm; }
  .role-head { display: flex; justify-content: space-between; align-items: baseline; gap: 6mm; margin-top: 0.8mm; break-after: avoid; }
  .role-head .title { font-weight: 700; }
  .role-head .date { font-style: italic; font-size: 9pt; white-space: nowrap; }
  .group { border-left: 1px solid #b4b4b4; padding-left: 3.5mm; margin-left: 0.8mm; margin-top: 1mm; break-inside: avoid; }
  ul { margin: 0.8mm 0 0; padding-left: 5.5mm; }
  li { margin: 0 0 0.4mm; padding-left: 0.4mm; }
  li:last-child { margin-bottom: 0; }

  .skills { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.2mm 7mm; break-inside: avoid; }
  .skills h3 { font-size: 10.5pt; font-weight: 700; margin: 0 0 0.6mm; }
</style>
</head>
<body>

<header>
  <h1 class="name">${esc(d.hero.name)}</h1>
  <p class="headline">${esc(d.hero.role)}</p>
  <p class="contact">
    <a href="mailto:${CONTACT.email}">${CONTACT.email}</a><span class="sep">·</span>
    <a href="${SITE}">${CONTACT.website}</a><span class="sep">·</span>
    ${esc(d.hero.location)}
  </p>
</header>

<section class="profile">
  <h2>${L.profile}</h2>
  ${d.about.map((p) => `<p>${esc(p)}</p>`).join('\n  ')}
</section>

<section>
  <h2>${esc(d.sections.experience)}</h2>
  ${experience}
</section>

<section>
  <h2>${esc(L.projects)}</h2>
  ${projects}
</section>

<section>
  <h2>${esc(d.sections.talks)}</h2>
  ${talks}
</section>

<section>
  <h2>${esc(d.sections.skills)}</h2>
  <div class="skills">
    ${skills}
  </div>
</section>

<section>
  <h2>${esc(L.qualifications)}</h2>
  ${education}
</section>

<script>
  // Keeps hyphenated words (Open-Source, CI-Pipelines, ...) on one line so the
  // PDF text layer contains them intact. Runs before Edge prints the page.
  (function () {
    var re = /[\\p{L}\\d#.+/]+(?:-[\\p{L}\\d#.+/]+)+/gu;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      if (!/\\S-\\S/.test(n.data) || (n.parentNode && n.parentNode.closest('script,style'))) return;
      var frag = document.createDocumentFragment();
      var last = 0, m;
      while ((m = re.exec(n.data)) !== null) {
        frag.appendChild(document.createTextNode(n.data.slice(last, m.index)));
        var s = document.createElement('span');
        s.className = 'nb';
        s.textContent = m[0];
        frag.appendChild(s);
        last = m.index + m[0].length;
      }
      frag.appendChild(document.createTextNode(n.data.slice(last)));
      n.parentNode.replaceChild(frag, n);
    });
  })();
</script>

</body>
</html>
`;
}

function findEdge() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const edge = candidates.find(existsSync);
  if (!edge) throw new Error('Microsoft Edge not found; install it or adjust findEdge() in scripts/build-cv.mjs');
  return edge;
}

mkdirSync(OUT_HTML, { recursive: true });
const edge = findEdge();

for (const lang of LANGS) {
  const html = resolve(OUT_HTML, `tareq-jami-cv-${lang}.html`);
  const pdf = resolve(OUT_PDF, `tareq-jami-cv-${lang}.pdf`);
  writeFileSync(html, renderCv(lang));
  execFileSync(
    edge,
    ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdf}`, pathToFileURL(html).href],
    { stdio: 'ignore' },
  );
  console.log(`built ${pdf}`);
}

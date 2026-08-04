// Animation layer for the one-page profile, built on anime.js v4.
// initAnimations() is re-run after every language re-render (the i18n system
// replaces section innerHTML), so everything here is idempotent: previous
// observers/animations are disposed first, then targets are re-bound.
// All motion is gated behind prefers-reduced-motion; without JS the CSS
// never hides content (see the `html.js [data-animate]` rule).
import { animate, createTimeline, stagger, utils } from 'animejs';

type Cancelable = { cancel: () => void };

let observers: IntersectionObserver[] = [];
let running: Cancelable[] = [];
let listeners: { el: EventTarget; type: string; fn: EventListenerOrEventListenerObject }[] = [];

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function on(el: EventTarget, type: string, fn: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, fn);
  listeners.push({ el, type, fn });
}

function dispose(): void {
  observers.forEach((o) => o.disconnect());
  observers = [];
  running.forEach((a) => a.cancel());
  running = [];
  listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  listeners = [];
}

// --- hero name splitting --------------------------------------------------

function splitName(): void {
  const el = document.querySelector<HTMLElement>('[data-split]');
  if (!el || el.querySelector('.char')) return;
  const words = (el.textContent ?? '').trim().split(/\s+/);
  el.textContent = '';
  words.forEach((word, i) => {
    if (i > 0) el.appendChild(document.createTextNode(' '));
    const w = document.createElement('span');
    w.className = 'word';
    for (const ch of word) {
      const c = document.createElement('span');
      c.className = 'char';
      c.textContent = ch;
      w.appendChild(c);
    }
    el.appendChild(w);
  });
}

// --- hero entrance --------------------------------------------------------

function heroIntro(mode: 'full' | 'soft'): void {
  splitName();
  // Hide chars before first paint of the timeline, then reveal the h1 shell.
  utils.set('.hero-name .char', { opacity: 0 });
  utils.set('.hero-name', { opacity: 1 });

  if (mode === 'full') {
    const tl = createTimeline({ defaults: { ease: 'outExpo', duration: 850 } });
    tl.add('.hero-eyebrow', { opacity: [0, 1], translateY: [18, 0] })
      .add(
        '.hero-name .char',
        { opacity: [0, 1], translateY: [54, 0], rotateZ: [6, 0], duration: 950, delay: stagger(28) },
        '-=620',
      )
      .add('.hero-tagline', { opacity: [0, 1], translateY: [22, 0] }, '-=780')
      .add('.hero-actions', { opacity: [0, 1], translateY: [18, 0] }, '-=740')
      .add('.hero-visual', { opacity: [0, 1], scale: [0.92, 1], duration: 1000 }, '-=900');
    running.push(tl);
  } else {
    // Language switch: quick, quiet re-entrance instead of the full show.
    utils.set('.hero-eyebrow, .hero-tagline, .hero-actions, .hero-visual', { opacity: 1 });
    running.push(
      animate('.hero-name .char', {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 450,
        ease: 'outCubic',
        delay: stagger(12),
      }),
    );
  }

  // Slow rotating dashed ring around the avatar (ambient, transform-only).
  const ring = document.querySelector('.ring-dash');
  if (ring) {
    running.push(animate(ring, { rotate: 360, duration: 32000, ease: 'linear', loop: true }));
  }
}

// --- scroll reveals -------------------------------------------------------

function revealTimelineItem(item: HTMLElement): void {
  running.push(
    animate(item, { opacity: [0, 1], translateX: [-22, 0], duration: 750, ease: 'outCubic' }),
  );
  const line = item.querySelector('.timeline-line');
  if (line) {
    running.push(animate(line, { scaleY: [0, 1], duration: 1100, ease: 'outCubic', delay: 150 }));
  }
  const marker = item.querySelector('.timeline-marker');
  if (marker) {
    running.push(
      animate(marker, { scale: [0, 1], rotate: 45, duration: 600, ease: 'outBack(2)' }),
    );
  }
}

function scrollReveals(): void {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        const el = entry.target as HTMLElement;

        if (el.hasAttribute('data-stagger')) {
          running.push(
            animate(Array.from(el.children), {
              opacity: [0, 1],
              translateY: [16, 0],
              scale: [0.85, 1],
              duration: 550,
              ease: 'outBack(1.4)',
              delay: stagger(35),
            }),
          );
          continue;
        }

        const kind = el.dataset.animate;
        if (kind === 'title') {
          el.classList.add('in'); // sweeps the underline via CSS
          running.push(
            animate(el, { opacity: [0, 1], translateY: [24, 0], duration: 700, ease: 'outCubic' }),
          );
        } else if (kind === 'tl') {
          revealTimelineItem(el);
        } else {
          running.push(
            animate(el, { opacity: [0, 1], translateY: [30, 0], duration: 800, ease: 'outCubic' }),
          );
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
  );
  observers.push(io);

  document
    .querySelectorAll('[data-animate]:not([data-animate="hero"]), [data-stagger]')
    .forEach((el) => io.observe(el));
}

// --- pointer interactions -------------------------------------------------

// 3D tilt + cursor spotlight on the open-source panel.
function bindTilt(): void {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    on(card, 'pointermove', ((e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      utils.set(card, {
        perspective: 900,
        rotateX: (0.5 - py) * 5,
        rotateY: (px - 0.5) * 7,
      });
    }) as EventListener);
    on(card, 'pointerleave', (() => {
      running.push(
        animate(card, { rotateX: 0, rotateY: 0, duration: 650, ease: 'outQuad' }),
      );
    }) as EventListener);
  });
}

// Buttons gently follow the cursor, then spring back.
function bindMagnetic(): void {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    on(btn, 'pointermove', ((e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      utils.set(btn, { translateX: dx * 0.22, translateY: dy * 0.22 });
    }) as EventListener);
    on(btn, 'pointerleave', (() => {
      running.push(
        animate(btn, {
          translateX: 0,
          translateY: 0,
          duration: 600,
          ease: 'outElastic(1, .5)',
        }),
      );
    }) as EventListener);
  });
}

// --- public API -----------------------------------------------------------

/** Re-bind all content animations. Call after every language re-render. */
export function initAnimations(mode: 'full' | 'soft'): void {
  dispose();
  if (reducedMotion()) return; // CSS keeps everything visible
  heroIntro(mode);
  scrollReveals();
  bindTilt();
  bindMagnetic();
}

/** One-time ambient background motion (orbs live outside re-rendered regions). */
export function initAmbient(): void {
  if (reducedMotion()) return;
  animate('.orb-a', {
    translateX: [0, -70],
    translateY: [0, 55],
    duration: 26000,
    ease: 'inOutSine',
    alternate: true,
    loop: true,
  });
  animate('.orb-b', {
    translateX: [0, 65],
    translateY: [0, -45],
    duration: 30000,
    ease: 'inOutSine',
    alternate: true,
    loop: true,
  });
}

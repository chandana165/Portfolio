// Theme toggle (remembers the choice) and footer year
const root = document.documentElement;
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
document.getElementById('theme').addEventListener('click', () => {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});
document.getElementById('year').textContent = new Date().getFullYear();

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll progress bar
const bar = document.getElementById('progress');
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = root.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
    ticking = false;
  });
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Highlight the nav link of the section in view
const links = [...document.querySelectorAll('nav a[href^="#"]')];
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => navObs.observe(s));

// Rotating skill word in the hero
const rot = document.getElementById('rot');
if (rot && !reduce) {
  const words = ['Java', 'Spring Boot', 'React', 'SQL', 'REST APIs'];
  let i = 0;
  setInterval(() => {
    rot.classList.add('out');
    setTimeout(() => { i = (i + 1) % words.length; rot.textContent = words[i]; rot.classList.remove('out'); }, 300);
  }, 2400);
}

// Count-up for percentages
function countUp(el) {
  const target = parseInt(el.dataset.t, 10);
  const start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / 1200, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + '%';
    if (p < 1) requestAnimationFrame(step);
  })(start);
}

// Reveal on scroll
document.querySelectorAll('.chips').forEach(c => [...c.children].forEach((li, i) => li.style.setProperty('--i', i)));
if (!reduce && 'IntersectionObserver' in window) {
  document.querySelectorAll('.pc').forEach(el => { el.dataset.t = parseInt(el.textContent, 10); el.textContent = '0%'; });
  const targets = new Set(document.querySelectorAll('h2, .about > *, .tl, .proj, .cat, .sk, .edu > div, .two > div, #contact .wrap > *'));
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      const pc = e.target.querySelector('.pc');
      if (pc) countUp(pc);
      revObs.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  targets.forEach(t => { t.classList.add('rv'); revObs.observe(t); });
}

// Skill card spotlight follows the cursor
document.querySelectorAll('.sk').forEach((el, i) => {
  el.style.transitionDelay = ((i % 4) * 60) + 'ms';
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
  el.addEventListener('pointerleave', () => { el.style.transitionDelay = '0ms'; });
});

// Hero stats count up on load
if (!reduce) {
  document.querySelectorAll('.stats b').forEach(b => {
    const t = +b.dataset.t, s = b.dataset.s || '';
    b.textContent = '0' + s;
    setTimeout(() => {
      const st = performance.now();
      (function f(now) {
        const p = Math.min((now - st) / 1400, 1);
        b.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))) + s;
        if (p < 1) requestAnimationFrame(f);
      })(st);
    }, 1100);
  });
}

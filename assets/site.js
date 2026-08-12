const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

// Native Banner is loaded after the document is ready so the ad remains
// monetized without competing with the first content paint.
const lazyAdScripts = [...document.querySelectorAll('script[data-lazy-ad-src]')];

const loadLazyAdScripts = () => {
  lazyAdScripts.forEach((placeholder) => {
    if (placeholder.dataset.loaded === 'true') return;
    const script = document.createElement('script');
    script.async = true;
    script.src = placeholder.dataset.lazyAdSrc;
    if (placeholder.dataset.cfasync === 'false') script.dataset.cfasync = 'false';
    placeholder.dataset.loaded = 'true';
    placeholder.replaceWith(script);
  });
};

if (lazyAdScripts.length) {
  const scheduleAds = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadLazyAdScripts, { timeout: 1800 });
    } else {
      window.setTimeout(loadLazyAdScripts, 900);
    }
  };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', scheduleAds, { once: true });
  } else {
    scheduleAds();
  }
}

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
      toggle.focus();
    }
  });
}

document.querySelectorAll('[data-year]').forEach((item) => {
  item.textContent = new Date().getFullYear();
});

const achievementChecks = [...document.querySelectorAll('[data-achievement-check]')];

if (achievementChecks.length) {
  const storageKey = 'machine-party-achievement-progress';
  let saved = [];

  try {
    saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch {
    saved = [];
  }

  const updateProgress = () => {
    const completed = achievementChecks.filter((check) => check.checked);
    document.querySelectorAll('[data-achievement-count]').forEach((item) => {
      item.textContent = String(completed.length);
    });
    achievementChecks.forEach((check) => {
      check.closest('.achievement-card')?.classList.toggle('completed', check.checked);
    });
    try {
      localStorage.setItem(storageKey, JSON.stringify(completed.map((check) => check.value)));
    } catch {
      // The checklist still works for this visit when storage is unavailable.
    }
  };

  achievementChecks.forEach((check) => {
    check.checked = saved.includes(check.value);
    check.addEventListener('change', updateProgress);
  });
  updateProgress();
}

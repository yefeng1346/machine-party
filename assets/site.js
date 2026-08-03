const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

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

const adFreePath = /^\/(?:about|editorial-policy|privacy|sources)(?:\/|$)/;
const adPlacementId = 'container-e4ae25d46cfe4ad2fbfd761aedae2cad';

if (!adFreePath.test(window.location.pathname)) {
  const contentWrap = document.querySelector('main .content-wrap');
  const contentColumn = contentWrap?.classList.contains('two-col')
    ? contentWrap.querySelector(':scope > div:not(.page-meta)')
    : contentWrap;

  if (contentColumn) {
    const adSlot = document.createElement('aside');
    adSlot.className = 'ad-slot';
    adSlot.setAttribute('aria-label', 'Advertisement');
    adSlot.innerHTML = `
      <p class="ad-slot__label"><span>Advertisement</span> / external transmission</p>
      <div class="ad-slot__body">
        <div id="${adPlacementId}"></div>
      </div>
    `;

    const nextSection = contentColumn.querySelector(':scope > .related-section, :scope > .source-note');
    contentColumn.insertBefore(adSlot, nextSection);

    let loaded = false;
    const loadAd = () => {
      if (loaded) return;
      loaded = true;

      const script = document.createElement('script');
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = 'https://pl30656589.effectivecpmnetwork.com/e4ae25d46cfe4ad2fbfd761aedae2cad/invoke.js';
      adSlot.appendChild(script);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          loadAd();
        }
      }, { rootMargin: '500px 0px' });
      observer.observe(adSlot);
    } else {
      loadAd();
    }
  }
}

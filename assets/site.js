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

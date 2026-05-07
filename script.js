// Highlight current page in nav (also marks current language in lang-switcher)
(() => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav ul li a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
})();

// Hamburger menu (click + keyboard, ARIA sync, focus trap, ESC to close)
(() => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.getElementById('overlay');
    if (!hamburger || !navMenu) return;

    const isHr = document.documentElement.lang === 'hr';
    const labelOpen = isHr ? 'Otvori izbornik' : 'Open menu';
    const labelClose = isHr ? 'Zatvori izbornik' : 'Close menu';

    const focusable = () => navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    const isOpen = () => hamburger.classList.contains('active');

    const open = () => {
        hamburger.classList.add('active');
        navMenu.classList.add('show');
        if (overlay) overlay.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', labelClose);
        const first = focusable()[0];
        if (first) first.focus();
    };

    const close = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('show');
        if (overlay) overlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', labelOpen);
        hamburger.focus();
    };

    const toggle = () => isOpen() ? close() : open();

    hamburger.addEventListener('click', toggle);
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!isOpen()) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            close();
            return;
        }
        if (e.key === 'Tab') {
            const items = focusable();
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
})();

// Hero role rotator
(() => {
    const roles = document.querySelectorAll('.hero-roles .role');
    if (roles.length < 2) return;

    let idx = 0;
    setInterval(() => {
        roles[idx].classList.remove('active');
        idx = (idx + 1) % roles.length;
        roles[idx].classList.add('active');
    }, 2500);
})();

// Button hover spotlight (uses CSS vars --x / --y)
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty('--x', (e.clientX - rect.left) + 'px');
        btn.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    });
});

// Scroll progress bar — thin line under the header
(() => {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);

    const update = () => {
        const scrolled = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (scrolled / max) * 100 : 0;
        bar.style.width = pct + '%';
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();

// Email obfuscation — assemble mailto: links from data-u + data-d at runtime
(() => {
    document.querySelectorAll('a.email[data-u][data-d]').forEach(a => {
        const addr = a.dataset.u + '@' + a.dataset.d;
        a.href = 'mailto:' + addr;
        if (!a.textContent.trim() || a.textContent.includes('@') === false) {
            a.textContent = addr;
        }
    });
})();

// Copy-email button — copies the address from the nearest .email link
(() => {
    const isHr = document.documentElement.lang === 'hr';
    const copiedLabel = isHr ? 'Kopirano!' : 'Copied!';

    document.querySelectorAll('.copy-email-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const scope = btn.closest('.email-row, p, div, footer') || document;
            const link = scope.querySelector('a.email[data-u][data-d]');
            if (!link) return;
            const addr = link.dataset.u + '@' + link.dataset.d;
            try {
                await navigator.clipboard.writeText(addr);
            } catch {
                return;
            }
            const original = btn.textContent;
            btn.classList.add('copied');
            btn.textContent = copiedLabel;
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.textContent = original;
            }, 1800);
        });
    });
})();

// Reveal-on-scroll: any element with .reveal gets .active when in view
(() => {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
})();

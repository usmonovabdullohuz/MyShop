// ============ PAGE LOADER ============
function hideLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('loaded');
    }
}

window.addEventListener('load', hideLoader);
setTimeout(hideLoader, 2000);

// ============ NAVBAR SCROLL EFFEKTI + PROGRESS + BACK TO TOP ============
const navbar = document.getElementById('mainNavbar');
const backToTopBtn = document.getElementById('back-to-top');

function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
}

function toggleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    updateScrollProgress();
    toggleBackToTop();
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============ SCROLL'DA PAYDO BO'LISH (reveal) ============
const revealElements = document.querySelectorAll('.reveal, .reveal-up');

if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ============ PAROLNI KO'RSATISH/YASHIRISH ============
const eyeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const eyeOffIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.innerHTML = isPassword ? eyeOffIcon : eyeIcon;
    });
});

// ============ TUGMA LOADING HOLATI (forma yuborilganda) ============
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn && !submitBtn.classList.contains('no-loading')) {
            submitBtn.classList.add('is-loading');
        }
    });
});

// ============ TOAST XABAR FUNKSIYASI ============
function showToast(message) {
    const existing = document.querySelector('.toast-notify');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notify';
    toast.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ============ CUSTOM SELECT (dizaynga mos ochiladigan dropdown) ============
function initCustomSelects() {
    document.querySelectorAll('select.form-select:not(.custom-select-done)').forEach(select => {
        select.classList.add('custom-select-done');

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';

        select.classList.add('custom-select-hidden');
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        trigger.tabIndex = 0;

        const options = document.createElement('div');
        options.className = 'custom-select-options';

        function renderTrigger() {
            const selected = select.options[select.selectedIndex];
            trigger.innerHTML = `<span>${selected ? selected.textContent : ''}</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>`;
        }

        function renderOptions() {
            options.innerHTML = '';
            Array.from(select.options).forEach(opt => {
                const item = document.createElement('div');
                item.className = 'custom-select-option';
                item.textContent = opt.textContent;
                if (opt.selected) item.classList.add('selected');
                item.addEventListener('click', () => {
                    select.value = opt.value;
                    select.dispatchEvent(new Event('change'));
                    renderTrigger();
                    renderOptions();
                    closeDropdown();
                });
                options.appendChild(item);
            });
        }

        function openDropdown() {
            wrapper.classList.add('open');
        }

        function closeDropdown() {
            wrapper.classList.remove('open');
        }

        trigger.addEventListener('click', () => {
            wrapper.classList.contains('open') ? closeDropdown() : openDropdown();
        });

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                wrapper.classList.contains('open') ? closeDropdown() : openDropdown();
            } else if (e.key === 'Escape') {
                closeDropdown();
            }
        });

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) closeDropdown();
        });

        renderTrigger();
        renderOptions();
        wrapper.appendChild(trigger);
        wrapper.appendChild(options);
    });
}

document.addEventListener('DOMContentLoaded', initCustomSelects);
if (document.readyState !== 'loading') {
    initCustomSelects();
}

// ============ KATALOG DROPDOWN ============
const catalogDropdown = document.querySelector('.catalog-dropdown');
const catalogBtn = document.querySelector('.catalog-btn');

if (catalogBtn) {
    catalogBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        catalogDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!catalogDropdown.contains(e.target)) {
            catalogDropdown.classList.remove('open');
        }
    });
}

// ============ WISHLIST (YURAKCHA) TOGGLE ============
document.querySelectorAll('.wishlist-toggle-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const url = btn.dataset.url;
        if (!url) return;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            if (response.status === 403) {
                window.location.href = '/accounts/login/';
                return;
            }

            const data = await response.json();
            const heartIcon = btn.querySelector('.heart-icon');

            if (data.wished) {
                heartIcon.setAttribute('fill', '#ff4a6b');
                btn.classList.add('wished');
            } else {
                heartIcon.setAttribute('fill', 'none');
                btn.classList.remove('wished');
            }

            const badge = document.querySelector('.wishlist-badge');
            if (badge) badge.textContent = data.count;

        } catch (err) {
            console.error('Wishlist xatosi:', err);
        }
    });
});

// ============ BANNER AVTO-SLIDER VA PROGRESS BAR ============
document.addEventListener("DOMContentLoaded", function () {
    const scrollContainer = document.getElementById('promoScroll');
    const prevBtn = document.getElementById('slidePrev');
    const nextBtn = document.getElementById('slideNext');
    const progressBar = document.getElementById('sliderProgress');

    if (!scrollContainer || !prevBtn || !nextBtn) return;

    const scrollAmount = 360;
    const autoPlayInterval = 4000;
    let autoPlayTimer;

    function getMaxScroll() {
        return scrollContainer.scrollWidth - scrollContainer.clientWidth;
    }

    function updateProgressBar() {
        if (!progressBar) return;
        const maxScrollLeft = getMaxScroll();
        if (maxScrollLeft <= 0) return;
        const scrollPercent = (scrollContainer.scrollLeft / maxScrollLeft) * 100;
        progressBar.style.width = scrollPercent + '%';
    }

    function slideNext() {
        const maxScrollLeft = getMaxScroll();
        if (scrollContainer.scrollLeft >= maxScrollLeft - 15) {
            scrollContainer.scrollLeft = 0; // oxiriga yetganda boshiga qaytadi
        } else {
            scrollContainer.scrollLeft += scrollAmount;
        }
    }

    function slidePrev() {
        if (scrollContainer.scrollLeft <= 15) {
            scrollContainer.scrollLeft = getMaxScroll();
        } else {
            scrollContainer.scrollLeft -= scrollAmount;
        }
    }

    function startAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(slideNext, autoPlayInterval);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }

    scrollContainer.addEventListener('scroll', updateProgressBar);

    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        slideNext();
        startAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        slidePrev();
        startAutoPlay();
    });

    scrollContainer.addEventListener('mouseenter', stopAutoPlay);
    scrollContainer.addEventListener('mouseleave', startAutoPlay);

    updateProgressBar();
    startAutoPlay();
});
// ============ SICHQONCHA BILAN SUDRAB O'TISH (mouse-drag) ============
let isDown = false;
let startX;
let scrollLeftStart;

scrollContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    scrollContainer.classList.add('dragging');
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeftStart = scrollContainer.scrollLeft;
    stopAutoPlay();
});

scrollContainer.addEventListener('mouseleave', () => {
    isDown = false;
    scrollContainer.classList.remove('dragging');
    startAutoPlay();
});

scrollContainer.addEventListener('mouseup', () => {
    isDown = false;
    scrollContainer.classList.remove('dragging');
    startAutoPlay();
});

scrollContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 1.5; // sudrash tezligi
    scrollContainer.scrollLeft = scrollLeftStart - walk;
});
// ============ NAVBAR SKROLL EFFEKTI (dublikat, xavfsizlik uchun) ============
// Eslatma: yuqorida allaqachon .navbar (id=mainNavbar) uchun scroll effekt bor,
// bu qism faqat umumiy .navbar klassiga ega boshqa elementlar uchun zaxira.
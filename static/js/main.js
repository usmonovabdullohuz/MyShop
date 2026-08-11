(function markRatingSelect() {
        const wrapper = document.getElementById('starRatingInput');
        if (!wrapper) return;
        const hiddenSelect = wrapper.parentElement.querySelector('select');
        if (hiddenSelect) hiddenSelect.classList.add('rating-hidden-select');
    })();

    function checkCachedImages() {
        document.querySelectorAll('.img-skeleton-wrapper img').forEach(img => {
            if (img.complete && img.naturalWidth > 0) {
                img.classList.add('img-loaded');
                img.parentElement.classList.add('img-loaded');
            }
        });
    }
    document.addEventListener('DOMContentLoaded', checkCachedImages);
    if (document.readyState !== 'loading') {
        checkCachedImages();
    }
    // AJAX orqali mahsulotlar gridi yangilanganda (filtr/sort/pagination)
    // yangi <img> elementlar uchun ham cache holatini tekshiramiz
    window.addEventListener('productGrid:updated', checkCachedImages);

    function hideLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.add('loaded');
        }
    }

    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 6000);

    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            __activeRequestCount = 0;
            const overlay = document.getElementById('global-spinner-overlay');
            if (overlay) overlay.classList.remove('show');
            hideLoader();
            document.querySelectorAll('button.is-loading').forEach(btn => {
                btn.classList.remove('is-loading');
            });
        }
    });

    let __activeRequestCount = 0;

    function getSpinnerOverlay() {
        let overlay = document.getElementById('global-spinner-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'global-spinner-overlay';
            overlay.className = 'global-spinner-overlay';
            overlay.innerHTML = '<div class="global-spinner"></div>';
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    function showSpinner() {
        __activeRequestCount++;
        const overlay = getSpinnerOverlay();
        overlay.classList.add('show');
    }

    function hideSpinner() {
        __activeRequestCount = Math.max(0, __activeRequestCount - 1);
        if (__activeRequestCount === 0) {
            const overlay = document.getElementById('global-spinner-overlay');
            if (overlay) overlay.classList.remove('show');
        }
    }

    // Xavfsizlik to'ri: agar biror joyda showSpinner() hideSpinner()siz
    // qolib ketsa (masalan kutilmagan xato tufayli), counter cheksiz
    // o'sib, spinner butunlay "osilib qolgan" holga tushib qolmasligi
    // uchun - eng ko'p 10 soniyadan keyin overlay majburan yopiladi va
    // counter nolga tushiriladi.
    let __spinnerSafetyTimer = null;
    const __originalShowSpinner = showSpinner;
    showSpinner = function () {
        __originalShowSpinner();
        clearTimeout(__spinnerSafetyTimer);
        __spinnerSafetyTimer = setTimeout(() => {
            __activeRequestCount = 0;
            const overlay = document.getElementById('global-spinner-overlay');
            if (overlay) overlay.classList.remove('show');
        }, 10000);
    };
    const __originalHideSpinner = hideSpinner;
    hideSpinner = function () {
        __originalHideSpinner();
        if (__activeRequestCount === 0) {
            clearTimeout(__spinnerSafetyTimer);
        }
    };

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
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.classList.contains('no-loading')) {
                submitBtn.classList.add('is-loading');
            }
            if (form.dataset.noSpinner !== 'true') {
                showSpinner();
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
        document.querySelectorAll('select.form-select:not(.custom-select-done):not(.rating-hidden-select)').forEach(select => {
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

    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.wishlist-toggle-btn');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        if (btn.classList.contains('is-loading')) return;

        const url = btn.dataset.url;
        if (!url) return;

        btn.classList.add('is-loading');
        showSpinner();
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
                if (heartIcon) heartIcon.setAttribute('fill', '#ff4a6b');
                btn.classList.add('wished', 'active');
                showToast("Sevimlilarga qo'shildi");
            } else {
                if (heartIcon) heartIcon.setAttribute('fill', 'none');
                btn.classList.remove('wished', 'active');
                showToast("Sevimlilardan olib tashlandi");
            }

            const badge = document.querySelector('.wishlist-badge');
            if (badge) badge.textContent = data.count;

        } catch (err) {
            console.error('Wishlist xatosi:', err);
        } finally {
            btn.classList.remove('is-loading');
            hideSpinner();
        }
    });

    // ============ SAVATGA QO'SHISH (AJAX + TOAST) ============
    // Xuddi shu sabab bilan delegatsiyaga o'tkazildi: qidiruv natijalarida
    // yoki keyinroq DOM'ga qo'shilgan "Savatga qo'shish" tugmalari ham
    // ishlashi kerak - avval faqat sahifa birinchi ochilgandagi tugmalar
    // ishlar edi.
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.cart-add-btn');
        if (!btn) return;

        const url = btn.dataset.url;
        if (!url || btn.classList.contains('is-loading')) return;

        btn.classList.add('is-loading');
        showSpinner();

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            if (response.status === 403 || response.redirected) {
                window.location.href = '/accounts/login/';
                return;
            }

            const data = await response.json();

            if (data.success) {
                showToast(data.message);
                const cartBadge = document.querySelector('.cart-count-badge');
                if (cartBadge && typeof data.cart_count !== 'undefined') {
                    cartBadge.textContent = data.cart_count;
                }
            }
        } catch (err) {
            console.error('Savatga qo\'shish xatosi:', err);
        } finally {
            btn.classList.remove('is-loading');
            hideSpinner();
        }
    });

    // ============ INTERAKTIV YULDUZCHA REYTING (sharh formasi) ============
    function initStarRating() {
        const wrapper = document.getElementById('starRatingInput');
        if (!wrapper) return;

        const hiddenSelect = wrapper.parentElement.querySelector('select');
        if (!hiddenSelect) return;

        const stars = Array.from(wrapper.querySelectorAll('.star-rating-btn'));

        function paintStars(upToValue) {
            stars.forEach(star => {
                const value = parseInt(star.dataset.value, 10);
                star.classList.toggle('hovered', value <= upToValue);
            });
        }

        function selectValue(value) {
            hiddenSelect.value = value;
            hiddenSelect.dispatchEvent(new Event('change'));
            stars.forEach(star => {
                const starValue = parseInt(star.dataset.value, 10);
                star.classList.toggle('selected', starValue <= value);
            });
        }

        stars.forEach(star => {
            const value = star.dataset.value;

            star.addEventListener('mouseenter', () => paintStars(parseInt(value, 10)));
            star.addEventListener('click', () => selectValue(value));
        });

        wrapper.addEventListener('mouseleave', () => {
            stars.forEach(star => star.classList.remove('hovered'));
        });

        // Agar formada oldindan tanlangan qiymat bo'lsa (masalan validatsiya xatosidan keyin qayta ko'rsatilsa)
        const initialValue = parseInt(hiddenSelect.value, 10);
        if (initialValue > 0) {
            selectValue(initialValue);
        }
    }

    document.addEventListener('DOMContentLoaded', initStarRating);
    if (document.readyState !== 'loading') {
        initStarRating();
    }

    // ============ RASM LIGHTBOX (mahsulot detail sahifasi) ============
    function initImageLightbox() {
        const trigger = document.getElementById('productImageZoom');
        const overlay = document.getElementById('imageLightbox');
        const closeBtn = document.getElementById('lightboxClose');

        if (!trigger || !overlay) return;

        function openLightbox() {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        trigger.addEventListener('click', openLightbox);
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    document.addEventListener('DOMContentLoaded', initImageLightbox);
    if (document.readyState !== 'loading') {
        initImageLightbox();
    }

    // ============ BANNER AVTO-SLIDER, PROGRESS BAR VA SICHQONCHA SUDRASH ============
    document.addEventListener("DOMContentLoaded", function () {
        const scrollContainer = document.getElementById('promoScroll');
        const prevBtn = document.getElementById('slidePrev');
        const nextBtn = document.getElementById('slideNext');
        const progressBar = document.getElementById('sliderProgress');

        if (!scrollContainer || !prevBtn || !nextBtn) return;

        const scrollAmount = 360;
        const autoPlayInterval = 4000;
        let autoPlayTimer;
        let isDown = false;
        let startX;
        let scrollLeftStart;

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
    });
    const sortSelectEl = document.getElementById('sortSelect');
    if (sortSelectEl) {
        sortSelectEl.addEventListener('change', function () {
            const url = new URL(window.location.href);
            url.searchParams.set('sort', this.value);
            window.location.href = url.toString();
        });
    }

/* ==========================================================================
   MAHSULOTLAR RO'YXATI — AJAX FILTR / SARALASH / SAHIFALASH
   Maqsad: filtr yoki sort o'zgarganda butun sahifa emas, faqat
   mahsulotlar gridi qayta yuklansin (pro SPA-hissi, oddiy JS bilan).
   ========================================================================== */
(function () {
    const gridContainer = document.getElementById('productGridContainer');
    const filterForm = document.getElementById('filterForm');
    const sortSelect = document.getElementById('sortSelect');
    const resultsCount = document.getElementById('resultsCount');

    if (!gridContainer) return;

    function currentParams() {
        return new URLSearchParams(window.location.search);
    }

    async function loadProducts(params, { pushState = true } = {}) {
        gridContainer.classList.add('grid-loading');

        const url = `${window.location.pathname}?${params.toString()}`;

        try {
            const response = await fetch(url, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (!response.ok) throw new Error('Server xatosi');
            const data = await response.json();

            // Server endi butun sahifani (navbar bilan) qaytaradi —
            // shuning uchun faqat kerakli #productGridContainer qismini
            // ajratib olib, joriy sahifadagi mos joyga qo'yamiz
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(data.html, 'text/html');
            const newGrid = newDoc.getElementById('productGridContainer');

            if (newGrid) {
                gridContainer.innerHTML = newGrid.innerHTML;
            }

            if (resultsCount) {
                resultsCount.textContent = `${data.total_count} ta mahsulot topildi`;
            }

            if (pushState) {
                window.history.pushState({ ajax: true }, '', url);
            }

            // Yangi renderlangan kartalar uchun animatsiya/wishlist/lazy-load
            // hodisalarini qayta ulash kerak
            window.dispatchEvent(new CustomEvent('productGrid:updated'));

            gridContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
            console.error('Mahsulotlarni yuklashda xatolik:', err);
            // Muvaffaqiyatsiz bo'lsa — oddiy to'liq sahifa yuklashga tushamiz,
            // foydalanuvchi hech bo'lmasa natijani ko'radi
            window.location.href = url;
        } finally {
            gridContainer.classList.remove('grid-loading');
        }
    }

    // ---- Filtr formasi (narx, chegirma) ----
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const params = new URLSearchParams(new FormData(filterForm));
            // bo'sh qiymatlarni tashlab yuboramiz (toza URL uchun)
            [...params.keys()].forEach((key) => {
                if (!params.get(key)) params.delete(key);
            });
            loadProducts(params);
        });
    }

    // ---- Saralash select ----
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const params = currentParams();
            params.set('sort', sortSelect.value);
            params.delete('page');
            loadProducts(params);
        });
    }

    // ---- Kategoriya linklari va "Filtrlarni tozalash" ----
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-ajax-link]');
        if (!link) return;
        e.preventDefault();
        const linkUrl = new URL(link.href, window.location.origin);
        loadProducts(linkUrl.searchParams, { pushState: true });
        // Yo'l (path) o'zgarishi mumkin (masalan boshqa kategoriya slug'i),
        // shuning uchun pathname'ni ham yangilaymiz
        if (linkUrl.pathname !== window.location.pathname) {
            window.history.replaceState({ ajax: true }, '', linkUrl.pathname + linkUrl.search);
        }
    });

    // ---- Pagination tugmalari (delegatsiya, chunki grid qayta render bo'ladi) ----
    gridContainer.addEventListener('click', (e) => {
        const pageBtn = e.target.closest('.page-btn');
        if (!pageBtn || pageBtn.disabled) return;
        const params = currentParams();
        params.set('page', pageBtn.dataset.page);
        loadProducts(params);
    });

    // ---- Brauzer orqaga/oldinga tugmalari ----
    window.addEventListener('popstate', () => {
        loadProducts(currentParams(), { pushState: false });
    });
})();


/* ============================================
   ABTCMINING - ADVANCED INTERACTIVE SCRIPTS
   ============================================ */

/* ============================================
   PAGE TOGGLE SYSTEM
   ============================================ */
function showPage(pageName) {
    const pages = document.querySelectorAll('.page-section');
    const targetPage = document.getElementById(`page-${pageName}`);
    const currentActive = document.querySelector('.page-section.active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });

    const navMenu = document.getElementById('nav-menu');
    if (navMenu) navMenu.classList.remove('open');

    // If already on this page, just scroll to top
    if (currentActive === targetPage) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // Remove active from current page
    if (currentActive) {
        currentActive.classList.remove('active');
    }

    // Activate new page after a small delay to allow exit transition
    if (targetPage) {
        targetPage.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-init scroll animations for the new page
    setTimeout(() => {
        initScrollAnimations();
    }, 150);
}

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initCountdown();
    initPopupCountdown();
    initConverter();
    initSwiper();
    initChat();
    initContactModal();
    initPopup();
    initSmoothScroll();
    initYear();
    initCounterAnimation();
    initTheme();
    initTranslateDropdown();
});

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    menuToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
        });
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', toggleTheme);

    // Translate toggle
    const translateToggle = document.getElementById('translate-toggle');
    translateToggle?.addEventListener('click', toggleTranslateDropdown);
}

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, parseInt(delay));

                // Trigger counter animation for stats
                if (entry.target.dataset.animate === 'count-up') {
                    animateCounter(entry.target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
    // Stats counter is handled by IntersectionObserver
}

function animateCounter(element) {
    const numberEl = element.querySelector('.stat-number');
    if (!numberEl) return;

    const target = parseInt(numberEl.dataset.target);
    const duration = 2000;
    const start = performance.now();
    const suffix = target >= 1000000 ? 'M+' : target >= 100 ? '+' : '';

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        let current = Math.floor(easeOut * target);

        if (target >= 1000000) {
            numberEl.textContent = (current / 1000000).toFixed(0) + 'M+';
        } else {
            numberEl.textContent = current + (target >= 100 ? '+' : '');
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (target >= 1000000) {
                numberEl.textContent = '1M+';
            } else {
                numberEl.textContent = target + suffix;
            }
        }
    }

    requestAnimationFrame(update);
}

/* ============================================
   COUNTDOWN TIMER
   ============================================ */
function initCountdown() {
    const targetDate = getNextCycleDate();

    function update() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            updateDisplay(0, 0, 0, 0);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        updateDisplay(days, hours, minutes, seconds);
    }

    function updateDisplay(days, hours, minutes, seconds) {
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

function getNextCycleDate() {
    const baseDate = new Date('2023-04-06T00:00:00');
    const now = new Date();
    const diff = now - baseDate;
    const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
    const cyclesPassed = Math.floor(daysPassed / 20);
    const nextCycle = new Date(baseDate);
    nextCycle.setDate(baseDate.getDate() + (cyclesPassed + 1) * 20);
    return nextCycle;
}

/* ============================================
   POPUP COUNTDOWN
   ============================================ */
function initPopupCountdown() {
    const targetDate = getNextCycleDate();

    function update() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            updatePopupDisplay(0, 0, 0, 0);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        updatePopupDisplay(days, hours, minutes, seconds);
    }

    function updatePopupDisplay(days, hours, minutes, seconds) {
        const pd = document.getElementById('popup-days');
        const ph = document.getElementById('popup-hours');
        const pm = document.getElementById('popup-minutes');
        const ps = document.getElementById('popup-seconds');
        if (pd) pd.textContent = String(days).padStart(2, '0');
        if (ph) ph.textContent = String(hours).padStart(2, '0');
        if (pm) pm.textContent = String(minutes).padStart(2, '0');
        if (ps) ps.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

/* ============================================
   BTC/USD CONVERTER (Connected to Backend)
   ============================================ */
function initConverter() {
    const btcInput = document.getElementById('btc-amount');
    const convertBtn = document.getElementById('convert-btn');
    const usdResult = document.getElementById('usd-result');
    const rateInfo = document.getElementById('rate-info');

    let btcRate = 0;

    async function fetchRate() {
        try {
            const response = await fetch('/api/btc-rate');
            const data = await response.json();
            btcRate = data.rate;
            if (rateInfo) {
                const source = data.cached ? '(cached)' : data.fallback ? '(fallback)' : '(live)';
                rateInfo.textContent = `Current BTC/USD rate: $${btcRate.toLocaleString()} ${source}`;
            }
        } catch (error) {
            console.error('Error fetching BTC rate:', error);
            if (rateInfo) {
                rateInfo.textContent = 'Error loading rate. Using fallback: $67,000';
            }
            btcRate = 67000;
        }
    }

    function convert() {
        const amount = parseFloat(btcInput?.value);
        if (!amount || amount <= 0) {
            showToast('Please enter a valid BTC amount', 'warning');
            return;
        }

        if (btcRate === 0) {
            showToast('Rate not loaded yet. Please wait.', 'info');
            return;
        }

        const usd = amount * btcRate;
        if (usdResult) {
            usdResult.textContent = `$${usd.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
    }

    convertBtn?.addEventListener('click', convert);
    btcInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') convert();
    });

    fetchRate();
    // Refresh rate every 60 seconds
    setInterval(fetchRate, 60000);
}

/* ============================================
   SWIPER SLIDER
   ============================================ */
function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 600,
    });
}

/* ============================================
   LIVE CHAT (Connected to Backend)
   ============================================ */
function initChat() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatModal = document.getElementById('chat-modal');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const sessionId = 'session_' + Math.random().toString(36).substring(2, 15);

    chatToggle?.addEventListener('click', () => {
        chatModal?.classList.toggle('active');
    });

    chatClose?.addEventListener('click', () => {
        chatModal?.classList.remove('active');
    });

    async function sendMessage() {
        const message = chatInput?.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        chatInput.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, sessionId })
            });
            const data = await response.json();
            if (data.success && data.botReply) {
                addMessage(data.botReply.message, 'bot');
            } else {
                addMessage('Sorry, something went wrong. Please try again.', 'bot');
            }
        } catch (error) {
            console.error('Chat error:', error);
            addMessage('Connection error. Please check your internet.', 'bot');
        }
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.textContent = text;
        chatMessages?.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatSend?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

/* ============================================
   CONTACT MODAL (Connected to Backend)
   ============================================ */
function initContactModal() {
    const contactBtn = document.getElementById('contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const modalClose = document.getElementById('modal-close');
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    contactBtn?.addEventListener('click', () => {
        contactModal?.classList.add('active');
    });

    modalClose?.addEventListener('click', () => {
        contactModal?.classList.remove('active');
    });

    contactModal?.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('active');
        }
    });

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        const formData = {
            name: contactForm.querySelector('[name="name"]')?.value,
            email: contactForm.querySelector('[name="email"]')?.value,
            subject: contactForm.querySelector('[name="subject"]')?.value,
            message: contactForm.querySelector('[name="message"]')?.value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                showToast('Message sent successfully!', 'success');
                contactForm.reset();
                contactModal.classList.remove('active');
            } else {
                showToast(data.error || 'Failed to send message.', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showToast('Network error. Please try again later.', 'error');
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Message</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>`;
    });
}

/* ============================================
   COUNTDOWN POPUP
   ============================================ */
function initPopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupCloseBtn = document.getElementById('popup-close-btn');

    // Show popup after 3 seconds
    setTimeout(() => {
        popupOverlay?.classList.add('active');
    }, 3000);

    popupCloseBtn?.addEventListener('click', () => {
        popupOverlay?.classList.remove('active');
    });

    popupOverlay?.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove('active');
        }
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ============================================
   YEAR FOOTER
   ============================================ */
function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/* ============================================
   TOAST NOTIFICATIONS
   ============================================ */
function showToast(message, type = 'info') {
    if (typeof Toastify === 'undefined') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        return;
    }

    const colors = {
        success: 'linear-gradient(to right, #00b09b, #96c93d)',
        error: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        warning: 'linear-gradient(to right, #f7971e, #ffd200)',
        info: 'linear-gradient(to right, #00c6ff, #0072ff)'
    };

    Toastify({
        text: message,
        duration: 4000,
        close: true,
        gravity: 'top',
        position: 'right',
        style: {
            background: colors[type] || colors.info,
            borderRadius: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }
    }).showToast();
}

/* ============================================
   THEME TOGGLE
   ============================================ */
function initTheme() {
    const savedTheme = localStorage.getItem('abtc-theme');
    const themeToggle = document.getElementById('theme-toggle');

    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const isLight = html.getAttribute('data-theme') === 'light';

    if (isLight) {
        html.removeAttribute('data-theme');
        localStorage.setItem('abtc-theme', 'dark');
        if (themeToggle) themeToggle.textContent = '🌙';
        showToast('Dark mode enabled', 'info');
    } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('abtc-theme', 'light');
        if (themeToggle) themeToggle.textContent = '☀️';
        showToast('Light mode enabled', 'info');
    }
}

/* ============================================
   TRANSLATE DROPDOWN
   ============================================ */
const LANGUAGES = [
    { code: 'af', native: 'Afrikaans', sub: 'Afrikaans' },
    { code: 'sq', native: 'Shqip', sub: 'Albanian' },
    { code: 'ar', native: 'العربية', sub: 'Arabic' },
    { code: 'be', native: 'Беларуская', sub: 'Belarusian' },
    { code: 'bg', native: 'Български', sub: 'Bulgarian' },
    { code: 'ca', native: 'Català', sub: 'Catalan' },
    { code: 'zh-CN', native: '简体中文', sub: 'Chinese (Simplified)' },
    { code: 'zh-TW', native: '繁體中文', sub: 'Chinese (Traditional)' },
    { code: 'hr', native: 'Hrvatski', sub: 'Croatian' },
    { code: 'cs', native: 'Čeština', sub: 'Czech' },
    { code: 'da', native: 'Dansk', sub: 'Danish' },
    { code: 'nl', native: 'Nederlands', sub: 'Dutch' },
    { code: 'en', native: 'English', sub: 'English' },
    { code: 'eo', native: 'Esperanto', sub: 'Esperanto' },
    { code: 'et', native: 'Eesti', sub: 'Estonian' },
    { code: 'tl', native: 'Filipino', sub: 'Filipino' },
    { code: 'fi', native: 'Suomi', sub: 'Finnish' },
    { code: 'fr', native: 'Français', sub: 'French' },
    { code: 'gl', native: 'Galego', sub: 'Galician' },
    { code: 'ka', native: 'ქართული', sub: 'Georgian' },
    { code: 'de', native: 'Deutsch', sub: 'German' },
    { code: 'el', native: 'Ελληνικά', sub: 'Greek' },
    { code: 'gu', native: 'ગુજરાતી', sub: 'Gujarati' },
    { code: 'ht', native: 'Kreyòl Ayisyen', sub: 'Haitian Creole' },
    { code: 'iw', native: 'עברית', sub: 'Hebrew' },
    { code: 'hi', native: 'हिन्दी', sub: 'Hindi' },
    { code: 'hu', native: 'Magyar', sub: 'Hungarian' },
    { code: 'is', native: 'Íslenska', sub: 'Icelandic' },
    { code: 'id', native: 'Bahasa Indonesia', sub: 'Indonesian' },
    { code: 'ga', native: 'Gaeilge', sub: 'Irish' },
    { code: 'it', native: 'Italiano', sub: 'Italian' },
    { code: 'ja', native: '日本語', sub: 'Japanese' },
    { code: 'kn', native: 'ಕನ್ನಡ', sub: 'Kannada' },
    { code: 'ko', native: '한국어', sub: 'Korean' },
    { code: 'lo', native: 'ລາວ', sub: 'Lao' },
    { code: 'lv', native: 'Latviešu', sub: 'Latvian' },
    { code: 'lt', native: 'Lietuvių', sub: 'Lithuanian' },
    { code: 'mk', native: 'Македонски', sub: 'Macedonian' },
    { code: 'ms', native: 'Bahasa Melayu', sub: 'Malay' },
    { code: 'mt', native: 'Malti', sub: 'Maltese' },
    { code: 'no', native: 'Norsk', sub: 'Norwegian' },
    { code: 'fa', native: 'فارسی', sub: 'Persian' },
    { code: 'pl', native: 'Polski', sub: 'Polish' },
    { code: 'pt', native: 'Português', sub: 'Portuguese' },
    { code: 'ro', native: 'Română', sub: 'Romanian' },
    { code: 'ru', native: 'Русский', sub: 'Russian' },
    { code: 'sr', native: 'Српски', sub: 'Serbian' },
    { code: 'sk', native: 'Slovenčina', sub: 'Slovak' },
    { code: 'sl', native: 'Slovenščina', sub: 'Slovenian' },
    { code: 'es', native: 'Español', sub: 'Spanish' },
    { code: 'sw', native: 'Kiswahili', sub: 'Swahili' },
    { code: 'sv', native: 'Svenska', sub: 'Swedish' },
    { code: 'ta', native: 'தமிழ்', sub: 'Tamil' },
    { code: 'te', native: 'తెలుగు', sub: 'Telugu' },
    { code: 'th', native: 'ไทย', sub: 'Thai' },
    { code: 'tr', native: 'Türkçe', sub: 'Turkish' },
    { code: 'uk', native: 'Українська', sub: 'Ukrainian' },
    { code: 'ur', native: 'اردو', sub: 'Urdu' },
    { code: 'vi', native: 'Tiếng Việt', sub: 'Vietnamese' },
    { code: 'cy', native: 'Cymraeg', sub: 'Welsh' },
    { code: 'yi', native: 'ייִדיש', sub: 'Yiddish' }
];

function initTranslateDropdown() {
    const dropdownBody = document.getElementById('translate-dropdown-body');
    if (!dropdownBody) return;

    dropdownBody.innerHTML = LANGUAGES.map(lang => `
        <div class="translate-lang-item" data-code="${lang.code}">
            <span class="lang-native">${lang.native}</span>
            <span class="lang-sub">${lang.sub}</span>
        </div>
    `).join('');

    dropdownBody.querySelectorAll('.translate-lang-item').forEach(item => {
        item.addEventListener('click', () => {
            const code = item.dataset.code;
            selectLanguage(code);
        });
    });

    // Close button
    document.getElementById('translate-close')?.addEventListener('click', closeTranslateDropdown);

    // Close on outside click
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('translate-dropdown');
        const toggle = document.getElementById('translate-toggle');
        if (dropdown && !dropdown.contains(e.target) && e.target !== toggle && !toggle?.contains(e.target)) {
            closeTranslateDropdown();
        }
    });
}

function toggleTranslateDropdown() {
    const dropdown = document.getElementById('translate-dropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('active');
}

function closeTranslateDropdown() {
    const dropdown = document.getElementById('translate-dropdown');
    if (dropdown) dropdown.classList.remove('active');
}

function selectLanguage(langCode) {
    closeTranslateDropdown();

    if (langCode === 'en') {
        // Reset to English
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = 'en';
            select.dispatchEvent(new Event('change'));
        }
        showToast('Language reset to English', 'info');
        return;
    }

    // Try to trigger Google Translate
    let attempts = 0;
    const maxAttempts = 30;
    const interval = setInterval(() => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            clearInterval(interval);
            select.value = langCode;
            select.dispatchEvent(new Event('change'));
            const lang = LANGUAGES.find(l => l.code === langCode);
            showToast(`Translated to ${lang?.sub || langCode}`, 'success');
        } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            showToast('Translation service not ready. Please try again.', 'warning');
        }
        attempts++;
    }, 200);
}

/* ============================================
   PARALLAX EFFECT (Optional)
   ============================================ */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-video');

    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

/* ============================================
   CURSOR GLOW EFFECT (Desktop)
   ============================================ */
if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        const glow = document.querySelector('.cursor-glow');
        if (!glow) {
            const div = document.createElement('div');
            div.className = 'cursor-glow';
            div.style.cssText = `
                position: fixed;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0, 246, 255, 0.08) 0%, transparent 70%);
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: opacity 0.3s;
            `;
            document.body.appendChild(div);
        }

        const cursorGlow = document.querySelector('.cursor-glow');
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

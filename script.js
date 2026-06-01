const INTRO_AUTO_SECONDS = 3;
const AUTO_ENTER_SECONDS = 10;

const cursor = document.querySelector('.cursor');
const greetingText =
    "Meri Bagar Billi Soumya — you stand by me in everything. Thank you for being my strength, my calm, and my happiest place. 💖";
const greetingElement = document.querySelector('.greeting');
let charIndex = 0;
let navigatingToCause = false;
let introCountdownTimer = null;
let enterCountdownTimer = null;

if (cursor) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            left: e.clientX,
            top: e.clientY,
            duration: 0.15,
            ease: 'power2.out'
        });
    });
}

function typeGreeting() {
    if (charIndex < greetingText.length) {
        greetingElement.textContent += greetingText.charAt(charIndex);
        charIndex++;
        setTimeout(typeGreeting, 45);
    }
}

const floatingElements = ['💖', '✨', '🌸', '💫', '💕', '🦋', '⭐'];

function createFloating() {
    const element = document.createElement('div');
    element.className = 'floating';
    element.textContent = floatingElements[Math.floor(Math.random() * floatingElements.length)];
    element.style.left = Math.random() * 100 + 'vw';
    element.style.top = 100 + 'vh';
    element.style.fontSize = Math.random() * 18 + 18 + 'px';
    document.body.appendChild(element);

    gsap.to(element, {
        y: -window.innerHeight - 200,
        x: Math.random() * 120 - 60,
        rotation: Math.random() * 360,
        opacity: 0.9,
        duration: Math.random() * 4 + 6,
        ease: 'none',
        onComplete: () => element.remove()
    });
}

function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 55; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            a: Math.random() * 0.5 + 0.2
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 182, 220, ${p.a})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

function initPhotoOrbit() {
    const orbit = document.querySelector('.photo-orbit');
    if (!orbit) return;
    const thumbs = [4, 5, 6, 7, 8, 9, 10, 11];
    const cx = () => window.innerWidth / 2;
    const cy = () => window.innerHeight / 2;
    const rx = () => Math.min(window.innerWidth * 0.38, 320);
    const ry = () => Math.min(window.innerHeight * 0.32, 280);

    thumbs.forEach((n, i) => {
        const img = document.createElement('img');
        img.src = `assets/images/img${String(n).padStart(2, '0')}.jpg`;
        img.alt = '';
        img.className = 'orbit-thumb';
        orbit.appendChild(img);
        const start = (i / thumbs.length) * Math.PI * 2;
        const state = { t: start };
        gsap.to(state, {
            t: start + Math.PI * 2,
            duration: 16 + i,
            repeat: -1,
            ease: 'none',
            onUpdate: () => {
                const x = cx() + Math.cos(state.t) * rx() - 36;
                const y = cy() + Math.sin(state.t) * ry() - 36;
                img.style.left = `${x}px`;
                img.style.top = `${y}px`;
            }
        });
    });
}

function burstHearts(x, y) {
    const emojis = ['💖', '✨', '💕', '🌸'];
    for (let i = 0; i < 14; i++) {
        const el = document.createElement('div');
        el.className = 'floating';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.fontSize = Math.random() * 16 + 14 + 'px';
        el.style.opacity = '1';
        document.body.appendChild(el);
        gsap.to(el, {
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200 - 80,
            opacity: 0,
            rotation: Math.random() * 360,
            duration: 1.2 + Math.random(),
            onComplete: () => el.remove()
        });
    }
}

function initIntroGate(onOpen) {
    const gate = document.getElementById('intro-gate');
    if (!gate) {
        onOpen();
        return;
    }

    const envelope = gate.querySelector('.envelope');
    const btn = gate.querySelector('.open-surprise-btn');
    let opened = false;

    function openGate() {
        if (opened) return;
        opened = true;
        if (introCountdownTimer) clearInterval(introCountdownTimer);
        gate.classList.add('is-closing');
        gate.style.pointerEvents = 'none';
        envelope?.classList.add('open');
        burstHearts(window.innerWidth / 2, window.innerHeight / 2);
        SiteMusic.play();

        gsap.to(gate, {
            opacity: 0,
            scale: 1.04,
            duration: 1,
            delay: 0.7,
            ease: 'power2.inOut',
            onComplete: () => {
                gate.classList.add('hidden');
                onOpen();
            }
        });
    }

    btn?.addEventListener('click', openGate);
    envelope?.addEventListener('click', openGate);
    envelope?.addEventListener('touchend', (e) => {
        e.preventDefault();
        openGate();
    });
    envelope?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGate();
        }
    });

    startIntroCountdown(openGate);
}

function goToCausePage() {
    if (navigatingToCause) return;
    navigatingToCause = true;
    if (introCountdownTimer) clearInterval(introCountdownTimer);
    if (enterCountdownTimer) clearInterval(enterCountdownTimer);

    gsap.to('body', {
        opacity: 0,
        scale: 0.98,
        duration: 0.9,
        onComplete: () => {
            window.location.href = 'cause.html';
        }
    });
}

function runCountdown({ seconds, numberEl, labelEl, labels, onDone }) {
    let left = seconds;
    if (numberEl) numberEl.textContent = String(left);
    if (labelEl && labels?.[left]) labelEl.textContent = labels[left];

    const timer = setInterval(() => {
        left -= 1;
        if (numberEl) numberEl.textContent = String(Math.max(left, 0));
        if (labelEl && labels?.[left]) labelEl.textContent = labels[left];

        if (left <= 0) {
            clearInterval(timer);
            onDone();
        }
    }, 1000);
    return timer;
}

function startEnterCountdown() {
    const numberEl = document.querySelector('.countdown-number');
    const labelEl = document.querySelector('.countdown-label');
    if (!numberEl) {
        goToCausePage();
        return;
    }

    const labels = {
        10: 'sec mein tumhara surprise khulega… ✨',
        5: 'bas thodi der aur… 💕',
        3: 'teen…',
        2: 'do…',
        1: 'ek…',
        0: 'chalo andar! 💖'
    };

    if (enterCountdownTimer) clearInterval(enterCountdownTimer);
    enterCountdownTimer = runCountdown({
        seconds: AUTO_ENTER_SECONDS,
        numberEl,
        labelEl,
        labels,
        onDone: goToCausePage
    });
}

function startIntroCountdown(openGate) {
    const numberEl = document.querySelector('.intro-countdown-num');
    const labelEl = document.querySelector('.intro-countdown-text');
    if (!numberEl) {
        setTimeout(openGate, 800);
        return;
    }

    const labels = {
        3: 'sec mein khul raha hai…',
        2: 'taiyaar ho jao… ✨',
        1: 'bas ek sec…',
        0: 'khul gaya! 💌'
    };

    introCountdownTimer = runCountdown({
        seconds: INTRO_AUTO_SECONDS,
        numberEl,
        labelEl,
        labels,
        onDone: openGate
    });
}

function startMainPage() {
    document.querySelector('.container')?.classList.add('revealed');
    startEnterCountdown();

    const tl = gsap.timeline();
    tl.to('.eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
        .to('h1', { opacity: 1, y: 0, duration: 1, ease: 'bounce.out' }, '-=0.4')
        .to('.hero-preview', { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.4)' }, '-=0.5')
        .from('.hero-feature', { scale: 0.85, opacity: 0, duration: 1 }, '-=0.7')
        .to('.nicknames', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .to('.greeting', { opacity: 1, duration: 0.5 }, '-=0.3')
        .to('.auto-countdown', { opacity: 1, y: 0, duration: 0.8, ease: 'back.out' }, '-=0.2');

    gsap.to('.hero-feature', { y: -6, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    charIndex = 0;
    if (greetingElement) greetingElement.textContent = '';
    typeGreeting();
    setInterval(createFloating, 900);
}

window.addEventListener('load', () => {
    initParticles();
    initPhotoOrbit();
    initIntroGate(startMainPage);
});


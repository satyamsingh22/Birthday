gsap.registerPlugin(ScrollTrigger);

const reasons = [
    {
        text: 'You support me in every ups and downs — I never feel alone when you are with me.',
        emoji: '🌟',
        image: 'assets/images/img04.jpg',
        tag: ''
    },
    {
        text: 'You believe in me even when I doubt myself. That kind of love is rare.',
        emoji: '💗',
        image: 'assets/images/img05.jpg',
        tag: ''
    },
    {
        text: 'Meri Bagar Billi — wild, cute, and mine. Your smile fixes my worst days.',
        emoji: '🐾',
        image: 'assets/images/img06.jpg',
        tag: 'Meri Bagar Billi',
        featured: true
    },
    {
        text: 'Meri Bagar Billi — from small moments to big dreams, you walk with me.',
        emoji: '💖',
        image: 'assets/images/img07.jpg',
        tag: 'Meri Bagar Billi'
    },
    {
        text: 'Satyam + Soumya = home. I am grateful for you every single day.',
        emoji: '🦋',
        image: 'assets/images/img08.jpg',
        tag: ''
    }
];

let currentReasonIndex = 0;
const reasonsContainer = document.getElementById('reasons-container');
const shuffleButton = document.querySelector('.shuffle-button');
const reasonCounter = document.querySelector('.reason-counter');
let isTransitioning = false;

function createReasonCard(reason) {
    const card = document.createElement('article');
    card.className = 'reason-card' + (reason.featured ? ' featured' : '');

    if (reason.tag) {
        const tag = document.createElement('span');
        tag.className = 'reason-tag';
        tag.textContent = reason.tag;
        card.appendChild(tag);
    }

    const text = document.createElement('div');
    text.className = 'reason-text';
    text.innerHTML = `${reason.emoji} ${reason.text}`;

    const media = document.createElement('div');
    media.className = 'reason-media photo-frame';
    media.innerHTML = `<img src="${reason.image}" alt="Memory with Soumya" loading="lazy">`;

    card.appendChild(text);
    card.appendChild(media);

    gsap.from(card, {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.65,
        ease: 'back.out(1.4)'
    });

    return card;
}

function initSplitHero() {
    const wrap = document.querySelector('.split-wrap');
    if (!wrap) return;

    gsap.from('.split-left', { x: '-100%', duration: 1.2, ease: 'power3.out', delay: 0.3 });
    gsap.from('.split-right', { x: '100%', duration: 1.2, ease: 'power3.out', delay: 0.3 });

    wrap.addEventListener('click', () => {
        wrap.classList.toggle('merged');
        if (wrap.classList.contains('merged')) {
            gsap.to('.split-badge', { scale: 1.15, duration: 0.4, yoyo: true, repeat: 1 });
        }
    });

    setTimeout(() => wrap.classList.add('merged'), 2500);
}

function displayNewReason() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (currentReasonIndex < reasons.length) {
        reasonsContainer.appendChild(createReasonCard(reasons[currentReasonIndex]));
        reasonCounter.textContent = `Reason ${currentReasonIndex + 1} of ${reasons.length}`;
        currentReasonIndex++;
        createFloatingElement();

        if (currentReasonIndex === reasons.length) {
            shuffleButton.dataset.mode = 'memories';
            gsap.to(shuffleButton, {
                scale: 1.05,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)',
                onComplete: () => {
                    shuffleButton.textContent = 'See Our Memories ✨';
                    shuffleButton.classList.add('story-mode');
                }
            });
            gsap.to('.ending-section', {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.3,
                ease: 'power2.out'
            });
        }

        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
}

shuffleButton.addEventListener('click', () => {
    gsap.to(shuffleButton, { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 });
    if (shuffleButton.dataset.mode === 'memories') {
        gsap.to('body', {
            opacity: 0,
            duration: 0.9,
            onComplete: () => {
                window.location.href = 'last.html';
            }
        });
        return;
    }
    displayNewReason();
});

function createFloatingElement() {
    const elements = ['🌸', '✨', '💖', '🦋', '⭐', '💝', '🐾'];
    const element = document.createElement('div');
    element.className = 'floating';
    element.textContent = elements[Math.floor(Math.random() * elements.length)];
    element.style.left = Math.random() * window.innerWidth + 'px';
    element.style.top = window.innerHeight + 'px';
    element.style.fontSize = Math.random() * 20 + 14 + 'px';
    document.body.appendChild(element);

    gsap.to(element, {
        y: -window.innerHeight - 100,
        x: Math.random() * 80 - 40,
        rotation: Math.random() * 180,
        opacity: 0.85,
        duration: Math.random() * 6 + 8,
        ease: 'power1.out',
        onComplete: () => element.remove()
    });
}

const cursor = document.querySelector('.custom-cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX - 15, y: e.clientY - 15, duration: 0.2 });
    });
}

gsap.from('h1', { opacity: 0, y: -30, duration: 1, ease: 'bounce.out' });
gsap.from('.subtitle', { opacity: 0, duration: 0.8, delay: 0.3 });

initSplitHero();
setInterval(createFloatingElement, 2200);

gsap.registerPlugin(ScrollTrigger);

const IMAGE_COUNT = 16;
const slideImages = Array.from({ length: IMAGE_COUNT }, (_, i) =>
    `assets/images/img${String(i + 1).padStart(2, '0')}.jpg`
);

const VIDEOS = [
    { src: 'assets/videos/video01.mp4', label: 'Us — moment 1', sub: 'Bagar Billi 💕' },
    { src: 'assets/videos/video02.mp4', label: 'Us — moment 2', sub: 'Together always' },
    { src: 'assets/videos/video03.mp4', label: 'Us — moment 3', sub: 'Bagar Billi 🐾' },
    { src: 'assets/videos/video04.mp4', label: 'Us — moment 4', sub: 'My favourite human' },
    { src: 'assets/videos/video05.mp4', label: 'Us — moment 5', sub: 'Satyam + Soumya' }
];

function initHearts() {
    const container = document.querySelector('.floating-hearts');
    const hearts = ['💝', '💖', '💗', '💓', '💕', '✨', '🐾'];
    for (let i = 0; i < 14; i++) {
        const el = document.createElement('span');
        el.className = 'heart-float';
        el.textContent = hearts[i % hearts.length];
        el.style.left = `${Math.random() * 100}%`;
        el.style.animationDuration = `${5 + Math.random() * 6}s`;
        el.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(el);
    }
}

function initSlideshow() {
    const slideshow = document.getElementById('slideshow');
    const dotsContainer = document.getElementById('slide-dots');
    let index = 0;

    const first = slideshow.querySelector('.slide');
    first.src = slideImages[0];

    slideImages.forEach((src, i) => {
        if (i > 0) {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Memory ${i + 1}`;
            img.className = 'slide';
            slideshow.appendChild(img);
        }

        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    const slides = slideshow.querySelectorAll('.slide');
    const dots = dotsContainer.querySelectorAll('button');

    function goTo(i) {
        index = i;
        slides.forEach((s, j) => s.classList.toggle('active', j === i));
        dots.forEach((d, j) => d.classList.toggle('active', j === i));
    }

    setInterval(() => goTo((index + 1) % slides.length), 4000);
}

function initCinemaReel() {
    const track = document.getElementById('cinema-track');
    const progress = document.getElementById('cinema-progress');
    const counter = document.getElementById('cinema-counter');
    const prevBtn = document.getElementById('cinema-prev');
    const nextBtn = document.getElementById('cinema-next');

    let activeIndex = 0;
    let playingVideo = null;

    VIDEOS.forEach((item, i) => {
        const scene = document.createElement('article');
        scene.className = 'reel-scene' + (i === 0 ? ' is-active' : '');
        scene.dataset.index = String(i);

        scene.innerHTML = `
            <div class="reel-pulse"></div>
            <video class="reel-video" muted playsinline loop preload="metadata" poster="assets/images/img0${(i % 6) + 1}.jpg">
                <source src="${item.src}" type="video/mp4">
            </video>
            <div class="reel-ui">
                <span class="reel-label">${item.label}</span>
                <span class="reel-sub">${item.sub}</span>
                <div class="reel-controls">
                    <button type="button" class="reel-play" aria-label="Play">▶</button>
                    <button type="button" class="reel-sound" aria-label="Sound off">🔇 Sound</button>
                </div>
            </div>
        `;

        const video = scene.querySelector('video');
        const playBtn = scene.querySelector('.reel-play');
        const soundBtn = scene.querySelector('.reel-sound');

        playBtn.addEventListener('click', () => togglePlay(scene, video, playBtn));
        soundBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            soundBtn.textContent = video.muted ? '🔇 Sound' : '🔊 Sound';
        });

        track.appendChild(scene);
    });

    const scenes = track.querySelectorAll('.reel-scene');

    function updateUI() {
        scenes.forEach((s, i) => s.classList.toggle('is-active', i === activeIndex));
        progress.style.width = `${((activeIndex + 1) / VIDEOS.length) * 100}%`;
        counter.textContent = `${activeIndex + 1} / ${VIDEOS.length}`;

        scenes.forEach((s, i) => {
            const v = s.querySelector('video');
            if (i !== activeIndex) {
                v.pause();
                v.currentTime = 0;
                s.querySelector('.reel-play').textContent = '▶';
                s.querySelector('.reel-play').classList.remove('playing');
            }
        });

        const active = scenes[activeIndex];
        const v = active.querySelector('video');
        playingVideo = v;
        v.play().catch(() => {});
        active.querySelector('.reel-play').textContent = '❚❚';
        active.querySelector('.reel-play').classList.add('playing');

        gsap.fromTo(active, { scale: 0.88, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' });
        active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    function togglePlay(scene, video, btn) {
        if (video.paused) {
            if (playingVideo && playingVideo !== video) playingVideo.pause();
            playingVideo = video;
            activeIndex = Number(scene.dataset.index);
            updateUI();
        } else {
            video.pause();
            btn.textContent = '▶';
            btn.classList.remove('playing');
        }
    }

    function go(delta) {
        activeIndex = (activeIndex + delta + VIDEOS.length) % VIDEOS.length;
        updateUI();
    }

    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
                const idx = Number(entry.target.dataset.index);
                if (idx !== activeIndex) {
                    activeIndex = idx;
                    updateUI();
                }
            });
        },
        { root: track, threshold: [0.55, 0.75] }
    );

    scenes.forEach((s) => observer.observe(s));

    gsap.from('.reel-scene', {
        opacity: 0,
        x: 80,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#cinema-section', start: 'top 80%' }
    });

    updateUI();
}

function initCollage() {
    const grid = document.getElementById('photo-collage');
    slideImages.forEach((src, i) => {
        const tile = document.createElement('div');
        const isFeatured = src.includes('img06');
        tile.className = 'tile' + (isFeatured ? ' featured-tile' : '');
        tile.innerHTML = `<img src="${src}" alt="Memory ${i + 1}" loading="lazy">`;
        tile.addEventListener('click', () => openLightbox(src));
        grid.appendChild(tile);
    });

    gsap.from('.tile', {
        opacity: 0,
        y: 30,
        stagger: 0.05,
        duration: 0.5,
        scrollTrigger: { trigger: grid, start: 'top 85%' }
    });
}

function openLightbox(src) {
    let box = document.querySelector('.lightbox');
    if (!box) {
        box = document.createElement('div');
        box.className = 'lightbox';
        box.innerHTML =
            '<button class="lightbox-close" type="button" aria-label="Close">&times;</button><img src="" alt="Enlarged memory">';
        document.body.appendChild(box);
        box.querySelector('.lightbox-close').addEventListener('click', () => box.classList.remove('open'));
        box.addEventListener('click', (e) => {
            if (e.target === box) box.classList.remove('open');
        });
    }
    box.querySelector('img').src = src;
    box.classList.add('open');
}

document.getElementById('replay-btn').addEventListener('click', () => {
    gsap.to('body', {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
            window.location.href = 'index.html';
        }
    });
});

gsap.from('.spotlight-frame', {
    scale: 0.9,
    opacity: 0,
    duration: 1.2,
    ease: 'back.out',
    scrollTrigger: { trigger: '.pyari-spotlight', start: 'top 85%' }
});

gsap.from('.nick-bubble', {
    y: 20,
    opacity: 0,
    stagger: 0.2,
    duration: 0.7,
    scrollTrigger: { trigger: '.floating-nicks', start: 'top 90%' }
});

initHearts();
initSlideshow();
initCinemaReel();
initCollage();

gsap.from('.welcome h1', { opacity: 0, scale: 0.9, duration: 1.2, ease: 'back.out' });
gsap.from('.tagline', { opacity: 0, y: 20, duration: 0.8, delay: 0.4 });

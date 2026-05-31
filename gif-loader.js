/** Hide spinner when soumya-memories.gif is ready */
function initMemoryGifLoaders() {
    document.querySelectorAll('.gif-showcase').forEach((box) => {
        const img = box.querySelector('.memory-gif');
        const loader = box.querySelector('.gif-loader');
        if (!img) return;

        box.classList.add('is-loading');

        function done() {
            box.classList.remove('is-loading');
            loader?.classList.add('hidden');
            img.classList.add('loaded');
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(img, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out' });
            }
        }

        if (img.complete && img.naturalWidth > 0) {
            done();
        } else {
            img.addEventListener('load', done);
            img.addEventListener('error', () => {
                if (img.dataset.fallback) return;
                img.dataset.fallback = '1';
                img.src = 'assets/soumya-collage.gif';
                if (loader) loader.querySelector('span').textContent = 'Chhoti GIF load ho rahi…';
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', initMemoryGifLoaders);

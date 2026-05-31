/**
 * 4 background music moods — switch from the panel (bottom-right).
 */
const SiteMusic = (() => {
    const STORAGE_PLAYING = 'soumya-music-playing';
    const STORAGE_TRACK = 'soumya-music-track';
    const VOLUME = 0.42;

    const TRACKS = [
        { id: 'romantic', name: 'Romantic', emoji: '💕', url: 'assets/music-romantic.mp3' },
        { id: 'happy', name: 'Happy', emoji: '🎂', url: 'assets/music-happy.mp3' },
        { id: 'calm', name: 'Calm', emoji: '🌙', url: 'assets/music-calm.mp3' },
        { id: 'dreamy', name: 'Dreamy', emoji: '✨', url: 'assets/music-dreamy.mp3' }
    ];

    let trackIndex = 0;
    let audio = null;
    let playing = false;
    let panelOpen = false;
    let fab = null;
    let hint = null;
    let panel = null;

    function getSavedTrackIndex() {
        try {
            const n = parseInt(sessionStorage.getItem(STORAGE_TRACK), 10);
            return n >= 0 && n < TRACKS.length ? n : 0;
        } catch (_) {
            return 0;
        }
    }

    function saveTrackIndex() {
        try {
            sessionStorage.setItem(STORAGE_TRACK, String(trackIndex));
        } catch (_) {}
    }

    function savePlaying() {
        try {
            sessionStorage.setItem(STORAGE_PLAYING, playing ? '1' : '0');
        } catch (_) {}
    }

    function shouldAutoResume() {
        try {
            return sessionStorage.getItem(STORAGE_PLAYING) === '1';
        } catch (_) {
            return false;
        }
    }

    function currentTrack() {
        return TRACKS[trackIndex];
    }

    function createAudio() {
        if (audio) {
            audio.pause();
            audio.src = '';
        }
        audio = new Audio(currentTrack().url);
        audio.loop = true;
        audio.volume = VOLUME;
        audio.preload = 'auto';
    }

    function createUI() {
        if (document.getElementById('music-fab')) return;

        hint = document.createElement('div');
        hint.className = 'music-hint';
        hint.textContent = '🎵 Play music · ♫ se 4 vibes choose karo';

        panel = document.createElement('div');
        panel.className = 'music-panel';
        panel.id = 'music-panel';
        panel.innerHTML = `<p class="music-panel-title">Choose vibe</p><div class="music-tracks"></div>`;

        const trackWrap = panel.querySelector('.music-tracks');
        TRACKS.forEach((t, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'music-track-btn' + (i === trackIndex ? ' active' : '');
            btn.dataset.index = String(i);
            btn.innerHTML = `<span class="track-emoji">${t.emoji}</span><span class="track-name">${t.name}</span>`;
            btn.addEventListener('click', () => selectTrack(i));
            trackWrap.appendChild(btn);
        });

        fab = document.createElement('button');
        fab.type = 'button';
        fab.id = 'music-fab';
        fab.className = 'music-fab muted-state';
        fab.setAttribute('aria-label', 'Music controls');
        fab.textContent = '🎵';

        fab.addEventListener('click', () => togglePlay());

        const pickerBtn = document.createElement('button');
        pickerBtn.type = 'button';
        pickerBtn.className = 'music-picker-btn';
        pickerBtn.textContent = '♫';
        pickerBtn.setAttribute('aria-label', 'Choose music type');
        pickerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel();
        });

        const dock = document.createElement('div');
        dock.className = 'music-dock';
        dock.appendChild(panel);
        dock.appendChild(pickerBtn);
        dock.appendChild(fab);

        document.body.appendChild(hint);
        document.body.appendChild(dock);

        setTimeout(() => hint.classList.add('show'), 500);
        setTimeout(() => hint.classList.remove('show'), 5500);
    }

    function updateTrackButtons() {
        panel?.querySelectorAll('.music-track-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === trackIndex);
        });
        const t = currentTrack();
        if (hint && !playing) {
            hint.textContent = `${t.emoji} ${t.name} — tap 🎵 to play`;
        }
    }

    function updateUI() {
        if (!fab) return;
        fab.classList.toggle('playing', playing);
        fab.classList.toggle('muted-state', !playing);
        fab.textContent = playing ? '🎶' : '🔇';
        updateTrackButtons();
    }

    function togglePanel() {
        panelOpen = !panelOpen;
        panel?.classList.toggle('open', panelOpen);
    }

    async function selectTrack(index) {
        if (index === trackIndex && playing) return;
        const wasPlaying = playing;
        pause();
        trackIndex = index;
        saveTrackIndex();
        createAudio();
        updateTrackButtons();
        if (wasPlaying) await play();
        panelOpen = false;
        panel?.classList.remove('open');
    }

    async function play() {
        if (!audio) createAudio();
        try {
            await audio.play();
            playing = true;
            savePlaying();
            updateUI();
        } catch (e) {
            console.warn('Music play blocked — tap 🎵', e);
        }
    }

    function pause() {
        playing = false;
        audio?.pause();
        savePlaying();
        updateUI();
    }

    async function togglePlay() {
        if (playing) pause();
        else await play();
        hint?.classList.remove('show');
    }

    async function setup() {
        trackIndex = getSavedTrackIndex();
        createUI();
        createAudio();
        updateUI();
        if (shouldAutoResume()) await play();
    }

    return { setup, play, pause, toggle: togglePlay, selectTrack };
})();

document.addEventListener('DOMContentLoaded', () => SiteMusic.setup());

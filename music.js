/**
 * 4 Bollywood background tracks — switch from the panel (bottom-right).
 * Streams official uploads via YouTube (needs internet).
 */
const SiteMusic = (() => {
    const STORAGE_PLAYING = 'soumya-music-playing';
    const STORAGE_TRACK = 'soumya-music-track';
    const VOLUME = 42;

    const TRACKS = [
        {
            id: 'romantic',
            name: 'Tum Hi Ho',
            movie: 'Aashiqui 2',
            emoji: '💕',
            youtubeId: 'Umqb9KENgmk'
        },
        {
            id: 'happy',
            name: 'London Thumakda',
            movie: 'Queen',
            emoji: '🎂',
            youtubeId: 'udra3Mfw2oo'
        },
        {
            id: 'calm',
            name: 'Agar Tum Saath Ho',
            movie: 'Tamasha',
            emoji: '🌙',
            youtubeId: 'xRb8hxwN5zc'
        },
        {
            id: 'dreamy',
            name: 'Ilahi',
            movie: 'YJHD',
            emoji: '✨',
            youtubeId: 'fdubeMFwuGs'
        }
    ];

    let trackIndex = 0;
    let ytPlayer = null;
    let ytApiLoaded = false;
    let playerReady = false;
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

    function loadYouTubeAPI() {
        return new Promise((resolve) => {
            if (window.YT?.Player) {
                resolve();
                return;
            }
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                prev?.();
                resolve();
            };
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        });
    }

    function ensurePlayerHost() {
        if (document.getElementById('music-yt-player')) return;
        const host = document.createElement('div');
        host.className = 'music-yt-host';
        host.innerHTML = '<div id="music-yt-player"></div>';
        document.body.appendChild(host);
    }

    async function ensurePlayer() {
        ensurePlayerHost();
        if (!ytApiLoaded) {
            await loadYouTubeAPI();
            ytApiLoaded = true;
        }
        if (ytPlayer) return;

        await new Promise((resolve) => {
            ytPlayer = new YT.Player('music-yt-player', {
                height: '0',
                width: '0',
                videoId: currentTrack().youtubeId,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    rel: 0,
                    playsinline: 1,
                    origin: window.location.origin
                },
                events: {
                    onReady: (e) => {
                        playerReady = true;
                        e.target.setVolume(VOLUME);
                        resolve();
                    },
                    onStateChange: (e) => {
                        if (e.data === YT.PlayerState.ENDED) {
                            e.target.seekTo(0);
                            e.target.playVideo();
                        }
                    }
                }
            });
        });
    }

    async function loadTrack() {
        await ensurePlayer();
        if (!playerReady) return;
        ytPlayer.loadVideoById(currentTrack().youtubeId);
        ytPlayer.setVolume(VOLUME);
    }

    function createUI() {
        if (document.getElementById('music-fab')) return;

        hint = document.createElement('div');
        hint.className = 'music-hint';
        hint.textContent = '🎵 Bollywood songs · ♫ se choose karo';

        panel = document.createElement('div');
        panel.className = 'music-panel';
        panel.id = 'music-panel';
        panel.innerHTML = `<p class="music-panel-title">Bollywood vibes</p><div class="music-tracks"></div>`;

        const trackWrap = panel.querySelector('.music-tracks');
        TRACKS.forEach((t, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'music-track-btn' + (i === trackIndex ? ' active' : '');
            btn.dataset.index = String(i);
            btn.innerHTML =
                `<span class="track-emoji">${t.emoji}</span>` +
                `<span class="track-name">${t.name}</span>` +
                `<span class="track-movie">${t.movie}</span>`;
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
        await loadTrack();
        updateTrackButtons();
        if (wasPlaying) await play();
        panelOpen = false;
        panel?.classList.remove('open');
    }

    async function play() {
        try {
            await loadTrack();
            ytPlayer.playVideo();
            playing = true;
            savePlaying();
            updateUI();
        } catch (e) {
            console.warn('Music play blocked — tap 🎵', e);
        }
    }

    function pause() {
        playing = false;
        if (playerReady && ytPlayer?.pauseVideo) {
            ytPlayer.pauseVideo();
        }
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
        updateUI();
        if (shouldAutoResume()) await play();
    }

    return { setup, play, pause, toggle: togglePlay, selectTrack };
})();

document.addEventListener('DOMContentLoaded', () => SiteMusic.setup());

/* ============================================
   THIỆP MỜI HỘI ĐỒNG HƯƠNG - SCRIPT
   Văn Tiến & Ngọc Khuyên
   ============================================ */

// ===== CONFIGURATION =====
const CONFIG = {
    weddingDate: new Date('2026-07-25T10:00:00+07:00'),
    images: [
        'image/optimized/2S8A0140.jpg',
        'image/optimized/2S8A0167.jpg',
        'image/optimized/2S8A0362.jpg',
        'image/optimized/2S8A0365.jpg',
        'image/optimized/2S8A0377.jpg',
        'image/optimized/2S8A0382.jpg',
        'image/optimized/2S8A0405.jpg',
        'image/optimized/2S8A0598.jpg',
        'image/optimized/2S8A0602.jpg',
        'image/optimized/2S8A0630.jpg',
        'image/optimized/2S8A0653.jpg',
        'image/optimized/2S8A0661.jpg',
        'image/optimized/2S8A0694.jpg',
        'image/optimized/2S8A0715.jpg',
        'image/optimized/2S8A0788.jpg',
        'image/optimized/2S8A0803.jpg',
        'image/optimized/2S8A0806.jpg',
        'image/optimized/2S8A0809.jpg',
        'image/optimized/2S8A0826.jpg'
    ]
};

// ===== STATE =====
let isMusicPlaying = false;
let galleryObserver = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initAOS();
    buildGallery();
    initFloatingPetals();
});

function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 80,
            easing: 'ease-out-cubic'
        });
    }
}

// ===== WELCOME OVERLAY =====
function openInvitation() {
    const overlay = document.getElementById('welcome-overlay');
    const main = document.getElementById('invitation-main');

    overlay.classList.add('fade-out');

    // Start music
    playMusic();

    setTimeout(() => {
        overlay.style.display = 'none';
        main.classList.remove('hidden');
        main.classList.add('show');

        // Re-init AOS after showing main content
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            // Init gallery scroll observer after content is visible
            initGalleryObserver();
        }, 100);
    }, 800);
}

// ===== MUSIC PLAYER =====
function playMusic() {
    const audio = document.getElementById('bg-music');
    const player = document.getElementById('music-player');

    audio.play().then(() => {
        isMusicPlaying = true;
        player.classList.add('playing');
    }).catch(err => {
        console.log('Autoplay blocked:', err);
        isMusicPlaying = false;
    });
}

function toggleMusic() {
    const audio = document.getElementById('bg-music');
    const player = document.getElementById('music-player');

    if (isMusicPlaying) {
        audio.pause();
        isMusicPlaying = false;
        player.classList.remove('playing');
    } else {
        audio.play().then(() => {
            isMusicPlaying = true;
            player.classList.add('playing');
        }).catch(err => console.log('Play error:', err));
    }
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date();
    const diff = CONFIG.weddingDate - now;

    if (diff <= 0) {
        document.getElementById('cd-days').textContent = '00';
        document.getElementById('cd-hours').textContent = '00';
        document.getElementById('cd-minutes').textContent = '00';
        document.getElementById('cd-seconds').textContent = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    animateValue('cd-days', days);
    animateValue('cd-hours', hours);
    animateValue('cd-minutes', minutes);
    animateValue('cd-seconds', seconds);
}

function animateValue(id, value) {
    const el = document.getElementById(id);
    const newVal = String(value).padStart(2, '0');
    if (el.textContent !== newVal) {
        el.style.transform = 'translateY(-4px)';
        el.style.opacity = '0.5';
        setTimeout(() => {
            el.textContent = newVal;
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
        }, 150);
    }
}

// ===== SCROLL-REVEAL GALLERY =====
function buildGallery() {
    const gallery = document.getElementById('photo-gallery');
    if (!gallery) return;

    // Define gallery layout:
    // Mix of single images and rows of 2 for visual variety
    const layout = [
        { type: 'single', indices: [0] },
        { type: 'pair', indices: [1, 2] },
        { type: 'single', indices: [3] },
        { type: 'pair', indices: [4, 5] },
        { type: 'single', indices: [6] },
        { type: 'pair', indices: [7, 8] },
        { type: 'single', indices: [9] },
        { type: 'pair', indices: [10, 11] },
        { type: 'single', indices: [12] },
        { type: 'pair', indices: [13, 14] },
        { type: 'single', indices: [15] },
        { type: 'pair', indices: [16, 17] },
        { type: 'single', indices: [18] }
    ];

    layout.forEach((row) => {
        if (row.type === 'single') {
            const idx = row.indices[0];
            if (idx < CONFIG.images.length) {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'gallery-row gallery-row-1';

                const item = createGalleryItem(idx);
                rowDiv.appendChild(item);
                gallery.appendChild(rowDiv);
            }
        } else {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'gallery-row gallery-row-2';

            row.indices.forEach(idx => {
                if (idx < CONFIG.images.length) {
                    const item = createGalleryItem(idx);
                    rowDiv.appendChild(item);
                }
            });

            gallery.appendChild(rowDiv);
        }
    });
}

function createGalleryItem(index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-index', index);

    const img = document.createElement('img');
    img.src = CONFIG.images[index];
    img.alt = `Ảnh cưới ${index + 1}`;
    img.loading = 'lazy';

    img.addEventListener('click', () => openLightbox(index));
    item.appendChild(img);

    return item;
}

function initGalleryObserver() {
    const items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;

    galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on position within viewport
                const item = entry.target;
                const delay = idx * 100; // stagger effect
                setTimeout(() => {
                    item.classList.add('revealed');
                }, delay);
                galleryObserver.unobserve(item);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    items.forEach(item => galleryObserver.observe(item));
}

// ===== LIGHTBOX =====
let lightboxIndex = 0;

function openLightbox(index) {
    lightboxIndex = index;
    const lb = document.getElementById('lightbox');
    lb.classList.add('active');
    updateLightboxImage();
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function closeLightboxOnBackdrop(e) {
    if (e.target === document.getElementById('lightbox')) {
        closeLightbox();
    }
}

function lightboxNav(dir) {
    lightboxIndex = (lightboxIndex + dir + CONFIG.images.length) % CONFIG.images.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    img.src = CONFIG.images[lightboxIndex];
    img.alt = `Ảnh cưới ${lightboxIndex + 1}`;
    // Trigger zoom animation
    img.style.animation = 'none';
    img.offsetHeight; // reflow
    img.style.animation = '';
    counter.textContent = `${lightboxIndex + 1} / ${CONFIG.images.length}`;
}

// Keyboard support
document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'ArrowLeft') lightboxNav(-1);
});

// Touch swipe for lightbox
(function () {
    let touchStartX = 0;
    document.addEventListener('touchstart', e => {
        const lb = document.getElementById('lightbox');
        if (lb && lb.classList.contains('active')) {
            touchStartX = e.changedTouches[0].screenX;
        }
    }, { passive: true });

    document.addEventListener('touchend', e => {
        const lb = document.getElementById('lightbox');
        if (lb && lb.classList.contains('active')) {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                lightboxNav(diff > 0 ? 1 : -1);
            }
        }
    }, { passive: true });
})();

// ===== FLOATING PETALS & MAGICAL EFFECTS =====
function initFloatingPetals() {
    // Create petals very frequently for a dense flower-falling effect
    setInterval(() => {
        if (document.getElementById('welcome-overlay')?.style.display === 'none') {
            // Spawn 1 to 3 petals at once to make it thicker
            const count = Math.floor(Math.random() * 3) + 1;
            for(let i = 0; i < count; i++) {
                createPetal();
            }
        }
    }, 300);

    // Create magical glowing orbs periodically
    setInterval(() => {
        if (document.getElementById('welcome-overlay')?.style.display === 'none') {
            createGlowingOrb();
        }
    }, 1500);
}

function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';

    // Random position across the screen
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.top = '-20px';

    // Random size (some big, some small for depth)
    const size = 6 + Math.random() * 14;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';

    // Varied animation duration for realistic falling
    const duration = 4 + Math.random() * 6;
    petal.style.animationDuration = duration + 's';

    // Random horizontal drift
    const drift = -50 + Math.random() * 100;
    petal.style.setProperty('--drift', drift + 'px');

    // Slight random delay so they don't fall exactly together
    petal.style.animationDelay = (Math.random() * 2) + 's';

    document.body.appendChild(petal);

    // Cleanup
    setTimeout(() => {
        petal.remove();
    }, (duration + 2) * 1000);
}

function createGlowingOrb() {
    const orb = document.createElement('div');
    orb.className = 'glowing-orb';

    // Start from bottom or sides
    orb.style.left = Math.random() * 100 + 'vw';
    orb.style.bottom = '-50px';

    const size = 4 + Math.random() * 8;
    orb.style.width = size + 'px';
    orb.style.height = size + 'px';

    const duration = 8 + Math.random() * 10;
    orb.style.animationDuration = duration + 's';

    document.body.appendChild(orb);

    setTimeout(() => {
        orb.remove();
    }, duration * 1000);
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

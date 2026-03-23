
const useImageTemplates = false;

const TEMPLATES = [
    { id: 'sakura',   label: '🌸 Sakura',   class: 'strip-tpl-sakura',   emoji: '🌸', image: 'template-sakura.png'   },
    { id: 'candy',    label: '🍭 Candy',    class: 'strip-tpl-candy',    emoji: '🍭', image: 'template-candy.png'    },
    { id: 'cotton',   label: '☁️ Cotton',   class: 'strip-tpl-cotton',   emoji: '☁️', image: 'template-cotton.png'   },
    { id: 'dreamy',   label: '💜 Dreamy',   class: 'strip-tpl-dreamy',   emoji: '💜', image: 'template-dreamy.png'   },
    { id: 'mint',     label: '🌿 Mint',     class: 'strip-tpl-mint',     emoji: '🌿', image: 'template-mint.png'     },
    { id: 'midnight', label: '🌙 Midnight', class: 'strip-tpl-midnight', emoji: '🌙', image: 'template-midnight.png' },
];

const TEMPLATE_GRADIENTS = {
    sakura:   ['#ffd6e7', '#ff85a2'],
    candy:    ['#fff0b3', '#ffb3d5'],
    cotton:   ['#e8f0ff', '#a8b8f8'],
    dreamy:   ['#f0e8ff', '#c0a8f8'],
    mint:     ['#e0fff5', '#88e0c8'],
    midnight: ['#1a1030', '#4a2070'],
};

const TEMPLATE_TEXT_COLORS = {
    sakura:   '#8a2050',
    candy:    '#9a5080',
    cotton:   '#3050a0',
    dreamy:   '#6030b0',
    mint:     '#206050',
    midnight: '#c8a8ff',
};

const PHOTO_W  = 340;
const PHOTO_H  = 255;
const GAP      = 16;
const PAD_TOP  = 50;
const PAD_SIDE = 30;
const FOOTER_H = 60;
const STRIP_W  = 400;

let selectedCount    = 2;
let selectedTemplate = TEMPLATES[0];
let selectedTimer    = 3;
let capturedImages   = [];

const video       = document.getElementById('video');
const captureBtn  = document.getElementById('capture-btn');
const btnLabel    = document.getElementById('btn-label');
const countdownEl = document.getElementById('countdown-overlay');
const flashEl     = document.getElementById('flash-overlay');
const photosEl    = document.getElementById('photos');
const downloadEl  = document.getElementById('download-container');
const dotsEl      = document.getElementById('progress-dots');
const retakeBtn   = document.getElementById('retake-btn');

const FLOATIES_LIST = ['🌸','💫','⭐','💖','🎀','✨','💕','🌟','🍓','🌈','💝','🎵'];

function spawnFloatie() {
    const el = document.createElement('span');
    el.className = 'floatie';
    el.textContent = FLOATIES_LIST[Math.floor(Math.random() * FLOATIES_LIST.length)];
    el.style.left    = Math.random() * 100 + 'vw';
    el.style.fontSize = (1 + Math.random() * 1.4) + 'rem';
    const dur = 8 + Math.random() * 10;
    el.style.animationDuration  = dur + 's';
    el.style.animationDelay     = Math.random() * -dur + 's';
    document.getElementById('floaties').appendChild(el);
    setTimeout(() => el.remove(), (dur + 1) * 1000);
}

for (let i = 0; i < 12; i++) spawnFloatie();
setInterval(spawnFloatie, 1800);

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; })
    .catch(() => alert('Camera access denied. Please allow camera access.'));

const templateGrid = document.getElementById('template-grid');
TEMPLATES.forEach((tpl, i) => {
    const btn = document.createElement('button');
    btn.className = 'template-btn' + (i === 0 ? ' active' : '');
    btn.dataset.tpl = tpl.id;

    const bgStyle = useImageTemplates
        ? `background-image:url('${tpl.image}');background-size:cover;background-position:center;`
        : '';

    btn.innerHTML = `
        <div class="template-preview ${useImageTemplates ? '' : tpl.class}" style="${bgStyle}">
            <div class="mini-photo"></div>
            <div class="mini-photo"></div>
        </div>
        <span class="tpl-name">${tpl.emoji}<br>${tpl.label.split(' ').slice(1).join(' ')}</span>
    `;
    btn.addEventListener('click', () => {
        document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTemplate = tpl;
        renderStrip();
    });
    templateGrid.appendChild(btn);
});

function enterShootMode() {
    document.querySelectorAll('.pre-shoot-group').forEach(el => el.classList.remove('hidden'));
    document.getElementById('template-group').classList.remove('revealed');
    retakeBtn.classList.remove('revealed');
    downloadEl.innerHTML = '';
}

function enterReviewMode() {
    document.querySelectorAll('.pre-shoot-group').forEach(el => el.classList.add('hidden'));
    document.getElementById('template-group').classList.add('revealed');
    retakeBtn.classList.add('revealed');
}

retakeBtn.addEventListener('click', () => {
    capturedImages = [];
    renderStrip();
    renderDots();
    enterShootMode();
});

document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCount = parseInt(btn.dataset.count);
        capturedImages = [];
        renderStrip();
        renderDots();
        enterShootMode();
    });
});

document.querySelectorAll('.timer-opt').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.timer-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTimer = parseInt(btn.dataset.sec);
    });
});

function renderDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i < selectedCount; i++) {
        const d = document.createElement('div');
        d.className = 'dot' + (i < capturedImages.length ? ' filled' : '');
        dotsEl.appendChild(d);
    }
}
renderDots();

// ── STRIP PREVIEW ─────────────────────────
function renderStrip() {
    photosEl.innerHTML = '';
    const strip = document.createElement('div');

    if (useImageTemplates) {
        strip.className = 'photo-strip';
        strip.style.backgroundImage = `url('${selectedTemplate.image}')`;
        strip.style.backgroundSize = 'cover';
        strip.style.backgroundPosition = 'center';
    } else {
        strip.className = `photo-strip ${selectedTemplate.class}`;
    }

    for (let i = 0; i < selectedCount; i++) {
        if (capturedImages[i]) {
            const img = document.createElement('img');
            img.src = capturedImages[i];
            img.className = 'strip-photo';
            strip.appendChild(img);
        } else {
            const slot = document.createElement('div');
            slot.className = 'photo-slot';
            slot.textContent = '📷';
            strip.appendChild(slot);
        }
    }

    const footer = document.createElement('div');
    footer.className = 'strip-footer';
    footer.textContent = '🎀 pic-a-booth 🎀';
    strip.appendChild(footer);

    photosEl.appendChild(strip);
}
renderStrip();

captureBtn.addEventListener('click', () => {
    capturedImages = [];
    downloadEl.innerHTML = '';
    renderStrip();
    renderDots();

    captureBtn.disabled = true;
    btnLabel.textContent = 'Get ready…';

    let count = 0;

    function captureNext() {
        if (count >= selectedCount) {
            captureBtn.disabled = false;
            btnLabel.textContent = 'Say Cheese!';
            triggerConfetti();
            showDownloadBtn();
            enterReviewMode();
            return;
        }
        showCountdown(selectedTimer, () => {
            capturePhoto();
            count++;
            setTimeout(captureNext, 700);
        });
    }

    captureNext();
});

function showCountdown(secs, cb) {
    let n = secs;
    countdownEl.style.visibility = 'visible';
    countdownEl.textContent = n;

    const interval = setInterval(() => {
        n--;
        if (n > 0) {
            countdownEl.textContent = n;
        } else {
            clearInterval(interval);
            countdownEl.style.visibility = 'hidden';
            cb();
        }
    }, 1000);
}

function capturePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    capturedImages.push(canvas.toDataURL('image/png'));

    flashEl.classList.remove('flash');
    void flashEl.offsetWidth;
    flashEl.classList.add('flash');

    renderStrip();
    renderDots();
}

function showDownloadBtn() {
    downloadEl.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'download-btn';
    btn.textContent = '⬇ Save my strip!';
    btn.addEventListener('click', downloadStrip);
    downloadEl.appendChild(btn);
}

function downloadStrip() {
    const STRIP_H = PAD_TOP + selectedCount * PHOTO_H + (selectedCount - 1) * GAP + FOOTER_H + 20;

    const canvas = document.createElement('canvas');
    canvas.width  = STRIP_W;
    canvas.height = STRIP_H;
    const ctx = canvas.getContext('2d');

    function drawPhotosAndSave() {
        const promises = capturedImages.map((src, i) => new Promise(res => {
            const img = new Image();
            img.onload = () => {
                const x = PAD_SIDE;
                const y = PAD_TOP + i * (PHOTO_H + GAP);
                // white border
                ctx.fillStyle = 'rgba(255,255,255,0.55)';
                ctx.beginPath();
                ctx.roundRect(x - 4, y - 4, PHOTO_W + 8, PHOTO_H + 8, 10);
                ctx.fill();
                // clip + draw
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, PHOTO_W, PHOTO_H, 8);
                ctx.clip();
                ctx.drawImage(img, x, y, PHOTO_W, PHOTO_H);
                ctx.restore();
                res();
            };
            img.src = src;
        }));

        Promise.all(promises).then(() => {
            const textColor = TEMPLATE_TEXT_COLORS[selectedTemplate.id];
            ctx.fillStyle = textColor;
            ctx.font = 'bold 13px "Poppins", sans-serif';
            ctx.textAlign = 'center';
            ctx.letterSpacing = '2px';
            ctx.fillText('🎀  PIC-A-BOOTH  🎀', STRIP_W / 2, STRIP_H - 22);

            const link = document.createElement('a');
            link.download = `pic-a-booth-${selectedTemplate.id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }

    if (useImageTemplates) {
        const bgImg = new Image();
        bgImg.onload = () => {
            ctx.drawImage(bgImg, 0, 0, STRIP_W, STRIP_H);
            drawPhotosAndSave();
        };
        bgImg.src = selectedTemplate.image;
    } else {
        const [c1, c2] = TEMPLATE_GRADIENTS[selectedTemplate.id];
        const grad = ctx.createLinearGradient(0, 0, STRIP_W, STRIP_H);
        grad.addColorStop(0, c1);
        grad.addColorStop(1, c2);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(0, 0, STRIP_W, STRIP_H, 20);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.arc(STRIP_W / 2, 28, 5, 0, Math.PI * 2);
        ctx.fill();

        drawPhotosAndSave();
    }
}

// ── CONFETTI ──────────────────────────────
function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#ffb7d5', '#c8b4f8', '#a8d8f0', '#ff85b3', '#ffffff', '#ffd6e7'],
        shapes: ['circle', 'square'],
    });
}
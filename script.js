document.addEventListener('DOMContentLoaded', () => {
    createPetals();
    createFloatingHearts();
    setupRevealAnimations();
    setupFlowerInteractions();
    setupCounterAnimation();
    loadGallery();
    setupMemoryGame();
    setupEnvelope();
});

function setupEnvelope() {
    const envelope = document.getElementById('envelope');
    if (!envelope) return;

    envelope.addEventListener('click', () => {
        if (envelope.classList.contains('opened')) return;
        envelope.classList.add('opened');
    });
}

function loadGallery() {
    const tilts = [-3, 2, -1, 2, -2, 3, -2, 1, -3];

    fetch('photos/captions.json')
        .then(res => res.json())
        .then(photos => {
            const row = document.getElementById('polaroid-row');
            photos.forEach((photo, i) => {
                const tilt = tilts[i % tilts.length];
                const polaroid = document.createElement('div');
                polaroid.className = 'polaroid';
                polaroid.style.setProperty('--tilt', tilt + 'deg');
                polaroid.innerHTML = `
                    <div class="clip"></div>
                    <div class="polaroid-photo">
                        <img src="photos/${photo.file}" alt="${photo.caption}">
                    </div>
                    <p class="polaroid-caption">${photo.caption}</p>
                `;

                const photoEl = polaroid.querySelector('.polaroid-photo');
                photoEl.addEventListener('click', () => {
                    if (!photoEl.classList.contains('revealed')) {
                        photoEl.classList.add('revealed');
                    }
                });

                row.appendChild(polaroid);
            });

            const rope = document.querySelector('.clothesline-rope');
            if (rope) rope.style.width = row.scrollWidth + 'px';
        });
}

function createPetals() {
    const container = document.getElementById('petal-container');
    const petalCount = 25;

    function spawnPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        const size = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 6 + 6;
        const drift = (Math.random() - 0.5) * 200;
        const rotation = Math.random() * 720 - 360;

        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = left + '%';
        petal.style.setProperty('--drift', drift + 'px');
        petal.style.setProperty('--rotation', rotation + 'deg');
        petal.style.animationDuration = duration + 's';

        container.appendChild(petal);

        petal.addEventListener('animationend', () => petal.remove());
    }

    for (let i = 0; i < petalCount; i++) {
        setTimeout(spawnPetal, Math.random() * 5000);
    }

    setInterval(spawnPetal, 800);
}

function createFloatingHearts() {
    const container = document.getElementById('hearts-container');
    const hearts = ['🤍', '🩶', '🤎', '🤍', '❤️'];

    function spawnHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        const left = Math.random() * 100;
        const duration = Math.random() * 8 + 8;
        const size = Math.random() * 15 + 12;

        heart.style.left = left + '%';
        heart.style.fontSize = size + 'px';
        heart.style.animationDuration = duration + 's';

        container.appendChild(heart);

        heart.addEventListener('animationend', () => heart.remove());
    }

    setInterval(spawnHeart, 3000);
}

function setupRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
}

function setupFlowerInteractions() {
    const flowers = document.querySelectorAll('.flower');
    const messageEl = document.getElementById('flower-message');

    flowers.forEach(flower => {
        flower.addEventListener('click', () => {
            const msg = flower.getAttribute('data-msg');
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateY(10px)';

            setTimeout(() => {
                messageEl.textContent = msg;
                messageEl.style.opacity = '1';
                messageEl.style.transform = 'translateY(0)';
            }, 200);

            burstHearts(flower);
        });

        flower.addEventListener('mouseenter', () => {
            const msg = flower.getAttribute('data-msg');
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateY(10px)';

            setTimeout(() => {
                messageEl.textContent = msg;
                messageEl.style.opacity = '1';
                messageEl.style.transform = 'translateY(0)';
            }, 200);
        });
    });
}

function burstHearts(element) {
    const rect = element.getBoundingClientRect();
    const hearts = ['❤️', '🤍', '🩶', '🤎'];

    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top}px;
            font-size: 18px;
            pointer-events: none;
            z-index: 10000;
            transition: all 1s ease-out;
            opacity: 1;
        `;

        document.body.appendChild(heart);

        requestAnimationFrame(() => {
            const angle = (Math.PI * 2 * i) / 6;
            const distance = 60 + Math.random() * 40;
            heart.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance - 30}px) scale(0.5)`;
            heart.style.opacity = '0';
        });

        setTimeout(() => heart.remove(), 1000);
    }
}

function setupCounterAnimation() {
    const counters = document.querySelectorAll('.counter-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = current.toLocaleString('tr-TR');

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString('tr-TR');
        }
    }

    requestAnimationFrame(update);
}

function setupMemoryGame() {
    const emojis = ['🌹', '🐾', '🤍', '🌺'];
    const cards = [...emojis, ...emojis];
    let flipped = [];
    let matched = 0;
    let locked = false;

    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    const board = document.getElementById('game-board');
    const status = document.getElementById('game-status');

    cards.forEach((emoji, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.idx = idx;
        card.dataset.emoji = emoji;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front">?</div>
                <div class="card-face card-back">${emoji}</div>
            </div>
        `;
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });

    function flipCard(card) {
        if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        flipped.push(card);

        if (flipped.length === 2) {
            locked = true;
            const [a, b] = flipped;

            if (a.dataset.emoji === b.dataset.emoji) {
                a.classList.add('matched');
                b.classList.add('matched');
                matched++;
                flipped = [];
                locked = false;

                if (matched === emojis.length) {
                    status.textContent = 'Hepsini buldun! 🎉';
                    setTimeout(showSurprise, 600);
                }
            } else {
                setTimeout(() => {
                    a.classList.remove('flipped');
                    b.classList.remove('flipped');
                    flipped = [];
                    locked = false;
                }, 800);
            }
        }
    }

    function showSurprise() {
        const surprise = document.getElementById('game-surprise');
        surprise.classList.add('revealed');
        burstCelebration();
    }

    function burstCelebration() {
        const emojis = ['🎉', '🤍', '✨', '🌹', '🐾'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const el = document.createElement('div');
                el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                el.style.cssText = `
                    position: fixed;
                    left: ${20 + Math.random() * 60}%;
                    top: ${20 + Math.random() * 60}%;
                    font-size: ${20 + Math.random() * 20}px;
                    pointer-events: none;
                    z-index: 10000;
                    transition: all 1.5s ease-out;
                    opacity: 1;
                `;
                document.body.appendChild(el);
                requestAnimationFrame(() => {
                    el.style.transform = `translateY(${-80 - Math.random() * 80}px) scale(0.3)`;
                    el.style.opacity = '0';
                });
                setTimeout(() => el.remove(), 1500);
            }, i * 100);
        }
    }
}

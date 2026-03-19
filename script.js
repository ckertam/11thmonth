document.addEventListener('DOMContentLoaded', () => {
    createPetals();
    createFloatingHearts();
    setupRevealAnimations();
    setupFlowerInteractions();
    setupCounterAnimation();
});

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
    const hearts = ['💕', '💗', '💖', '🤍', '💛'];

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
    const hearts = ['❤️', '💕', '💖', '🤍'];

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

/* ============================================================
   MENU HAMBURGER — Mobile
   ============================================================ */
function toggleMenu() {
    const navLinks  = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');

    if (!navLinks || !hamburger) return;

    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
}

// Fermer le menu si on clique en dehors
document.addEventListener('click', function (event) {
    const navLinks  = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');

    if (!navLinks || !hamburger) return;

    if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
    }
});

/* ============================================================
   TOGGLE DES CARTES DE FILIÈRES (page admission)
   ============================================================ */
function toggleCard(cardId) {
    const card = document.getElementById('card-' + cardId);
    if (!card) return;
    card.classList.toggle('expanded');
}

/* ============================================================
   COMPORTEMENTS AU CHARGEMENT DU DOM
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    /* Scroll smooth pour les liens d’ancre */
    const ancres = document.querySelectorAll('a[href^="#"]');

    ancres.forEach(function (lien) {
        lien.addEventListener('click', function (e) {
            const cible = document.querySelector(this.getAttribute('href'));
            if (cible) {
                e.preventDefault();
                cible.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* Animation compteur pour les stats (page accueil) */
    const statCards = document.querySelectorAll('.stat-card h3');
    
    function animateCounter(element) {
        const text = element.textContent;
        const hasNumber = text.match(/\d+/);
        
        if (!hasNumber) return;
        
        const targetNumber = parseInt(hasNumber[0]);
        const prefix = text.substring(0, text.indexOf(hasNumber[0]));
        const suffix = text.substring(text.indexOf(hasNumber[0]) + hasNumber[0].length);
        
        let currentNumber = 0;
        const increment = targetNumber / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                element.textContent = prefix + targetNumber + suffix;
                clearInterval(timer);
            } else {
                element.textContent = prefix + Math.floor(currentNumber) + suffix;
            }
        }, stepTime);
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statCards.forEach(card => observer.observe(card));

    /* Effet parallax sur le hero (page accueil) */
    const heroImage = document.querySelector('.hero img');
    
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroImage.style.transform = `translateY(${rate}px) scale(1.1)`;
        });
    }

    /* Ajout de badges "POPULAIRE" sur certaines filières */
    const popularIndexes = [0, 4, 6];
    const filiereCards = document.querySelectorAll('.filiere-card');
    
    filiereCards.forEach((card, index) => {
        if (popularIndexes.includes(index)) {
            const badge = document.createElement('div');
            badge.className = 'badge';
            badge.textContent = ' POPULAIRE';
            card.appendChild(badge);
        }
    });

    /* Validation du formulaire de contact avant envoi au backend */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            const nom     = document.getElementById('nom');
            const email   = document.getElementById('email');
            const sujet   = document.getElementById('sujet');
            const message = document.getElementById('message');

            if (!nom || !email || !message) return;

            if (nom.value.trim() === '') {
                e.preventDefault();
                alert('Veuillez entrer votre nom.');
                nom.focus();
                return;
            }

            if (email.value.trim() === '' || !email.value.includes('@')) {
                e.preventDefault();
                alert('Veuillez entrer un email valide.');
                email.focus();
                return;
            }

            if (sujet && sujet.value === '') {
                e.preventDefault();
                alert('Veuillez choisir un sujet.');
                sujet.focus();
                return;
            }

            if (message.value.trim() === '') {
                e.preventDefault();
                alert('Veuillez écrire un message.');
                message.focus();
                return;
            }
        });
    }

    /* Afficher le message de succès si ?success=1 dans l’URL */
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
        const success = document.getElementById('msgSuccess');
        if (success) {
            success.style.display = 'block';
        }
    }
});

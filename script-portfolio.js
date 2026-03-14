/**
 * JONA DOMKE - Portfolio Script
 * Fokus: Custom Cursor & Scroll-Reveal Animationen
 */

// 1. Initialisierung
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const allLinks = document.querySelectorAll('a');
const fadeElements = document.querySelectorAll('.fade-in');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

// 2. Maus-Bewegung für den Cursor
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Der kleine Punkt folgt der Maus sofort
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

// 3. Animations-Loop für den flüssigen Ring (LERP)
function animateCursor() {
    // Der Ring folgt mit einer leichten Verzögerung (0.12)
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// 4. Reveal-Effekt beim Scrollen (Intersection Observer)
// Das sorgt dafür, dass die Elemente erst erscheinen, wenn man sie sieht
const revealOptions = {
    threshold: 0.15, // Erscheint, wenn 15% des Elements sichtbar sind
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Einmal eingeblendet, stoppen wir die Beobachtung für dieses Element
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

fadeElements.forEach(el => {
    revealObserver.observe(el);
});

// 5. Cursor-Interaktion für alle Links
allLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursorRing.style.width = '70px';
        cursorRing.style.height = '70px';
        cursorRing.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        cursorDot.style.opacity = '0';
    });
    
    link.addEventListener('mouseleave', () => {
        cursorRing.style.width = '40px';
        cursorRing.style.height = '40px';
        cursorRing.style.backgroundColor = 'transparent';
        cursorDot.style.opacity = '1';
    });
});

// 6. Sanftes Scrollen für den "Back to Start"-Link
const backLink = document.querySelector('.back-home-link');
if (backLink && backLink.getAttribute('href') === '#') {
    backLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
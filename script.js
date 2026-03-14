/**
 * JONA DOMKE - Full Script
 * Handling: Custom Cursor, Spotlight, Scroll-Fading & Image Plateau
 */

// 1. Initialisierung & Scroll-Reset
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const spotlightText = document.querySelector('.spotlight-text');
const textWrapper = document.querySelector('.text-wrapper');
const smallLogo = document.querySelector('.small-logo');
const bottomPortfolioLink = document.querySelector('.bottom-portfolio-link');
const projectImages = document.querySelectorAll('.project-item img');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let smoothScrollY = 0;

// 2. Maus-Bewegung & Spotlight
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot folgt sofort
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    // Spotlight-Position berechnen
    if (spotlightText) {
        const rect = spotlightText.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;
        spotlightText.style.setProperty('--mouse-x', `${x}px`);
        spotlightText.style.setProperty('--mouse-y', `${y}px`);
    }
});

// 3. Scroll-to-Top für Logo und Bottom-Link
const scrollUpLinks = [smallLogo, bottomPortfolioLink];
scrollUpLinks.forEach(link => {
    if (link) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// 2. Klick-Events
const backToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// NUR das Logo scrollt nach oben
if (smallLogo) smallLogo.addEventListener('click', backToTop);

// 4. Kern-Logik für Scroll-Effekte
function updateScrollLogic() {
    const currentScroll = window.scrollY;
    
    // Dämpfung für weiche Übergänge
    smoothScrollY += (currentScroll - smoothScrollY) * 0.05;

    // --- Name & Logo Fading ---
    const fadeLimit = window.innerHeight * 0.4;
    let opacityProgress = 1 - (smoothScrollY / fadeLimit);
    
    // Großen Text ausblenden
    if (textWrapper) {
        textWrapper.style.opacity = Math.max(0, opacityProgress);
    }

    // Kleines Logo einblenden
    if (smoothScrollY > fadeLimit) {
        smallLogo.style.opacity = "1";
        smallLogo.style.pointerEvents = "auto";
    } else {
        smallLogo.style.opacity = "0";
        smallLogo.style.pointerEvents = "none";
    }

    // --- Bilder Plateau & Fokus ---
    const viewportCenter = window.innerHeight / 2;

    projectImages.forEach(img => {
        const parent = img.parentElement;
        const imgCenter = (parent.offsetTop - smoothScrollY) + (parent.offsetHeight / 2);
        
        const distance = Math.abs(viewportCenter - imgCenter);
        const maxDistance = window.innerHeight * 0.8;
        
        let progress = 1 - (distance / maxDistance);
        progress = Math.max(0, Math.min(1, progress));

        // Plateau: Bereich in der Mitte bleibt länger scharf
        let plateauProgress = Math.max(0, Math.min(1, (progress - 0.15) * 1.4));

        img.style.opacity = Math.pow(plateauProgress, 2); 
        
        let blurAmount = 0;
        if (plateauProgress < 0.8) {
            blurAmount = (0.8 - plateauProgress) * 50; 
        }
        
        img.style.filter = `blur(${blurAmount}px) brightness(${0.4 + plateauProgress * 0.6})`;
        img.style.transform = `scale(${0.98 + (plateauProgress * 0.02)})`;
    });
}

// 5. Animations-Loop
function animate() {
    // Ring-Follower (LERP)
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    
    updateScrollLogic();
    requestAnimationFrame(animate);
}

// Start
animate();

// 6. Link-Hover für Custom Cursor (betrifft alle <a> Tags)
document.querySelectorAll('a').forEach(link => {
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
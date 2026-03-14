/**
 * JONA DOMKE - Contact Form Script
 * Handling: Step-by-Step Navigation, Enter-Key & Custom Cursor
 */

const steps = document.querySelectorAll('.form-step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progressBar = document.getElementById('progressBar');
const form = document.getElementById('stepForm');

const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let currentStep = 0;
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

// 1. Formular-Logik: Update der Ansicht
function updateForm() {
    // Schritte umschalten
    steps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep);
    });

    // Progress Bar berechnen
    const progress = ((currentStep) / (steps.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;

    // Button-Sichtbarkeit
    prevBtn.style.opacity = currentStep === 0 ? "0" : "1";
    prevBtn.style.pointerEvents = currentStep === 0 ? "none" : "auto";
    
    // "Weiter"-Pfeil beim letzten Schritt (Absenden) verstecken
    if (currentStep === steps.length - 1) {
        nextBtn.style.opacity = "0";
        nextBtn.style.pointerEvents = "none";
    } else {
        nextBtn.style.opacity = "1";
        nextBtn.style.pointerEvents = "auto";
    }

    // Automatisch das Input-Feld im neuen Schritt fokussieren
    const currentInput = steps[currentStep].querySelector('input, textarea');
    if (currentInput) {
        setTimeout(() => currentInput.focus(), 400);
    }
}

// 2. Navigation Events
nextBtn.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateForm();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateForm();
    }
});

// Mit "Enter" zur nächsten Frage springen
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        // Verhindern, dass das Formular zu früh abschickt
        if (currentStep < steps.length - 1) {
            e.preventDefault();
            currentStep++;
            updateForm();
        }
    }
});

// 3. Custom Cursor Logik (Konsistent zur Hauptseite)
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor-Interaktion für Buttons und Links
const interactiveElements = document.querySelectorAll('a, button, input, textarea');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorRing.style.width = '70px';
        cursorRing.style.height = '70px';
        cursorRing.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        cursorDot.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
        cursorRing.style.width = '40px';
        cursorRing.style.height = '40px';
        cursorRing.style.backgroundColor = 'transparent';
        cursorDot.style.opacity = '1';
    });
});

// 4. Formular-Absendung (Beispiel-Handling)
form.addEventListener('submit', (e) => {
    // Wir lassen das Standard-Absenden zu, damit Netlify die Mail erhält
    // Wenn du eine "Danke"-Meldung ohne Seiten-Reload willst, nutzen wir Fetch:
    e.preventDefault();
    
    const formData = new FormData(form);
    
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
    })
    .then(() => {
        // Erfolg: Zeige deine Danke-Meldung
        const lastStepH2 = steps[currentStep].querySelector('h2');
        lastStepH2.innerText = "Vielen Dank! Ich melde mich bei dir.";
        form.querySelector('.submit-btn').style.display = 'none';
    })
    .catch((error) => alert(error));
});
/**
 * JONA DOMKE - Contact Form Script
 * Handling: Step-by-Step Navigation, Enter-Key, Custom Cursor & Web3Forms Integration
 */

// --- 1. INITIALISIERUNG ---
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

// --- 2. FORMULAR-NAVIGATION ---

/**
 * Aktualisiert die Anzeige des Formulars basierend auf dem aktuellen Schritt
 */
function updateForm() {
    // Sichtbarkeit der Schritte umschalten
    steps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep);
    });

    // Fortschrittsbalken berechnen
    const progress = ((currentStep) / (steps.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;

    // "Zurück"-Button ein/ausblenden
    prevBtn.style.opacity = currentStep === 0 ? "0" : "1";
    prevBtn.style.pointerEvents = currentStep === 0 ? "none" : "auto";
    
    // "Weiter"-Button am Ende verstecken (da dort der Senden-Button im HTML liegt)
    if (currentStep === steps.length - 1) {
        nextBtn.style.opacity = "0";
        nextBtn.style.pointerEvents = "none";
    } else {
        nextBtn.style.opacity = "1";
        nextBtn.style.pointerEvents = "auto";
    }

    // Fokus auf das nächste Input-Feld setzen
    const currentInput = steps[currentStep].querySelector('input, textarea');
    if (currentInput) {
        setTimeout(() => currentInput.focus(), 400);
    }
}

// Event-Listener für Klicks
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

// Tastatur-Support: Mit Enter zum nächsten Schritt
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        // Nur wenn wir nicht im letzten Schritt sind
        if (currentStep < steps.length - 1) {
            e.preventDefault(); // Verhindert frühzeitiges Absenden
            currentStep++;
            updateForm();
        }
    }
});

// --- 3. CUSTOM CURSOR LOGIK ---

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (cursorDot) {
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
});

/**
 * Flüssige Animation für den äußeren Cursor-Ring
 */
function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    
    if (cursorRing) {
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Interaktionseffekte für den Cursor
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

// --- 4. VALIDIERUNG & ABSENDEN (WEB3FORMS) ---

/**
 * Zeigt die rote Apple-Style Fehlermeldung an
 */
function showAppleError(customText) {
    const errorMessage = document.getElementById('errorMessage');
    if (customText && errorMessage.querySelector('p')) {
        errorMessage.querySelector('p').innerText = customText;
    }
    
    errorMessage.classList.add('show-error');
    
    setTimeout(() => {
        errorMessage.classList.remove('show-error');
    }, 4000);
}

// Das eigentliche Absenden des Formulars
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Check ob Felder leer sind
    if (!form.checkValidity()) {
        showAppleError("Bitte fülle alle Felder korrekt aus.");
        return;
    }

    // 2. Daten sammeln
    const formData = new FormData(form);
    
    // Web3Forms Konfiguration hinzufügen
    formData.append("access_key", "ee3af827-2f81-4fb7-812e-217d3f8e7970"); 
    formData.append("subject", "Neue Anfrage über jonadomke.de");
    formData.append("from_name", "Portfolio Kontaktformular");

    // 3. Daten absenden (AJAX / Fetch)
    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(async (response) => {
        if (response.ok) {
            // ERFOLG: Formular ausblenden
            form.style.display = 'none';
            document.querySelector('.form-navigation').style.display = 'none';

            // Erfolgs-Bildschirm anzeigen
            const container = document.querySelector('.contact-container');
            container.innerHTML = `
                <div class="form-step active" style="text-align: center;">
                    <span class="step-number">06</span>
                    <h2 style="margin-bottom: 10px;">Vielen Dank!</h2>
                    <p style="font-family: 'degular-mono'; opacity: 0.6; font-size: 16px;">
                        Deine Nachricht wurde erfolgreich übermittelt.<br>Ich melde mich zeitnah bei dir.
                    </p>
                    <br><br>
                    <a href="index.html" class="back-link" style="color: #fff; text-decoration: underline; font-size: 12px; font-family: 'degular-mono'; cursor: pointer;">
                        Zurück zur Startseite
                    </a>
                </div>
            `;
        } else {
            // Fehler vom Server
            showAppleError("Senden fehlgeschlagen. Bitte versuche es später erneut.");
        }
    })
    .catch(error => {
        // Netzwerkfehler
        showAppleError("Netzwerkfehler. Hast du eine aktive Internetverbindung?");
    });
});

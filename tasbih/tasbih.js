let count = localStorage.getItem('tasbihCount') ? parseInt(localStorage.getItem('tasbihCount')) : 0;
const phrases = ["SubhanAllah", "Alhamdulillah", "Allahu Akbar", "La ilaha illa Allah"];
let phraseIndex = 0;

const counterDisplay = document.getElementById('counter');
const tapBtn = document.getElementById('tap-btn');
const resetBtn = document.getElementById('reset-btn');
const changeBtn = document.getElementById('change-btn');
const dhikrText = document.getElementById('dhikr-text');

// Initialize display
counterDisplay.innerText = count;

// --- FIX: Use 'pointerdown' instead of 'click' ---
// This stops the mobile browser from waiting to see if you will double-tap (zoom)
tapBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault(); // This is the secret to stopping the zoom!
    
    count++;
    counterDisplay.innerText = count;
    localStorage.setItem('tasbihCount', count);
    
    // Visual feedback
    tapBtn.style.transform = "scale(0.92)";
    
    // Optional: Add a real vibration if the phone supports it
    if (navigator.vibrate) {
        navigator.vibrate(10); 
    }
});

// Reset scale when finger lifts
tapBtn.addEventListener('pointerup', () => {
    tapBtn.style.transform = "scale(1)";
});

// Reset functionality
resetBtn.addEventListener('click', () => {
    if(confirm("Do you want to reset your count?")) {
        count = 0;
        counterDisplay.innerText = count;
        localStorage.setItem('tasbihCount', count);
    }
});

// Change Dhikr phrase
changeBtn.addEventListener('click', () => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    dhikrText.innerText = phrases[phraseIndex];
});
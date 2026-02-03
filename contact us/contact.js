// 1. Handle Contact Form Submission
const form = document.querySelector('.contact-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        // We let Formspree handle the redirect by default, 
        // but you can add a loading state here
        const button = form.querySelector('.submit-btn');
        if (button) {
            button.innerText = 'Sending...';
            button.style.opacity = '0.7';
            button.disabled = true;
        }
    });
}

// 2. Smooth Scroll for the Donation Section
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 3. Crypto Wallet Copy Function (Optional)
const cryptoCard = document.querySelector('a[href="#crypto"]');
if (cryptoCard) {
    cryptoCard.addEventListener('click', (e) => {
        e.preventDefault();
        const walletAddress = "YOUR_WALLET_ADDRESS_HERE"; // Put your actual address
        navigator.clipboard.writeText(walletAddress).then(() => {
            alert("Crypto address copied to clipboard!");
        }).catch(() => {
            alert("Failed to copy crypto address.");
        });
    });
}
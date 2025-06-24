// script.js

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile menu after clicking a link
        if (window.innerWidth < 767) { // Using 767px to match Tailwind's 'md' breakpoint
            const navLinks = document.getElementById('nav-links');
            const hamburgerMenu = document.getElementById('hamburger-menu');
            navLinks.classList.remove('open');
            hamburgerMenu.classList.remove('open');
        }
    });
});

// Hamburger menu functionality for mobile
const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');
const header = document.querySelector('header'); // Get the header element

hamburgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburgerMenu.classList.toggle('open');
    // Ensure header is visible when mobile menu is opened
    if (navLinks.classList.contains('open')) {
        header.style.transform = 'translateY(0)';
    }
});

// Hide/Show header on scroll
let lastScrollY = window.scrollY; // Store the last scroll position

window.addEventListener('scroll', () => {
    // Only apply this effect if the mobile menu is NOT open
    if (!navLinks.classList.contains('open')) {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { // Scrolling down and past a threshold
            header.style.transform = 'translateY(-100%)'; // Hide header by moving it up
            header.style.transition = 'transform 0.3s ease-out'; // Smooth transition
        } else if (window.scrollY < lastScrollY) { // Scrolling up
            header.style.transform = 'translateY(0)'; // Show header
            header.style.transition = 'transform 0.3s ease-out'; // Smooth transition
        }
    }
    lastScrollY = window.scrollY; // Update last scroll position
});


// Form submission handling (client-side now sends to backend)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent actual form submission

    formStatus.classList.remove('hidden', 'text-red-600', 'text-green-600');
    formStatus.classList.add('text-gray-600');
    formStatus.textContent = 'Sending message...';
    formStatus.classList.remove('hidden');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    // Simple client-side validation before sending
    if (!name || !email || !message) {
        formStatus.classList.remove('text-gray-600');
        formStatus.classList.add('text-red-600');
        formStatus.textContent = 'Please fill in all required fields (Name, Email, Message).';
        return; // Stop execution if validation fails
    }

    try {
        // IMPORTANT: Replace with the actual URL where your Flask backend is running
        // If running locally, it's typically 'http://127.0.0.1:5000/send-message'
        // If deployed, it will be your deployed backend URL.
        const backendUrl = 'http://127.0.0.1:5000/send-message';

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, message }),
        });

        const result = await response.json();

        if (response.ok) { // Check for HTTP 200-299 status codes
            formStatus.classList.remove('text-gray-600');
            formStatus.classList.add('text-green-600');
            formStatus.textContent = result.message;
            contactForm.reset(); // Clear the form on success
        } else {
            formStatus.classList.remove('text-gray-600');
            formStatus.classList.add('text-red-600');
            formStatus.textContent = result.message || 'An unexpected error occurred.';
        }
    } catch (error) {
        console.error('Error sending form data:', error);
        formStatus.classList.remove('text-gray-600');
        formStatus.classList.add('text-red-600');
        formStatus.textContent = 'Could not connect to the server. Please try again later.';
    }
});

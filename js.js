// Generate Stars
        function createStars() {
            const starsContainer = document.getElementById('stars');
            const numberOfStars = 200;
            
            for (let i = 0; i < numberOfStars; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
                star.style.animationDelay = Math.random() * 3 + 's';
                
                // Random size
                const size = Math.random() * 2 + 1;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                
                starsContainer.appendChild(star);
            }
        }

        createStars();

        // Mobile Menu Toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 968) {
                    navLinks.classList.remove('active');
                }
            });
        });

        // Profile Image Upload
        const profileImage = document.getElementById('profileImage');
        profileImage.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        profileImage.innerHTML = '';
                        profileImage.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            };
            
            input.click();
        });

        // Contact Form Handler
        const contactForm = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        const submitButton = document.getElementById('submitButton');

        function showStatus(type, message) {
            const target = type === 'success' ? successMessage : errorMessage;
            const other = type === 'success' ? errorMessage : successMessage;

            if (!target) return;

            other.classList.remove('show');
            target.textContent = message;
            target.classList.add('show');
        }

        function clearStatus() {
            successMessage?.classList.remove('show');
            errorMessage?.classList.remove('show');
        }

        function validateForm(name, email, message) {
            const trimmedName = name.trim();
            const trimmedEmail = email.trim();
            const trimmedMessage = message.trim();

            if (trimmedName.length < 2) {
                return 'Please enter a valid name.';
            }

            if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
                return 'Please enter a valid email address.';
            }

            if (trimmedMessage.length < 10) {
                return 'Message must be at least 10 characters long.';
            }

            return '';
        }

        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;

                const validationError = validateForm(name, email, message);
                if (validationError) {
                    clearStatus();
                    showStatus('error', validationError);
                    return;
                }

                clearStatus();
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';

                try {
                    const endpoint = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
                        ? 'http://localhost:8888/.netlify/functions/send'
                        : '/.netlify/functions/send';

                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, message })
                    });

                    const data = await response.json().catch(() => ({}));

                    if (!response.ok) {
                        throw new Error(data.error || 'Unable to send message right now. Please try again later.');
                    }

                    contactForm.reset();
                    showStatus('success', '✨ Thank you! Your message has been sent successfully.');
                    setTimeout(() => {
                        clearStatus();
                    }, 5000);
                } catch (err) {
                    console.error('Contact form error:', err);
                    showStatus('error', err.message || 'Something went wrong while sending your message.');
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            });
        }

        // Scroll Animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
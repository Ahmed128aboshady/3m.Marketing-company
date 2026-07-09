document.addEventListener('DOMContentLoaded', () => {
    // 0. Theme Toggle (Dark / Light)
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }
    // 1. Header Scroll Effect
    const header = document.querySelector('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const closeMenu = document.getElementById('close-menu');
    const backdrop = document.getElementById('mobile-backdrop');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const openDrawer = () => {
        mobileNav.classList.add('open');
        backdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        mobileNav.classList.remove('open');
        backdrop.classList.remove('show');
        document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', openDrawer);
    closeMenu.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 5. Portfolio Lightbox Modal
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.portfolio-img');
            const title = item.querySelector('.portfolio-title').textContent;
            const category = item.querySelector('.portfolio-category').textContent;
            
            lightboxImg.src = img.src;
            lightboxCaption.textContent = `${title} (${category})`;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightboxModal = () => {
        lightbox.classList.remove('open');
        if (!mobileNav.classList.contains('open')) {
            document.body.style.overflow = '';
        }
    };

    lightboxClose.addEventListener('click', closeLightboxModal);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightboxModal();
        }
    });

    // 6. Testimonials Slider Carousel
    const container = document.getElementById('testimonial-container');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    const updateSlider = () => {
        // Since RTL page directions can affect slider transform directions,
        // we use percentage calculation.
        // In RTL, translating to the left means moving in the positive X direction (or negative depending on structure).
        // Let's standardise using style.transform = translateX(2D * index) or standard slide transition.
        // The cleanest cross-browser way is: translateX(currentSlide * 100%) in RTL or negative in LTR.
        // For RTL document: translating by positive value moves items to the left (next slide).
        container.style.transform = `translateX(${currentSlide * 100}%)`;
    };

    const nextSlideFunc = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    };

    const prevSlideFunc = () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    };

    if (totalSlides > 0) {
        nextBtn.addEventListener('click', () => {
            nextSlideFunc();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlideFunc();
            resetAutoSlide();
        });

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(nextSlideFunc, 6000);
        };

        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };

        startAutoSlide();
    }

    // 7. Active Menu Link Highlighter on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const mobLinks = document.querySelectorAll('.mobile-links .mobile-link');

    const updateActiveNavLink = () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Set active class on desktop links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Set active class on mobile links
                mobLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveNavLink);

    // 8. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('success-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extract values
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const email = document.getElementById('form-email').value;
            const serviceSelect = document.getElementById('form-service');
            const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
            const message = document.getElementById('form-message').value;

            // Format WhatsApp Message
            // Decide which WhatsApp number to send to based on client's phone number
            let whatsappNumber = "201008938924"; // default Egypt
            const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, ''); // strip symbols
            
            // Route to Saudi WhatsApp if phone matches Saudi prefixes
            if (cleanPhone.startsWith('966') || cleanPhone.startsWith('00966') || 
                (cleanPhone.startsWith('5') && cleanPhone.length === 9) || 
                (cleanPhone.startsWith('05') && cleanPhone.length === 10)) {
                whatsappNumber = "966562062421"; // Saudi Arabia
            }

            const messageTemplate = 
`*طلب تواصل جديد من موقع 3M Marketing*

*الاسم بالكامل:* ${name}
*رقم الهاتف:* ${phone}
*البريد الإلكتروني:* ${email}
*الخدمة المطلوبة:* ${serviceText}
*تفاصيل الرسالة:*
${message ? message : 'لا توجد تفاصيل إضافية'}`;

            const encodedText = encodeURIComponent(messageTemplate);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;

            // Show submit loading feedback
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري فتح واتساب...';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Open WhatsApp link in a new tab
                window.open(whatsappUrl, '_blank');

                // Show success message on site
                successMsg.style.display = 'block';
                contactForm.reset();
                
                // Smooth scroll to success message
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Hide after 5 seconds
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            }, 1000);
        });
    }

    // 9. Back To Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

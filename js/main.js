 // Smooth scrolling for navigation links
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Restore simple hero dimming: dim text while hero is visible to avoid blocking subtitles.
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    if (!hero || !heroContent) return;

    // Respect user preference for reduced motion
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let heroVisible = false;
    let rafId = null;
    let touchTimeout = null;
    let revealRadius = 150;

    function recomputeRadius() {
        const rect = hero.getBoundingClientRect();
        revealRadius = Math.min(rect.width, rect.height) * 0.12;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            heroVisible = entry.isIntersecting && entry.intersectionRatio > 0.4;
            if (heroVisible) {
                heroContent.classList.add('dimmed');
            } else {
                heroContent.classList.remove('dimmed');
            }
        });
    }, { threshold: [0, 0.4, 0.6, 1] });
    io.observe(hero);

    function handlePointer(event) {
        if (!heroVisible) return;
        const rect = hero.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const x = event.clientX;
        const y = event.clientY;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist <= revealRadius) {
            heroContent.classList.remove('dimmed');
        } else {
            heroContent.classList.add('dimmed');
        }
    }

    function onMouseMove(e) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => handlePointer(e));
    }

    window.addEventListener('resize', recomputeRadius);
    window.addEventListener('orientationchange', recomputeRadius);
    recomputeRadius();
    hero.addEventListener('mousemove', onMouseMove);

    // Touch interactions: show on touch, re-dim after a short timeout
    hero.addEventListener('touchstart', () => {
        heroContent.classList.remove('dimmed');
        clearTimeout(touchTimeout);
    }, { passive: true });
    hero.addEventListener('touchend', () => {
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            if (heroVisible) heroContent.classList.add('dimmed');
        }, 1200);
    }, { passive: true });

    // If user taps the content, keep visible for a bit longer
    heroContent.addEventListener('click', () => {
        heroContent.classList.remove('dimmed');
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            if (heroVisible) heroContent.classList.add('dimmed');
        }, 4000);
    });
});

// Experimental hero-dimming/proximity logic removed per user request.
// Keep hero content static; we only control video playback and the audio alert.

// FAQ Toggle
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').classList.remove('active');
    });

    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
        answer.classList.add('active');
    }
}

// Animated Number Counter
function animateNumber(element, targetValue, suffix = '') {
    const duration = 2000; // 2 segundos
    const startTime = performance.now();
    const startValue = 0;
    
    // Extraer el número del valor objetivo (remover comas, signos +, %)
    const numericValue = parseFloat(targetValue.toString().replace(/[^\d.]/g, ''));
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Función de easing para animación suave
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        
        const currentValue = startValue + (numericValue - startValue) * easeOutQuad;
        
        // Formatear el número según el tipo
        let formattedValue;
        if (targetValue.includes(',')) {
            // Si tiene comas, formatear con comas
            formattedValue = Math.floor(currentValue).toLocaleString('en-US');
        } else if (targetValue.includes('%')) {
            // Si es porcentaje, mostrar como porcentaje
            formattedValue = Math.floor(currentValue) + '%';
        } else {
            // Número simple
            formattedValue = Math.floor(currentValue);
        }
        
        // Agregar sufijo si existe (como +)
        if (targetValue.includes('+')) {
            formattedValue += '+';
        }
        
        element.textContent = formattedValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            // Asegurar que termine exactamente en el valor objetivo
            element.textContent = targetValue;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Intersection Observer para animar números cuando sean visibles
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((statNumber, index) => {
                const targetValue = statNumber.textContent.trim();
                // Reiniciar a 0
                statNumber.textContent = '0';
                // Animar con un pequeño delay para cada número
                setTimeout(() => {
                    animateNumber(statNumber, targetValue);
                }, index * 200);
            });
            // Dejar de observar después de animar
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5 // Animar cuando el 50% de la sección sea visible
});

// Inicializar observador cuando el DOM esté listo
function initStatsObserver() {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// Inicializar cuando el DOM esté listo o inmediatamente si ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatsObserver);
} else {
    initStatsObserver();
}

// Before After Carousel
function initCarousel() {
    const carouselWrapper = document.getElementById('carouselWrapper');
    const carouselContainer = document.querySelector('.carousel-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselDots = document.getElementById('carouselDots');
    const slides = carouselWrapper.querySelectorAll('.carousel-slide');
    
    if (!carouselWrapper || !prevBtn || !nextBtn || !carouselContainer) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Actualizar carrusel al redimensionar ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 250);
    });
    
    // Auto-play: rotación automática
    let autoPlayInterval;
    let isPaused = false;
    let resumeTimeout;
    
    function startAutoPlay() {
        if (!isPaused && !autoPlayInterval) {
            autoPlayInterval = setInterval(() => {
                const visibleSlides = getVisibleSlides();
                const maxSlide = Math.max(0, totalSlides - visibleSlides);
                
                if (currentSlide < maxSlide) {
                    currentSlide++;
                } else {
                    currentSlide = 0; // Volver al inicio
                }
                updateCarousel();
            }, 4000); // Cambiar cada 4 segundos
        }
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        if (resumeTimeout) {
            clearTimeout(resumeTimeout);
            resumeTimeout = null;
        }
    }
    
    function pauseAutoPlayTemporarily() {
        isPaused = true;
        stopAutoPlay();
        // Reanudar después de 8 segundos de inactividad
        resumeTimeout = setTimeout(() => {
            isPaused = false;
            startAutoPlay();
        }, 8000);
    }
    
    // Crear dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
            pauseAutoPlayTemporarily();
        });
        carouselDots.appendChild(dot);
    });
    
    // Función para obtener el número de slides visibles
    function getVisibleSlides() {
        const containerWidth = carouselContainer.offsetWidth;
        if (containerWidth > 1024) {
            return 3; // Desktop: 3 imágenes
        } else if (containerWidth > 768) {
            return 2; // Tablet: 2 imágenes
        } else {
            return 1; // Mobile: 1 imagen
        }
    }
    
    // Función para actualizar el carrusel
    function updateCarousel() {
        const visibleSlides = getVisibleSlides();
        // Calcular el ancho de cada slide como porcentaje
        // Considerando que cada slide es 1/visibleSlides del ancho visible
        const slideWidth = 100 / visibleSlides;
        
        // Calcular el desplazamiento basado en el índice actual
        const translateX = currentSlide * slideWidth;
        
        carouselWrapper.style.transform = `translateX(-${translateX}%)`;
        
        // Actualizar dots
        carouselDots.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Actualizar botones (carrusel circular, no se deshabilitan)
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }
    
    // Función para ir a un slide específico
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
        pauseAutoPlayTemporarily();
    }
    
    // Botón anterior (circular)
    prevBtn.addEventListener('click', () => {
        const visibleSlides = getVisibleSlides();
        const maxSlide = Math.max(0, totalSlides - visibleSlides);
        
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = maxSlide; // Ir al último slide posible
        }
        updateCarousel();
        pauseAutoPlayTemporarily();
    });
    
    // Botón siguiente (circular)
    nextBtn.addEventListener('click', () => {
        const visibleSlides = getVisibleSlides();
        const maxSlide = Math.max(0, totalSlides - visibleSlides);
        
        if (currentSlide < maxSlide) {
            currentSlide++;
        } else {
            currentSlide = 0; // Volver al primer slide
        }
        updateCarousel();
        pauseAutoPlayTemporarily();
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        const carouselSection = document.querySelector('.before-after');
        if (!carouselSection) return;
        
        const rect = carouselSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            const visibleSlides = getVisibleSlides();
            const maxSlide = Math.max(0, totalSlides - visibleSlides);
            
            if (e.key === 'ArrowLeft') {
                if (currentSlide > 0) {
                    currentSlide--;
                } else {
                    currentSlide = maxSlide; // Ir al último slide posible
                }
                updateCarousel();
                pauseAutoPlayTemporarily();
            } else if (e.key === 'ArrowRight') {
                if (currentSlide < maxSlide) {
                    currentSlide++;
                } else {
                    currentSlide = 0; // Volver al primer slide
                }
                updateCarousel();
                pauseAutoPlayTemporarily();
            }
        }
    });
    
    // Pausar auto-play al hacer hover sobre el carrusel
    carouselContainer.addEventListener('mouseenter', () => {
        isPaused = true;
        stopAutoPlay();
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        isPaused = false;
        startAutoPlay();
    });
    
    // Inicializar
    updateCarousel();
    
    // Iniciar auto-play después de un pequeño delay
    setTimeout(() => {
        startAutoPlay();
    }, 1000);
}

// Inicializar carrusel cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}

// Hero Video Controls
let isMuted = true;
let isPlaying = false;

// Mostrar SweetAlert recomendando activar el audio
function showAudioRecommendation() {
    const videoDesktop = document.getElementById('heroVideoElement');
    const videoMobile = document.getElementById('heroVideoElementMobile');
    
    // Verificar si alguno de los videos está listo
    if (videoDesktop || videoMobile) {
        if ((videoDesktop && videoDesktop.readyState >= 2) || (videoMobile && videoMobile.readyState >= 2)) {
            displayAudioAlert();
        } else {
            if (videoDesktop) {
                videoDesktop.addEventListener('loadeddata', displayAudioAlert, { once: true });
            }
            if (videoMobile) {
                videoMobile.addEventListener('loadeddata', displayAudioAlert, { once: true });
            }
            // Fallback: mostrar después de 1 segundo si los videos no cargan
            setTimeout(() => {
                if ((videoDesktop && videoDesktop.readyState < 2) && (videoMobile && videoMobile.readyState < 2)) {
                    displayAudioAlert();
                }
            }, 1000);
        }
    } else {
        // Si los videos no existen, mostrar después de un pequeño delay
        setTimeout(displayAudioAlert, 500);
    }
}

function displayAudioAlert() {
    Swal.fire({
        title: '🔊 Activar Audio',
        html: `
            <div class="audio-content" style="padding:0; display:flex; flex-direction:column; align-items:center;">
                <div class="audio-icon">🎵</div>
                <p class="audio-text">Para una experiencia completa, activa el audio del video. Puedes desactivarlo cuando quieras.</p>
            </div>
        `,
        showIcon: false,
        showCancelButton: true,
        confirmButtonText: '✓ Activar Audio',
        cancelButtonText: '✕ Continuar Sin Audio',
        confirmButtonColor: '#000',
        cancelButtonColor: '#fff',
        cancelButtonTextColor: '#000',
        buttonsStyling: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        backdrop: 'rgba(0, 0, 0, 0.5)',
        customClass: {
            popup: 'audio-recommendation-popup',
            title: 'audio-title',
            htmlContainer: 'audio-content',
            confirmButton: 'audio-confirm-btn',
            cancelButton: 'audio-cancel-btn'
        }
    }).then((result) => {
        const muteBtn = document.getElementById('muteBtn');
        const playBtn = document.getElementById('playBtn');
        
        if (result.isConfirmed) {
            // Activar audio y poner en play solo en el video visible
            const visibleVideo = getVisibleVideo();
            if (visibleVideo) {
                visibleVideo.muted = false;
                visibleVideo.play().catch(e => console.log('Error al reproducir:', e));
            }
            isMuted = false;
            isPlaying = true;
            
            const muteBtnFloating = document.getElementById('muteBtnFloating');
            
            if (muteBtn) {
                muteBtn.textContent = '🔊';
                muteBtn.classList.add('active');
            }
            
            if (muteBtnFloating) {
                muteBtnFloating.textContent = '🔊';
                muteBtnFloating.classList.add('active');
            }
            
            if (playBtn) {
                playBtn.textContent = '⏸️';
                playBtn.classList.add('active');
            }
        }
    });
}

// Inicializar la recomendación de audio cuando la página cargue
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(showAudioRecommendation, 800);
    });
} else {
    setTimeout(showAudioRecommendation, 800);
}

// Helper: Obtener el video visible según el tamaño de pantalla
function getVisibleVideo() {
    const videoDesktop = document.getElementById('heroVideoElement');
    const videoMobile = document.getElementById('heroVideoElementMobile');
    const isMobileView = window.innerWidth <= 1024;
    
    return isMobileView ? videoMobile : videoDesktop;
}

// Helper: Obtener ambos videos
function getBothVideos() {
    return {
        desktop: document.getElementById('heroVideoElement'),
        mobile: document.getElementById('heroVideoElementMobile')
    };
}

function toggleMute() {
    const videos = getBothVideos();
    const muteBtn = document.getElementById('muteBtn');
    const muteBtnFloating = document.getElementById('muteBtnFloating');
    
    // Silenciar/dessilenciar solo el video visible
    const visibleVideo = getVisibleVideo();
    if (visibleVideo) visibleVideo.muted = !isMuted;
    
    if (isMuted) {
        // Cambiar a con audio
        if (muteBtn) {
            muteBtn.textContent = '🔊';
            muteBtn.classList.add('active');
        }
        if (muteBtnFloating) {
            muteBtnFloating.textContent = '🔊';
            muteBtnFloating.classList.add('active');
        }
        isMuted = false;
    } else {
        // Cambiar a sin audio
        if (muteBtn) {
            muteBtn.textContent = '🔇';
            muteBtn.classList.remove('active');
        }
        if (muteBtnFloating) {
            muteBtnFloating.textContent = '🔇';
            muteBtnFloating.classList.remove('active');
        }
        isMuted = true;
    }
}

// Función para sincronizar el estado del botón flotante
function updateFloatingMuteButton() {
    const muteBtn = document.getElementById('muteBtn');
    const muteBtnFloating = document.getElementById('muteBtnFloating');
    
    if (muteBtn && muteBtnFloating) {
        muteBtnFloating.textContent = muteBtn.textContent;
        if (muteBtn.classList.contains('active')) {
            muteBtnFloating.classList.add('active');
        } else {
            muteBtnFloating.classList.remove('active');
        }
    }
}

// Detectar scroll y mostrar/ocultar botón flotante
let lastScrollTop = 0;
const heroSection = document.querySelector('.hero');

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const muteBtnFloating = document.getElementById('muteBtnFloating');
    
    if (muteBtnFloating && heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        
        // Mostrar botón flotante solo cuando el hero haya pasado completamente
        // (cuando el scroll es mayor al final del hero)
        if (scrollTop > heroBottom) {
            muteBtnFloating.classList.add('visible');
            updateFloatingMuteButton();
        } else {
            muteBtnFloating.classList.remove('visible');
        }
    }
    
    lastScrollTop = scrollTop;
}

// Agregar event listener para scroll
window.addEventListener('scroll', handleScroll, { passive: true });

function togglePlay() {
    const playBtn = document.getElementById('playBtn');
    
    // Reproducir/pausar solo el video visible
    const visibleVideo = getVisibleVideo();
    
    if (isPlaying) {
        // Pausar video
        if (visibleVideo) visibleVideo.pause();
        if (playBtn) {
            playBtn.textContent = '▶️';
            playBtn.classList.remove('active');
        }
        isPlaying = false;
    } else {
        // Reproducir video
        if (visibleVideo) visibleVideo.play();
        if (playBtn) {
            playBtn.textContent = '⏸️';
            playBtn.classList.add('active');
        }
        isPlaying = true;
    }
}

// Hero text animation on video play
function initHeroTextAnimation() {
    const heroTextContainer = document.querySelector('.hero-text-container');
    if (!heroTextContainer) return;

    const videoDesktop = document.getElementById('heroVideoElement');
    const videoMobile = document.getElementById('heroVideoElementMobile');
    
    let buttonExpandTimeout = null;
    
    function triggerTextAnimation() {
        const ctaButton = document.querySelector('.cta-button');
        
        // Clear any pending button expansion timeout
        if (buttonExpandTimeout) {
            clearTimeout(buttonExpandTimeout);
            buttonExpandTimeout = null;
        }
        
        // Remove any existing animation classes to restart animation
        heroTextContainer.classList.remove('video-playing');
        if (ctaButton) {
            ctaButton.classList.remove('expanded');
        }
        
        // Force a reflow to ensure the class removal is processed
        void heroTextContainer.offsetWidth;
        
        // Add the animation class to start the animation
        heroTextContainer.classList.add('video-playing');
        
        // After text animation completes (11.5 seconds), expand the button
        buttonExpandTimeout = setTimeout(() => {
            if (ctaButton) {
                ctaButton.classList.add('expanded');
            }
            buttonExpandTimeout = null;
        }, 11500); // 11.5 seconds = when text fade out completes
    }

    let lastAnimationTime = 0;
    const ANIMATION_COOLDOWN = 12000; // 12 seconds cooldown to prevent rapid re-triggers
    
    function handleVideoPlay() {
        const now = Date.now();
        // Prevent triggering animation if it was triggered recently
        if (now - lastAnimationTime < ANIMATION_COOLDOWN) {
            return;
        }
        
        // Small delay to ensure video is actually playing
        setTimeout(() => {
            triggerTextAnimation();
            lastAnimationTime = Date.now();
        }, 50);
    }

    // Listen for play events on both videos
    if (videoDesktop) {
        videoDesktop.addEventListener('play', handleVideoPlay);
        videoDesktop.addEventListener('playing', handleVideoPlay);
    }
    
    if (videoMobile) {
        videoMobile.addEventListener('play', handleVideoPlay);
        videoMobile.addEventListener('playing', handleVideoPlay);
    }

    // Check if video is already playing when page loads
    function checkInitialVideoState() {
        const visibleVideo = getVisibleVideo();
        if (visibleVideo && !visibleVideo.paused && visibleVideo.readyState >= 2) {
            handleVideoPlay();
        }
    }

    // Check after a short delay to allow videos to load
    setTimeout(checkInitialVideoState, 500);
    
    // Also check when videos are loaded
    if (videoDesktop) {
        videoDesktop.addEventListener('loadeddata', () => {
            setTimeout(checkInitialVideoState, 200);
        }, { once: true });
    }
    
    if (videoMobile) {
        videoMobile.addEventListener('loadeddata', () => {
            setTimeout(checkInitialVideoState, 200);
        }, { once: true });
    }
}

// Initialize text animation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroTextAnimation);
} else {
    initHeroTextAnimation();
}

// Video Modal Functions
function openVideoModal(videoUrl) {
    // Mostrar notificación elegante preguntando sobre el audio
    Swal.fire({
        title: '🎵 ¿Activar Audio?',
        html: `
            <div style="text-align: center; margin: 20px 0;">
                <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
                    El video se reproducirá automáticamente. ¿Te gustaría activar el audio?
                </p>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                    <button id="audioOn" style="
                        background: #4a4a4a; 
                        color: white; 
                        border: none; 
                        padding: 12px 24px; 
                        border-radius: 25px; 
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='#B8941F'" onmouseout="this.style.background='#D4AF37'">
                        🔊 Con Audio
                    </button>
                    <button id="audioOff" style="
                        background: #f0f0f0; 
                        color: #2c2c2c; 
                        border: 2px solid #ddd; 
                        padding: 12px 24px; 
                        border-radius: 25px; 
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background='#f0f0f0'">
                        🔇 Sin Audio
                    </button>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
        customClass: {
            popup: 'swal-video-popup'
        },
        didOpen: () => {
            // Agregar estilos personalizados
            const style = document.createElement('style');
            style.textContent = `
                .swal-video-popup {
                    border-radius: 20px !important;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
                }
                .swal2-popup {
                    padding: 30px !important;
                }
            `;
            document.head.appendChild(style);
            
            // Manejar clicks en los botones
            document.getElementById('audioOn').addEventListener('click', () => {
                Swal.close();
                openVideoWithAudio(videoUrl);
            });
            
            document.getElementById('audioOff').addEventListener('click', () => {
                Swal.close();
                openVideoWithoutAudio(videoUrl);
            });
        }
    });
}

function openVideoWithAudio(videoUrl) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    iframe.src = videoUrl + '&autoplay=1&mute=0';
    modal.style.display = 'block';
}

function openVideoWithoutAudio(videoUrl) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    iframe.src = videoUrl + '&autoplay=1&mute=1';
    modal.style.display = 'block';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    iframe.src = '';
    modal.style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const videoModal = document.getElementById('videoModal');
    
    if (event.target === videoModal) {
        closeVideoModal();
    }
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#000';
        header.style.backdropFilter = 'none';
    }
});

// Fix Calendly scroll issues on mobile
function fixCalendlyScroll() {
    // Force page scroll to work
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.position = 'static';
    
    // Add touch event listeners to prevent iframe scroll capture
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.calendar-container')) {
            e.stopPropagation();
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('.calendar-container')) {
            e.stopPropagation();
        }
    }, { passive: true });
}

// Initialize scroll fix
document.addEventListener('DOMContentLoaded', fixCalendlyScroll);

// Re-apply fix when iframe loads
window.addEventListener('load', fixCalendlyScroll);

// Mobile service card expansion
function initMobileServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Add click handler for mobile expansion
        card.addEventListener('click', function(e) {
            // Only expand on mobile devices
            if (window.innerWidth <= 768) {
                // Don't expand if clicking the button
                if (e.target.classList.contains('service-button')) {
                    return;
                }
                
                // Toggle expansion
                if (card.classList.contains('mobile-expanded')) {
                    closeMobileServiceCard(card);
                } else {
                    openMobileServiceCard(card);
                }
            }
        });
    });
}

function openMobileServiceCard(card) {
    // Close any other expanded cards
    document.querySelectorAll('.service-card.mobile-expanded').forEach(expandedCard => {
        closeMobileServiceCard(expandedCard);
    });
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeMobileServiceCard(card);
    };
    card.appendChild(closeBtn);
    
    // Expand the card
    card.classList.add('mobile-expanded');
    document.body.style.overflow = 'hidden';
}

function closeMobileServiceCard(card) {
    card.classList.remove('mobile-expanded');
    const closeBtn = card.querySelector('.mobile-close-btn');
    if (closeBtn) {
        closeBtn.remove();
    }
    document.body.style.overflow = 'auto';
}

// Initialize mobile service cards
document.addEventListener('DOMContentLoaded', initMobileServiceCards);

// Check if user already has a booking
function checkExistingBooking() {
    const bookingData = localStorage.getItem('payment_completed');
    if (bookingData) {
        try {
            const booking = JSON.parse(bookingData);
            // Check if user already has a booking
            if (booking.hasBooking) {
                console.log('🔒 User already has a booking, blocking calendar');
                blockCalendarAfterBooking();
                return true;
            }
        } catch (e) {
            localStorage.removeItem('payment_completed');
        }
    }
    return false;
}

// Check booking on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Page loaded, checking booking status...');
    
    if (checkExistingBooking()) {
        console.log('✅ Booking status checked');
    }
    
    // Page loaded successfully
});


// Function to block calendar after successful booking
function blockCalendarAfterBooking() {
    console.log('🔒 Blocking calendar after booking...');
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        const calendarContainer = document.getElementById('calendarContainer');
        if (calendarContainer) {
            // Hide the iframe
            const iframe = document.getElementById('calendlyIframe');
            if (iframe) {
                iframe.style.display = 'none';
            }
            
            // Hide the scroll wrapper
            const scrollWrapper = calendarContainer.querySelector('.calendar-scroll-wrapper');
            if (scrollWrapper) {
                scrollWrapper.style.display = 'none';
            }
            
            // Show blocked message
            calendarContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 10px; border: 2px solid #000;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
                    <h3 style="color: #000; margin-bottom: 15px;">¡Cita Confirmada!</h3>
                    <p style="color: #666; margin-bottom: 20px;">Tu cita ha sido reservada exitosamente.</p>
                    <p style="color: #999; font-size: 0.9rem; margin-bottom: 20px;">📧 Recibirás un email de confirmación</p>
                    <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #000;">
                        <p style="color: #666; font-size: 0.9rem; margin: 0;">
                            <strong>💡 Tip:</strong> Si quieres hacer otra reserva, recarga la página (F5)
                        </p>
                    </div>
                </div>
            `;
        }
    }, 100);
}

// Scroll to payment section
function goToCalendly(service) {
    // Guardar el servicio seleccionado
    selectedService = service;
    
    // Ir directo a Calendly
    goToCalendlyDirect(service);
}

function goToCalendlyDirect(service) {
    console.log('🎯 Mostrando Calendly para servicio:', service);
    
    // Guardar el servicio seleccionado
    selectedService = service;
    
    // Hacer scroll suave hacia la sección de reserva
    const reservaSection = document.getElementById('reservar');
    if (reservaSection) {
        reservaSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    // Mostrar el calendario directamente con el servicio correcto
    setTimeout(() => {
        showCalendar(service);
    }, 500);
}

// Service Selection - FUNCTIONAL
let selectedService = null;
let selectedPrice = null;

function selectService(service, price) {
    selectedService = service;
    selectedPrice = price;
    
    // Ir directo a Calendly - el pago se maneja ahí
    goToCalendlyDirect(service);
}

function getServiceName(service) {
    const names = {
        'corte': 'Corte de Cabello',
        'asesoria-presencial': 'Asesoría Presencial – Primera Consulta',
        'asesoria-online': 'Asesoría de Visagismo en Línea'
    };
    return names[service] || 'Servicio';
}

function showCalendar(service) {
    // Hide payment selection or services grid (whichever exists)
    const paymentSelection = document.querySelector('.payment-selection');
    const servicesGrid = document.querySelector('.services-grid');
    if (paymentSelection) paymentSelection.style.display = 'none';
    if (servicesGrid) servicesGrid.style.display = 'none';

    // Unlock calendar container and show iframe
    const calendarContainer = document.getElementById('calendarContainer');
    const iframe = document.getElementById('calendlyIframe');
    const scrollWrapper = calendarContainer.querySelector('.calendar-scroll-wrapper');
    const lockOverlay = calendarContainer.querySelector('.calendar-lock-overlay');

    if (calendarContainer) {
        calendarContainer.classList.remove('locked');
        calendarContainer.classList.add('unlocked');
    }

    // Show scroll wrapper and iframe
    if (scrollWrapper) scrollWrapper.style.display = 'block';
    if (iframe) {
        iframe.style.display = 'block';
            // Calendly URLs (kept inline where used to match original structure)
            if (service === 'corte') {
                iframe.src = 'https://calendly.com/alexander-hernandez-iest/corte-de-cabello-visagismo';
            } else if (service === 'asesoria-presencial') {
                iframe.src = 'https://calendly.com/alexander-hernandez-iest/corte-asesoria-visagismo';
            } else {
                iframe.src = 'https://calendly.com/alexander-hernandez-iest/corte-asesoria-visagismo';
            }
    }

    if (lockOverlay) lockOverlay.style.display = 'none';

    // Scroll to calendar
    if (calendarContainer) calendarContainer.scrollIntoView({ behavior: 'smooth' });

    // Setup Calendly event detection
    setupCalendlyDetection();

    // Show footer service switcher under the iframe (if exists)
    const serviceSwitcher = document.getElementById('calendarServiceSwitcher');
    const footerSelect = document.getElementById('changeServiceSelectFooter');
    if (serviceSwitcher) {
        // ensure it's unhidden and visible
        serviceSwitcher.hidden = false;
        serviceSwitcher.classList.add('visible');
        if (footerSelect && selectedService) footerSelect.value = selectedService;
    }
}

// Detect Calendly events and button clicks
function setupCalendlyDetection() {
    console.log('🔍 Setting up Calendly detection...');
    setupCalendlyListener();
}

// Change service while calendar is open (footer switcher)
function changeServiceFromFooter() {
    const select = document.getElementById('changeServiceSelectFooter');
    if (!select) return;
    const service = select.value;
    selectedService = service;
    const iframe = document.getElementById('calendlyIframe');
    if (iframe) {
        if (service === 'corte') {
            iframe.src = 'https://calendly.com/alexander-hernandez-iest/corte-de-cabello-visagismo';
        } else if (service === 'asesoria-presencial') {
            iframe.src = 'https://calendly.com/alexander-hernandez-iest/corte-asesoria-visagismo';
        } else {
            iframe.src = 'https://calendly.com/alexander-hernandez-iest/corte-asesoria-visagismo';
        }
        // restart detection to catch events for new url
        setupCalendlyDetection();
    }
}

function closeCalendarSwitcher() {
    const serviceSwitcher = document.getElementById('calendarServiceSwitcher');
    if (serviceSwitcher) {
        serviceSwitcher.classList.remove('visible');
        serviceSwitcher.hidden = true;
    }
}

// Check if user already has a booking
async function checkExistingBooking() {
    const paymentData = localStorage.getItem('payment_completed');
    if (!paymentData) {
        return false;
    }

    try {
        const payment = JSON.parse(paymentData);
        const response = await fetch('/apis/check-booking.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                customer_email: payment.payer_email || 'unknown@example.com',
                payment_id: payment.payment_id 
            })
        });
        
        const result = await response.json();
        return result.has_booking || false;
    } catch (error) {
        console.error('Error checking existing booking:', error);
        return false;
    }
}

// Setup Calendly event listener
function setupCalendlyListener() {
    console.log('🔍 Setting up ENHANCED Calendly detection...');
    
    let bookingDetected = false;
    
    // Method 1: Listen for postMessage events from Calendly
    window.addEventListener('message', function(event) {
        if (event.origin.includes('calendly.com') || event.origin.includes('app.calendly.com')) {
            console.log('📅 Calendly message:', event.data);
            
            // Check for any event data
            if (event.data && typeof event.data === 'object') {
                // Check for event type
                if (event.data.type) {
                    console.log('🎯 Event type:', event.data.type);
                    
                    // Trigger on any significant Calendly event
                    if (event.data.type.includes('scheduled') || 
                        event.data.type.includes('submitted') || 
                        event.data.type.includes('created') ||
                        event.data.type.includes('confirmed') ||
                        event.data.type.includes('booked')) {
                        console.log('🎉 Calendly booking event detected via postMessage!');
                        if (!bookingDetected) {
                            bookingDetected = true;
                            setTimeout(() => handleScheduleEvent(), 2000);
                        }
                    }
                }
                
                // Check for event data structure
                if (event.data.event) {
                    console.log('🎯 Event data:', event.data.event);
                    if (event.data.event.includes('scheduled') || 
                        event.data.event.includes('booked') ||
                        event.data.event.includes('confirmed')) {
                        console.log('🎉 Calendly booking event detected via event data!');
                        if (!bookingDetected) {
                            bookingDetected = true;
                            setTimeout(() => handleScheduleEvent(), 2000);
                        }
                    }
                }
            }
        }
    });
    
    // Method 2: Monitor iframe src changes
    let lastSrc = '';
    const iframe = document.getElementById('calendlyIframe');
    
    const checkSrcChanges = () => {
        const currentSrc = iframe.src;
        if (currentSrc !== lastSrc && currentSrc !== '') {
            console.log('📝 Iframe src changed:', currentSrc);
            lastSrc = currentSrc;
            
            // Check for success indicators in URL
            if (currentSrc.includes('success') || 
                currentSrc.includes('confirmed') || 
                currentSrc.includes('thank') ||
                currentSrc.includes('scheduled') ||
                currentSrc.includes('booked')) {
                console.log('✅ Success URL detected!');
                if (!bookingDetected) {
                    bookingDetected = true;
                    setTimeout(() => handleScheduleEvent(), 2000);
                }
            }
        }
    };
    
    // Check src changes every 1 second (more frequent)
    const srcInterval = setInterval(checkSrcChanges, 1000);
    
    // Method 3: Detect clicks and check for success
    iframe.addEventListener('click', () => {
        console.log('🖱️ Click detected in Calendly');
        setTimeout(() => {
            const currentSrc = iframe.src;
            if (currentSrc.includes('success') || 
                currentSrc.includes('confirmed') || 
                currentSrc.includes('thank') ||
                currentSrc.includes('scheduled')) {
                console.log('✅ Click led to success page!');
                handleScheduleEvent();
            }
        }, 3000);
    });
    
    // Clean up intervals after 15 minutes
    setTimeout(() => {
        clearInterval(srcInterval);
        console.log('⏰ Calendly detection stopped after 15 minutes');
    }, 900000);
}

// Handle when Schedule Event is clicked
function handleScheduleEvent() {
    console.log('🎊 SCHEDULE EVENT CLICKED! Processing reservation...');
    
    // Hide manual button immediately
    
    // Check if already processing to prevent duplicates
    if (window.bookingInProgress) {
        console.log('⚠️ Booking already in progress, ignoring duplicate event');
        return;
    }
    
    // Check for recent booking attempt (within last 30 seconds)
    const lastBookingAttempt = localStorage.getItem('last_booking_attempt');
    if (lastBookingAttempt) {
        const timeSinceLastAttempt = Date.now() - parseInt(lastBookingAttempt);
        if (timeSinceLastAttempt < 30000) { // 30 seconds
            console.log('⚠️ Recent booking attempt detected, ignoring duplicate');
            return;
        }
    }
    
    // Set timestamp for this booking attempt
    localStorage.setItem('last_booking_attempt', Date.now().toString());
    
    // Check if user already has a booking in localStorage
    const paymentData = localStorage.getItem('payment_completed');
    if (!paymentData) {
        console.warn('⚠️ No payment data found in localStorage');
        return;
    }
    
    const payment = JSON.parse(paymentData);
    
    window.bookingInProgress = true;
    console.log('💳 Payment data found:', payment);
    
    // Save booking to database (server will check for duplicates)
    const bookingData = {
        customer_email: payment.payer_email || 'unknown@example.com',
        customer_name: 'Cliente', // Default name
        customer_phone: '', // Empty phone
        service: payment.service,
        appointment_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        calendly_event_id: 'temp_' + Date.now() // Temporary event ID
    };
    
    console.log('💾 Saving booking data:', bookingData);
    
    fetch('/apis/save-booking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
    }).then(response => {
        if (response.status === 409) {
            // Conflict - user already has a booking
            return response.json().then(data => {
                throw new Error('DUPLICATE_BOOKING');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('✅ Booking saved successfully:', data);
        
        // Update localStorage to mark booking as completed
        const updatedPayment = {
            ...payment,
            hasBooking: true,
            bookingDate: bookingData.appointment_date,
            bookingId: data.booking_id || 'temp_id'
        };
        localStorage.setItem('payment_completed', JSON.stringify(updatedPayment));
        
        // Hide manual confirmation button
        
        // Show success message
        Swal.fire({
            title: '✅ ¡Cita Confirmada!',
            text: 'Tu cita ha sido reservada exitosamente. Recibirás un email de confirmación.',
            icon: 'success',
            confirmButtonText: 'Perfecto',
            confirmButtonColor: '#D4AF37'
        }).then(() => {
            // Block calendar after successful booking
            console.log('🔒 Blocking calendar after successful booking...');
            blockCalendarAfterBooking();
        });
        
        console.log('🎯 Booking process completed!');
        window.bookingInProgress = false;
    }).catch(error => {
        console.error('❌ Error saving booking:', error);
        
        if (error.message === 'DUPLICATE_BOOKING') {
            // User already has a booking
            Swal.fire({
                title: '⚠️ Ya tienes una cita',
                text: 'Ya tienes una cita confirmada. Si necesitas cambiarla, contáctanos.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#000'
            });
            
            // Update localStorage to reflect this
            const updatedPayment = {
                ...payment,
                hasBooking: true
            };
            localStorage.setItem('payment_completed', JSON.stringify(updatedPayment));
        } else {
            Swal.fire({
                title: '❌ Error',
                text: 'Hubo un problema al guardar tu cita. Por favor contacta al soporte.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#000'
            });
        }
        window.bookingInProgress = false;
    });
}


function updateFavicon() {
    const favicon = document.getElementById('favicon');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
        // Tema oscuro: usar ícono blanco
        favicon.href = 'img/icon.png';
    } else {
        // Tema claro: usar ícono negro
        favicon.href = 'img/Icon-Dark.png';
    }
}

// Actualizar al cargar la página
updateFavicon();

// Escuchar cambios en el tema del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);

// Change service from the calendar overlay select
// Open the footer service switcher when user wants to change package from overlay
// removed: overlay-open handler not needed — footer switcher appears when calendar opens

// Show services grid (useful when user wants to re-pick visually)
function showServicesFromOverlay() {
    // Ensure services grid is visible and scroll to it
    const servicesGrid = document.querySelector('.services-grid');
    const paymentSelection = document.querySelector('.payment-selection');
    if (paymentSelection) paymentSelection.style.display = 'block';
    if (servicesGrid) {
        servicesGrid.style.display = 'grid';
        servicesGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        // Fallback: scroll to reservar section
        const reserva = document.getElementById('reservar');
        if (reserva) reserva.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Ensure overlay select is visible and interactive on load
document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.getElementById('calendarContainer');
    if (!calendarContainer) return;
    const lockOverlay = calendarContainer.querySelector('.calendar-lock-overlay');
    const select = document.getElementById('changeServiceSelect');
    if (lockOverlay && select) {
        // Make sure overlay is displayed when locked
        if (calendarContainer.classList.contains('locked')) {
            lockOverlay.style.display = 'flex';
        }

        // Ensure select is visible and usable
        select.style.display = 'block';
        select.addEventListener('change', (e) => {
            // optional: reflect selection elsewhere
            console.log('Overlay service selected:', e.target.value);
        });
    } else {
        console.log('Info: changeServiceSelect not found in DOM');
    }
});
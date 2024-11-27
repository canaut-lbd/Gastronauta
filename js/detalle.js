// ========================================
// INICIALIZACIÓN DE PLUGINS Y CONFIGURACIÓN
// ========================================

// Inicialización de Lenis para smooth scroll
const lenis = new Lenis({
    duration: 0.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.5,
    smoothTouch: true,
    touchMultiplier: 2.5,
    touchInertiaMultiplier: 35,
    infinite: false
});

// Manejador del scroll suave de Lenis
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Registro del plugin ScrollTrigger y SplitText de GSAP
gsap.registerPlugin(ScrollTrigger, SplitText);

// ========================================
// SPLITTEXT HERO
// ========================================

document.addEventListener("DOMContentLoaded", function () {
    // Seleccionar los elementos del título y el párrafo
    const titleElement = document.querySelector(".hero-content h1");
    const paragraphElement = document.querySelector(".hero-content p");

    if (!titleElement || !paragraphElement) {
        console.error("No se encontró el título o párrafo en .hero-content");
        return;
    }

    // Dividir el texto del título en caracteres
    const splitTitle = new SplitText(titleElement, { type: "chars" });

    // Dividir el texto del párrafo en líneas (en lugar de palabras o caracteres)
    const splitParagraph = new SplitText(paragraphElement, { type: "lines" });

    // Crear la animación
    const tl = gsap.timeline();

    // Animación para las letras del título
    tl.from(splitTitle.chars, {
        y: 50, // Suben desde abajo
        opacity: 0,
        stagger: 0.02, // Menor desfase entre caracteres
        ease: "power2.out", // Movimiento más suave
        duration: 0.8, // Duración total
    });

    // Animación para las líneas del párrafo
    tl.from(
        splitParagraph.lines,
        {
            y: 30, // Suben desde abajo
            opacity: 0,
            stagger: 0.1, // Más rápido entre líneas
            ease: "power2.out", // Movimiento más suave
            duration: 1, // Duración total
        },
        "-=0.4" // Superponer ligeramente con el final del título
    );

    // Después de la animación del texto
    gsap.to('.hero-content .share-button', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.5, // Ajusta este valor según cuando quieras que aparezca después del texto
        ease: "power2.out"
    });
});


// ========================================
// ANIMACIÓN PRINCIPAL DEL HERO (SCROLLTRIGGER)
// ========================================

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "+=100%",
        scrub: 2,
        pin: true,
        anticipatePin: 1
    }
});

// Animación de la imagen principal y contracción horizontal del hero-content
tl.fromTo(".hero-image-container", {
    clipPath: "inset(0 0% 0 0)", // Imagen cubre toda la pantalla
    width: "100vw"
}, {
    clipPath: "inset(0 50% 0 0)", // Efecto cortina
    width: "100vw",
    duration: 1.8,
    ease: "power2.inOut"
})
.fromTo(".hero-content", {
    width: "100%", // Ancho inicial
}, {
    width: "40%", // Reducimos a un 70% en lugar de 50%
    duration: 1.8, // Movimiento más lento
    ease: "power1.out", // Movimiento más suave
    transformOrigin: "center center" // Reducción desde el centro
}, "<") // Sincronizado con el efecto cortina
.fromTo(".content-container", {
    x: "100%",
    opacity: 0
}, {
    x: "0%",
    opacity: 1,
    duration: 1.5,
    ease: "power2.inOut"
}, "<");


// ========================================
// CONEXIÓN ENTRE LENIS Y SCROLLTRIGGER
// ========================================

document.querySelector('.content-container').addEventListener('wheel', (e) => {
    e.stopPropagation();
}, { passive: true });

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
ScrollTrigger.refresh();

// ========================================
// SLIDER DE COMPARACIÓN DE IMÁGENES
// ========================================

function initializeImageComparisonSlider() {
    const sliderHandle = document.querySelector(".slider-handle");
    const imageBefore = document.querySelector(".image-before");
    const comparisonContainer = document.querySelector(".image-comparison");

    if (!sliderHandle || !imageBefore || !comparisonContainer) {
        console.warn("Slider de comparación no encontrado. Verifica tu HTML.");
        return;
    }

    let isDragging = false;

    // Set initial positions
    function setInitialState() {
        const rect = comparisonContainer.getBoundingClientRect();
        const initialPercentage = 50; // Posición inicial en el centro
        sliderHandle.style.left = `${initialPercentage}%`;
        imageBefore.style.clipPath = `inset(0 ${100 - initialPercentage}% 0 0)`;
    }

    // Helper function to update slider position and clip-path
    function updateSlider(clientX) {
        const rect = comparisonContainer.getBoundingClientRect();
        let offsetX = clientX - rect.left;

        // Limitar el movimiento dentro del contenedor
        offsetX = Math.max(0, Math.min(offsetX, rect.width));

        const percentage = (offsetX / rect.width) * 100;

        // Actualizar posición del deslizador y clip-path
        sliderHandle.style.left = `${percentage}%`;
        imageBefore.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    }

    // Start dragging
    sliderHandle.addEventListener("mousedown", (e) => {
        isDragging = true;
        updateSlider(e.clientX);
    });

    // Stop dragging
    window.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // Move slider on mouse move
    window.addEventListener("mousemove", (e) => {
        if (isDragging) updateSlider(e.clientX);
    });

    // Support touch events
    comparisonContainer.addEventListener("touchstart", (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
    });

    comparisonContainer.addEventListener("touchmove", (e) => {
        if (isDragging) updateSlider(e.touches[0].clientX);
    });

    comparisonContainer.addEventListener("touchend", () => {
        isDragging = false;
    });

    // Set initial state on load
    setInitialState();
}

// Initialize everything after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lenis and GSAP animations
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Initialize the image comparison slider
    initializeImageComparisonSlider();

    // Inicialización del Swiper
    const swiper = new Swiper('.food-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        grabCursor: false,
        preventInteractionOnTransition: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        effect: 'slide',
        resistance: true,
        resistanceRatio: 0.85,
        watchOverflow: true,
    });
});

// =============================================
//  3. ANIMACIONES DE SECCIONES
// =============================================

const isMobile = window.innerWidth <= 768;

// Animaciones solo para desktop
if (!isMobile) {
    gsap.utils.toArray('.content-section').forEach((section) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "top 35%",
                scrub: 1.5,
                scroller: ".content-container",
                toggleActions: "play none none reverse"
            },
            y: 100,
            scale: 0.95,
            opacity: 0.5,
            filter: "blur(8px)",
            transformOrigin: "center center",
            ease: "power2.inOut"
        });
    });
}

// =============================================
//  4. CURSOR PERSONALIZADO
// =============================================

function updateCursorText() {
    const cursor = document.querySelector('.custom-cursor span');
    const foodCarousel = document.querySelector('.food-carousel');
    const imageComparison = document.querySelector('.image-comparison');
    const galleryGrid = document.querySelector('.gallery-grid');
    const shareButton = document.querySelector('.share-button');
    const backButton = document.querySelector('.back-button');
    
    const mouseY = event.clientY;
    const mouseX = event.clientX;
    
    const carouselRect = foodCarousel.getBoundingClientRect();
    const comparisonRect = imageComparison?.getBoundingClientRect();
    const galleryGridRect = galleryGrid?.getBoundingClientRect();
    const shareButtonRect = shareButton?.getBoundingClientRect();
    const backButtonRect = backButton?.getBoundingClientRect();

    if ((shareButton && 
         mouseX >= shareButtonRect.left && 
         mouseX <= shareButtonRect.right &&
         mouseY >= shareButtonRect.top && 
         mouseY <= shareButtonRect.bottom) ||
        (backButton && 
         mouseX >= backButtonRect.left && 
         mouseX <= backButtonRect.right &&
         mouseY >= backButtonRect.top && 
         mouseY <= backButtonRect.bottom)) {
        cursor.parentElement.style.opacity = 0;
        return;
    }
    
    cursor.parentElement.style.opacity = 1;

    if (imageComparison && 
        mouseY >= comparisonRect.top && 
        mouseY <= comparisonRect.bottom) {
        cursor.textContent = 'drag';
    }
    else if (mouseY >= carouselRect.top && 
             mouseY <= carouselRect.bottom) {
        cursor.textContent = 'drag';
    }
    else if (galleryGrid && 
             mouseY >= galleryGridRect.top && 
             mouseY <= galleryGridRect.bottom) {
        cursor.textContent = 'click';
    }
    else {
        cursor.textContent = 'scroll';
    }
}

document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    cursor.style.opacity = 1;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    updateCursorText();
});

// Actualizar el texto en scroll
window.addEventListener('scroll', updateCursorText);

// Llamar a updateCursorText cuando la página carga
document.addEventListener('DOMContentLoaded', updateCursorText);

// Añadir esta nueva funcionalidad para la galería del entorno
document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.querySelector('.gallery-main img');
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Guardar la src de la imagen principal actual
            const currentMainSrc = mainImage.src;
            
            // Cambiar la imagen principal por la thumbnail clickeada
            mainImage.src = this.src;
            
            // Actualizar la thumbnail con la imagen que estaba en principal
            this.src = currentMainSrc;
            
            // Opcional: añadir una pequeña animación
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 50);
        });
    });
});

// Añade el botón de compartir a los elementos que ocultan el cursor
const shareButton = document.querySelector('.share-button');
if (shareButton) {
    shareButton.addEventListener('mouseenter', () => {
        document.querySelector('.custom-cursor').style.opacity = 0;
    });

    shareButton.addEventListener('mouseleave', () => {
        document.querySelector('.custom-cursor').style.opacity = 1;
    });
}


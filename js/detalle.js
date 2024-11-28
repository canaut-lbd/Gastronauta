// ========================================
// INICIALIZACIÓN DE PLUGINS Y CONFIGURACIÓN
// ========================================

// Inicialización de Lenis para smooth scroll
//He creado la constante isMobile para evitar errores en responsive
const isMobile = window.innerWidth <= 600; 
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

// Función para manejar el scroll suave de Lenis
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
    // Selecciono el título y el párrafo del hero del detalle
    const titleElement = document.querySelector(".hero-content h1");
    const paragraphElement = document.querySelector(".hero-content p");

    if (!titleElement || !paragraphElement) {
        console.error("No se encontró el título o párrafo en .hero-content");
        return;
    }

    // Dividir el texto del título en caracteres
    const splitTitle = new SplitText(titleElement, { type: "chars" });
    // Dividir el texto del párrafo en líneas (en lugar de palabras o caracteres) para que sea más dinámico
    const splitParagraph = new SplitText(paragraphElement, { type: "lines" });
    const tl = gsap.timeline();

    // Animación para las letras del título
    tl.from(splitTitle.chars, {
        y: 50, 
        opacity: 0,
        stagger: 0.02, 
        ease: "power2.out", 
        duration: 0.8, 
    });

    // Animación para las líneas del párrafo
    tl.from(
        splitParagraph.lines,
        {
            y: 30, 
            opacity: 0,
            stagger: 0.1, 
            ease: "power2.out", 
            duration: 1, 
        },
        "-=0.4" 
    );

    // Después de la animación del texto sube el botón de compartir
    gsap.to('.hero-content .share-button', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.5, 
        ease: "power2.out"
    });
});

// ========================================
// ANIMACIÓN PRINCIPAL DEL HERO (SCROLLTRIGGER)
// ========================================
// Si el dispositivo es desktop, se ejecuta la animación principal del hero, he retirado el scrolltrigger para que no se ejecute en mobile para dejar que la experiencia sea más fluida en vertical
if (!isMobile) {
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

    // Aseguro que el Hero empieza centrado
    gsap.set(".hero-content", {
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        top: "50%",
        width: "60%",
        textAlign: "center",
        alignItems: "center"
    });

    tl.fromTo(".hero-image-container", {
        clipPath: "inset(0 0% 0 0)",
        width: "100vw"
    }, {
        clipPath: "inset(0 50% 0 0)",
        width: "100vw",
        duration: 1.8,
        ease: "power2.inOut"
    })
    .to(".hero-content", {
        left: "35%",
        x: "-12vw",
        width: "40%",
        textAlign: "center",
        alignItems: "center",
        duration: 1.8,
        ease: "power1.out"
    }, "<")
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


// =============================================
//  3. ANIMACIONES DE SECCIONES
// =============================================

const isMobile = window.innerWidth <= 768;

// Animaciones solo para desktop. Aplico un scrolltrigger para que se ejecute en desktop y no en mobile
gsap.utils.toArray('.content-section').forEach((section) => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 35%",
            scrub: 1.5,
            scroller: ".content-container",
            toggleActions: "play none none reverse"
        }, //Aplico un efecto de blurr y de escalado cuando el usuario scrollea hasta la seccion
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
// Función para cambiar el comportamiento del cursor en función de sobre qué elemento o en qué región este
function updateCursorText() {
    const cursor = document.querySelector('.custom-cursor span');
    const foodCarousel = document.querySelector('.food-carousel');
    const imageComparison = document.querySelector('.image-comparison');
    const galleryGrid = document.querySelector('.gallery-grid');
    const shareButton = document.querySelector('.share-button');
    const backButton = document.querySelector('.back-button');
    //Obtengo la posición del ratón
    const mouseY = event.clientY;
    const mouseX = event.clientX;
    //Obtengo las dimensiones de los elementos
    const carouselRect = foodCarousel.getBoundingClientRect();
    const comparisonRect = imageComparison?.getBoundingClientRect();
    const galleryGridRect = galleryGrid?.getBoundingClientRect();
    const shareButtonRect = shareButton?.getBoundingClientRect();
    const backButtonRect = backButton?.getBoundingClientRect();
    //Oculto el cursor cuando me encuentro sobre el botón compartir o sobre el botón "volver a rutas" para que no tape el contenido
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
    //Cambio el cursor según la sección sobre la que se encuentra
    cursor.parentElement.style.opacity = 1;
    //Sobre el slide handle pongo "drag"
    if (imageComparison && 
        mouseY >= comparisonRect.top && 
        mouseY <= comparisonRect.bottom) {
        cursor.textContent = 'drag';
    } //En el carrusel de Comida coloco "drag" para que el usuario haga slide.
    else if (mouseY >= carouselRect.top && 
             mouseY <= carouselRect.bottom) {
        cursor.textContent = 'drag';
    } //Sobre el grid pongo "click" para clicar en las imágenes y activar la siguiente animación
    else if (galleryGrid && 
             mouseY >= galleryGridRect.top && 
             mouseY <= galleryGridRect.bottom) {
        cursor.textContent = 'click';
    }
    else {
        cursor.textContent = 'scroll';
    }
}

// Función para manejar el cursor solo en desktop
function initCustomCursor() {
    if (window.innerWidth > 600) {
        document.addEventListener('mousemove', (e) => {
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                cursor.style.opacity = 1;
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                updateCursorText();
            }
        });
        window.addEventListener('scroll', updateCursorText);
    }
}

// Inicializar solo en desktop
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 600) {
        initCustomCursor();
        updateCursorText();
    }
});

// =============================================
//  5. FUNCIÓN PARA MOVER LAS IMÁGENES DE LA GALERÍA DEL ENTORNO
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.querySelector('.gallery-main img');
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Guardo la src de la imagen principal actual
            const currentMainSrc = mainImage.src;
            
            // Cambio la imagen principal por la thumbnail clicada
            mainImage.src = this.src;
            
            // Actualizo la thumbnail con la imagen que estaba en principal
            this.src = currentMainSrc;
            
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 50);
        });
    });
});
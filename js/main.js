gsap.registerPlugin(ScrollTrigger, SplitText);

//====================
//SECCIÓN ANIMACIÓN HORIZONTAL
//====================
const horizontalSection = gsap.timeline({
    scrollTrigger: {
        trigger: ".horizontal-scroll-section",
        start: "top top",
        end: () => `+=${document.querySelector(".animation-wrap").offsetWidth}`,
        end: () => {
            const totalWidth = document.querySelector(".animation-wrap").offsetWidth;
            if (window.innerWidth <= 600) {
                return `+=${totalWidth * 1.2}`;
            }
            return `+=${totalWidth}`;
        },
        pin: true,
        scrub: 1.5,
        invalidateOnRefresh: true,
        onEnter: () => {
            document.body.style.overflowX = "auto";

            // Activar primer bloque
            const firstBlock = document.querySelector('.text-block');
            const firstContentWrapper = firstBlock.querySelector('.content-wrapper');
            gsap.to(firstContentWrapper, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        },
        onLeave: () => {
            document.body.style.overflowX = "hidden";
        },
        onLeaveBack: () => {
            document.body.style.overflowX = "hidden";
        },
        onUpdate: (self) => {
            if (self.progress >= 1) {
                gsap.to('.carousel-container', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        gsap.set('.carousel-container', {
                            clearProps: "all"
                        });
                    }
                });
            }
        }
    }
});

horizontalSection.to(".animation-wrap", {
    x: () => -(document.querySelector(".animation-wrap").offsetWidth - window.innerWidth),
    ease: "none"
});

gsap.utils.toArray('.text-block').forEach((block, index, blocks) => {
    const contentWrapper = block.querySelector('.content-wrapper');
    const arrow = block.querySelector('.path-arrow path');
    const nextBlock = blocks[index + 1];

    const textContent = contentWrapper.querySelector('.text-content');
    const image = contentWrapper.querySelector('.step-image');

    gsap.set(textContent, {
        opacity: 0,
        x: -30
    });

    gsap.set(image, {
        opacity: 0,
        x: 30,
        scale: 0.95
    });

    if (arrow) {
        const pathLength = arrow.getTotalLength();
        gsap.set(arrow, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
            opacity: 0
        });
    }

    ScrollTrigger.create({
        trigger: block,
        containerAnimation: horizontalSection,
        start: "left 65%",
        end: "right 45%",
        scrub: 1,
        onEnter: () => {
            gsap.to(textContent, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out"
            });

            gsap.to(image, {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.2)"
            });

            contentWrapper.classList.add('active');
        },
        onUpdate: (self) => {
            if (arrow) {
                const progress = self.progress;

                gsap.to(arrow, {
                    strokeDashoffset: arrow.getTotalLength() * (1 - progress),
                    opacity: progress,
                    duration: 0.3,
                    ease: "none"
                });

                if (progress > 0.6 && nextBlock) {
                    const nextText = nextBlock.querySelector('.text-content');
                    const nextImage = nextBlock.querySelector('.step-image');

                    gsap.fromTo(nextText, 
                        { opacity: 0, x: -30 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.8,
                            ease: "power2.out"
                        }
                    );

                    gsap.fromTo(nextImage,
                        { opacity: 0, x: 30, scale: 0.95 },
                        {
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            duration: 0.8,
                            ease: "back.out(1.2)"
                        }
                    );
                }
            }
        }
    });
});

//====================
//ANIMACIÓN DEL HERO
//====================
function initHeroAnimation() {
    const heroElement = document.querySelector(".hero_title");
    
    // Aseguramos que el elemento sea visible
    gsap.set(heroElement, { opacity: 1 });

    // Dividimos en caracteres manteniendo la estructura
    const title = new SplitText(".hero_title", {
        type: "chars, words",
        charsClass: "char",
        wordsClass: "word",
        position: "relative",
        wordDelimiter: " ",
        preserveSpaces: true
    });

    // Aseguramos que las palabras se mantengan juntas
    title.words.forEach(word => {
        word.style.display = 'inline-block';
        word.style.whiteSpace = 'nowrap';
    });

    // Configuración inicial de los caracteres
    gsap.set(title.chars, {
        y: 100,
        opacity: 0,
        display: 'inline-block'
    });

    // Animación de los caracteres
    gsap.to(title.chars, {
        duration: 1.4,
        y: 0,
        opacity: 1,
        stagger: 0.02,
        ease: "power4.out",
        delay: 0.2
    });
}

// Aseguramos que la función esté disponible globalmente
window.initHeroAnimation = initHeroAnimation;

//====================
// ANIMACIÓN MENÚ
//====================
document.querySelector('.menu-trigger').addEventListener('click', function() {
    document.querySelector('.menu-wrap').classList.toggle('active');
});
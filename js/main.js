gsap.registerPlugin(ScrollTrigger, SplitText);

const horizontalSection = gsap.timeline({
    scrollTrigger: {
        trigger: ".horizontal-scroll-section",
        start: "top top",
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
            if (self.progress > 0.8) {
                const progress = (self.progress - 0.8) / 0.2;
                
                gsap.to('.carousel-container', {
                    opacity: progress,
                    y: `${(1 - progress) * 100}vh`,
                    duration: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        if (self.progress > 0.99) {
                            gsap.set('.carousel-container', {
                                clearProps: "all"
                            });
                        }
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
        end: "right 35%",
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

function initHeroAnimation() {
    try {
        const heroElement = document.querySelector(".hero_title");
        gsap.set(heroElement, { opacity: 0 });

        const title = new SplitText(".hero_title", {
            type: "chars",
            charsClass: "char"
        });

        gsap.set(title.chars, {
            opacity: 0,
            y: 50,
            rotationX: 30
        });

        gsap.to(heroElement, {
            opacity: 1,
            duration: 0.1,
            onComplete: () => {
                gsap.to(title.chars, {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 1,
                    stagger: 0.03,
                    ease: "back.out(1.7)"
                });
            }
        });
    } catch (error) {
        console.error("Error en la animación:", error);
    }
}

window.initHeroAnimation = initHeroAnimation;

gsap.set('.carousel-container', {
    opacity: 0,
    y: '100vh',
});

document.querySelector('.menu-trigger').addEventListener('click', function() {
    document.querySelector('.menu-wrap').classList.toggle('active');
});


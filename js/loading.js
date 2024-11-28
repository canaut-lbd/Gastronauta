// Verifica si es la primera carga de la sesión
if (!sessionStorage.getItem('hasLoaded')) {
    // Si no ha cargado antes, se muestra la pantalla de carga
    sessionStorage.setItem('hasLoaded', 'true');

    let counterElement = document.getElementById('counter');
    let rotatingImage = document.querySelector('.contenedor_giratorio');
    let loadingPage = document.getElementById('loading_page');
    let count = 0;

    // Inicia la rotación al mismo tiempo que el conteo
    gsap.to(rotatingImage, {
        rotation: 360,
        repeat: -1,
        duration: 4,
        ease: "linear"
    });

    document.body.style.overflow = 'hidden';

    function updateCounter() {
        if (count <= 100) {
            counterElement.textContent = count;
            count++;
            setTimeout(updateCounter, 25);
        } else {
            triggerExpansion();
        }
    }

    function triggerExpansion() {
        let tl = gsap.timeline();

        // Primero fade out del contador
        tl.to(counterElement, {
            opacity: 0,
            duration: 0.5,
            ease: "power1.out"
        });

        // Luego el efecto de scale del logo
        tl.to(rotatingImage, {
            scale: 30,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
                // Detenemos la rotación y ocultamos el logo
                gsap.killTweensOf(rotatingImage);
                rotatingImage.style.display = 'none';
                counterElement.style.display = 'none';

                // SOLO DESPUÉS de que termine el efecto del logo, movemos la página
                gsap.to(loadingPage, {
                    y: '-100%',
                    duration: 1,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        loadingPage.style.display = 'none';
                        loadingPage.style.visibility = 'hidden';
                        document.body.style.overflow = 'auto';
                        console.log("Loading terminado - Iniciando animación del hero");
                        if (typeof initHeroAnimation === "function") {
                            initHeroAnimation();
                        } else {
                            console.error("initHeroAnimation no está definida");
                        }
                    }
                });
            }
        }, "-=0.5");
    }

    updateCounter();

} else {
    // Si ya ha cargado antes, oculta la pantalla de carga y muestra el contenido directamente
    document.getElementById('loading_page').style.display = 'none';
    document.body.style.overflow = 'auto';
    if (typeof initHeroAnimation === "function") {
        initHeroAnimation();
    }
}

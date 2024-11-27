document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll(".card");
    const totalCards = cards.length;
    let currentIndex = Math.floor(totalCards / 2);
    let startX = 0;
    let isDragging = false;
    let isAnimating = false;

    // Añadir eventos hover solo a la card centrada
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            // Solo aplicar el hover si es la card centrada y no se está arrastrando
            if (!isDragging && index === currentIndex) {
                gsap.to(card, {
                    scale: 0.95,
                    duration: 0.3,
                    overwrite: true
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            // Restaurar solo si es la card centrada y no se está arrastrando
            if (!isDragging && index === currentIndex) {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    overwrite: true
                });
            }
        });
    });

    // Actualizar el cursor solo para la card centrada
    function updateCardCursors() {
        cards.forEach((card, index) => {
            card.style.cursor = index === currentIndex ? 'pointer' : 'default';
        });
    }

    function updateCarousel() {
        if (isAnimating) return;
        isAnimating = true;

        cards.forEach((card, index) => {
            const offset = index - currentIndex;
            
            // Mantenemos el espaciado
            const spacing = 600;
            const x = offset * spacing;
            
            // Aumentamos el arco
            const y = Math.pow(Math.abs(offset), 2) * 80;
            
            // Rotación más pronunciada para las cards laterales
            const rotation = offset * 20;

            // Ocultamos las cards más allá de ±1
            const isVisible = Math.abs(offset) <= 1;
            
            gsap.to(card, {
                x: x,
                y: y,
                rotation: rotation,
                scale: 1 - Math.abs(offset) * 0.08,
                opacity: isVisible ? 1 - Math.abs(offset) * 0.15 : 0, // Ocultamos cards lejanas
                duration: 0.5,
                ease: "power2.out",
                zIndex: 100 - Math.abs(offset),
                onComplete: () => {
                    isAnimating = false;
                }
            });
        });

        // Actualizar cursores después de la animación
        updateCardCursors();
    }

    // Posicionamiento inicial
    cards.forEach((card, index) => {
        const offset = index - currentIndex;
        const spacing = 600;
        const isVisible = Math.abs(offset) <= 1;
        
        gsap.set(card, {
            x: offset * spacing,
            y: Math.pow(Math.abs(offset), 2) * 30,
            rotation: Math.abs(offset) * offset * 3,
            scale: 1 - Math.abs(offset) * 0.08,
            opacity: isVisible ? 1 - Math.abs(offset) * 0.15 : 0,
            zIndex: 100 - Math.abs(offset)
        });
    });

    // Función para mover el carrusel
    function moveCarousel(direction) {
        if (isAnimating) return;
        
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < totalCards) {
            currentIndex = newIndex;
            updateCarousel();
        }
    }

    // Eventos de drag mejorados
    function startDragging(e) {
        if (isAnimating) return;
        isDragging = true;
        startX = e.pageX || e.clientX;
        track.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging || isAnimating) return;
        
        const currentX = e.pageX || e.clientX;
        const diff = currentX - startX;

        if (Math.abs(diff) > 100) {
            const direction = diff > 0 ? -1 : 1;
            moveCarousel(direction);
            startX = currentX;
        }
    }

    function stopDragging() {
        isDragging = false;
        track.style.cursor = 'grab';
    }

    // Eventos
    track.addEventListener('mousedown', startDragging);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stopDragging);
    
    track.addEventListener('touchstart', e => startDragging(e.touches[0]));
    window.addEventListener('touchmove', e => drag(e.touches[0]));
    window.addEventListener('touchend', stopDragging);

    // Inicializar
    updateCarousel();

    // Actualizar cursores al inicio
    updateCardCursors();
});
  
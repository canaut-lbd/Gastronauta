document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los elementos con la clase 'sticky_card'
    const stickyCards = document.querySelectorAll('.sticky_card');

    // Asegúrate de que hay al menos una tarjeta para manejar el caso de no tener tarjetas
    if (stickyCards.length > 0) {
        // Pinning the title while cards are stacking
        gsap.timeline({
            scrollTrigger: {
                trigger: '.cards_home', // Asegúrate de apuntar correctamente al contenedor principal
                start: 'top top',
                endTrigger: stickyCards[stickyCards.length - 1], // Termina con la última tarjeta
                end: 'bottom+=20 bottom+=20', // Controla cuándo deja de estar "fijo" el título
                scrub: true,
                pin: '.cards_title', // Fija el título mientras se apilan las tarjetas
                pinSpacing: false // Evita que se cree espacio adicional mientras el título esté "fijo"
            }
        });
    }

    // Configuración de cada tarjeta para el stacking con GSAP
    stickyCards.forEach((card, index) => {
        card.style.setProperty('--index', index + 1);
        card.style.zIndex = stickyCards.length + index; // Disminuye el z-index para asegurar el stacking correcto

        gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: 'top+=50 center', // Ajusta el valor `+=50` para agregar espacio
                end: '+=100%',
                scrub: true
            }
        })
        .to(card, {
            y: index * 30, // Ajusta el desplazamiento vertical para el stacking si es necesario
            scale: 0.85 + index * 0.03,
            ease: 'power3.out'
        });
    });
});

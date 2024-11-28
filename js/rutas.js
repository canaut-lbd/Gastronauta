

// Cursor personalizado
function updateCursorText() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorText = cursor.querySelector('span');
    const scrollTopButton = document.querySelector('.scroll-top');
    
    // Obtengo la posición actual del cursor
    const mouseY = event.clientY;
    const mouseX = event.clientX;
    
    // Obtengo las coordenadas del botón
    const buttonRect = scrollTopButton.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Calculo la distancia entre el cursor y el centro del botón
    const distance = Math.hypot(
        mouseX - buttonCenterX,
        mouseY - buttonCenterY
    );
    
    // Si el cursor está cerca del botón, se quita y se activa la clase hover para el "Volver arriba"
    if (distance < 40) {
        cursor.style.opacity = '0';
        cursor.style.transform = `translate(${buttonCenterX}px, ${buttonCenterY}px) translate(-50%, -50%)`;
        scrollTopButton.classList.add('cursor-hover');
    } else {
        cursor.style.opacity = '1';
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        scrollTopButton.classList.remove('cursor-hover');
        
        // Compruebo si está sore una card, si es asi, pondra "visita la ruta"
        const cards = document.querySelectorAll('.column_item');
        let isOverCard = false;
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (mouseX >= rect.left && 
                mouseX <= rect.right && 
                mouseY >= rect.top && 
                mouseY <= rect.bottom) {
                isOverCard = true;
            }
        });
        
        cursorText.textContent = isOverCard ? 'Visita la ruta' : 'scroll';
    }
}

// Actualizo la posición del cursor
document.addEventListener('mousemove', (e) => {
    updateCursorText();
});

// Funcionalidad del botón scroll to top
const scrollTopButton = document.querySelector('.scroll-top');

// Mostrar/ocultar el botón basado en el scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
});

// Scroll to top cuando se hace click
scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

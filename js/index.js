document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll('.img_inner');
    const imageUrls = Array.from(images).map(img => img.src);

    // Pre-cargar imágenes
    preloadImages(imageUrls, initializeAnimations);
});

function preloadImages(urls, callback) {
    let loadedImagesCount = 0;
    const total = urls.length;

    urls.forEach(url => {
        const img = new Image();
        img.src = url;
        img.onload = img.onerror = () => {
            loadedImagesCount++;
            if (loadedImagesCount === total) {
                callback();
            }
        };
    });
}

function initializeAnimations() {
    // Selección de todos los elementos con clase 'destino'
    const destinos = document.querySelectorAll('.destino');

    // Definimos los colores para los diferentes grupos
    const colorMap = {
        group1: 'var(--orange)',  // 1, 5, 9, ...
        group2: 'var(--pink)',    // 2, 6, 10, ...
        group3: 'var(--blue)',    // 3, 7, 11, ...
        group4: 'var(--green)'    // 4, 8, 12, ...
    };

    destinos.forEach((destino, index) => {
        let group;
        if ((index + 1) % 4 === 1) {
            group = 'group1';
        } else if ((index + 1) % 4 === 2) {
            group = 'group2';
        } else if ((index + 1) % 4 === 3) {
            group = 'group3';
        } else {
            group = 'group4';
        }

        const backgroundColor = colorMap[group];
        const title = destino.querySelector('.destino_title');
        const imgs = destino.querySelectorAll('.img_inner');

        destino.addEventListener('mouseenter', () => {
            // Cambiar el color de fondo del .destino
            gsap.to(destino, {
                duration: 0.1,
                backgroundColor: backgroundColor,
                ease: 'power3.out'
            });

            // Desplazar el título solo en el eje X hacia la derecha
            gsap.to(title, {
                delay:0.1,
                duration: 0.5,
                x: 20, // Desplazar 20px hacia la derecha
                ease: 'power3.out'
            });

            // Animación de las imágenes con stagger (en orden inverso)
            gsap.to(imgs, {
                duration: 0.3,
                opacity: 1,
                scale: 1,
                stagger: {
                    each: 0.1,
                    from: "end" // Empieza desde la última imagen hacia la primera
                },
                ease: 'power3.out'
            });
        });

        destino.addEventListener('mouseleave', () => {
            // Volver al color de fondo original
            gsap.to(destino, {
                duration: 0.,
                backgroundColor: 'var(--beige)',
                ease: 'power2.out'
            });

            // Devolver el título a su posición original
            gsap.to(title, {
                duration: 0.5,
                x: 0, // Volver a la posición original
                ease: 'power2.in'
            });

            // Ocultar nuevamente las imágenes (en orden inverso)
            gsap.to(imgs, {
                duration: 0.3,
                opacity: 0,
                ease: 'power2.out',
                stagger: {
                    each: 0.1,
                    from: "end" // Empieza desde la última imagen hacia la primera
                }
            });
        });
    });
}

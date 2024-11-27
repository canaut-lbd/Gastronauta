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

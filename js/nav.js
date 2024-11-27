document.addEventListener('DOMContentLoaded', function() {
    const menu = document.querySelector('.menu');
    const menuBurger = document.querySelector('.menu_burger');
    const menuItems = document.querySelector('.menu_items');

    if (menuBurger && menuItems) {
        menuBurger.addEventListener('click', () => {
            menu.classList.toggle('active');
            menuBurger.classList.toggle('active');
            menuItems.classList.toggle('active');
        });
    }
});

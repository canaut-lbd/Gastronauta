gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({ repeat: -1, paused: false });
tl.to('.looping-wrapper', {
    xPercent: -100,
    duration: 15,
    ease: 'none',
    repeat: -1
});

const loopingWrapper = document.querySelector('.looping-destinations');
loopingWrapper.addEventListener('mouseenter', () => {
    tl.pause();
});

loopingWrapper.addEventListener('mouseleave', () => {
    tl.play();
});

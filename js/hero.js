document.addEventListener("DOMContentLoaded", () => {
    const title = new SplitText(".hero_title", {
        type: "chars, words",
        charsClass: "char",
        wordsClass: "word",
        wordDelimiter: " ",
        preserveSpaces: true
    });

    gsap.set(title.chars, {
        y: 100,
        opacity: 0
    });

    gsap.to(title.chars, {
        duration: 0.8,
        y: 0,
        opacity: 1,
        stagger: 0.02,
        ease: "power4.out",
        delay: 0.2
    });

    gsap.to(".hero-scroll-indicator", {
        y: "10px",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });

    gsap.from(".hero-scroll-indicator", {
        opacity: 0,
        duration: 1,
        delay: 1
    });
});

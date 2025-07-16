document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.firstscreen__logo');
    const layers = Array.from(logo.querySelectorAll('.firstscreen__logo-text'));
    const bg = document.querySelector(".firstscreen > .bg")
    let mouseX = 0, mouseY = 0;
    gsap.registerPlugin(ScrollTrigger);
    const funcEvent = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    function updateParallax() {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        // Нормализуем в диапазон [-1, 1]
        const dx = (mouseX - cx) / cx;
        const dy = (mouseY - cy) / cy;

        layers.forEach((layer, i) => {
            // Скорость: слои, стоящие раньше в DOM, движутся быстрее
            const speedFactor = (layers.length - i);
            // Подберите 10 (px) под ваши нужды
            const xOffset = dx * speedFactor * 15;
            const yOffset = dy * speedFactor * 15;
            layer.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
            bg.style.transform = `translate3d(${xOffset * 1.5}px, ${yOffset * 1.5}px, 0)`;
        });

        requestAnimationFrame(updateParallax);
    }
    if (window.innerWidth < 1100) {
        window.addEventListener("scroll", e => {
            const cy = window.scrollY / 2;

            layers.forEach((layer, i) => {
                const speedFactor = (layers.length - i);
                const yOffset = cy * speedFactor / 6;
                layer.style.transform = `translateY(${-yOffset}px)`;
                bg.style.transform = `translateY(${-yOffset * 1.5}px)`;
            })
        })
    }
    else {
        window.addEventListener('mousemove', funcEvent);
        updateParallax();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // 1) Начальные состояния
    gsap.set(".firstscreen", {
        backgroundColor: "var(--main-color)",
        borderLeftWidth: 0,
        borderRightWidth: 0
    });

    // Чёрный слой лого: только невидим
    gsap.set(".firstscreen__logo-text.text-black", {
        opacity: 0,
        x: 0,
        y: 0
    });


    // marquee выдвинем за правую грань
    gsap.set(".marquee", { x: "100%" });

    // текст и кнопка под лого: спрятать
    gsap.set(".firstscreen__text h1, .firstscreen__text h2, .firstscreen__link", {
        opacity: 0,
        y: 50
    });

    // 2) Собираем Timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.ease" } });

    // а) появляется чёрный логотип (без смещения)
    tl.to(".firstscreen__logo-text.text-black", {
        opacity: 1,
        duration: 0.6
    });

    // б) из-за экрана сверху-слева «прилетают» цветные слои на свои места
    tl.to(".firstscreen__logo-text:not(.text-black)", {
        opacity: 1,
        stagger: 0.1,
        duration: 0.8
    }, "-=0.2");

    // в) фон панели firstscreen проявляется
    tl.to(".firstscreen", {
        backgroundColor: "var(--grey)",
        borderWidth: "var(--offset)",
        duration: 1,
    }, "-=0.6");

    // г) заезжает бегущая строка
    tl.to(".marquee", {
        x: 0,
        duration: 1
    }, "-=0.3");
    // г) заезжает бегущая строка
    tl.to(".marquee", {
        rotateZ: "4deg",
        duration: 1
    }, "-=0.3");
    // д) рисуем бордюры
    tl.to(".firstscreen", {
        borderLeftWidth: "var(--offset)",
        borderRightWidth: "var(--offset)",
        duration: 0.5
    }, "-=0.8");
    tl.to(".bg", { opacity: 1, duration: 0.3 })

    // е) появляется текст снизу
    tl.to(".firstscreen__text .firstscreen__title", {
        opacity: 1,
        y: 0,
        duration: 0.6
    });
    tl.to(".firstscreen__side", { backgroundColor: "rgba(0, 0, 0, 0.85)", duration: 0.6 })
    // ж) появляется сабтайтл
    tl.to(".firstscreen__text .firstscreen__subtitle", {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, "-=0.4");
    tl.to(
        ".toggle",
        { x: "0 !important", duration: 0.5 }
    )
    // з) и в конце — кнопка
    tl.to(".firstscreen__link", {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, "-=0.3");
    setTimeout(() => {
        document.querySelector(".firstscreen__side").classList.add("side__anim")
        document.querySelector(".firstscreen__link").classList.add("link__anim")
    }, 5000)

});

document.addEventListener('DOMContentLoaded', () => {
    const lenis = new Lenis({
        wrapper: document.querySelector('main'),
        content: document.querySelector('main'),
        duration: 1.2,
        smooth: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const swapTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.firstscreen',
            start: 'top top',
            end: '+=100%',
            scrub: true,
            pin: true
        }
    });

    swapTl.to('.firstscreen', { y: '100vh', ease: 'none' })
        .from('.secondscreen', { y: '100vh', ease: 'none' }, 0);
});

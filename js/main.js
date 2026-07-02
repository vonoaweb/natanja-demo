/* ============================================================
   NATANJA CONSTRUCTORA — Demo por Vonoa Web
   GSAP + ScrollTrigger con fallback vanilla
   ============================================================ */

const hasGSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Preloader con barra de progreso ----------
const preloader = document.getElementById("preloader");
const preloaderFill = document.getElementById("preloaderFill");
let fakeProgress = 0;
const progressTimer = setInterval(() => {
  fakeProgress = Math.min(fakeProgress + Math.random() * 22, 92);
  preloaderFill.style.width = fakeProgress + "%";
}, 180);

window.addEventListener("load", () => {
  clearInterval(progressTimer);
  preloaderFill.style.width = "100%";
  setTimeout(() => {
    preloader.classList.add("done");
    playHeroIntro();
  }, 450);
});
// Seguro por si 'load' tarda demasiado (imágenes externas lentas)
setTimeout(() => {
  if (!preloader.classList.contains("done")) {
    clearInterval(progressTimer);
    preloader.classList.add("done");
    playHeroIntro();
  }
}, 4000);

// ---------- Hero intro (split text) ----------
const heroTitle = document.getElementById("heroTitle");
heroTitle.querySelectorAll(".line").forEach((line) => {
  const words = line.textContent.trim().split(" ");
  line.innerHTML = words.map((w) => `<span class="word">${w} </span>`).join("");
});

let heroPlayed = false;
function playHeroIntro() {
  if (heroPlayed) return;
  heroPlayed = true;

  if (!hasGSAP || reducedMotion) return; // sin GSAP el hero simplemente queda visible

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.from("[data-hero='eyebrow']", { y: 24, autoAlpha: 0, duration: 0.7 })
    .from(
      "#heroTitle .word",
      { yPercent: 120, duration: 0.9, stagger: 0.06 },
      "-=0.35"
    )
    .from(
      "[data-hero='fade']",
      { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.12 },
      "-=0.45"
    )
    .from(".hero__scroll", { autoAlpha: 0, duration: 0.6 }, "-=0.3");

  // Zoom lento de la foto del hero
  gsap.fromTo(
    ".hero__bg img",
    { scale: 1.15 },
    { scale: 1, duration: 2.4, ease: "power2.out" }
  );
}

// ---------- Header + scroll progress + back-to-top ----------
const header = document.getElementById("header");
const progress = document.getElementById("scrollProgress");
const backTop = document.getElementById("backTop");
let lastY = 0;

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 40);
  // Ocultar header al bajar, mostrarlo al subir
  header.classList.toggle("hidden", y > 500 && y > lastY && !nav.classList.contains("open"));
  lastY = y;
  backTop.classList.toggle("show", y > 600);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- Cursor personalizado ----------
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + "px";
  cursorDot.style.top = mouseY + "px";
});
(function animateRing() {
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;
  cursorRing.style.left = ringX + "px";
  cursorRing.style.top = ringY + "px";
  requestAnimationFrame(animateRing);
})();
document.querySelectorAll("a, button, .project-card, .faq__item summary").forEach((el) => {
  el.addEventListener("mouseenter", () => cursorRing.classList.add("hovering"));
  el.addEventListener("mouseleave", () => cursorRing.classList.remove("hovering"));
});

// ---------- Botones magnéticos ----------
if (window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    });
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  });
}

// ---------- Menú móvil ----------
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  nav.classList.toggle("open");
});
nav.querySelectorAll(".nav__link").forEach((link) =>
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    nav.classList.remove("open");
  })
);

// ---------- Nav activo según sección ----------
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__link");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

// ---------- Reveals con GSAP (fallback: IntersectionObserver) ----------
if (hasGSAP && !reducedMotion) {
  // Elementos genéricos (las project-card van aparte, vía ScrollTrigger.batch)
  document.querySelectorAll("[data-reveal]:not(.project-card)").forEach((el) => {
    gsap.set(el, { y: 44, autoAlpha: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () =>
        gsap.to(el, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", clearProps: "transform" }),
    });
  });

  // Imágenes con clip-path
  document.querySelectorAll(".img-reveal").forEach((el) => {
    const img = el.querySelector("img");
    gsap.set(el, { clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(img, { scale: 1.25 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.inOut", clearProps: "clipPath" });
        gsap.to(img, { scale: 1, duration: 1.6, ease: "power3.out", clearProps: "transform" });
      },
    });
  });

  // Parallax: hero, quote strip y CTA banner
  gsap.to(".hero__bg img", {
    yPercent: 18,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".quote-strip__bg img", {
    yPercent: -14,
    ease: "none",
    scrollTrigger: { trigger: ".quote-strip", start: "top bottom", end: "bottom top", scrub: true },
  });
  gsap.to(".cta-banner__bg img", {
    yPercent: -14,
    ease: "none",
    scrollTrigger: { trigger: ".cta-banner", start: "top bottom", end: "bottom top", scrub: true },
  });

  // Frase gigante: palabras que se iluminan con el scroll
  const quote = document.getElementById("quoteText");
  const splitWords = (text, extraClass = "") =>
    text
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => `<span class="word ${extraClass}">${w} </span>`)
      .join("");
  quote.innerHTML = [...quote.childNodes]
    .map((node) => {
      if (node.nodeType === Node.TEXT_NODE) return splitWords(node.textContent);
      if (node.tagName === "BR") return "<br />";
      return splitWords(node.textContent, node.className);
    })
    .join("");
  gsap.from("#quoteText .word", {
    autoAlpha: 0.12,
    y: 14,
    stagger: 0.06,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: { trigger: ".quote-strip", start: "top 70%", end: "top 25%", scrub: true },
  });

  // Línea de proceso que se llena al hacer scroll
  gsap.to("#timelineFill", {
    width: "100%",
    ease: "none",
    scrollTrigger: { trigger: "#timeline", start: "top 75%", end: "bottom 55%", scrub: 0.6 },
  });

  // Tarjetas de proyecto con stagger
  gsap.set(".project-card", { y: 50, autoAlpha: 0 });
  ScrollTrigger.batch(".project-card", {
    start: "top 90%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", clearProps: "transform" }),
  });
} else {
  // Fallback sin GSAP: reveal simple con IntersectionObserver
  const style = document.createElement("style");
  style.textContent =
    "[data-reveal]{opacity:0;transform:translateY(34px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}[data-reveal].in{opacity:1;transform:translateY(0)}";
  document.head.appendChild(style);
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}

// ---------- Contadores animados ----------
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll(".counter").forEach((c) => counterObserver.observe(c));

// ---------- Filtros de proyectos ----------
const filterBtns = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.filter;
    projectCards.forEach((card) => {
      const show = cat === "todos" || card.dataset.cat === cat;
      card.classList.toggle("hide", !show);
      if (show) {
        card.style.animation = "none";
        void card.offsetWidth;
        card.style.animation = "cardIn 0.6s cubic-bezier(0.22,1,0.36,1)";
      }
    });
  });
});

// ---------- Lightbox de proyectos ----------
const lightbox = document.getElementById("lightbox");
projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    document.getElementById("lbImg").src = card.querySelector("img").src.replace("w=900", "w=1400");
    document.getElementById("lbCat").textContent = card.querySelector(".project-card__cat").textContent;
    document.getElementById("lbTitle").textContent = card.querySelector("h3").textContent;
    document.getElementById("lbLoc").textContent = card.querySelector(".project-card__info p").textContent;
    document.getElementById("lbDesc").textContent = card.dataset.desc;
    document.getElementById("lbArea").textContent = card.dataset.area;
    document.getElementById("lbYear").textContent = card.dataset.year;
    document.getElementById("lbTime").textContent = card.dataset.time;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
lightbox.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeLightbox));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
});

// ---------- Slider de testimonios ----------
const track = document.getElementById("sliderTrack");
const slides = track.children.length;
const dotsWrap = document.getElementById("sliderDots");
let current = 0;
let autoTimer;

for (let i = 0; i < slides; i++) {
  const dot = document.createElement("button");
  dot.className = "slider__dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", "Testimonio " + (i + 1));
  dot.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(dot);
}
const dots = dotsWrap.querySelectorAll(".slider__dot");

function goTo(i) {
  current = (i + slides) % slides;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, idx) => d.classList.toggle("active", idx === current));
  restartAuto();
}
document.getElementById("prevSlide").addEventListener("click", () => goTo(current - 1));
document.getElementById("nextSlide").addEventListener("click", () => goTo(current + 1));

function restartAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(current + 1), 6000);
}
restartAuto();

// Swipe en móvil
let touchX = 0;
track.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
track.addEventListener(
  "touchend",
  (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
  },
  { passive: true }
);

// ---------- FAQ: cerrar los demás al abrir uno ----------
const faqItems = document.querySelectorAll(".faq__item");
faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (item.open) faqItems.forEach((other) => other !== item && (other.open = false));
  });
});

// ---------- Tilt sutil en tarjetas de proyecto ----------
if (window.matchMedia("(hover: hover)").matches) {
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-10px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });
}

// ---------- Formulario (demo) ----------
const form = document.getElementById("contactForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const success = document.getElementById("formSuccess");
  success.classList.add("show");
  form.querySelectorAll("input, textarea, select").forEach((f) => (f.value = ""));
  setTimeout(() => success.classList.remove("show"), 5000);
});

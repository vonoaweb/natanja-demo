/* ============================================================
   NATANJA CONSTRUCTORA — Demo por Vonoa Web
   ============================================================ */

// ---------- Preloader ----------
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => preloader.classList.add("done"), 700);
});

// ---------- Header + scroll progress + back-to-top ----------
const header = document.getElementById("header");
const progress = document.getElementById("scrollProgress");
const backTop = document.getElementById("backTop");

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 40);
  backTop.classList.toggle("show", y > 600);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

  // Parallax en el hero
  const heroImg = document.querySelector(".hero__bg img");
  if (heroImg && y < window.innerHeight) {
    heroImg.style.transform = `scale(1.06) translateY(${y * 0.25}px)`;
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

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

// ---------- Reveal al hacer scroll ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document
  .querySelectorAll(".reveal-fade:not(.hero .reveal-fade)")
  .forEach((el) => revealObserver.observe(el));

// ---------- Contadores animados ----------
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
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
        void card.offsetWidth; // reinicia la animación
        card.style.animation = "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1)";
      }
    });
  });
});

// ---------- Tilt sutil en tarjetas de proyecto ----------
projectCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-10px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ---------- Formulario (demo) ----------
const form = document.getElementById("contactForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const success = document.getElementById("formSuccess");
  success.classList.add("show");
  form.querySelectorAll("input, textarea, select").forEach((f) => (f.value = ""));
  setTimeout(() => success.classList.remove("show"), 5000);
});

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Animasi nama (M -> huruf terakhir -> balik) ---------- */
  const heroName = document.getElementById("heroName");
  if (heroName && !reduceMotion) {
    const text = heroName.textContent;
    const letters = [...text].map((ch, i) => {
      if (ch === " ") return '<span class="letter">&nbsp;</span>';
      return `<span class="letter" style="animation-delay:${i * 70}ms">${ch}</span>`;
    });
    heroName.innerHTML = letters.join("");
  }

  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme || "dark";

  document.documentElement.setAttribute("data-theme", initialTheme);
  themeToggle.setAttribute("aria-label", initialTheme === "dark" ? "Ganti ke terang" : "Ganti ke gelap");

  themeToggle.addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeToggle.setAttribute("aria-label", next === "dark" ? "Ganti ke terang" : "Ganti ke gelap");
    setTimeout(() => root.classList.remove("theme-transition"), 400);
  });

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  document.body.appendChild(overlay);

  const closeNav = () => {
    navToggle.classList.remove("active");
    mainNav.classList.remove("open");
    overlay.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.contains("open");
    if (isOpen) {
      closeNav();
    } else {
      navToggle.classList.add("active");
      mainNav.classList.add("open");
      overlay.classList.add("show");
      navToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
  });

  overlay.addEventListener("click", closeNav);
  mainNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- Header border on scroll ---------- */
  const header = document.getElementById("siteHeader");
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    },
    { passive: true }
  );

  /* ---------- 3D tilt on cards ---------- */
  const canHover = window.matchMedia("(hover: hover)").matches;
  const tiltCards = document.querySelectorAll(".project-card, .skill-card");

  if (!reduceMotion && canHover) {
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        if (card.classList.contains("open")) return;
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 10;
        const ry = (px - 0.5) * 12;
        card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in-view"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  /* ---------- Accordion karya ---------- */
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const head = card.querySelector(".project-head");
    head.addEventListener("click", () => {
      const isOpen = card.classList.contains("open");
      card.classList.toggle("open");
      head.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ---------- Fallback foto hero (kalau file belum ada) ---------- */
  const heroImg = document.querySelector(".photo-frame img");
  if (heroImg) {
    heroImg.addEventListener("error", () => (heroImg.style.display = "none"));
    heroImg.addEventListener("load", () => {
      const ph = heroImg.nextElementSibling;
      if (ph) ph.style.display = "none";
    });
  }

  /* ---------- Fallback foto (kalau file belum ada) ---------- */
  document.querySelectorAll(".project-photo img").forEach((img) => {
    img.addEventListener("error", () => img.remove());
    img.addEventListener("load", () => {
      const ph = img.closest(".project-photo").querySelector(".photo-ph");
      if (ph) ph.remove();
    });
  });

  /* ---------- Lightbox foto karya (klik foto -> tampil besar) ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");

  const openLightbox = (src) => {
    lightboxImg.src = src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  };

  document.querySelectorAll(".project-photo img").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(img.src));
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
  });
  lightboxClose.addEventListener("click", closeLightbox);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });
})();

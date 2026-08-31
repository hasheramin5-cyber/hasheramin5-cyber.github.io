/* ==================================================
   HASHER AMIN — PORTFOLIO / 126
   Vanilla JS: mobile nav, scroll reveals, active-link
   tracking, and graceful hero-photo fallback.
   ================================================== */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------
     Mobile navigation toggle
     ------------------------------------------------ */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------
     Hero load-in sequence
     ------------------------------------------------ */
  window.requestAnimationFrame(function () {
    document.body.classList.add("is-loaded");
  });

  /* ------------------------------------------------
     Hero photo — graceful placeholder if the source
     image at assets/profile.jpg hasn't been added yet.
     ------------------------------------------------ */
  var heroPhoto = document.getElementById("heroPhoto");
  var heroPhotoImg = document.getElementById("heroPhotoImg");

  if (heroPhoto && heroPhotoImg) {
    heroPhotoImg.addEventListener("error", function () {
      heroPhotoImg.setAttribute("data-broken", "true");
      heroPhoto.classList.add("no-photo");
    });

    // Handle the case where the image is already broken by the
    // time this script runs (e.g. cached 404).
    if (heroPhotoImg.complete && heroPhotoImg.naturalWidth === 0) {
      heroPhotoImg.setAttribute("data-broken", "true");
      heroPhoto.classList.add("no-photo");
    }
  }

  /* ------------------------------------------------
     Scroll-triggered reveals
     ------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // No IntersectionObserver support (or reduced motion) —
    // just show everything.
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ------------------------------------------------
     Active nav-link tracking
     ------------------------------------------------ */
  var sections = ["work", "about", "experience", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var navAnchors = navLinks ? navLinks.querySelectorAll("a") : [];

  function setActiveLink(id) {
    navAnchors.forEach(function (a) {
      var match = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-active", match);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ------------------------------------------------
     Project row interactions — keyboard + touch parity
     with the CSS :hover treatment.
     ------------------------------------------------ */
  document.querySelectorAll(".project").forEach(function (project) {
    project.addEventListener("focusin", function () {
      project.classList.add("is-hovered");
    });
    project.addEventListener("focusout", function () {
      project.classList.remove("is-hovered");
    });
  });

})();

document.addEventListener("DOMContentLoaded", function () {
  function signalPageReady() {
    window.__nwPageReady = true;
    document.dispatchEvent(new CustomEvent("nw:page-ready"));
  }

  if (typeof ScrollTrigger === "undefined") {
    signalPageReady();
  } else {
    requestAnimationFrame(function () {
      ScrollTrigger.refresh();
      requestAnimationFrame(signalPageReady);
    });
  }

  // ── GSAP Hover cho menu items (trừ logo) ──────────────────────────────
  if (typeof gsap !== "undefined") {
    const menuItems = document.querySelectorAll(
      ".nw-main-menu .nw-menu-item"
    );

    menuItems.forEach(function (item) {
      const link = item.querySelector(".nw-menu-link");
      if (!link) return;

      // Đặt trạng thái ban đầu
      gsap.set(link, { y: 0 });

      item.addEventListener("mouseenter", function () {
        gsap.to(link, {
          y: -2,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      item.addEventListener("mouseleave", function () {
        gsap.to(link, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });

    // ── GSAP Hover cho hamburger ──────────────────────────────────────────
    const hamburgerBtn = document.querySelector(".nw-hamburger-btn");
    if (hamburgerBtn) {
      const topLine    = hamburgerBtn.querySelector(".nw-ham-top");
      const bottomLine = hamburgerBtn.querySelector(".nw-ham-bottom");

      gsap.set([topLine, bottomLine], { x: 0 });

      hamburgerBtn.addEventListener("mouseenter", function () {
        gsap.to(topLine, {
          x: 4,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(bottomLine, {
          x: -4,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      hamburgerBtn.addEventListener("mouseleave", function () {
        gsap.to([topLine, bottomLine], {
          x: 0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    }
  }
});
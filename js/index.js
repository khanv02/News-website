document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined") return;

  // ── Element references ────────────────────────────────────────────────────
  var overlay = document.getElementById("nw-intro-overlay");
  var introText = document.getElementById("nw-intro-text");
  var wipeLayer = document.querySelector(".nw-it-wipe");
  var anchor = document.getElementById("nw-dt-anchor");
  var dtTitle = document.getElementById("nw-dt-title");   // real page title

  if (!overlay || !introText || !wipeLayer || !anchor) return;

  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll("[data-page-reveal]")
  );
  var anchorRevealEl = anchor.closest("[data-page-reveal]");
  var revealTweenEls = revealEls.filter(function (el) {
    return el !== anchorRevealEl;
  });

  // Hide the real page title immediately; it will be shown instantly at final handoff.
  if (dtTitle) gsap.set(dtTitle, { autoAlpha: 0 });
  gsap.set(introText, { transformOrigin: "center center", force3D: true });

  // Set all line-inner elements to their hidden start state.
  // y: '110%' slides them just below the .nw-line-wrap overflow:hidden clip.
  // They become visible only when the parent section autoAlpha hits 1 in Phase 3.
  gsap.set(".nw-line-inner", { y: "110%" });

  // Ruler split-vertical-out: starts collapsed at center (scaleY:0),
  // spans are pre-positioned toward center so they slide OUT up/down when revealed.
  gsap.set(".nw-ruler", { scaleY: 0, autoAlpha: 0 });
  // First span moves upward to its resting position, second moves downward.
  gsap.set(".nw-ruler-inner span:first-child", { y: 16 });
  gsap.set(".nw-ruler-inner span:last-child", { y: -16 });

  // ════════════════════════════════════════════════════════════════════════════
  //  MASTER CINEMATIC TIMELINE  (continuous, no dead frames between phases)
  //
  //  Phase map:
  //   Phase 1: soft entrance (opacity 0→1, y -80→0, dark gray base visible)
  //   Phase 2: short hold (0.4s max) with no abrupt stop
  //   Phase 3: move+scale to anchor while wipe runs in parallel and ends earlier
  // ════════════════════════════════════════════════════════════════════════════
  var master = gsap.timeline({
    defaults: { ease: "power2.out" },
    delay: 0.06,
  });

  // ── PHASE 1 — Soft Entrance (fade + float down) ──────────────────────────
  master.fromTo(
    introText,
    { y: -80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.05,
      ease: "expo.out",
    }
  );

  // ── PHASE 2 — Short cinematic hold (kept subtle and brief) ───────────────
  master.to(introText, {
    duration: 0.4,
    ease: "none",
  });

  // ── PHASE 3 — Move + Scale + Wipe (fully overlapped, no pause) ───────────
  master.add(function () {
    var targetEl = dtTitle || anchor;
    var tRect = targetEl.getBoundingClientRect();
    var iRect = introText.getBoundingClientRect();
    var introBase = introText.querySelector(".nw-it-base");

    // Align centre-to-centre so final position matches the real title.
    var moveX = (tRect.left + tRect.width / 2) - (iRect.left + iRect.width / 2);
    var moveY = (tRect.top + tRect.height / 2) - (iRect.top + iRect.height / 2);

    // Match final size by font-size ratio first; fallback to width ratio if needed.
    var sourceFont = introBase ? parseFloat(getComputedStyle(introBase).fontSize) : 0;
    var targetFont = dtTitle ? parseFloat(getComputedStyle(dtTitle).fontSize) : 0;
    var rawScale = (sourceFont > 0 && targetFont > 0)
      ? targetFont / sourceFont
      : (tRect.width / iRect.width);
    var scaleTarget = Math.min(Math.max(rawScale, 0.25), 4);

    var tl3 = gsap.timeline();
    var moveDuration = 1.12;
    var wipeDuration = 0.58;

    // Micro pre-roll keeps the handoff from Phase 2 organic.
    tl3.to(introText, {
      scale: 1.03,
      duration: 0.18,
      ease: "power2.out",
    });

    // Main cinematic morph: movement continues after wipe completes.
    tl3.add("introMoveStart");
    tl3.to(
      introText,
      {
        x: moveX,
        y: moveY,
        scale: scaleTarget,
        duration: moveDuration,
        ease: "expo.inOut",
        force3D: true,
      },
      "introMoveStart"
    );

    // Wipe starts with movement and ends earlier to preserve forward momentum.
    tl3.to(
      wipeLayer,
      {
        clipPath: "inset(-0.5em 0% -0.3em 0)",
        duration: wipeDuration,
        ease: "power3.inOut",
      },
      "introMoveStart"
    );

    // Hero reveal can begin only after intro text animation is done.
    tl3.add("introTextDone", "introMoveStart+=" + moveDuration);

    // ── Page reveal: zoom-in only (no fade-up) ───────────────────────────────
    //    Step A – Make sections visible immediately, then scale from 0.94 → 1.
    tl3.set(revealTweenEls, { autoAlpha: 1 }, "introTextDone+=0.05");
    tl3.fromTo(
      revealTweenEls,
      { scale: 0.94 },
      {
        scale: 1,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.09,
        clearProps: "transform",
      },
      "introTextDone+=0.05"
    );

    //    Step B – Wipe-up: line inners slide from 110% → 0 with stagger.
    //             Start after text intro completes so the handoff is explicit.
    //             Each line is offset by 0.1s for a cascading cinematic feel.
    tl3.fromTo(
      ".nw-line-inner",
      { y: "110%" },
      {
        y: "0%",
        duration: 0.85,
        ease: "power4.out",
        stagger: 0.10,
      },
      "introTextDone+=0.22"
    );

    // ── Ruler split-vertical-out ─────────────────────────────────────────────
    //    Timing: same label as the page reveal (introTextDone+=0.05)
    //    Effect: the .nw-ruler bar expands from center by scaleY:0 → 1,
    //            while text spans split vertically (up and down) to natural positions.
    //
    //    Step i  — make ruler visible + expand the bar from center vertically
    tl3.to(
      ".nw-ruler",
      {
        scaleY: 1,
        autoAlpha: 1,
        duration: 0.65,
        ease: "power3.out",
        clearProps: "transform",  // clean up so layout is unaffected afterwards
      },
      "introTextDone+=0.05"   // SAME start as the page reveal
    );

    //    Step ii — first span slides from y:16 → 0 (outward upward feel)
    tl3.to(
      ".nw-ruler-inner span:first-child",
      {
        y: 0,
        duration: 0.55,
        ease: "expo.out",
      },
      "introTextDone+=0.05"   // starts simultaneously with bar expansion
    );

    //    Step iii — last span slides from y:-16 → 0 (outward downward feel)
    tl3.to(
      ".nw-ruler-inner span:last-child",
      {
        y: 0,
        duration: 0.55,
        ease: "expo.out",
      },
      "introTextDone+=0.05"   // starts simultaneously with bar expansion
    );

    // Keep anchor static for position matching, but still reveal it.
    if (anchorRevealEl) {
      tl3.to(
        anchorRevealEl,
        {
          autoAlpha: 1,
          duration: 0.75,
          ease: "power2.out",
        },
        "<"
      );
    }

    // Dissolve overlay right after intro text completes so wipe-up is visible.
    tl3.to(
      overlay,
      {
        autoAlpha: 0,
        duration: 0.42,
        ease: "power2.out",
        onComplete: function () {
          overlay.style.display = "none";
        },
      },
      "introTextDone+=0.05"
    );

    // Show real display title instantly at the exact overlay fade start (no fade-in).
    if (dtTitle) {
      tl3.set(
        dtTitle,
        {
          autoAlpha: 1,
        },
        "<"
      );
    }

    master.add(tl3);
  });

  // ════════════════════════════════════════════════════════════════════════════
  //  POST-INTRO interactions (nav hover + 3D card tilt)
  //  Registered now so listeners are ready the moment the page reveals.
  // ════════════════════════════════════════════════════════════════════════════

  // Nav link micro lift
  document.querySelectorAll(".nw-menu-link").forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      gsap.to(link, { y: -2, duration: 0.2, overwrite: true });
    });
    link.addEventListener("mouseleave", function () {
      gsap.to(link, { y: 0, duration: 0.2, overwrite: true });
    });
  });

  // 3D tilt on the video card
  var card = document.querySelector(".nw-video-card");
  if (card) {
    var MAX_TILT = 5;
    var MAX_LIFT = -10;
    gsap.set(card, { transformStyle: "preserve-3d" });

    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      var normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      gsap.to(card, {
        rotationY: normX * MAX_TILT,
        rotationX: -normY * MAX_TILT,
        z: MAX_LIFT,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    });

    card.addEventListener("mouseleave", function () {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 1.1,
        ease: "elastic.out(1, 0.55)",
        overwrite: true,
      });
    });
  }

  // ── Circle Mask Reveal (scroll-based cinematic transition) ───────────────
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    var cmSection = document.getElementById("nw-cm-transition");
    if (cmSection) {
      var cmNextLayer = cmSection.querySelector(".nw-cm-next-layer");
      var cmRing = cmSection.querySelector(".nw-cm-ring");
      var cmRevealItems = cmSection.querySelectorAll("[data-cm-reveal]");

      // Initial content state: hidden and shifted down for reveal motion.
      gsap.set(cmRevealItems, { autoAlpha: 0, y: 40, filter: "blur(8px)" });

      var cmTl = gsap.timeline({
        scrollTrigger: {
          // Pin the transition section while timeline progress follows scroll.
          trigger: cmSection,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Circle expansion logic: animate clip-path only (no width/height animation)
      // to keep the transition smooth and avoid layout reflows.
      cmTl.to(
        cmNextLayer,
        {
          clipPath: "circle(150% at 50% 50%)",
          duration: 1.2,
          ease: "none",
        },
        0
      );

      // Optional polish: subtle ring glow fades while the mask grows.
      cmTl.to(
        cmRing,
        {
          autoAlpha: 0,
          scale: 1.35,
          duration: 0.65,
          ease: "none",
        },
        0.24
      );

      // Overlap timing: start content reveal BEFORE circle expansion ends.
      // This removes dead frames and keeps motion continuous.
      cmTl.to(
        cmRevealItems,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.12,
          duration: 0.72,
          ease: "power3.out",
        },
        0.66
      );
    }
  }
});


// ── Custom circular cursor (GSAP + rAF lerp) ───────────────────────────────
(function () {
  var cursor = document.getElementById("nw-cursor");
  if (!cursor) return;

  // Current rendered position (lerp target)
  var posX = window.innerWidth / 2;
  var posY = window.innerHeight / 2;

  // Raw mouse position
  var mouseX = posX;
  var mouseY = posY;

  // Base smoothing factor tuned for 60fps (converted to frame-rate independent alpha below)
  var BASE_EASE = 0.16;
  var lastTime = performance.now();

  // Update mouse coordinates on every move
  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // rAF loop – lerp toward mouse then update cursor position
  function tick(now) {
    // Frame-rate independent smoothing keeps motion consistent across different FPS values.
    var dt = Math.min(now - lastTime, 40);
    lastTime = now;
    var alpha = 1 - Math.pow(1 - BASE_EASE, dt / 16.67);

    // Linear interpolation for smooth trailing
    posX += (mouseX - posX) * alpha;
    posY += (mouseY - posY) * alpha;

    // Use GSAP set for GPU-composited transform (no layout thrash)
    if (typeof gsap !== "undefined") {
      gsap.set(cursor, { x: posX, y: posY, force3D: true });
    } else {
      cursor.style.transform = "translate(" + (posX - cursor.offsetWidth / 2) + "px, " + (posY - cursor.offsetHeight / 2) + "px)";
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // ── Hover scale: enlarge on interactive elements ──────────────────
  var interactiveSelectors = "a, button, [role='button'], input, textarea, select, label, .nw-video-card";

  document.querySelectorAll(interactiveSelectors).forEach(addHoverListeners);

  // Also support dynamically added elements via event delegation
  document.addEventListener("mouseover", function (e) {
    if (e.target.matches(interactiveSelectors) || e.target.closest(interactiveSelectors)) {
      cursor.classList.add("nw-cursor--hover");
    }
  });

  document.addEventListener("mouseout", function (e) {
    if (e.target.matches(interactiveSelectors) || e.target.closest(interactiveSelectors)) {
      cursor.classList.remove("nw-cursor--hover");
    }
  });

  function addHoverListeners(el) {
    el.addEventListener("mouseenter", function () {
      cursor.classList.add("nw-cursor--hover");
    });
    el.addEventListener("mouseleave", function () {
      cursor.classList.remove("nw-cursor--hover");
    });
  }

  // ── Hide cursor when it leaves the window ─────────────────────────
  document.addEventListener("mouseleave", function () {
    gsap && gsap.to(cursor, { opacity: 0, duration: 0.2 });
  });
  document.addEventListener("mouseenter", function () {
    gsap && gsap.to(cursor, { opacity: 1, duration: 0.2 });
  });
})();


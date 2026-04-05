document.addEventListener("DOMContentLoaded", function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var html = document.documentElement;
  var body = document.body;
  var currentY = window.scrollY || window.pageYOffset;
  var targetY = currentY;
  var rafId = 0;

  // Tuning
  var EASE_OUT   = 0.09;   // deceleration (smaller = smoother but slower)
  var EASE_IN    = 0.14;   // acceleration towards new target
  var MIN_DIFF   = 0.5;    // px threshold to snap to target
  var SOFT_GAIN  = 1.4;    // multiplier for small delta events (touchpad-like)
  var HARD_LIMIT = 80;     // deltaY above this = native scroll (trackwheel)
  var LINE_PX    = 16;     // 1 "line" in pixels (for deltaMode=1)
  var PAGE_PX    = function () { return window.innerHeight * 0.85; };

  function maxScrollY() {
    return Math.max(
      0,
      Math.max(html.scrollHeight, body.scrollHeight) - window.innerHeight
    );
  }

  function clamp(v) {
    return Math.min(maxScrollY(), Math.max(0, v));
  }

  function normalizeDelta(e) {
    var dy = e.deltaY;
    if (e.deltaMode === 1) dy *= LINE_PX;       // lines → px
    if (e.deltaMode === 2) dy *= PAGE_PX();     // pages → px
    return dy;
  }

  function animate() {
    var diff = targetY - currentY;
    var ease = diff > 0 ? EASE_IN : EASE_OUT;
    currentY += diff * ease;

    if (Math.abs(diff) < MIN_DIFF) {
      currentY = targetY;
    }

    window.scrollTo(0, currentY);

    if (currentY !== targetY) {
      rafId = window.requestAnimationFrame(animate);
    } else {
      rafId = 0;
    }
  }

  function onWheel(e) {
    if (e.defaultPrevented || e.ctrlKey) return; // pinch-zoom on trackpad

    var dy = normalizeDelta(e);
    var absDy = Math.abs(dy);

    // Large delta = likely a physical scroll wheel → let browser handle natively
    if (absDy > HARD_LIMIT) return;

    e.preventDefault();

    // Small delta (touchpad / smooth-scroll wheel) → apply gain
    targetY = clamp(targetY + dy * SOFT_GAIN);

    if (!rafId) {
      rafId = window.requestAnimationFrame(animate);
    }
  }

  // Sync currentY/targetY when scroll happens outside our control
  // (keyboard, scrollbar drag, anchor jump, programmatic scroll)
  window.addEventListener("scroll", function () {
    if (rafId) return;
    currentY = window.scrollY || window.pageYOffset;
    targetY  = currentY;
  }, { passive: true });

  window.addEventListener("wheel", onWheel, { passive: false });

  window.addEventListener("resize", function () {
    targetY = clamp(targetY);
  });
});
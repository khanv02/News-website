/**
 * section2.js — Circle Reveal ScrollTrigger
 * ─────────────────────────────────────────────────────────────────────────────
 * Kỹ thuật: CSS sticky (KHÔNG dùng GSAP pin:true)
 *
 *   .nw-cm-transition   → height: 250vh  (scroll budget)
 *   .nw-cm-sticky-inner → position: sticky; top: 0; height: 100vh
 *                         Browser tự ghim, không có spacer-div hay position:fixed conflict.
 *
 * ScrollTrigger chạy trên section ngoài (250vh), drive timeline qua 130vh scroll.
 * Không có onLeave / onEnterBack phức tạp — timeline scrub tự xử lý chiều thuận + nghịch.
 *
 * Khởi tạo: Đợi event "nw:page-ready" từ heroSection.js (sau intro + ScrollTrigger.refresh).
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
    "use strict";

    var _inited = false;

    // ── Hàm khởi tạo chính ─────────────────────────────────────────────────────
    function initSection2() {
        if (_inited) return;
        _inited = true;

        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
        gsap.registerPlugin(ScrollTrigger);

        // ── Elements ──────────────────────────────────────────────────────────────
        var section = document.getElementById("nw-cm-transition");   // outer 250vh
        var svgMask = document.getElementById("nw-cm-svg-mask");
        var circleEl = document.getElementById("nw-cm-hole");
        var revealEls = [].slice.call(document.querySelectorAll("[data-cm-reveal]"));

        if (!section || !svgMask || !circleEl) return;

        // ── Viewport dimensions ───────────────────────────────────────────────────
        var INITIAL_R = 56;   // pixel — bán kính ban đầu
        var diagRadius = 100;  // sẽ được tính lại

        function calcDimensions() {
            var W = window.innerWidth;
            var H = window.innerHeight;
            // Đường chéo / 2 + buffer để lấp đầy mọi tỉ lệ màn hình
            diagRadius = Math.ceil(Math.sqrt(W * W + H * H) / 2) + 20;

            // Sync SVG viewBox + cx/cy bằng pixel (tránh % gây lỗi khi animate attr)
            svgMask.setAttribute("viewBox", "0 0 " + W + " " + H);
            circleEl.setAttribute("cx", Math.round(W / 2).toString());
            circleEl.setAttribute("cy", Math.round(H / 2).toString());

            var bgRect = svgMask.querySelector("#nw-cm-bg-rect");
            if (bgRect) {
                bgRect.setAttribute("width", W.toString());
                bgRect.setAttribute("height", H.toString());
            }
        }

        // ── Set trạng thái khởi đầu ───────────────────────────────────────────────
        calcDimensions();
        circleEl.setAttribute("r", INITIAL_R.toString());
        gsap.set(svgMask, { opacity: 1 });
        gsap.set(revealEls, { opacity: 0, y: 40, filter: "blur(8px)" });

        // ── GSAP Timeline (progress 0 → 1 scrubbed bởi ScrollTrigger) ────────────
        var tl = gsap.timeline({ defaults: { ease: "none" } });

        // Phase 1 [0.0 → 0.7]: lỗ tròn mở rộng từ 56px → toàn màn hình
        tl.to(circleEl, {
            attr: { r: diagRadius },
            ease: "power2.inOut",
            duration: 0.7,
        }, 0);

        // Phase 1b [0.35 → 0.70]: text reveal stagger khi vòng tròn đủ lớn
        if (revealEls.length) {
            tl.to(revealEls, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                ease: "power2.out",
                stagger: 0.06,
                duration: 0.35,
            }, 0.35);
        }

        // Phase 2 [0.7 → 1.0]: SVG overlay fade out hoàn toàn → nền trắng lộ ra
        tl.to(svgMask, {
            opacity: 0,
            ease: "power1.in",
            duration: 0.3,
        }, 0.7);

        // ── ScrollTrigger — CSS sticky
        ScrollTrigger.create({
            animation: tl,
            trigger: section,
            start: "top top",
            end: "+=70%",
            scrub: 1.2,
            invalidateOnRefresh: true,   // tính lại positions khi F5
        });

        // ── Resize ────────────────────────────────────────────────────────────────
        var resizeTimeout;
        window.addEventListener("resize", function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                calcDimensions();
                ScrollTrigger.refresh();
            }, 200);
        });

    } // end initSection2

    // ── Điều phối timing khởi tạo ────────────────────────────────────────────
    //
    // Flow:
    //   heroSection.js → intro complete → "nw:page-ready"
    //   → đợi document.fonts.ready (font-display:swap có thể gây reflow)
    //   → initSection2()  (layout chắc chắn ổn định: fonts loaded, no pending reflow)
    //
    // Fallback (nếu heroSection không tồn tại hay bị lỗi): chờ 4 giây rồi init.
    //
    function waitForFontsThenInit() {
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () {
                requestAnimationFrame(function () {
                    initSection2();
                });
            });
        } else {
            initSection2();
        }
    }

    document.addEventListener("nw:page-ready", function onReady() {
        document.removeEventListener("nw:page-ready", onReady);
        waitForFontsThenInit();
    });
    setTimeout(waitForFontsThenInit, 4000);

})();

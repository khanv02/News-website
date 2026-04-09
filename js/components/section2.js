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

    // ────────── Hàm khởi tạo chính ──────────
    function initSection2() {
        if (_inited) return;
        _inited = true;

        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
        gsap.registerPlugin(ScrollTrigger);

        // ────────── Elements ──────────
        var section = document.getElementById("nw-cm-transition");
        var svgMask = document.getElementById("nw-cm-svg-mask");
        var circleEl = document.getElementById("nw-cm-hole");
        var cmVideo = section ? section.querySelector(".nw-cm-video") : null;
        var feedListPrimary = section ? section.querySelector(".nw-feed-list-primary") : null;
        var feedListSecondary = section ? section.querySelector(".nw-feed-list-secondary") : null;
        var feedListTertiary = section ? section.querySelector(".nw-feed-list-tertiary") : null;
        var revealEls = [].slice.call(document.querySelectorAll("[section2-data]"));
        var feedCards = section ? [].slice.call(section.querySelectorAll(".nw-feed-card")) : [];

        if (!section || !svgMask || !circleEl) return;

        // ────────── Viewport dimensions ──────────
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

        function isMobileViewport() {
            if (!window.matchMedia) return window.innerWidth <= 767;
            return window.matchMedia("(max-width: 767.98px)").matches;
        }

        function getVideoScrubStart() {
            return isMobileViewport() ? "top 50%" : "center 60%";
        }

        function getVideoScrubEnd() {
            return isMobileViewport() ? "120% top" : "bottom top";
        }

        function setupFeedHover(cards) {
            if (!cards.length) return [];

            var canHover = true;
            var reduceMotion = false;
            var mediaItems = [];

            if (window.matchMedia) {
                canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
                reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            }

            cards.forEach(function (card) {
                var media = card.querySelector(".nw-feed-media");
                var mediaImg = media ? media.querySelector("img") : null;
                if (!media) return;

                mediaItems.push({
                    card: card,
                    media: media,
                    mediaImg: mediaImg,
                });

                // Move media to body so fixed positioning stays consistent.
                if (media.parentNode !== document.body) {
                    document.body.appendChild(media);
                }

                if (!canHover || reduceMotion) {
                    gsap.set(media, { autoAlpha: 0 });
                    return;
                }

                gsap.set(media, {
                    autoAlpha: 0,
                    x: 0,
                    y: 0,
                    xPercent: -50,
                    yPercent: -50,
                    scale: 0.82,
                    transformOrigin: "50% 50%",
                });

                if (mediaImg) {
                    gsap.set(mediaImg, { scale: 1.07, transformOrigin: "50% 50%" });
                }

                card.addEventListener("mouseenter", function () {
                    card.style.zIndex = "30";

                    gsap.to(media, {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.38,
                        ease: "power3.out",
                        overwrite: true,
                    });

                    if (mediaImg) {
                        gsap.to(mediaImg, {
                            scale: 1,
                            duration: 0.4,
                            ease: "power2.out",
                            overwrite: true,
                        });
                    }
                });

                card.addEventListener("mouseleave", function () {
                    gsap.to(media, {
                        autoAlpha: 0,
                        x: 0,
                        y: 0,
                        scale: 0.82,
                        duration: 0.24,
                        ease: "power2.in",
                        overwrite: true,
                        onComplete: function () {
                            card.style.zIndex = "";
                        },
                    });

                    if (mediaImg) {
                        gsap.to(mediaImg, {
                            scale: 1.07,
                            duration: 0.24,
                            ease: "power2.in",
                            overwrite: true,
                        });
                    }
                });
            });

            return mediaItems;
        }

        // ────────── Set trạng thái khởi đầu ──────────
        calcDimensions();
        var feedMediaItems = setupFeedHover(feedCards);
        circleEl.setAttribute("r", INITIAL_R.toString());
        gsap.set(svgMask, { opacity: 1 });
        gsap.set(revealEls, { opacity: 0, y: 40, filter: "blur(8px)" });

        if (feedListSecondary) {
            gsap.set(feedListSecondary, { autoAlpha: 0, y: 18, pointerEvents: "none" });
        }
        if (feedListTertiary) {
            gsap.set(feedListTertiary, { autoAlpha: 0, y: 18, pointerEvents: "none" });
        }

        // ── GSAP Timeline (progress 0 → 1 scrubbed bởi ScrollTrigger) ────────────
        var tl = gsap.timeline({ defaults: { ease: "none" } });
        var sectionScrollEnd = "+=300%";
        var sectionScrub = 2;
        var listSwap1Start = 2;
        var listSwap2Start = 4;
        var listSwapDuration = 0.36;
        var maskFadeStart = 1.34;

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

        if (feedListPrimary && feedListSecondary) {
            tl.to(feedListPrimary, {
                autoAlpha: 0,
                y: -18,
                ease: "power2.inOut",
                duration: listSwapDuration,
                onStart: function () {
                    feedListPrimary.style.pointerEvents = "none";
                    feedListSecondary.style.pointerEvents = "none";
                    if (feedListTertiary) {
                        feedListTertiary.style.pointerEvents = "none";
                    }
                },
                onReverseComplete: function () {
                    feedListPrimary.style.pointerEvents = "auto";
                    feedListSecondary.style.pointerEvents = "none";
                    if (feedListTertiary) {
                        feedListTertiary.style.pointerEvents = "none";
                    }
                },
            }, listSwap1Start);

            tl.to(feedListSecondary, {
                autoAlpha: 1,
                y: 0,
                ease: "power2.out",
                duration: listSwapDuration,
                onComplete: function () {
                    feedListSecondary.style.pointerEvents = "auto";
                },
                onReverseComplete: function () {
                    feedListSecondary.style.pointerEvents = "none";
                },
            }, listSwap1Start);
        }

        if (feedListSecondary && feedListTertiary) {
            tl.to(feedListSecondary, {
                autoAlpha: 0,
                y: -18,
                ease: "power2.inOut",
                duration: listSwapDuration,
                onStart: function () {
                    feedListPrimary.style.pointerEvents = "none";
                    feedListSecondary.style.pointerEvents = "none";
                    feedListTertiary.style.pointerEvents = "none";
                },
                onReverseComplete: function () {
                    feedListSecondary.style.pointerEvents = "auto";
                    feedListTertiary.style.pointerEvents = "none";
                },
            }, listSwap2Start);

            tl.to(feedListTertiary, {
                autoAlpha: 1,
                y: 0,
                ease: "power2.out",
                duration: listSwapDuration,
                onComplete: function () {
                    feedListTertiary.style.pointerEvents = "auto";
                },
                onReverseComplete: function () {
                    feedListTertiary.style.pointerEvents = "none";
                    feedListSecondary.style.pointerEvents = "auto";
                },
            }, listSwap2Start);
        }

        // Phase 2 [0.7 → 1.0]: SVG overlay fade out hoàn toàn → nền trắng lộ ra
        tl.to(svgMask, {
            opacity: 0,
            ease: "power1.in",
            duration: 0.38,
        }, maskFadeStart);

        // ── ScrollTrigger — CSS sticky
        var mediaSyncedHidden = true;
        var textRevealStart = 0.35;

        ScrollTrigger.create({
            animation: tl,
            trigger: section,
            start: "top top",
            end: sectionScrollEnd,
            scrub: sectionScrub,
            invalidateOnRefresh: true,   // tính lại positions khi F5
            onUpdate: function (self) {
                if (!feedMediaItems.length) return;

                // Khi cuộn ngược về trước phase text reveal, ảnh card ẩn cùng nhịp 0.35s.
                if (self.progress <= textRevealStart) {
                    if (mediaSyncedHidden) return;

                    feedMediaItems.forEach(function (item) {
                        gsap.to(item.media, {
                            autoAlpha: 0,
                            scale: 0.82,
                            duration: 0.35,
                            ease: "power2.out",
                            overwrite: true,
                        });

                        if (item.mediaImg) {
                            gsap.to(item.mediaImg, {
                                scale: 1.07,
                                duration: 0.35,
                                ease: "power2.out",
                                overwrite: true,
                            });
                        }

                        item.card.style.zIndex = "";
                    });

                    mediaSyncedHidden = true;
                    return;
                }

                mediaSyncedHidden = false;
            },
        });

        if (cmVideo) {
            gsap.set(cmVideo, {
                scale: 1.12,
                yPercent: -4,
                transformOrigin: "50% 50%",
            });

            var videoScrubTl = gsap.timeline({
                scrollTrigger: {
                    trigger: cmVideo,
                    start: getVideoScrubStart,
                    end: getVideoScrubEnd,
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            });

            function bindVideoScrubToDuration() {
                if (!isFinite(cmVideo.duration) || cmVideo.duration <= 0) return;

                cmVideo.pause();
                videoScrubTl.clear();
                videoScrubTl.fromTo(cmVideo, {
                    currentTime: 0,
                }, {
                    currentTime: cmVideo.duration,
                    ease: "none",
                    duration: 1,
                }, 0);
            }

            if (cmVideo.readyState >= 1) {
                bindVideoScrubToDuration();
            } else {
                cmVideo.addEventListener("loadedmetadata", bindVideoScrubToDuration, { once: true });
            }

            ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: sectionScrollEnd,
                scrub: 2.6,
                invalidateOnRefresh: true,
                animation: gsap.to(cmVideo, {
                    scale: 1,
                    yPercent: 0,
                    ease: "none",
                }),
            });
        }

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

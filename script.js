import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let presentationPhase2;

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

    // --- LENIS SMOOTH SCROLL SETUP ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    let isAnimating = false;


    // --- Parallax Logic ---
    window.addEventListener("mousemove", (e) => {
        const xPct = (e.clientX / window.innerWidth - 0.5) * 20;
        const yPct = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to("#intro-main h1", { x: xPct, y: yPct, duration: 1, ease: "power2.out" });
        gsap.to(".chaos-item", { x: -xPct * 2, y: -yPct * 2, duration: 1.5, ease: "power2.out", overwrite: "auto" });
    });


    // --- Presentation Tick Logic (Tick++) ---
    window.presentation = {
        currentTick: 0,
        nextTick: function() {
            if (isAnimating || this.currentTick >= 22) return;
            this.currentTick++;
            isAnimating = true;
            this.executeTick();
        },
        triggerWordShatterEffect: function() {
            // Preserved for later use (e.g. Analog Clash transition)
            gsap.to("#intro-pragmatism .char", {
                y: () => 100 + Math.random() * 400,
                x: () => (Math.random() - 0.5) * 200,
                rotation: () => (Math.random() - 0.5) * 90,
                opacity: 0, filter: "blur(10px)", duration: 2,
                stagger: { amount: 0.8, from: "random" }
            });
        },
        executeTick: function() {
            const unlock = (delay = 1000) => setTimeout(() => { isAnimating = false; }, delay);
            switch(this.currentTick) {
                // Section 1: Intro
                case 1:
                    const hackTl = gsap.timeline({
                        onComplete: () => unlock(500)
                    });
                    gsap.set("#intro-title", { opacity: 0, pointerEvents: "none" });
                    hackTl.to(["#crash-sequence", "#photoshop-desktop"], { opacity: 1, duration: 0.5 });
                    hackTl.fromTo("#mouse-cursor", 
                        { opacity: 0, x: "20vw", y: "20vh" }, 
                        { opacity: 1, x: 0, y: 0, duration: 1.2, ease: "power2.inOut" }, 
                        "+=0.2"
                    );
                    hackTl.to("#photoshop-icon", { scale: 0.9, duration: 0.1, repeat: 1, yoyo: true }, "+=0.2");
                    hackTl.to(["#photoshop-desktop", "#mouse-cursor"], { opacity: 0, duration: 0.2 }, "+=0.3");
                    hackTl.fromTo("#photoshop-window", 
                        { scale: 0.8, opacity: 0 }, 
                        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
                    );
                    hackTl.fromTo("#adobe-popup", 
                        { scale: 1.1, opacity: 0 }, 
                        { scale: 1, opacity: 1, duration: 0.2, ease: "expo.out" }, 
                        "+=1.0"
                    );
                    break;

                case 2:
                    // Abrupt Kill - Scale windows to 0, Photoshop Icon becomes visible again
                    gsap.to(["#photoshop-window", "#adobe-popup"], { 
                        scale: 0, opacity: 0, duration: 0.2, ease: "power2.in"
                    });
                    gsap.to("#photoshop-desktop", { opacity: 1, duration: 0.3, onComplete: () => unlock(500) });
                    break;

                case 3:
                    // Arsenal Phase - Cracked Icons pop up
                    const arsenalIcons = document.querySelectorAll('.arsenal-icon');
                    gsap.to(arsenalIcons, { 
                        opacity: 1, scale: 1, duration: 0.5, stagger: 0.15, 
                        ease: "back.out(1.7)", onComplete: () => unlock(1000)
                    });
                    break;

                case 4:
                    // Transition to Bio 2022 - Desktop slides up, Bio reveals
                    const transitionTl = gsap.timeline({
                        onComplete: () => {
                            gsap.to("#node-2022", { visibility: "visible", opacity: 1, x: 10, duration: 0.5 });
                            gsap.to("#bio-img-agency", { visibility: "visible", opacity: 1, duration: 1 });
                            unlock(1000);
                        }
                    });
                    transitionTl.to(["#photoshop-desktop", "#crash-sequence"], { 
                        y: "-100vh", opacity: 0, duration: 0.8, ease: "power2.inOut" 
                    });
                    transitionTl.set(["#bio-left-col", "#bio-right-col"], { visibility: "visible", opacity: 1 }, "-=0.4");
                    break;

                case 5:
                    // Bio 2023
                    gsap.to("#node-2023", { opacity: 1, x: 10, duration: 0.5 });
                    gsap.to("#bio-img-agency", { opacity: 0, duration: 0.5 });
                    gsap.to("#bio-img-reset", { opacity: 1, duration: 0.5, delay: 0.2 });
                    unlock(1000); break;

                case 6:
                    // Bio 2024
                    gsap.to("#node-2024", { opacity: 1, x: 10, duration: 0.5 });
                    gsap.to("#bio-img-reset", { opacity: 0, duration: 0.5 });
                    gsap.to("#bio-img-reality", { opacity: 1, duration: 0.5, delay: 0.2 });
                    unlock(1000); break;

                case 7:
                    // Pragmatismus Zoom
                    gsap.to([".timeline-node", "#timeline-rail"], { opacity: 0, filter: "blur(10px)", duration: 0.5 });
                    gsap.to("#bio-img-reality", { opacity: 0, duration: 0.5 });
                    gsap.to(["#bio-left-col", "#bio-right-col"], { borderColor: "transparent", backgroundColor: "#000000", duration: 0.5 });
                    gsap.set("#intro-pragmatism", { scale: 4, opacity: 0 });
                    gsap.to("#intro-pragmatism", { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" });
                    unlock(800); break;

                case 8:
                    // Evidence Popups
                    gsap.to(".project-popup", {
                        opacity: 1, rotationX: () => (Math.random() - 0.5) * 25, rotationY: () => (Math.random() - 0.5) * 25,
                        duration: 1.2, stagger: 0.15, ease: "back.out(2)"
                    });
                    unlock(1200); break;

                case 9:
                    // Section 1 -> 2 Transition
                    gsap.to("#pragmatism-wrapper", { opacity: 0, filter: "blur(10px)", duration: 1.2, ease: "power2.in" });
                    gsap.to(window, {
                        scrollTo: "#sec-pro", duration: 1.5, delay: 0.2, ease: "power2.inOut",
                        onComplete: () => {
                            document.getElementById("status-text").innerText = "STATUS: SYSTEM_MADNESS";
                            document.getElementById("status-dot").classList.replace("bg-neon", "bg-alert");
                            isAnimating = false;
                        }
                    });
                    break;

                case 10: currentStep = 1; startDrawing(); unlock(1000); break;
                case 11: currentStep = 2; startCrosshair(); unlock(1500); break;
                case 12: currentStep = 3; showBaustelle(); unlock(1000); break;
                case 13: currentStep = 4; startReveal(); unlock(1500); break;
                case 14: currentStep = 5; startKPIs(); unlock(500); break;
                case 15: currentStep = 6; startClimax(); unlock(1000); break;
                
                case 16: 
                    // Buffer tick / Narrative Pause before the big transition at 17
                    unlock(300); 
                    break;
                case 17: 
                    initTick1(); 
                    unlock(3000); // Wait for the high-end counter to finish
                    break;
                case 18: showBaukasten(); unlock(1000); break;
                case 19: startMerge(); unlock(1000); break;
                case 20: showReduction(); unlock(800); break;
                case 21: showProof(); unlock(2000); break;
                case 22:
                    // Stage change already handled in HUD Zoom for smoother transition
                    unlock(500); 
                    break;
            }
        }
    };

    // Disable lenis on start to allow pure tick control
    lenis.stop();
    // Scroll to top just in case
    window.scrollTo(0,0);

    let isMasterTimelineZoomed = false;
    let timelineAnimating = false;
    let lastZoomedTick = -1;
    let activePulseTween1 = null;
    let activePulseTween2 = null;

    function updateTimelineState(activeTick) {
        let activeChap = "";
        // Mapping aligned with user's architectural requirements:
        // INIT (1-16) includes Desktop, Arsenal and System Madness (Sektion 2)
        if (activeTick <= 16) activeChap = "chap-pre-study";
        // MOD_01 (17-21) is the Service Design / Modular section
        else if (activeTick <= 21) activeChap = "chap-sem-01";
        // MOD_02 (22-30) Transition to Phase 2 / Chaos
        else if (activeTick <= 30) activeChap = "chap-sem-02";
        // ERR_03 (31-48) Analog Infection / Clash
        else if (activeTick <= 48) activeChap = "chap-sem-03";
        // OUT_04 (47+) Final Balance
        else activeChap = "chap-outro";

        if (activePulseTween1) {
            activePulseTween1.kill();
            activePulseTween1 = null;
        }
        if (activePulseTween2) {
            activePulseTween2.kill();
            activePulseTween2 = null;
        }

        document.querySelectorAll('.timeline-chapter').forEach(el => {
            const dot = el.querySelector('.glow-dot');
            const label = el.querySelector('.chapter-label');
            if (!dot || !label) return;

            gsap.killTweensOf(dot);
            gsap.killTweensOf(label);

            if (el.id === activeChap) {
                if (el.id === "chap-sem-03") {
                    gsap.set(dot, { backgroundColor: '#FF0000', boxShadow: '0 0 15px #FF0000', scale: 1, opacity: 1 });
                    gsap.set(label, { color: '#FF0000', textShadow: '0 0 8px rgba(255,0,0,0.5)', fontWeight: '700', scale: 1, opacity: 1 });
                } else {
                    gsap.set(dot, { backgroundColor: '#00FF41', boxShadow: '0 0 15px #00FF41', scale: 1, opacity: 1 });
                    gsap.set(label, { color: '#00FF41', textShadow: '0 0 8px rgba(0,255,65,0.5)', fontWeight: '700', scale: 1, opacity: 1 });
                }

                // Awwwards-Level Yoyo Pulse
                activePulseTween1 = gsap.to(dot, {
                    scale: 1.3,
                    boxShadow: el.id === "chap-sem-03" ? '0 0 25px rgba(255,0,0,0.9)' : '0 0 25px rgba(0,255,65,0.9)',
                    duration: 1.2,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });

                activePulseTween2 = gsap.to(label, {
                    textShadow: el.id === "chap-sem-03" ? '0 0 15px rgba(255,0,0,0.8)' : '0 0 15px rgba(0,255,65,0.8)',
                    scale: 1.02,
                    duration: 1.2,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });
            } else {
                gsap.set(dot, { backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: 'none', scale: 1, opacity: 1 });
                gsap.set(label, { color: 'rgba(255,255,255,0.4)', textShadow: 'none', fontWeight: '400', scale: 1, opacity: 1 });
            }
        });
    }

    function zoomInMasterTimeline(targetTick) {
        timelineAnimating = true;
        isMasterTimelineZoomed = true;
        
        updateTimelineState(targetTick);

        if (targetTick === 1) {
            // Fix: Fade out intro-title during HUD zoom for a clean black background
            gsap.to("#intro-title", { opacity: 0, duration: 1.2, pointerEvents: "none", ease: "expo.out" });
            
            // Fix: Immediately hide bio content to prevent background leak in blur
            gsap.set(["#node-2022", "#bio-img-agency", "#bio-left-col", "#bio-right-col"], { 
                opacity: 0, 
                visibility: "hidden" 
            });
            // Keep Photoshop components hidden during zoom (User wants black Background)
            gsap.set(["#crash-sequence", "#photoshop-desktop"], { opacity: 0 });
            
            // Ensure HUD is visible!
            gsap.set(["#master-timeline", "#timeline-gradient"], { opacity: 1, visibility: "visible" });
        }
        
        if (targetTick === 17) {
            // Cinematic transition to Sektion 3
            gsap.to(window, { 
                scrollTo: "#sec-modular", 
                duration: 2, 
                ease: "power3.inOut" 
            });
            document.getElementById("status-text").innerText = "STATUS: MODULAR_SYSTEM";
            document.getElementById("status-dot").classList.replace("bg-alert", "bg-neon");
            
            // Fix: Hide the madness grid and interface before modular section starts
            const grid = document.getElementById('grid-background');
            if (grid) grid.classList.remove('visible');
            const interfaceContainer = document.getElementById('interface-container');
            if (interfaceContainer) {
                interfaceContainer.classList.remove('visible');
                interfaceContainer.classList.add('climax-active'); // This now has opacity: 0
            }

            // Ensure Section 3 counter elements are hidden during the zoom-in (before animation)
            gsap.set(["#counter", "#counter-label"], { opacity: 0 });
        }
        
        if (targetTick === 22) {
            // Transition into Phase 2 / Shatter the old world
            triggerShatterTransition();

            // PRE-LOAD Phase 2 Stage behind the HUD for smooth buildup
            const uiContainer = document.getElementById('ui-container');
            const threeCanvas = document.getElementById('three-canvas');
            if (uiContainer) { 
                uiContainer.style.visibility = 'visible'; 
                gsap.to(uiContainer, { opacity: 1, duration: 2, ease: "power2.inOut" });
            }
            if (threeCanvas) { 
                threeCanvas.style.visibility = 'visible'; 
                gsap.to(threeCanvas, { opacity: 1, duration: 2, ease: "power2.inOut" });
            }
            
            // Start Phase 2 Ambient build-up immediately
            if (presentationPhase2) {
                presentationPhase2.prepareStage();
            }
            
            // Cleanup Phase 1
            const main = document.querySelector('main');
            if (main) main.style.display = 'none';
        }

        if (targetTick === 31) {
            // Transition to Phase 3 / Analog Clash
            // Hide Phase 2 remnants to ensure black background in blur
            if (presentationPhase2) presentationPhase2.cleanupPreviousSections();
            gsap.to(document.body, { backgroundColor: '#000', duration: 1 });
            gsap.set(["#master-timeline", "#timeline-gradient"], { opacity: 1, visibility: "visible" });
        }

        const tlEl = document.getElementById('master-timeline');
        const chapters = document.querySelectorAll('.timeline-chapter');
        const rect = tlEl.getBoundingClientRect();
        const centerXOffset = - (window.innerWidth / 2) + rect.width / 2 + 32;

        let tl = gsap.timeline({
            onComplete: () => {
                timelineAnimating = false;
            }
        });

        tl.to("#timeline-gradient", { 
            opacity: 0, 
            duration: 1.2, 
            ease: "expo.inOut" 
        }, 0);

        tl.to("#master-timeline-overlay", { 
            opacity: 1, 
            backdropFilter: "blur(15px)", 
            duration: 1.2, 
            ease: "expo.inOut" 
        }, 0);

        tl.to(tlEl, {
            x: centerXOffset,
            scale: 2.2,
            opacity: 1,
            duration: 1.2,
            ease: "expo.inOut"
        }, 0);

        // Prep the stagger animation
        gsap.set(chapters, { x: 20, filter: "blur(8px)" });
        
        tl.to(chapters, {
            x: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "expo.inOut",
            stagger: 0.05
        }, 0);
    }

    function zoomOutMasterTimeline() {
        timelineAnimating = true;
        isMasterTimelineZoomed = false;

        let tl = gsap.timeline({
            onComplete: () => {
                timelineAnimating = false;
                proceedWithTick();
            }
        });

        const chapters = document.querySelectorAll('.timeline-chapter');

        tl.to("#timeline-gradient", { 
            opacity: 1, 
            duration: 1.2, 
            ease: "expo.inOut" 
        }, 0);

        tl.to("#master-timeline-overlay", { 
            opacity: 0, 
            backdropFilter: "blur(0px)", 
            duration: 1.2, 
            ease: "expo.inOut" 
        }, 0);

        tl.to(document.getElementById('master-timeline'), {
            x: 0,
            scale: 1,
            duration: 1.2,
            ease: "expo.inOut"
        }, 0);

        tl.to(chapters, {
            x: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "expo.inOut"
        }, 0);
    }

    function proceedWithTick() {
        if (window.presentation.currentTick < 22) {
            window.presentation.nextTick();
        } else if (presentationPhase2) {
            presentationPhase2.nextTick();
        }

        // SYNC: Call timeline update immediately after starting the logic/animation
        syncTimelineHighlight();
    }

    function syncTimelineHighlight() {
        let activeGlobalTick = window.presentation.currentTick;
        if (activeGlobalTick >= 22 && presentationPhase2) {
            activeGlobalTick = presentationPhase2.currentTick;
        }
        updateTimelineState(activeGlobalTick);
    }

    function handleInteraction() {
        if (isAnimating) return;
        if (timelineAnimating) return;

        if (isMasterTimelineZoomed) {
            zoomOutMasterTimeline();
            return;
        }

        let globalNextTick;
        if (window.presentation.currentTick < 22) {
            globalNextTick = window.presentation.currentTick + 1;
        } else if (presentationPhase2) {
            globalNextTick = presentationPhase2.currentTick + 1;
        } else {
            return;
        }

        if ([1, 17, 22, 32, 47].includes(globalNextTick) && lastZoomedTick !== globalNextTick) {
            lastZoomedTick = globalNextTick;
            zoomInMasterTimeline(globalNextTick);
        } else {
            proceedWithTick();
        }
    }

    window.addEventListener("keydown", (e) => {
        if (["Space", "ArrowRight", "PageDown", "ArrowDown"].includes(e.code)) {
            e.preventDefault();
            handleInteraction();
        }
        
        // --- DEV MODE JUMP ---
        if (e.shiftKey && e.code === "KeyJ") {
            e.preventDefault();
            const input = prompt("DEV MODE: Jump to Tick (1-50):");
            if (!input) return;
            const targetTick = parseInt(input, 10);
            if (isNaN(targetTick) || targetTick < 1 || targetTick > 50) return;

            // Reset animation locks globally
            isAnimating = false;
            timelineAnimating = false;

            if (targetTick < 19) {
                window.presentation.currentTick = targetTick - 1;
                window.presentation.nextTick();
            } else {
                // Handoff Security: Force Phase 2 visibility instantly
                const uiContainer = document.getElementById('ui-container');
                const threeCanvas = document.getElementById('three-canvas');
                if (uiContainer) {
                    uiContainer.style.visibility = 'visible';
                    uiContainer.style.opacity = '1';
                }
                if (threeCanvas) {
                    threeCanvas.style.visibility = 'visible';
                    threeCanvas.style.opacity = '1';
                }
                const oldElements = document.querySelectorAll('main, #grid-background, #interface-container');
                oldElements.forEach(el => {
                    if (el) el.style.display = 'none';
                });

                // Jump logic
                if (presentationPhase2) {
                    presentationPhase2.currentTick = targetTick - 1;
                    presentationPhase2.nextTick();
                } else {
                    console.warn("Dev Mode: Phase 2 not initialized yet. Skipping jump.");
                }
            }
        }
    });

    window.addEventListener("mousedown", (e) => {
        if (e.target.closest("a, button")) return;
        if (e.button === 0) {
            handleInteraction();
        }
    });

    updateTimelineState(0);

    function smoothScroll(targetY) {
        gsap.to(window, { scrollTo: targetY, duration: 1.5, ease: "power2.inOut" });
    }

    // --- DIGITAL SHATTER TRANSITION ---
    function triggerShatterTransition() {
        const overlay = document.getElementById('shatter-overlay');
        const cracks = document.getElementById('shatter-cracks');
        const fragments = document.getElementById('shatter-fragments');
        const flash = document.getElementById('flash-hit');
        const slide3 = document.getElementById('slide-3');

        // 1. Setup Overlay
        overlay.style.opacity = '1';
        cracks.innerHTML = '';
        fragments.innerHTML = '';

        // Generate Digital Crack Pattern (Razor sharp white lines from center)
        let crackSVG = `<svg viewBox="0 0 1000 1000" preserveAspectRatio="none">`;
        for (let i = 0; i < 25; i++) {
            const x1 = 500;
            const y1 = 500;
            const angle = (i / 25) * Math.PI * 2 + (Math.random() * 0.2);
            const dist = 1200;
            const x2 = x1 + Math.cos(angle) * dist;
            const y2 = y1 + Math.sin(angle) * dist;
            crackSVG += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="crack-line" style="stroke-dasharray: 1000; stroke-dashoffset: 1000;" />`;
        }
        crackSVG += `</svg>`;
        cracks.innerHTML = crackSVG;

        // 2. Create Fragments (Harde geometrische Formen)
        const fragCount = 45;
        for (let i = 0; i < fragCount; i++) {
            const frag = document.createElement('div');
            frag.className = 'shatter-fragment';
            
            // Distribution: start around center
            const startX = 45 + Math.random() * 10;
            const startY = 45 + Math.random() * 10;
            const w = 10 + Math.random() * 20;
            const h = 10 + Math.random() * 20;

            frag.style.width = w + 'vw';
            frag.style.height = h + 'vh';
            frag.style.left = startX + 'vw';
            frag.style.top = startY + 'vh';

            // Random Geometric Polygon (3-6 points)
            const pointCount = 3 + Math.floor(Math.random() * 3);
            const points = [];
            for (let p = 0; p < pointCount; p++) {
                points.push(`${Math.random() * 100}% ${Math.random() * 100}%`);
            }
            frag.style.clipPath = `polygon(${points.join(',')})`;
            
            fragments.appendChild(frag);
        }

        const fragEls = document.querySelectorAll('.shatter-fragment');

        // 3. ANIMATION TIMELINE
        const tl = gsap.timeline({
            onComplete: () => {
                // 3. Shatter-Overlay ausblenden
                gsap.to(overlay, { opacity: 0, duration: 1.5, delay: 0.5 });
            }
        });

        // THE HIT (Flash + Cracks)
        tl.to(flash, { opacity: 1, duration: 0.04, ease: "none" })
          .to(flash, { opacity: 0, duration: 0.3, ease: "power2.inOut" })
          .to(".crack-line", { strokeDashoffset: 0, duration: 0.08, stagger: 0.005, ease: "none" }, 0);

        // FRAGMENT BURST (Extreme speed, Linear)
        fragEls.forEach((frag) => {
            const angle = Math.random() * Math.PI * 2;
            const force = 1000 + Math.random() * 1500;
            const tx = Math.cos(angle) * force;
            const ty = Math.sin(angle) * force;
            const rot = (Math.random() - 0.5) * 360;

            tl.to(frag, {
                x: tx,
                y: ty,
                scale: 20,
                rotation: rot,
                duration: 0.7,
                ease: "none" // Constant velocity
            }, 0.04);
        });

        // Wipe original content
        tl.to(slide3, { opacity: 0, duration: 0.1 }, 0.04);
    }

    ScrollTrigger.defaults({ toggleActions: "play none none reverse" });


    // --- SECTION 1: INTRO (BIOGRAPHY TIMELINE) ---
    // Vertical Timeline logic replaced by Tick++ case 1-5


    // --- SECTION 2: THE PRO (STEPPED MADNESS REVAMP) ---
    // Variables for the madness sequence
    let currentStep = 0;
    let svgLoaded = false;
    let drawAnimationElements = [];
    let targetElementForLock = null;
    let isInMadnessSection = false;

    // Load SVG for Section 2
    async function initMadnessSVG() {
        const container = document.getElementById('svg-container');
        if (!container) return;

        try {
            const response = await fetch('assets/section_2/blaupause.svg');
            const svgContent = await response.text();

            container.innerHTML = svgContent;
            const svg = container.querySelector('svg');

            if (!svg) {
                console.error("No SVG found in the file.");
                return;
            }

            // Parse layers and prepare them for animation out (delay calculation)
            const layers = Array.from(svg.querySelectorAll('g'));

            layers.forEach((layer, layerIndex) => {
                const elements = Array.from(layer.querySelectorAll('path, line, polyline, polygon, rect'));

                elements.sort((a, b) => {
                    const boxA = a.getBBox();
                    const boxB = b.getBBox();
                    return boxA.x - boxB.x;
                });

                elements.forEach((el, index) => {
                    const length = el.getTotalLength ? el.getTotalLength() : 0;

                    if (length > 0) {
                        el.style.strokeDasharray = length;
                        el.style.strokeDashoffset = length;
                        el.style.opacity = '0'; // Keep hidden until drawn to avoid dots

                        const layerDelay = layerIndex * 800;
                        const elementDelay = index * 12;

                        drawAnimationElements.push({
                            el: el,
                            delay: layerDelay + elementDelay,
                            isLength: true,
                            lengthVal: length // Store to reset later
                        });
                    } else {
                        const layerDelay = layerIndex * 800;
                        const elementDelay = index * 12;

                        drawAnimationElements.push({
                            el: el,
                            delay: layerDelay + elementDelay,
                            isLength: false
                        });
                    }
                });
            });

            // Find an element to target for the bounding box snap
            const allElements = Array.from(svg.querySelectorAll('path, line, polyline, polygon, rect'));
            targetElementForLock = allElements.find(el => {
                const box = el.getBBox();
                const centerX = box.x + box.width / 2;
                const centerY = box.y + box.height / 2;
                return centerX > 200 && centerX < 450 && centerY > 300 && centerY < 600 && box.width > 50;
            }) || allElements[Math.floor(allElements.length / 2)];

            setTimeout(() => {
                container.classList.add('visible'); 
                svgLoaded = true;
            }, 300);

        } catch (e) {
            console.error("Failed to load or animate SVG:", e);
        }
    }

    initMadnessSVG();

    // Madness Logic Functions
    function advanceAnimation() {
        currentStep++;
        if (currentStep === 1) startDrawing();
        else if (currentStep === 2) startCrosshair();
        else if (currentStep === 3) startBanner();
        else if (currentStep === 4) startReveal();
        else if (currentStep === 5) startKPIs();
        else if (currentStep === 6) startClimax();
    }

    function reverseAnimation() {
        if (currentStep <= 0) return;
        currentStep--;
        if (currentStep === 0) resetDrawing();
        else if (currentStep === 1) resetCrosshair();
        else if (currentStep === 2) resetBanner();
        else if (currentStep === 3) resetReveal();
        else if (currentStep === 4) resetKPIs();
        else if (currentStep === 5) resetClimax();
    }

    // Step Functions
    function startDrawing() {
        drawAnimationElements.forEach(item => {
            item.timeoutId = setTimeout(() => {
                if (currentStep !== 1) return;
                if (item.isLength) {
                    item.el.style.opacity = '1';
                    item.el.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.1s ease';
                    item.el.style.strokeDashoffset = '0';
                } else {
                    item.el.style.opacity = '1';
                    item.el.style.transition = 'opacity 1.5s ease';
                }
            }, item.delay);
        });
    }

    function startCrosshair() {
        if (!targetElementForLock) return;
        const crosshair = document.getElementById('crosshair');
        const svgBounds = document.getElementById('svg-container').getBoundingClientRect();
        crosshair.style.opacity = '1';
        let iterations = 0;
            setTimeout(() => {
                if (currentStep !== 2) return;
                const target = document.getElementById('baustelle-container');
                const targetRect = target.getBoundingClientRect();
                const container = document.getElementById('svg-container');
                const svgRect = container.getBoundingClientRect();
                
                // Random jumping before final snap
                crosshair.style.opacity = '1';
                let jumpCount = 0;
                window.jumpInterval = setInterval(() => {
                    const rx = svgRect.left + Math.random() * (svgRect.width - 200);
                    const ry = svgRect.top + Math.random() * (svgRect.height - 200);
                    crosshair.style.transition = 'none';
                    crosshair.style.left = rx + 'px';
                    crosshair.style.top = ry + 'px';
                    crosshair.style.width = (100 + Math.random() * 200) + 'px';
                    crosshair.style.height = (80 + Math.random() * 150) + 'px';
                    jumpCount++;
                    if (jumpCount > 8 || currentStep !== 2) {
                        clearInterval(window.jumpInterval);
                        if (currentStep === 2) finalize();
                    }
                }, 60);

                function finalize() {
                    const scale = 1.0; 
                    const padding = 8; // Small consistent padding around the asset
                    const finalW = (targetRect.width + padding * 2) * scale;
                    const finalH = (targetRect.height + padding * 2) * scale;
                    const finalL = (targetRect.left + targetRect.width / 2) - finalW / 2;
                    const finalT = (targetRect.top + targetRect.height / 2) - finalH / 2;

                    crosshair.style.transition = 'all 0.5s cubic-bezier(0.1, 0.9, 0.2, 1)';
                    crosshair.style.left = finalL + 'px';
                    crosshair.style.top = finalT + 'px';
                    crosshair.style.width = finalW + 'px';
                    crosshair.style.height = finalH + 'px';
                    window.finalLockStats = { left: finalL, top: finalT, width: finalW, height: finalH };

                    // Zoom the whole SVG section to the container
                    const originX = ((targetRect.left + targetRect.width/2 - svgRect.left) / svgRect.width) * 100;
                    const originY = ((targetRect.top + targetRect.height/2 - svgRect.top) / svgRect.height) * 100;
                    container.style.transition = 'transform 1.2s cubic-bezier(0.1, 0.9, 0.2, 1), transform-origin 0s';
                    container.style.transformOrigin = `${originX}% ${originY}%`;
                    container.style.transform = `scale(1.8)`;

                    const terminalOverlay = document.getElementById('terminal-overlay');
                    const terminalText = document.getElementById('terminal-text');
                    terminalOverlay.style.opacity = '1';
                    const textToType = "> TARGET_LOCK: AREA_BAUSTELLE.LOG";
                    terminalText.textContent = '';
                    let charIndex = 0;
                    window.typingInterval = setInterval(() => {
                        terminalText.textContent += textToType[charIndex];
                        charIndex++;
                        if (charIndex >= textToType.length) clearInterval(window.typingInterval);
                    }, 30);
                }
            }, 400);
    }

    function showBaustelle() {
        if (!window.finalLockStats) return;
        const baustelle = document.getElementById('baustelle-container');
        const padding = 8;
        
        // Match the image exactly to the interior of the (padded) crosshair
        baustelle.style.left = (window.finalLockStats.left + padding) + 'px';
        baustelle.style.top = (window.finalLockStats.top + padding) + 'px';
        baustelle.style.width = (window.finalLockStats.width - padding * 2) + 'px';
        baustelle.style.height = (window.finalLockStats.height - padding * 2) + 'px';
        
        // Remove the CSS centering since we are now absolute positioned by JS
        baustelle.style.transform = 'none';

        baustelle.style.opacity = '1';
        baustelle.style.filter = 'blur(0px)';
    }

    function startReveal() {
        const baustelle = document.getElementById('baustelle-container');
        const uiInterface = document.getElementById('interface-container');
        const video = document.getElementById('onboarding-video');
        
        baustelle.classList.add('melt');
        document.getElementById('main-content').classList.add('blur-out');
        
        setTimeout(() => {
            if (currentStep !== 4) return;
            uiInterface.classList.add('visible');
            video.play();
        }, 1000);
    }

    function startKPIs() {
        document.getElementById('interface-container').classList.add('kpi-visible');
    }

    function startClimax() {
        document.getElementById('interface-container').classList.add('climax-active');
        document.getElementById('grid-background').classList.add('visible');
    }

    // Reset Functions
    function resetDrawing() {
        resetCrosshair();
        drawAnimationElements.forEach(item => {
            if (item.timeoutId) clearTimeout(item.timeoutId);
            item.el.style.transition = 'none';
            if (item.isLength) {
                item.el.style.strokeDashoffset = item.lengthVal;
                item.el.style.opacity = '0';
            } else {
                item.el.style.opacity = '0';
            }
        });
    }

    function resetCrosshair() {
        const crosshair = document.getElementById('crosshair');
        const terminalOverlay = document.getElementById('terminal-overlay');
        const terminalText = document.getElementById('terminal-text');
        const container = document.getElementById('svg-container');
        if (window.jumpInterval) clearInterval(window.jumpInterval);
        if (window.searchInterval) clearInterval(window.searchInterval);
        if (window.typingInterval) clearInterval(window.typingInterval);
        crosshair.style.opacity = '0';
        terminalOverlay.style.opacity = '0';
        terminalText.textContent = '';
        container.style.transform = 'scale(1) translate(0px, 0px)';
        resetReveal();
    }

    function resetBanner() {
        const banner = document.getElementById('banner-overlay');
        banner.style.height = '0px';
        banner.style.opacity = '0';
    }

    function resetReveal() {
        const baustelle = document.getElementById('baustelle-container');
        const uiInterface = document.getElementById('interface-container');
        const mainContent = document.getElementById('main-content');
        
        if (baustelle) {
            baustelle.style.opacity = '0';
            baustelle.classList.remove('melt');
        }
        if (uiInterface) uiInterface.classList.remove('visible');
        if (mainContent) mainContent.classList.remove('blur-out');
        
        resetKPIs();
    }

    function resetKPIs() {
        const uiInterface = document.getElementById('interface-container');
        if (uiInterface) uiInterface.classList.remove('kpi-visible');
        resetClimax();
    }

    function resetClimax() {
        const uiInterface = document.getElementById('interface-container');
        const grid = document.getElementById('grid-background');
        if (uiInterface) uiInterface.classList.remove('climax-active');
        if (grid) grid.classList.remove('visible');
    }

    // Madness section pinning logic removed for Tick++
    // --- SECTION 3: THE MODULAR (STEPPED SEQUENCE) ---
    let currentModularStep = 1;
    let isModularAnimating = false;
    let isInModularSection = false;

    // DOM References for Section 3
    const modSlides = [
        document.getElementById('slide-0'),
        document.getElementById('slide-1'),
        document.getElementById('slide-2'),
        document.getElementById('slide-3')
    ];
    const modCounter = document.getElementById('counter');
    const modCounterLabel = document.getElementById('counter-label');
    const modPanelsGrid = document.getElementById('panels-grid');
    const modPanels = document.querySelectorAll('.panel');
    const modQuoteSlam = document.getElementById('quote-slam');
    const modProofLabel = document.getElementById('proof-label');
    const modProofFrame = document.getElementById('proof-frame');
    const modProofVideo = document.getElementById('proof-video');

    const modJourneyLine = document.getElementById('journey-line');
    const modDropPoint = document.getElementById('drop-point');
    const modDropPointRing = document.getElementById('drop-point-ring');
    const modConnectors = document.querySelectorAll('.connector');
    const modBarFills = document.querySelectorAll('.bar-fill');

    function advanceModular() {
        if (isModularAnimating) return;
        if (currentModularStep === 1) showBaukasten();
        else if (currentModularStep === 2) startMerge();
        else if (currentModularStep === 3) showReduction();
        else if (currentModularStep === 4) showProof();
        if (currentModularStep < 5) currentModularStep++;
    }

    function reverseModular() {
        if (isModularAnimating) return;
        if (currentModularStep <= 1) return;
        currentModularStep--;
        if (currentModularStep === 1) resetToTick1();
        else if (currentModularStep === 2) resetToBaukasten();
        else if (currentModularStep === 3) resetToMerge();
        else if (currentModularStep === 4) resetToReduction();
    }

    // TICK 1 Logic
    function initTick1() {
        // High-End Counter Sequence
        gsap.killTweensOf([modCounter, modCounterLabel]);
        
        modCounter.textContent = "0000";
        gsap.set(modCounterLabel, { opacity: 0, y: 15 });

        // Phase 1: Heavy Entry with Blur-Shift
        gsap.fromTo(modCounter,
            { opacity: 0, y: 50, scale: 0.95, filter: "blur(20px)" }, // Start from depth
            { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "expo.out" }
        );

        // Phase 2: Precise High-Performance Counting
        const obj = { val: 0 };
        gsap.to(obj, {
            val: 9168,
            duration: 2.2, // Slower for more weight and clarity
            delay: 0.5,
            ease: "power4.inOut", // Starts clinical, builds speed, settles smoothly
            onUpdate: () => {
                modCounter.textContent = Math.round(obj.val).toString().padStart(4, '0');
            },
            onComplete: () => {
                // Phase 3: Secondary Information reveal
                gsap.to(modCounterLabel, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" });
                
                // Polish: Subtle Impact Pulse
                gsap.to(modCounter, { scale: 1.01, duration: 0.1, yoyo: true, repeat: 1, ease: "sine.inOut" });
            }
        });
    }

    function showBaukasten() {
        isModularAnimating = true;
        gsap.to(modSlides[0], {
            opacity: 0, duration: 0.4, ease: 'power2.in',
            onComplete() {
                modSlides[0].classList.add('off');
                modSlides[1].classList.remove('off');
                modSlides[1].classList.add('active');
                gsap.set(modSlides[1], { opacity: 1 });
                animatePanels();
            }
        });
    }

    function animatePanels() {
        const tl = gsap.timeline({ onComplete: () => { isModularAnimating = false; } });
        modPanels.forEach((panel, i) => {
            tl.to(panel, { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out' }, i * 0.2);
            tl.add(() => panel.classList.add('visible'), i * 0.2 + 0.1);
        });
        tl.add(animateSVGs, 0.6);
    }

    function animateSVGs() {
        modConnectors.forEach((line, i) => {
            gsap.to(line, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut', delay: i * 0.2 });
        });
        gsap.to(modJourneyLine, {
            strokeDashoffset: 0,
            duration: 1.0,
            ease: 'power2.inOut',
            onComplete() {
                gsap.to(modDropPoint, { r: 6, duration: 0.25, ease: 'back.out(2)' });
                gsap.to(modDropPointRing, { r: 14, opacity: 0, duration: 0.6, ease: 'power2.out' });
            }
        });
        modBarFills.forEach((fill) => {
            const pct = parseInt(fill.dataset.pct, 10);
            const blocks = Math.round(pct / 10);
            let current = 0;
            const interval = setInterval(() => {
                fill.textContent = '█'.repeat(current) + '░'.repeat(10 - current);
                current++;
                if (current > blocks) clearInterval(interval);
            }, 80);
        });
    }

    function startMerge() {
        isModularAnimating = true;
        modPanelsGrid.classList.add('merged');
        setTimeout(() => {
            gsap.set(modQuoteSlam, { opacity: 0, scale: 1.1 });
            modQuoteSlam.classList.add('slammed');
            gsap.to(modQuoteSlam, { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(1.5)' });
            isModularAnimating = false;
        }, 680);
    }

    function showReduction() {
        modSlides[1].classList.add('off');
        modSlides[1].classList.remove('active');
        modSlides[2].classList.remove('off');
        modSlides[2].classList.add('active');
        gsap.set(modSlides[2], { opacity: 1 });

        const flash = document.createElement('div');
        flash.style.cssText = "position:fixed;inset:0;background:#fff;z-index:9999;pointer-events:none;opacity:1;";
        document.body.appendChild(flash);
        gsap.to(flash, { opacity: 0, duration: 0.2, onComplete: () => flash.remove() });
    }

    function showProof() {
        isModularAnimating = true;
        gsap.to(modSlides[2], {
            opacity: 0, 
            duration: 0.35,
            onComplete() {
                modSlides[2].classList.add('off');
                modSlides[3].classList.remove('off');
                modSlides[3].classList.add('active');
                gsap.set(modSlides[3], { opacity: 1 });
                
                // Reset label and make visible
                modProofLabel.textContent = "";
                modProofLabel.classList.add('visible');

                // Typewriter effect
                gsap.to(modProofLabel, {
                    duration: 1.5,
                    text: "> INTERFACE_DEMO: tinder_study.fig",
                    ease: "none",
                    onComplete: () => {
                        // After typing, show video
                        setTimeout(() => {
                            modProofFrame.classList.add('visible');
                            modProofVideo.play();
                            isModularAnimating = false;
                        }, 200);
                    }
                });
            }
        });
    }

    // Reset Functions
    function resetToTick1() {
        modSlides.forEach(s => { s.classList.add('off'); s.classList.remove('active'); });
        modSlides[0].classList.remove('off');
        modSlides[0].classList.add('active');
        gsap.set(modSlides[0], { opacity: 1 });
        modCounter.textContent = "0000";
        modCounterLabel.style.opacity = "0";
    }

    function resetToBaukasten() {
        modSlides.forEach(s => { s.classList.add('off'); s.classList.remove('active'); });
        modSlides[1].classList.remove('off');
        modSlides[1].classList.add('active');
        modPanelsGrid.classList.remove('merged');
        modQuoteSlam.classList.remove('slammed');
        modPanels.forEach(p => { p.classList.remove('visible'); p.style.opacity = "1"; });
        // Reset SVGs
        [modJourneyLine, ...modConnectors].forEach(el => el.style.strokeDashoffset = "400");
        modDropPoint.setAttribute('r', '0');
    }

    function resetToMerge() {
        modSlides.forEach(s => { s.classList.add('off'); s.classList.remove('active'); });
        modSlides[1].classList.remove('off');
        modSlides[1].classList.add('active');
        modPanelsGrid.classList.add('merged');
        modQuoteSlam.classList.add('slammed');
    }

    function resetToReduction() {
        modSlides.forEach(s => { s.classList.add('off'); s.classList.remove('active'); });
        modSlides[2].classList.remove('off');
        modSlides[2].classList.add('active');
        gsap.set(modSlides[2], { opacity: 1 });
        
        // Cleanup Slide 3
        modProofLabel.classList.remove('visible');
        modProofLabel.textContent = "";
        modProofFrame.classList.remove('visible');
        modProofVideo.pause();
    }

    // Modular section ScrollTrigger logic removed for Tick++




class DataCanvas {
    constructor() {
        this.canvas = document.getElementById('data-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.state = 'IDLE'; // IDLE, NOISE, SINE, COLLAPSE, HEARTBEAT

        this.lineY = this.canvas.height / 2;
        this.collapseFactor = 1; // 1 to 0
        this.pulseSize = 1;
        this.time = 0;

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.lineY = this.canvas.height / 2;
    }

    update() {
        if (this.state === 'IDLE' || !this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.05;

        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        if (this.state === 'NOISE') {
            this.drawNoise();
        } else if (this.state === 'SINE') {
            this.drawSine();
        } else if (this.state === 'COLLAPSE') {
            this.drawCollapse();
        } else if (this.state === 'HEARTBEAT') {
            this.drawHeartbeat();
        }

        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    drawNoise() {
        const step = 20;
        this.ctx.moveTo(0, this.lineY);
        for (let x = 0; x < this.canvas.width; x += step) {
            const y = this.lineY + (Math.random() - 0.5) * 200;
            this.ctx.lineTo(x, y);
        }
    }

    drawSine() {
        const step = 5;
        this.ctx.moveTo(0, this.lineY);
        for (let x = 0; x < this.canvas.width; x += step) {
            const y = this.lineY + Math.sin(x * 0.02 + this.time) * 50;
            this.ctx.lineTo(x, y);
        }
    }

    drawCollapse() {
        if (this.collapseFactor > 0) this.collapseFactor -= 0.02;
        const centerX = this.canvas.width / 2;

        const step = 5;
        this.ctx.moveTo(centerX - (centerX * this.collapseFactor), this.lineY);
        for (let x = 0; x < this.canvas.width; x += step) {
            const relativeX = (x - centerX) * this.collapseFactor;
            const y = this.lineY + Math.sin(x * 0.02 + this.time) * 50 * this.collapseFactor;
            this.ctx.lineTo(centerX + relativeX, y);
        }

        if (this.collapseFactor <= 0.01) {
            this.state = 'HEARTBEAT';
        }
    }

    drawHeartbeat() {
        const centerX = this.canvas.width / 2;
        const pulse = Math.abs(Math.sin(this.time * 2));

        // Increased size: base 10 + pulse amp 20
        this.pulseSize = 50 + pulse * 20;

        // Add stronger glow specifically for the heartbeat
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#FFFFFF';

        this.ctx.beginPath();
        this.ctx.arc(centerX, this.lineY, this.pulseSize, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
    }
}

class Presentation {
    constructor() {
        this.currentTick = 22; // Offset for Projekt B following Phase 1 completion at Tick 22
        this.isTransitioning = false;

        // DOM Elements
        this.flashOverlay = document.getElementById('flash-overlay');
        this.phoneFrame = document.getElementById('phone-frame');
        this.overlayLeft = document.getElementById('overlay-left');
        this.overlayRight = document.getElementById('overlay-right');
        this.filterBox = document.getElementById('filter-box');
        this.matchcutOverlay = document.getElementById('matchcut-overlay');
        this.matchcutVideo1 = document.getElementById('matchcut-video-1');
        this.matchcutVideo2 = document.getElementById('matchcut-video-2');
        this.terminalScreen = document.getElementById('terminal-screen');
        this.terminalContent = document.getElementById('terminal-content');
        this.clashContainer = document.getElementById('clash-container');
        this.chairWell = document.getElementById('chair-well');
        this.errorContainer = document.getElementById('error-container');
        this.blueprintSvg = document.getElementById('blueprint-svg');
        this.rebootToggle = document.getElementById('reboot-toggle');
        this.toggleStatus = this.rebootToggle ? this.rebootToggle.querySelector('.toggle-status') : null;
        this.chromaticFilter = document.getElementById('chromatic-aberration');
        this.feOffsets = this.chromaticFilter ? this.chromaticFilter.querySelectorAll('feOffset') : [];
        this.zoomContainer = document.getElementById('zoom-container');
        this.realityCheck = document.getElementById('reality-check');
        this.grindTerminal = document.getElementById('grind-terminal');
        this.bracketBox = document.getElementById('bracket-box');
        this.mountTerminal = document.getElementById('mount-terminal');
        this.mountContent = document.getElementById('mount-content');
        this.foundationLine = document.getElementById('foundation-line');
        this.finalText = document.getElementById('final-text');
        this.dataCanvas = new DataCanvas();

        this.chairInterval = null;
        this.chairCount = 0;

        // Three.js State
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.room = null; // Legacy room, now replaced by wormhole
        this.wormhole = null;
        this.wormholeState = 'CALM'; 
        this.wormholeIntensity = 0;
        this.models = [];

        this.initThree();
        // Removed initEventListeners() call as it was unified in the main controller
    }

    initThree() {
        const canvas = document.getElementById('three-canvas');
        if (!canvas) return;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Replacement for wireframe room: The Dynamic Wormhole
        const pathPoints = [];
        const segmentLength = 150;
        const totalSegments = 12; // More segments for depth
        for (let i = 0; i < totalSegments; i++) {
            pathPoints.push(new THREE.Vector3(0, 0, -i * segmentLength));
        }
        this.wormholeCurve = new THREE.CatmullRomCurve3(pathPoints);
        const geometry = new THREE.TubeGeometry(this.wormholeCurve, 120, 50, 20, false);
        const material = new THREE.MeshBasicMaterial({
            color: 0x39FF14, 
            wireframe: true, 
            side: THREE.BackSide, 
            transparent: true, 
            opacity: 0.25
        });
        this.wormhole = new THREE.Mesh(geometry, material);
        this.wormhole.visible = false;
        this.scene.add(this.wormhole);

        // Store original positions for deformation
        this.wormholeBasePos = geometry.attributes.position.array.slice();

        this.camera.position.z = 10;
        this.scene.add(this.camera);
        this.animate();
    }

    async nextTick() {
        this.currentTick++;
        switch (this.currentTick) {
            case 23: await this.transitionToTick1(); break;
            case 24: 
                if (this.overlayLeft) this.overlayLeft.classList.add('active'); 
                this.wormholeState = 'CALM';
                gsap.to(this, { wormholeIntensity: 0, duration: 1 });
                break;
            case 25: 
                if (this.overlayRight) this.overlayRight.classList.add('active'); 
                break;
            case 26: 
                this.startChaos(); 
                this.wormholeState = 'CHAOS';
                gsap.to(this, { wormholeIntensity: 1, duration: 1.5, ease: "power2.inOut" });
                // Hide overlays during noise
                if (this.overlayLeft) this.overlayLeft.classList.remove('active');
                if (this.overlayRight) this.overlayRight.classList.remove('active');
                break;
            case 27: 
                this.applyFilter(); 
                this.wormholeState = 'NEUTRALIZED';
                // Smooth beruhigen over 2 seconds
                gsap.to(this, { wormholeIntensity: 0, duration: 2.0, ease: "power2.inOut" });
                break;
            case 28: this.doMatchcut(); break;
            case 29: this.centerPoster(); break;
            case 30: await this.showConclusion(); break;
            case 31: 
                zoomInMasterTimeline(31); 
                break;
            case 32: 
                this.cleanupPreviousSections(); 
                // Ensure black background
                gsap.to(document.body, { backgroundColor: '#000', duration: 0.5 });
                break;
            case 33: this.showDeadpanZero(); break;
            case 34: this.showAnalogInfection(); break;
             case 35: this.startChairStorm(); break;
            case 36: this.startInfographicStorm(); break;
            case 37: this.startDataStorm(); break;
            case 38: this.showMotionSickness(); break;
            case 39: await this.showRebootSequence(); break;
            case 40: this.showRealityGrid(); break;
            case 41: this.showRealityCheck(); break; 
            case 42: this.showTrueValue(); break;
            case 43: this.showTunnelVision(); break;
            case 44: this.showDimOut(); break;
            // Buffer/dead space cases shifted (+1 further)
            case 49: this.showMountSequence(); break;
            case 50: this.showFile1(); break;
            case 51: this.showFile2(); break;
            case 52: this.showFileError(); break;
            case 53: this.showFinalVerification(); break;
            case 54: await this.showSystemPurge(); break;
            case 55: this.showFoundationLine(); break;
            case 56: /* Dummy Tick - Strategic Pause */ break;
            case 57: this.showMicDrop(); break;
            case 58: this.showSystemFreeze(); break;
        }
    }

    cleanupPreviousSections() {
        const ids = [
            'three-canvas', 'overlay-left', 'overlay-right',
            'filter-box', 'matchcut-overlay', 'data-canvas', 'terminal-screen'
        ];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                gsap.to(el, { opacity: 0, duration: 0.8, onComplete: () => { el.style.display = 'none'; } });
            }
        });
        if (this.dataCanvas) this.dataCanvas.state = 'IDLE';
    }

    showDeadpanZero() {
        this.cleanupPreviousSections();
        if (this.clashContainer) {
            this.clashContainer.className = 'active tick-8';
        }
    }

    showAnalogInfection() {
        if (this.clashContainer) {
            this.clashContainer.className = 'active tick-9';
        }
    }

    startChairStorm() {
        if (this.chairInterval) return;

        const chairList = [
            "1 1 of 1.webp", "10 1 of 1.webp", "2 1 of 1.webp", "3 1 of 1.webp", "4 1 of 1.webp", "5 1 of 1.webp", "7 1 of 1.webp",
            "bad__mid_oben31.webp", "bad_bad_hinten_links2.webp", "bad_bad_vorn_links30.webp", "bad_bad_vorne10.webp",
            "bad_bad_vorne20.webp", "bad_bad_vorne21.webp", "bad_bad_vorne_links11.webp", "bad_bad_vorne_links2.webp",
            "bad_bad_vorne_rechts22.webp", "bad_good_draufsicht3.webp", "bad_good_seitlich4.webp", "bad_good_vorn_rechts31.webp",
            "bad_good_vorne_links22.webp", "bad_mid_oben30.webp", "bad_mid_seitlich6.webp", "bad_mid_vorne_links20.webp",
            "bad_mid_vorne_links6.webp", "good_hinten_rechts21.webp", "good_oben_6.webp", "good_oben_rechts20.webp",
            "good_seitlich20.webp", "good_seitlich30.webp", "good_unten20.webp", "good_unten31.webp", "good_unten6.webp",
            "good_vorn.webp", "good_vorn30.webp", "good_vorn_rechts32.webp", "good_vorne6.webp", "good_vorne7.webp",
            "good_vorne8.webp", "good_vorne_links12.webp", "good_vorne_links21.webp", "good_vorne_links3.webp",
            "good_vorne_links7.webp", "good_vorne_links_hq.webp", "good_vorne_rechts20.webp", "good_vorne_rechts21.webp",
            "mid_bad_draufsicht.webp", "mid_good_ hinten_rechts30.webp", "mid_good_draufsicht2.webp", "mid_good_hinten_links.webp",
            "mid_good_hinten_links6.webp", "mid_hinten_rechts20.webp", "mid_mid_hinten_links20.webp", "mid_oben20.webp",
            "mid_oben_7.webp", "mid_seitlich.webp", "mid_seitlich2.webp", "mid_seitlich21.webp", "mid_seitlich3.webp",
            "mid_seitlich7.webp", "mid_unten.webp", "mid_unten30.webp", "mid_vorn31.webp", "mid_vorn_links31.webp",
            "mid_vorn_links32.webp", "mid_vorn_rechts33.webp", "mid_vorne9.webp", "mid_vorne_links9.webp",
            "mid_vorne_rechts.webp", "mid_vorne_rechts14.webp", "mid_vorne_rechts2.webp", "mid_vorne_rechts3.webp",
            "mid_vorne_rechts4.webp", "mid_vorne_rechts6.webp", "mid_vorne_rechts7.webp"
        ];

        this.chairInterval = setInterval(() => {
            if (this.chairCount >= 100) {
                clearInterval(this.chairInterval);
                return;
            }
            const randomFile = chairList[Math.floor(Math.random() * chairList.length)];
            this.spawnChair(`assets/skizzen/${randomFile}`);
        }, 60);
    }
    showMotionSickness() {
        if (this.clashContainer) {
            this.clashContainer.classList.add('motion-sickness-active');
        }

        // Chromatic Aberration Jitter with GSAP
        if (this.feOffsets.length >= 2) {
            const redOffset = this.feOffsets[0];
            const blueOffset = this.feOffsets[1];

            this.chromaticTimeline = gsap.timeline({ repeat: -1 });
            this.chromaticTimeline.to({}, {
                duration: 0.1,
                onUpdate: () => {
                    const amt = 2 + Math.random() * 8;
                    redOffset.setAttribute('dx', amt);
                    blueOffset.setAttribute('dx', -amt);
                }
            });
        }

        // Container Shake
        gsap.to(this.clashContainer, {
            x: '+=4',
            y: '-=4',
            duration: 0.05,
            repeat: -1,
            yoyo: true,
            ease: "none"
        });
    }

    async showRebootSequence() {
        if (this.clashContainer) {
            this.clashContainer.classList.remove('motion-sickness-active');
            gsap.killTweensOf(this.clashContainer);
            this.cleanupClashStorm();
        }

        // --- STEP 1: POWER OFF (CUT TO BLACK) ---
        document.body.style.backgroundColor = '#000000';
        if (this.clashContainer) {
            gsap.set(this.clashContainer, { opacity: 0 });
            this.clashContainer.style.display = 'none';
        }

        if (this.rebootToggle) {
            this.rebootToggle.classList.remove('off');
            if (this.toggleStatus) this.toggleStatus.innerText = "POWER: ON";
            this.rebootToggle.style.display = 'flex';
            gsap.fromTo(this.rebootToggle, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
        }

        await new Promise(r => setTimeout(r, 400));

        // Flip to OFF
        if (this.rebootToggle) {
            this.rebootToggle.classList.add('off');
            if (this.toggleStatus) this.toggleStatus.innerText = "POWER: OFF";
        }

        // --- STEP 2: PAUSE IN THE VOID ---
        await new Promise(r => setTimeout(r, 1000));

        // --- STEP 3: POWER ON (RE-FLIP) ---
        if (this.rebootToggle) {
            this.rebootToggle.classList.remove('off');
            if (this.toggleStatus) this.toggleStatus.innerText = "POWER: ON";
        }

        await new Promise(r => setTimeout(r, 400));

        // --- STEP 4: WHITE OUT ---
        document.body.classList.add('white-reboot');
        if (this.zoomContainer) {
            this.zoomContainer.classList.add('white-mode', 'active');
            this.zoomContainer.style.display = 'block';
            gsap.set(this.zoomContainer, { opacity: 1 });
        }

        if (this.rebootToggle) {
            gsap.to(this.rebootToggle, { opacity: 0, duration: 0.2, onComplete: () => {
                this.rebootToggle.style.display = 'none';
            }});
        }
    }

    showBlankSlate() {
        // Redundant - Tick 39 now uses showRebootSequence
    }

    cleanupClashStorm() {
        if (this.chairInterval) clearInterval(this.chairInterval);
        if (this.infographicInterval) clearInterval(this.infographicInterval);
        if (this.dataStormInterval) clearInterval(this.dataStormInterval);
        if (this.chromaticTimeline) this.chromaticTimeline.kill();
    }

    showRealityGrid() {
        // --- TICK 40: GRID LABELS ON WHITE ---
        if (this.realityCheck) {
            this.realityCheck.style.display = 'none'; // Not built yet
        }

        const gridLines = document.getElementById('grid-lines');
        if (gridLines) {
            gridLines.style.opacity = '1';
            const lines = gridLines.querySelectorAll('.grid-line');
            if (lines.length === 0) {
                this.generateRealityGrid(gridLines);
            }
            const allLines = gridLines.querySelectorAll('.grid-line');
            allLines.forEach(l => {
                l.classList.add('white-mode');
                l.style.background = 'rgba(0,0,0,0.1)';
            });

            gsap.fromTo(allLines, 
                { opacity: 0, scaleX: 0, scaleY: 0 },
                { opacity: 1, scaleX: 1, scaleY: 1, duration: 1, stagger: 0.05, ease: "power2.out" }
            );
        }

        const gridLabels = document.getElementById('grid-labels');
        if (gridLabels) {
            gsap.to(gridLabels, { opacity: 1, duration: 1.5, delay: 0.5 });
            const serifs = gridLabels.querySelectorAll('.serif-label');
            serifs.forEach(s => s.style.color = '#333'); // Dark serif on white
        }
    }

    generateRealityGrid(container) {
        const cols = 10;
        const spacing = 100;
        const startX = (window.innerWidth - (cols * spacing)) / 2;
        const startY = (window.innerHeight - (10 * spacing)) / 2;

        for (let c = 0; c < 12; c++) {
            const line = document.createElement('div');
            line.className = 'grid-line';
            line.style.left = `${startX + c * spacing}px`;
            line.style.top = '0'; line.style.width = '1px'; line.style.height = '100%';
            line.style.background = 'rgba(57, 255, 20, 0.2)'; // Neon green for reality
            container.appendChild(line);
        }
        for (let r = 0; r < 12; r++) {
            const line = document.createElement('div');
            line.className = 'grid-line';
            line.style.top = `${startY + r * spacing}px`;
            line.style.left = '0'; line.style.height = '1px'; line.style.width = '100%';
            line.style.background = 'rgba(57, 255, 20, 0.2)';
            container.appendChild(line);
        }
    }

    showRealityCheck() {
        // --- TICK 41: BACK TO BLACK + GREEN BULLSHIT ---
        document.body.classList.remove('white-reboot');
        document.body.style.backgroundColor = '#050505';

        if (this.zoomContainer) {
            this.zoomContainer.classList.remove('white-mode');
            this.zoomContainer.style.backgroundColor = '#050505';
            gsap.to(this.zoomContainer, { backgroundColor: '#050505', duration: 0.5 });
            
            // Cleanup UI for transition
            const gl = document.getElementById('grid-lines');
            if (gl) gl.style.display = 'none';
            const glabels = document.getElementById('grid-labels');
            if (glabels) glabels.style.display = 'none';
            
            // Hide previous spawned elements
            document.querySelectorAll('.spawned-chair, .spawned-infographic').forEach(c => c.style.display = 'none');
        }

        // Force background cut on body just in case
        gsap.set(document.body, { backgroundColor: '#050505' });

        // Grid Lines back to Neon (if ever reused)
        const lines = document.querySelectorAll('.grid-line');
        lines.forEach(l => {
            l.classList.remove('white-mode');
            l.style.background = 'rgba(57, 255, 20, 0.15)';
        });

        // Labels back to Green/Gray
        const labels = document.querySelectorAll('.serif-label');
        labels.forEach(s => s.style.color = '#666');

        if (this.clashContainer) this.clashContainer.style.display = 'none';

        if (this.realityCheck) {
            this.realityCheck.classList.remove('white-mode');
            this.realityCheck.style.display = 'block';
            this.realityCheck.style.color = '#39FF14'; 
            gsap.fromTo(this.realityCheck, { scale: 1.5, opacity: 0 }, { 
                scale: 1, 
                opacity: 1, 
                duration: 0.8, 
                ease: "back.out(2)" 
            });
        }
    }

    showBlueprint() {
        // Obsolete
    }

    showFakeLuftschloss() {
        // Obsolete
    }

    showFatalErrors() {
        // Obsolete but kept for logic safety until fully shifted
    }

    async showTrueValue() {
        if (this.realityCheck) this.realityCheck.style.display = 'none';
        if (this.grindTerminal) this.grindTerminal.style.display = 'block';

        const t1 = document.getElementById('grind-text-1');
        const t2 = document.getElementById('grind-text-2');
        const bar = document.getElementById('grind-bar');

        if (t1) await this.typeToElement(t1, ">  EXECUTING: 90_DAYS_GRIND.exe");

        // Bar progress
        if (bar) {
            const total = 20;
            for (let i = 0; i <= total; i++) {
                const perc = Math.floor((i / total) * 100);
                bar.innerText = `> [${'█'.repeat(i)}${' '.repeat(total - i)}] ${perc}% COMPLETE`;
                await new Promise(r => setTimeout(r, 70));
            }
        }

        if (t2) {
            await new Promise(r => setTimeout(r, 300));
            await this.typeToElement(t2, "> RESULT: FRUSTRATION_TOLERANCE_MAXED");
        }
    }

    async typeToElement(el, text) {
        el.innerText = "";
        const formattedText = this.formatPrompt(text);
        for (let char of formattedText) {
            el.innerText += char;
            await new Promise(r => setTimeout(r, 30));
        }
    }

    async showTunnelVision() {
        if (this.grindTerminal) this.grindTerminal.style.display = 'none';
        if (this.bracketBox) {
            this.bracketBox.style.display = 'block';
            setTimeout(() => this.bracketBox.classList.add('active'), 100);
        }

        const bText = document.getElementById('bracket-text');
        if (bText) {
            await new Promise(r => setTimeout(r, 1500));
            await this.typeToElement(bText, "> NOISE: 0%\n> CLARITY: ACHIEVED");
            bText.style.opacity = '1';
        }
    }

    showDimOut() {
        document.body.classList.add('dimmed');
    }

    async showMountSequence() {
        // Cleanup Section 5 elements
        if (this.bracketBox) this.bracketBox.style.display = 'none';
        const bText = document.getElementById('bracket-text');
        if (bText) bText.innerText = '';

        document.body.style.filter = "brightness(0.4)";
        if (this.mountTerminal) this.mountTerminal.classList.add('active');
        
        await this.addLineToTerminal("> mount /dev/box_grundstudium", true);
        await new Promise(r => setTimeout(r, 400));
        await this.addLineToTerminal("> ls -la", true);
    }

    async showFile1() {
        await this.addLineToTerminal("[FILE_01] : USER_GUIDE.pdf ...... (Strategy && Reduction)");
    }

    async showFile2() {
        await this.addLineToTerminal("[FILE_02] : TECH_SPECS.pdf ...... (Signal Processing && Space)");
    }

    async showFileError() {
        const line = await this.addLineToTerminal("[FILE_03] : THE_ERROR_LOG.pdf ... (Analog Crash && Frustration)");
        if (line) {
            line.classList.add('glitch-line');
            setTimeout(() => line.classList.remove('glitch-line'), 300);
        }
    }

    async showFinalVerification() {
        const bootLines = [
            "> VERIFYING: PRAGMATISM ............ [ OK ]",
            "> VERIFYING: FRUSTRATION_TOLERANCE . [ OK ]",
            "> SYSTEM_STATUS: BASICS_COMPLETED"
        ];

        for (let lineText of bootLines) {
            await this.addLineToTerminal(lineText, true, 20); // Faster printing
        }

        if (this.mountTerminal) {
            setTimeout(() => this.mountTerminal.classList.add('framed'), 100);
        }
    }

    async showSystemPurge() {
        await this.addLineToTerminal("> unmount /dev/box_grundstudium", true, 10);
        await this.addLineToTerminal("> clear", true, 10);
        
        setTimeout(() => {
            if (this.mountContent) this.mountContent.innerHTML = '';
            if (this.mountTerminal) {
                this.mountTerminal.classList.remove('active', 'framed');
                this.mountTerminal.style.display = 'none';
            }
            document.body.style.filter = "brightness(0.05)";
        }, 300);
    }



    showFoundationLine() {
        if (this.foundationLine) this.foundationLine.style.width = '100%';
    }

    showMicDrop() {
        // Instant Brightness Shock
        document.body.classList.add('shock-brightness');
        document.body.style.backgroundColor = '#050505';
        
        // Hide previous elements
        if (this.foundationLine) this.foundationLine.style.display = 'none';
        
        // Show Final Text
        if (this.finalText) {
            this.finalText.classList.add('active');
        }
    }

    showSystemFreeze() {
        document.body.classList.add('freeze');
        console.log("SYSTEM FREEZE : NARRATIVE COMPLETED.");
    }

    async addLineToTerminal(text, isGreen = false, speed = 40) {
        if (!this.mountContent) return null;
        const line = document.createElement('div');
        line.className = 'terminal-line' + (isGreen ? ' green' : '');
        this.mountContent.appendChild(line);
        
        const formattedText = this.formatPrompt(text);
        for (let char of formattedText) {
            line.innerText += char;
            await new Promise(r => setTimeout(r, speed + Math.random() * 20));
        }
        return line;
    }

    formatPrompt(text) {
        if (!text) return text;
        return text.split('\n').map(line => {
            if (line.trimStart().startsWith('>') && !line.includes('> [') && !line.includes('> ')) {
                return line.replace('>', '> ');
            }
            // Collapse multiple spaces after prompt to one, except for bracket case
            if (line.includes('>  ') && !line.includes('> [')) {
                return line.replace('>  ', '> ');
            }
            return line;
        }).join('\n');
    }

    spawnChair(src) {
        const chair = document.createElement('img');
        chair.src = src;
        chair.className = 'spawned-chair';

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const rot = (Math.random() - 0.5) * 360;
        const size = 150 + Math.random() * 300;
        const z = Math.floor(Math.random() * 100);

        chair.style.left = `${x}%`;
        chair.style.top = `${y}%`;
        chair.style.width = `${size}px`;
        chair.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
        chair.style.zIndex = z;

        if (this.chairWell) this.chairWell.appendChild(chair);
        this.chairCount++;
    }

    startInfographicStorm() {
        if (this.infographicInterval) return;

        const infoList = [
            "AnatomieBestattungsrechnung.webp", "SozialMedia.webp", "aquamation.webp", "aquamation2.webp", "aquamation3.webp",
            "bestattungsrechnung3.webp", "bestattungsrechnung4.webp", "bestatungsrechnung.webp", "bestatungsrechnung2.webp",
            "betsattungsarten.webp", "betsattungsarten2.webp", "epidemiologischeWende.webp", "epidemiologischeWende2.webp",
            "epidemiologischeWende3.webp", "epidemiologischeWende4.webp", "epidemiologischeWende5.webp", "epidemiologischeWende6.webp",
            "erd.webp", "erdbestattung 4.webp", "erdbestattung.webp", "erdbestattung2.webp", "erdbestattung3.webp",
            "feuer.webp", "feuerbestattung.webp", "kompostierung.webp", "körperKompostierung.webp", "körperKompostierung2.webp",
            "necrotecture.webp", "necrotecture2.webp", "necrotecture3.webp", "promession.webp", "promession2.webp",
            "rechnung_bestattungskosten_sketch.webp", "socialmedia_sketch.webp", "trauerfarben.webp", "uebersicht.webp",
            "uebersicht2.webp", "verglecih_feuer_sarg_wald.webp", "verglecih_feuer_sarg_wald2.webp", "verglecih_feuer_sarg_wald3.webp",
            "wald.webp", "waldbestattung.webp", "waldbestattung2.webp", "weltalbestattung2.webp", "weltraum.webp",
            "weltraumbestattung.webp", "weltraumbestattung2.webp", "ökobilanzGrabstein.webp", "übersicht.webp"
        ];

        this.infographicCount = 0;
        this.infographicInterval = setInterval(() => {
            if (this.infographicCount > 50) return; // Cap density
            const file = infoList[Math.floor(Math.random() * infoList.length)];
            this.spawnInfographic(`assets/infografik/${file}`);
        }, 120);
    }

    spawnInfographic(src) {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'spawned-infographic'; // Reusing style for consistency

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const rot = (Math.random() - 0.5) * 45;
        const size = 300 + Math.random() * 400;
        const z = 200 + Math.floor(Math.random() * 100); // Always on top of chairs

        img.style.left = `${x}%`;
        img.style.top = `${y}%`;
        img.style.width = `${size}px`;
        img.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
        img.style.zIndex = z;

        if (this.chairWell) this.chairWell.appendChild(img);
        this.infographicCount++;
    }

    startDataStorm() {
        if (this.dataStormInterval) return;

        const dataList = [
            "20241021_122148 (1).webp", "20241021_151504 (1).webp",
            "DSC01115.webp", "Screenshot 2025-03-03 174927.webp",
            "no1.2_scan.webp", "no10_scan.webp", "no11_scan.webp",
            "no12_scan.webp", "no1_scan.webp", "no3_scan.webp",
            "no4_scan.webp", "no5_scan.webp", "no6_scan.webp",
            "no8_scan.webp", "no9_scan.webp"
        ];

        this.dataCount = 0;
        this.dataStormInterval = setInterval(() => {
            if (this.dataCount > 40) return; // Cap density
            const file = dataList[Math.floor(Math.random() * dataList.length)];
            this.spawnDataImage(`assets/datauriso/${file}`);
        }, 150);
    }

    spawnDataImage(src) {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'spawned-infographic'; // Reuse logic/animation

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const rot = (Math.random() - 0.5) * 30;
        const size = 400 + Math.random() * 500;
        const z = 300 + Math.floor(Math.random() * 100); // On top of infographics

        img.style.left = `${x}%`;
        img.style.top = `${y}%`;
        img.style.width = `${size}px`;
        img.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
        img.style.zIndex = z;

        if (this.chairWell) this.chairWell.appendChild(img);
        this.dataCount++;
    }

    showFatalErrors() {
        if (this.chairInterval) clearInterval(this.chairInterval);

        const errors = [
            { text: "[SYS_EVAL: FALSE // BULLSHIT]", class: "error-box-1", rot: -2 },
            { text: "[ERR: INTERFACE_NOT_FOUND]", class: "error-box-2", rot: 1 },
            { text: "[WARN: EMPTY_CALORIES_DETECTED]", class: "error-box-3", rot: -1.5 }
        ];

        errors.forEach((err, i) => {
            setTimeout(() => {
                const box = document.createElement('div');
                box.className = `error-box ${err.class}`;
                box.style.setProperty('--rot', `${err.rot}deg`);

                // Header with symbols
                const header = document.createElement('div');
                header.className = 'error-header';
                header.innerHTML = `<span>[!] SYSTEM_CRITICAL</span><span>X</span>`;

                // Content
                const content = document.createElement('div');
                content.className = 'error-content';
                content.innerText = err.text;

                box.appendChild(header);
                box.appendChild(content);

                if (this.errorContainer) this.errorContainer.appendChild(box);
            }, i * 250);
        });
    }

    centerPoster() {
        if (this.matchcutOverlay) {
            this.matchcutOverlay.style.setProperty('--offset-x', '0px');
            this.matchcutOverlay.style.setProperty('--offset-y', '0px');
        }
    }

    showDualShot() {
        if (this.matchcutOverlay) {
            this.matchcutOverlay.classList.add('dual-shot');
            if (this.matchcutVideo2) this.matchcutVideo2.play();
        }
    }

    prepareStage() {
        // Ambient wormhole reveal
        if (this.wormhole) {
            this.wormhole.visible = true;
            this.wormhole.material.opacity = 0;
            gsap.to(this.wormhole.material, { opacity: 0.25, duration: 3, ease: "power2.inOut" });
            this.wormholeState = 'CALM';
        }
    }

    async transitionToTick1() {
        this.isTransitioning = true;
        if (this.phoneFrame) this.phoneFrame.classList.add('rotate-out');
        
        // Satisfying build-up: Models start loading/appearing
        this.triggerFlash();
        const t1 = document.getElementById('tick-1');
        if (t1) gsap.to(t1, { opacity: 0, duration: 0.5, onComplete: () => { t1.style.display = 'none'; } });
        
        this.loadModels();
        this.isTransitioning = false;
    }

    startChaos() {
        if (this.dataCanvas && this.dataCanvas.canvas) this.dataCanvas.canvas.classList.add('active');
        if (this.dataCanvas) this.dataCanvas.state = 'NOISE';
        if (this.overlayLeft) this.overlayLeft.classList.add('glitch');
        if (this.overlayRight) this.overlayRight.classList.add('glitch');
    }

    applyFilter() {
        if (this.dataCanvas) this.dataCanvas.state = 'SINE';
        if (this.overlayLeft) this.overlayLeft.classList.remove('glitch');
        if (this.overlayRight) this.overlayRight.classList.remove('glitch');
        if (this.filterBox) this.filterBox.classList.add('active');
    }

    doMatchcut() {
        this.isTransitioning = true;
        if (this.dataCanvas) this.dataCanvas.state = 'COLLAPSE';

        // Hide scene and formula
        const toFade = [
            document.getElementById('three-canvas'),
            this.overlayLeft,
            this.overlayRight,
            this.filterBox
        ];
        toFade.forEach(el => {
            if (el) el.classList.add('fade-out-all');
        });

        setTimeout(() => {
            if (this.matchcutOverlay) this.matchcutOverlay.classList.add('active');
            if (this.matchcutVideo1) this.matchcutVideo1.play();
            this.isTransitioning = false;
        }, 1000);

        // Hide the dot after 2 seconds of matchcut
        setTimeout(() => {
            if (this.dataCanvas) {
                this.dataCanvas.state = 'IDLE';
                if (this.dataCanvas.canvas) this.dataCanvas.canvas.classList.remove('active');
            }
        }, 3000); // 1000ms delay for matchcut start + 2000ms duration
    }

    async showConclusion() {
        if (this.matchcutOverlay) this.matchcutOverlay.classList.remove('active');
        if (this.dataCanvas && this.dataCanvas.canvas) this.dataCanvas.canvas.classList.remove('active');
        if (this.terminalScreen) this.terminalScreen.classList.add('active');

        const lines = ["> FOCUS: CODE", "> FOCUS: UX"];
        for (let line of lines) {
            await this.typeLine(line);
            if (this.terminalContent) this.terminalContent.innerHTML += "\n";
            await new Promise(r => setTimeout(r, 600)); // Smooth pause between lines
        }
    }

    async typeLine(text) {
        const formattedText = this.formatPrompt(text);
        for (let char of formattedText) {
            if (this.terminalContent) this.terminalContent.innerHTML += char;
            await new Promise(r => setTimeout(r, 40 + Math.random() * 60));
        }
    }

    triggerFlash() {
        if (!this.flashOverlay) return;
        this.flashOverlay.style.opacity = '1';
        setTimeout(() => {
            this.flashOverlay.style.transition = 'opacity 0.1s ease-out';
            this.flashOverlay.style.opacity = '0';
        }, 50);
    }

    loadModels() {
        const loader = new GLTFLoader();
        const modelNames = ['assets/distance_sensor_-_dummy.glb', 'assets/pir_sensor.glb', 'assets/pulse.glb'];
        const positions = [new THREE.Vector3(0, 0, -10), new THREE.Vector3(-8, 3, -12), new THREE.Vector3(8, -2, -12)];

        modelNames.forEach((name, index) => {
            loader.load(name, (gltf) => {
                const model = gltf.scene;
                model.traverse(c => { 
                    if (c.isMesh) {
                        c.material = new THREE.MeshBasicMaterial({ color: 0x39FF14, wireframe: true, transparent: true, opacity: 0 });
                    }
                });
                model.position.copy(positions[index]);
                model.scale.set(0, 0, 0); // Start from zero for satisfying entrance
                this.camera.add(model);
                
                const modelObj = {
                    mesh: model,
                    rotSpeed: { x: 0.002 + Math.random() * 0.002, y: 0.005, z: 0.001 }
                };
                this.models.push(modelObj);

                // Satisfying Digital Entrance Logic
                gsap.fromTo(model.scale, 
                    { x: 0, y: 0, z: 0 },
                    { 
                        x: 3, y: 3, z: 3, 
                        duration: 1.4, 
                        delay: index * 0.3, 
                        ease: "back.out(1.7)" // High-end mechanical snap
                    }
                );

                model.traverse(c => {
                    if (c.isMesh) {
                        // Digital pulse-in
                        gsap.fromTo(c.material, 
                            { opacity: 0 },
                            { 
                                opacity: 1, 
                                duration: 1, 
                                delay: index * 0.3,
                                onStart: () => {
                                    // Subtle flicker during construction
                                    gsap.to(c.material, { 
                                        opacity: 0.1, 
                                        duration: 0.05, 
                                        repeat: 5, 
                                        yoyo: true, 
                                        ease: "none" 
                                    });
                                }
                            }
                        );
                    }
                });
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const time = Date.now() * 0.001;

        if (this.wormhole && this.wormhole.visible) {
            // Forward movement - MUST match a periodicity in the noise
            const segmentDist = 150;
            this.wormhole.position.z += 0.8; 
            if (this.wormhole.position.z > segmentDist) this.wormhole.position.z -= segmentDist;

            // Vertex Deformation based on intensity
            const pos = this.wormhole.geometry.attributes.position;
            
            // Lerp between CALM (0) and CHAOS (1)
            // REDUCED INTENSITY: amp: 0.8 -> 3.5, freq: 2.0 -> 8.0
            const amp = 0.8 + (this.wormholeIntensity * 2.7); 
            const freq = 1.5 + (this.wormholeIntensity * 6.5); 

            // SEAMLESS PERIODICITY: k must be a multiple of (2 * PI / segmentDist)
            const k = (2 * Math.PI) / segmentDist; 

            for (let i = 0; i < pos.count; i++) {
                const bx = this.wormholeBasePos[i * 3];
                const by = this.wormholeBasePos[i * 3 + 1];
                const bz = this.wormholeBasePos[i * 3 + 2];

                // SPATIAL NOISE: use WORLD Z (bz + mesh.pos.z) for absolute seamless transition
                const worldZ = bz + this.wormhole.position.z;
                const noiseX = Math.sin(worldZ * k + time * freq) * amp;
                const noiseY = Math.cos(worldZ * k + time * freq) * amp;
                
                // Reduced Jitter
                const jitter = (this.wormholeIntensity > 0.5) ? (Math.random() - 0.5) * (this.wormholeIntensity * 1.5) : 0;
                
                pos.setX(i, bx + noiseX + jitter);
                pos.setY(i, by + noiseY + jitter);
            }
            pos.needsUpdate = true;

            // Visual Polish: Color Shifting / Pulsing based on Intensity
            if (this.wormholeIntensity > 0.1) {
                const wave = Math.sin(time * 12) * 0.5 + 0.5; // Slower pulse
                const chaosMod = this.wormholeIntensity;
                this.wormhole.material.color.setRGB(0.2 + (wave * 0.3 * chaosMod), 1.0, 0.2); 
                this.wormhole.material.opacity = 0.2 + (wave * 0.15 * chaosMod);
            } else {
                this.wormhole.material.color.setHex(0x39FF14);
                this.wormhole.material.opacity = 0.25;
            }

            this.models.forEach(m => {
                // Reduced jitter for models
                if (this.wormholeIntensity > 0.2) {
                    const jitterX = (Math.random() - 0.5) * this.wormholeIntensity * 0.1;
                    const jitterY = (Math.random() - 0.5) * this.wormholeIntensity * 0.1;
                    m.mesh.position.x += jitterX;
                    m.mesh.position.y += jitterY;
                }

                m.mesh.rotation.x += m.rotSpeed.x * (1 + this.wormholeIntensity * 2);
                m.mesh.rotation.y += m.rotSpeed.y * (1 + this.wormholeIntensity * 2);
                m.mesh.rotation.z += m.rotSpeed.z * (1 + this.wormholeIntensity * 2);
            });
        }
        if (this.dataCanvas) this.dataCanvas.update();
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }
}

presentationPhase2 = new Presentation();

});

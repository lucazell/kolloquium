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
            if (isAnimating || this.currentTick >= 19) return;
            this.currentTick++;
            isAnimating = true;
            this.executeTick();
        },
        executeTick: function() {
            const unlock = (delay = 1000) => setTimeout(() => { isAnimating = false; }, delay);
            switch(this.currentTick) {
                // Section 1: Intro
                case 1:
                    gsap.to("#intro-title", { opacity: 0, pointerEvents: "none", duration: 1 });
                    gsap.to("#timeline-line", { height: "15%", duration: 1 });
                    gsap.to("#node-2022", { opacity: 1, x: 10, duration: 0.5, delay: 0.5 });
                    gsap.to("#bio-img-agency", { opacity: 1, duration: 1 });
                    unlock(1000); break;
                case 2:
                    gsap.to("#timeline-line", { height: "55%", duration: 1 });
                    gsap.to("#node-2023", { opacity: 1, x: 10, duration: 0.5, delay: 0.5 });
                    gsap.to("#bio-img-agency", { opacity: 0, duration: 0.5 });
                    gsap.to("#bio-img-reset", { opacity: 1, duration: 0.5, delay: 0.5 });
                    unlock(1000); break;
                case 3:
                    gsap.to("#timeline-line", { height: "95%", duration: 1 });
                    gsap.to("#node-2024", { opacity: 1, x: 10, duration: 0.5, delay: 0.5 });
                    gsap.to("#bio-img-reset", { opacity: 0, duration: 0.5 });
                    gsap.to("#bio-img-reality", { opacity: 1, duration: 0.5, delay: 0.5 });
                    unlock(1000); break;
                case 4:
                    gsap.to(["#timeline-line", ".timeline-node", "#bio-img-reality", "#timeline-rail"], {
                        opacity: 0, filter: "blur(10px)", duration: 0.5
                    });
                    gsap.to(["#sec-intro > div.w-2\\/5", "#sec-intro > div.w-3\\/5"], {
                        borderColor: "transparent", backgroundColor: "#000000", duration: 0.5
                    });
                    gsap.to("#intro-pragmatism", { opacity: 1, scale: 1, duration: 0.5 });
                    unlock(500); break;
                case 5:
                    gsap.to("#intro-pragmatism .char", {
                        y: () => 100 + Math.random() * 400,
                        x: () => (Math.random() - 0.5) * 200,
                        rotation: () => (Math.random() - 0.5) * 90,
                        opacity: 0, filter: "blur(10px)", duration: 2,
                        stagger: { amount: 0.8, from: "random" }
                    });
                    unlock(2000); break;
                case 6:
                    gsap.to(window, { scrollTo: "#sec-pro", duration: 1.5, ease: "power2.inOut", onComplete: () => {
                        document.getElementById("status-text").innerText = "STATUS: SYSTEM_MADNESS";
                        document.getElementById("status-dot").classList.replace("bg-neon", "bg-alert");
                        isAnimating = false;
                    }});
                    break;
                // Section 2: Pro Madness
                case 7: currentStep = 1; startDrawing(); unlock(1000); break;
                case 8: currentStep = 2; startCrosshair(); unlock(1500); break;
                case 9: currentStep = 3; startBanner(); unlock(1000); break;
                case 10: currentStep = 4; startReveal(); unlock(1500); break;
                case 11: currentStep = 5; startKPIs(); unlock(500); break;
                case 12: currentStep = 6; startClimax(); unlock(1000); break;
                // Section 3: Modular Sequence
                case 13:
                    gsap.to(window, { scrollTo: "#sec-modular", duration: 1.5, ease: "power2.inOut", onComplete: () => {
                        document.getElementById("status-text").innerText = "STATUS: MODULAR_SYSTEM";
                        document.getElementById("status-dot").classList.replace("bg-alert", "bg-neon");
                        initTick1();
                        isAnimating = false;
                    }});
                    break;
                case 14: showBaukasten(); unlock(1000); break;
                case 15: startMerge(); unlock(1000); break;
                case 16: showReduction(); unlock(500); break;
                case 17: showProof(); unlock(2000); break;
                case 18:
                    triggerShatterTransition();
                    unlock(2000); 
                    break;
                case 19:
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
                        if(el) el.style.display = 'none';
                    });
                    unlock(500); 
                    break;
            }
        }
    };

    // Disable lenis on start to allow pure tick control
    lenis.stop();
    // Scroll to top just in case
    window.scrollTo(0,0);

    window.addEventListener("keydown", (e) => {
        if (["Space", "ArrowRight", "PageDown", "ArrowDown"].includes(e.code)) {
            e.preventDefault();
            if (window.presentation.currentTick < 19) {
                window.presentation.nextTick();
            } else if (presentationPhase2) {
                presentationPhase2.nextTick();
            }
        }
    });

    window.addEventListener("mousedown", (e) => {
        if (e.target.closest("a, button")) return;
        if (e.button === 0) {
            if (window.presentation.currentTick < 19) {
                window.presentation.nextTick();
            } else if (presentationPhase2) {
                presentationPhase2.nextTick();
            }
        }
    });

    function smoothScroll(targetY) {
        gsap.to(window, { scrollTo: targetY, duration: 1.5, ease: "power2.inOut" });
    }

    // --- DIGITAL SHATTER TRANSITION ---
    function triggerShatterTransition() {
        if (isAnimating) return;
        isAnimating = true;

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
                        el.style.opacity = '1';

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
                    item.el.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)';
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
        window.searchInterval = setInterval(() => {
            const randX = svgBounds.left + Math.random() * (svgBounds.width - 200);
            const randY = svgBounds.top + Math.random() * (svgBounds.height - 200);
            crosshair.style.transition = 'none';
            crosshair.style.left = randX + 'px';
            crosshair.style.top = randY + 'px';
            crosshair.style.width = (50 + Math.random() * 150) + 'px';
            crosshair.style.height = (50 + Math.random() * 150) + 'px';
            iterations++;
            if (currentStep !== 2) { clearInterval(window.searchInterval); return; }
            if (iterations > 8) { clearInterval(window.searchInterval); executeFinalSnap(); }
        }, 60);

        function executeFinalSnap() {
            if (currentStep !== 2) return;
            const container = document.getElementById('svg-container');
            const targetRect = targetElementForLock.getBoundingClientRect();
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const targetCenterY = targetRect.top + targetRect.height / 2;
            const containerRect = container.getBoundingClientRect();
            const originX = ((targetCenterX - containerRect.left) / containerRect.width) * 100;
            const originY = ((targetCenterY - containerRect.top) / containerRect.height) * 100;
            const scale = 2.5; 
            crosshair.style.transition = 'all 0.4s cubic-bezier(0.1, 0.9, 0.2, 1)';
            container.style.transition = 'transform 1.2s cubic-bezier(0.1, 0.9, 0.2, 1), transform-origin 0s';
            const padding = 20;
            const size = Math.max(targetRect.width, targetRect.height) + padding * 2;
            const finalW = size * scale;
            const finalH = size * scale;
            const finalL = targetCenterX - finalW / 2;
            const finalT = targetCenterY - finalH / 2;
            crosshair.style.left = finalL + 'px';
            crosshair.style.top = finalT + 'px';
            crosshair.style.width = finalW + 'px';
            crosshair.style.height = finalH + 'px';
            window.finalLockStats = { left: finalL, top: finalT, width: finalW, height: finalH };
            container.style.transformOrigin = `${originX}% ${originY}%`;
            container.style.transform = `scale(${scale})`;
            setTimeout(() => {
                if (currentStep !== 2) return;
                const terminalOverlay = document.getElementById('terminal-overlay');
                const terminalText = document.getElementById('terminal-text');
                terminalOverlay.style.opacity = '1';
                const textToType = "> TARGET_LOCK: LAT/LON [BAUSTELLE]";
                terminalText.textContent = '';
                let charIndex = 0;
                window.typingInterval = setInterval(() => {
                    terminalText.textContent += textToType[charIndex];
                    charIndex++;
                    if (charIndex >= textToType.length) clearInterval(window.typingInterval);
                }, 30);
            }, 400);
        }
    }

    function startBanner() {
        if (!window.finalLockStats) return;
        const banner = document.getElementById('banner-overlay');
        banner.style.left = window.finalLockStats.left + 'px';
        banner.style.top = window.finalLockStats.top + 'px';
        banner.style.width = window.finalLockStats.width + 'px';
        banner.style.height = '0px';
        banner.style.opacity = '1';
        banner.offsetHeight;
        banner.style.transition = 'height 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s';
        banner.style.height = window.finalLockStats.height + 'px';
    }

    function startReveal() {
        if (!window.finalLockStats) return;
        const qr = document.getElementById('qr-container');
        const uiInterface = document.getElementById('interface-container');
        const video = document.getElementById('onboarding-video');
        qr.style.left = window.finalLockStats.left + 'px';
        qr.style.top = window.finalLockStats.top + 'px';
        qr.style.width = window.finalLockStats.width + 'px';
        qr.style.height = window.finalLockStats.height + 'px';
        qr.style.opacity = '1';
        qr.classList.remove('melt');
        setTimeout(() => {
            if (currentStep !== 4) return;
            qr.classList.add('melt');
            document.getElementById('main-content').classList.add('blur-out');
            setTimeout(() => {
                if (currentStep !== 4) return;
                uiInterface.classList.add('visible');
                video.play();
            }, 1000);
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
            if (item.isLength) item.el.style.strokeDashoffset = item.lengthVal;
            else item.el.style.opacity = '0';
        });
    }

    function resetCrosshair() {
        const crosshair = document.getElementById('crosshair');
        const terminalOverlay = document.getElementById('terminal-overlay');
        const terminalText = document.getElementById('terminal-text');
        const container = document.getElementById('svg-container');
        if (window.searchInterval) clearInterval(window.searchInterval);
        if (window.typingInterval) clearInterval(window.typingInterval);
        crosshair.style.opacity = '0';
        terminalOverlay.style.opacity = '0';
        terminalText.textContent = '';
        container.style.transform = 'scale(1) translate(0px, 0px)';
        resetBanner();
        resetReveal();
    }

    function resetBanner() {
        const banner = document.getElementById('banner-overlay');
        banner.style.height = '0px';
        banner.style.opacity = '0';
    }

    function resetReveal() {
        const qr = document.getElementById('qr-container');
        const uiInterface = document.getElementById('interface-container');
        const container = document.getElementById('svg-container');
        if (qr) {
            qr.style.opacity = '0';
            qr.classList.remove('melt');
        }
        if (uiInterface) uiInterface.classList.remove('visible');
        const mainContent = document.getElementById('main-content');
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
        modCounter.textContent = "0000";
        gsap.set(modCounterLabel, { opacity: 0, y: 10 });
        gsap.fromTo(modCounter,
            { opacity: 0, y: 30, scale: 1.04 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out', delay: 0.1 }
        );

        const obj = { val: 0 };
        gsap.to(obj, {
            val: 9168,
            duration: 1.4,
            ease: 'expo.out',
            delay: 0.25,
            onUpdate() {
                modCounter.textContent = Math.round(obj.val).toString().padStart(4, '0');
            },
            onComplete() {
                gsap.to(modCounterLabel, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' });
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
        this.currentTick = 18; // Offset for Projekt B
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
        this.room = null;
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

        const roomSize = 500;
        const geometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize * 4);
        const material = new THREE.MeshBasicMaterial({
            color: 0x39FF14, wireframe: true, side: THREE.BackSide, transparent: true, opacity: 0.2
        });
        this.room = new THREE.Mesh(geometry, material);
        this.room.visible = false;
        this.scene.add(this.room);

        this.camera.position.z = 10;
        this.scene.add(this.camera);
        this.animate();
    }

    async nextTick() {
        this.currentTick++;
        switch (this.currentTick) {
            case 19: await this.transitionToTick1(); break;
            case 20: if (this.overlayLeft) this.overlayLeft.classList.add('active'); break;
            case 21: if (this.overlayRight) this.overlayRight.classList.add('active'); break;
            case 22: this.startChaos(); break;
            case 23: this.applyFilter(); break;
            case 24: this.doMatchcut(); break;
            case 25: this.centerPoster(); break;
            case 26: await this.showConclusion(); break;
            case 27: this.showDeadpanZero(); break;
            case 28: this.showAnalogInfection(); break;
            case 29: this.startChairStorm(); break;
            case 30: this.showFatalErrors(); break;
            case 31: this.showFakeLuftschloss(); break;
            case 32: this.showRealityCheck(); break;
            case 33: this.showTrueValue(); break;
            case 34: this.showTunnelVision(); break;
            case 35: this.showDimOut(); break;
            // Ticks 36-39 are buffer/dead space as requested
            case 40: this.showMountSequence(); break;
            case 41: this.showFile1(); break;
            case 42: this.showFile2(); break;
            case 43: this.showFileError(); break;
            case 44: this.showFinalVerification(); break;
            case 45: await this.showSystemPurge(); break;
            case 47: this.showFoundationLine(); break;
            case 48: /* Dummy Tick - Strategic Pause */ break;
            case 49: this.showMicDrop(); break;
            case 50: this.showSystemFreeze(); break;
        }
    }

    cleanupPreviousSections() {
        const ids = [
            'three-canvas', 'overlay-left', 'overlay-right',
            'filter-box', 'matchcut-overlay', 'data-canvas', 'terminal-screen'
        ];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
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
            "1 1 of 1.png", "10 1 of 1.png", "2 1 of 1.png", "3 1 of 1.png", "4 1 of 1.png", "5 1 of 1.png", "7 1 of 1.png",
            "bad__mid_oben31.png", "bad_bad_hinten_links2.png", "bad_bad_vorn_links30.png", "bad_bad_vorne10.png",
            "bad_bad_vorne20.png", "bad_bad_vorne21.png", "bad_bad_vorne_links11.png", "bad_bad_vorne_links2.png",
            "bad_bad_vorne_rechts22.png", "bad_good_draufsicht3.png", "bad_good_seitlich4.png", "bad_good_vorn_rechts31.png",
            "bad_good_vorne_links22.png", "bad_mid_oben30.png", "bad_mid_seitlich6.png", "bad_mid_vorne_links20.png",
            "bad_mid_vorne_links6.png", "good_hinten_rechts21.png", "good_oben_6.png", "good_oben_rechts20.png",
            "good_seitlich20.png", "good_seitlich30.png", "good_unten20.png", "good_unten31.png", "good_unten6.png",
            "good_vorn.png", "good_vorn30.png", "good_vorn_rechts32.png", "good_vorne6.png", "good_vorne7.png",
            "good_vorne8.png", "good_vorne_links12.png", "good_vorne_links21.png", "good_vorne_links3.png",
            "good_vorne_links7.png", "good_vorne_links_hq.png", "good_vorne_rechts20.png", "good_vorne_rechts21.png",
            "mid_bad_draufsicht.png", "mid_good_ hinten_rechts30.png", "mid_good_draufsicht2.png", "mid_good_hinten_links.png",
            "mid_good_hinten_links6.png", "mid_hinten_rechts20.png", "mid_mid_hinten_links20.png", "mid_oben20.png",
            "mid_oben_7.png", "mid_seitlich.png", "mid_seitlich2.png", "mid_seitlich21.png", "mid_seitlich3.png",
            "mid_seitlich7.png", "mid_unten.png", "mid_unten30.png", "mid_vorn31.png", "mid_vorn_links31.png",
            "mid_vorn_links32.png", "mid_vorn_rechts33.png", "mid_vorne9.png", "mid_vorne_links9.png",
            "mid_vorne_rechts.png", "mid_vorne_rechts14.png", "mid_vorne_rechts2.png", "mid_vorne_rechts3.png",
            "mid_vorne_rechts4.png", "mid_vorne_rechts6.png", "mid_vorne_rechts7.png"
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

    showFakeLuftschloss() {
        if (this.zoomContainer) {
            this.zoomContainer.classList.add('active');
            this.zoomContainer.style.backgroundColor = '#F5F5F0';
        }
        if (this.errorContainer) this.errorContainer.style.display = 'none';

        // Gridify Chairs
        const chairs = document.querySelectorAll('.spawned-chair');
        const cols = 10;
        const spacing = 100;
        const startX = (window.innerWidth - (cols * spacing)) / 2;
        const startY = (window.innerHeight - (Math.ceil(chairs.length / cols) * spacing)) / 2;
        const gridLines = document.getElementById('grid-lines');

        chairs.forEach((chair, i) => {
            chair.classList.add('clean');
            const r = Math.floor(i / cols);
            const c = i % cols;
            chair.style.left = `${startX + c * spacing}px`;
            chair.style.top = `${startY + r * spacing}px`;
            chair.style.transform = `scale(0.3) rotate(0deg)`;
            chair.style.zIndex = 10;
        });

        // Dynamic Lines
        if (gridLines) {
            gridLines.innerHTML = '';
            // Verticals
            for (let c = 0; c < cols; c++) {
                const line = document.createElement('div');
                line.className = 'grid-line';
                line.style.left = `${startX + c * spacing}px`;
                line.style.top = '0';
                line.style.width = '1px';
                line.style.height = '100%';
                gridLines.appendChild(line);
            }
            // Horizontals
            for (let r = 0; r < Math.ceil(chairs.length / cols); r++) {
                const line = document.createElement('div');
                line.className = 'grid-line';
                line.style.top = `${startY + r * spacing}px`;
                line.style.left = '0';
                line.style.height = '1px';
                line.style.width = '100%';
                gridLines.appendChild(line);
            }
        }

        const labels = document.querySelectorAll('.serif-label');
        labels.forEach((l, idx) => l.classList.add(`label-${idx + 1}`));

        setTimeout(() => {
            if (gridLines) gridLines.style.opacity = '1';
            const gridLabels = document.getElementById('grid-labels');
            if (gridLabels) gridLabels.style.opacity = '1';
        }, 500);
    }

    showRealityCheck() {
        if (this.clashContainer) this.clashContainer.style.display = 'none';
        if (this.zoomContainer) {
            this.zoomContainer.style.backgroundColor = '#050505';
            const gl = document.getElementById('grid-lines');
            if (gl) gl.style.display = 'none';
            const glabels = document.getElementById('grid-labels');
            if (glabels) glabels.style.display = 'none';
            // Hide chairs
            document.querySelectorAll('.spawned-chair').forEach(c => c.style.display = 'none');
        }
        if (this.realityCheck) this.realityCheck.style.display = 'block';
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

    async transitionToTick1() {
        this.isTransitioning = true;
        if (this.phoneFrame) this.phoneFrame.classList.add('rotate-out');
        setTimeout(() => {
            this.triggerFlash();
            if (this.room) this.room.visible = true;
            const t1 = document.getElementById('tick-1');
            if (t1) t1.style.display = 'none';
            this.loadModels();
            this.isTransitioning = false;
        }, 600);
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

        const lines = ["> FOCUS: CODE", "> FOCUS: UX", "> FOCUS: STRATEGIE"];
        for (let line of lines) {
            await this.typeLine(line);
            if (this.terminalContent) this.terminalContent.innerHTML += "\n";
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
                model.traverse(c => { if (c.isMesh) c.material = new THREE.MeshBasicMaterial({ color: 0x39FF14, wireframe: true }); });
                model.position.copy(positions[index]);
                model.scale.set(3, 3, 3);
                this.camera.add(model);
                this.models.push({
                    mesh: model,
                    rotSpeed: { x: 0.002 + Math.random() * 0.002, y: 0.005, z: 0.001 }
                });
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.room && this.room.visible) {
            this.room.position.z += 0.5;
            if (this.room.position.z > 500) this.room.position.z = 0;
            this.models.forEach(m => {
                m.mesh.rotation.x += m.rotSpeed.x;
                m.mesh.rotation.y += m.rotSpeed.y;
                m.mesh.rotation.z += m.rotSpeed.z;
            });
        }
        if (this.dataCanvas) this.dataCanvas.update();
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }
}

presentationPhase2 = new Presentation();

});

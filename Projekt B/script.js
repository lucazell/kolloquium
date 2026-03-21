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
            if (isAnimating || this.currentTick >= 18) return;
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
            }
        }
    };

    // Disable lenis on start to allow pure tick control
    lenis.stop();
    // Scroll to top just in case
    window.scrollTo(0,0);

    window.addEventListener("keydown", (e) => {
        if (["Space", "ArrowRight", "PageDown", "ArrowDown"].includes(e.code)) {
            if (window.presentation.currentTick < 18) {
                e.preventDefault();
                window.presentation.nextTick();
            }
        }
    });

    window.addEventListener("mousedown", (e) => {
        if (e.target.closest("a, button")) return;
        if (e.button === 0 && window.presentation.currentTick < 18) {
            window.presentation.nextTick();
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
                smoothScroll("#sec-tech");
                gsap.to(overlay, { opacity: 0, duration: 1.5, delay: 0.5 });
                lenis.start(); // Restore scrolling for the rest of the page
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
        const interface = document.getElementById('interface-container');
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
                interface.classList.add('visible');
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
        const interface = document.getElementById('interface-container');
        const container = document.getElementById('svg-container');
        if (qr) {
            qr.style.opacity = '0';
            qr.classList.remove('melt');
        }
        if (interface) interface.classList.remove('visible');
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.classList.remove('blur-out');
        resetKPIs();
    }

    function resetKPIs() {
        const interface = document.getElementById('interface-container');
        if (interface) interface.classList.remove('kpi-visible');
        resetClimax();
    }

    function resetClimax() {
        const interface = document.getElementById('interface-container');
        const grid = document.getElementById('grid-background');
        if (interface) interface.classList.remove('climax-active');
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



    // --- SECTION 4: THE TECH (COMPLETE OVERHAUL) ---
    // Step 1: Preamble (Terminal)
    // Step 2: Project Reveal (Visuals)
    // Step 3: Insight (Code)
    const tlTech = gsap.timeline({
        scrollTrigger: {
            trigger: "#sec-tech",
            start: "top top",
            end: "+=400%",
            pin: true,
            scrub: 1,
            anticipatePin: 1
        }
    });

    tlTech.to("#tech-preamble", { opacity: 0, scale: 0.9, duration: 1 })
        .to("#tech-bg", { opacity: 1, scale: 1, duration: 2 }, "<")
        .to("#tech-vignette", { opacity: 1, duration: 2 }, "<")
        .to("#tech-headline", { opacity: 1, y: -50, duration: 2 }, "<+0.5")
        .to("#tech-img", { opacity: 1, y: 0, rotate: 0, duration: 2, ease: "power3.out" }, "<")

        .to("#tech-img", { x: -200, duration: 2 })
        .to("#tech-headline", { opacity: 0, duration: 1 }, "<")
        .to("#tech-code", { x: 0, opacity: 1, duration: 2, ease: "back.out(1)" }, "<+0.5")

    gsap.to("#code-pulse", {
        innerHTML: 140,
        yoyo: true,
        repeat: -1,
        duration: 0.5,
        snap: { innerHTML: 1 },
        ease: "power1.inOut",
        onRepeat: () => {
            if (Math.random() > 0.8) document.getElementById("code-pulse").innerText = Math.floor(Math.random() * 200);
        }
    });


    // --- SECTION 5: THE GLITCH (OPTIMIZED V2) ---
    const grid = document.querySelector(".chair-grid");
    grid.innerHTML = "";
    // Reduced to Top 10 (Actually 7) to fix Memory Lag
    const chairImages = [
        "1 1 of 1.png", "2 1 of 1.png", "3 1 of 1.png", "4 1 of 1.png",
        "5 1 of 1.png", "7 1 of 1.png", "10 1 of 1.png"
    ];

    // Grid Size: 80 items (10 cols x 8 rows)
    const cols = 10;
    const gridState = []; // Track images to avoid neighbors

    for (let i = 0; i < 80; i++) {
        const chair = document.createElement("div");

        // Logic: Pick image that doesn't match Left (i-1) or Top (i-10)
        let validImages = [...chairImages];

        // Remove Left Neighbor
        if (i % cols !== 0 && gridState[i - 1]) {
            validImages = validImages.filter(img => img !== gridState[i - 1]);
        }
        // Remove Top Neighbor
        if (i >= cols && gridState[i - cols]) {
            validImages = validImages.filter(img => img !== gridState[i - cols]);
        }

        // Fallback (shouldn't happen with 7 images, but just in case)
        if (validImages.length === 0) validImages = [...chairImages];

        const randomImg = validImages[Math.floor(Math.random() * validImages.length)];
        gridState[i] = randomImg; // Store for next checks

        chair.className = "w-full h-full bg-cover bg-center transition-opacity duration-300 grayscale contrast-125";
        chair.style.backgroundImage = `url('assets/stühle/top10/${randomImg}')`; // Path: top10
        chair.style.opacity = Math.random() > 0.8 ? 0.3 : 0.02;
        chair.style.willChange = "opacity";
        grid.appendChild(chair);
    }

    // Performance Optimized Flicker
    function flickerChairs() {
        if (Math.random() > 0.5) {
            const chairs = document.querySelectorAll(".chair-grid div");
            const randomChair = chairs[Math.floor(Math.random() * chairs.length)];
            gsap.to(randomChair, {
                opacity: Math.random() * 0.5,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                overwrite: "auto"
            });
        }
        gsap.delayedCall(0.05, flickerChairs);
    }
    flickerChairs();

    const tlGlitch = gsap.timeline({
        scrollTrigger: {
            trigger: "#sec-glitch",
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 1,
            onEnter: () => {
                document.getElementById("status-text").innerText = "STATUS: ERROR";
                document.getElementById("status-dot").classList.replace("bg-neon", "bg-alert");
            },
            onLeaveBack: () => {
                document.getElementById("status-text").innerText = "STATUS: RUNNING";
                document.getElementById("status-dot").classList.replace("bg-alert", "bg-neon");
            }
        }
    });

    tlGlitch.fromTo(".chair-grid", { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 2 })
        .to("#glitch-message", { opacity: 1, scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" })
        .to(".chair-grid", { filter: "hue-rotate(90deg) blur(2px)", duration: 1 }, "<")
        .to("#sec-glitch", { opacity: 0, duration: 1 });


    // --- SECTION 6: THE ZOOM ---
    const tlZoom = gsap.timeline({
        scrollTrigger: {
            trigger: "#sec-zoom",
            start: "top top",
            end: "+=400%",
            pin: true,
            scrub: 1
        }
    });

    tlZoom.to("#zoom-drawing", { opacity: 1, scale: 1, duration: 2 })
        .fromTo(".cad-line", { strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 2, stagger: 0.5 })
        .to("#zoom-drawing", { scale: 5, duration: 3, ease: "power2.in" })
        .to("#zoom-drawing", { opacity: 0, duration: 0.5 }, "-=0.5");


    // --- SECTION 7: THE PRODUCT ---
    const tlProduct = gsap.timeline({
        scrollTrigger: {
            trigger: "#sec-product",
            start: "top top",
            end: "+=200%",
            pin: true,
            scrub: 1
        }
    });

    tlProduct.to("#product-box", { x: 0, opacity: 1, duration: 2 })
        .to(".boot-line", { opacity: 1, stagger: 0.5, x: 0, duration: 1 });


    // --- SECTION 8: OUTRO ---
    gsap.to(["#outro-text", "#outro-sub"], {
        scrollTrigger: {
            trigger: "#sec-outro",
            start: "top center",
        },
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1.5,
        ease: "power2.out"
    });

    // Tech Code Glitch
    const glitchNums = document.querySelectorAll(".glitch-num");
    setInterval(() => {
        glitchNums.forEach(num => {
            const max = parseInt(num.dataset.max);
            num.innerText = Math.floor(Math.random() * max);
        });
    }, 100);
});

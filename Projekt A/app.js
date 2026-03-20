import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class DataCanvas {
    constructor() {
        this.canvas = document.getElementById('data-canvas');
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
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.lineY = this.canvas.height / 2;
    }

    update() {
        if (this.state === 'IDLE') return;

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
        this.currentTick = 0;
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
        this.blinkingCursor = document.getElementById('blinking-cursor');
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
        this.initEventListeners();
    }

    initThree() {
        const canvas = document.getElementById('three-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
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

    initEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;
            if (e.code === 'Space' || e.code === 'ArrowRight') this.nextTick();
        });
        window.addEventListener('resize', () => {
            if (this.camera && this.renderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
    }

    async nextTick() {
        this.currentTick++;
        switch (this.currentTick) {
            case 1: await this.transitionToTick1(); break;
            case 2: if (this.overlayLeft) this.overlayLeft.classList.add('active'); break;
            case 3: if (this.overlayRight) this.overlayRight.classList.add('active'); break;
            case 4: this.startChaos(); break;
            case 5: this.applyFilter(); break;
            case 6: this.doMatchcut(); break;
            case 7: this.centerPoster(); break;
            case 8: await this.showConclusion(); break;
            case 9: this.showDeadpanZero(); break;
            case 10: this.showAnalogInfection(); break;
            case 11: this.startChairStorm(); break;
            case 12: this.showFatalErrors(); break;
            case 13: this.showFakeLuftschloss(); break;
            case 14: this.showRealityCheck(); break;
            case 15: this.showTrueValue(); break;
            case 16: this.showTunnelVision(); break;
            case 17: this.showDimOut(); break;
            // Ticks 18-21 are buffer/dead space as requested
            case 22: this.showMountSequence(); break;
            case 23: this.showFile1(); break;
            case 24: this.showFile2(); break;
            case 25: this.showFileError(); break;
            case 26: this.showFinalVerification(); break;
            case 27: await this.showSystemPurge(); break;
            case 28: this.showBlinkingCursor(); break;
            case 29: this.showFoundationLine(); break;
            case 30: /* Dummy Tick - Strategic Pause */ break;
            case 31: this.showMicDrop(); break;
            case 32: this.showSystemFreeze(); break;
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
            this.spawnChair(`skizzen/${randomFile}`);
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
            document.getElementById('grid-labels').style.opacity = '1';
        }, 500);
    }

    showRealityCheck() {
        if (this.clashContainer) this.clashContainer.style.display = 'none';
        if (this.zoomContainer) {
            this.zoomContainer.style.backgroundColor = '#050505';
            document.getElementById('grid-lines').style.display = 'none';
            document.getElementById('grid-labels').style.display = 'none';
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

    showBlinkingCursor() {
        if (this.blinkingCursor) this.blinkingCursor.style.display = 'block';
    }

    showFoundationLine() {
        if (this.foundationLine) this.foundationLine.style.width = '100%';
    }

    showMicDrop() {
        // Instant Brightness Shock
        document.body.classList.add('shock-brightness');
        document.body.style.backgroundColor = '#050505';
        
        // Hide previous elements
        if (this.blinkingCursor) this.blinkingCursor.style.display = 'none';
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
        this.phoneFrame.classList.add('rotate-out');
        setTimeout(() => {
            this.triggerFlash();
            this.room.visible = true;
            document.getElementById('tick-1').style.display = 'none';
            this.loadModels();
            this.isTransitioning = false;
        }, 600);
    }

    startChaos() {
        this.dataCanvas.canvas.classList.add('active');
        this.dataCanvas.state = 'NOISE';
        if (this.overlayLeft) this.overlayLeft.classList.add('glitch');
        if (this.overlayRight) this.overlayRight.classList.add('glitch');
    }

    applyFilter() {
        this.dataCanvas.state = 'SINE';
        if (this.overlayLeft) this.overlayLeft.classList.remove('glitch');
        if (this.overlayRight) this.overlayRight.classList.remove('glitch');
        this.filterBox.classList.add('active');
    }

    doMatchcut() {
        this.isTransitioning = true;
        this.dataCanvas.state = 'COLLAPSE';

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
            this.dataCanvas.state = 'IDLE';
            if (this.dataCanvas.canvas) this.dataCanvas.canvas.classList.remove('active');
        }, 3000); // 1000ms delay for matchcut start + 2000ms duration
    }

    async showConclusion() {
        if (this.matchcutOverlay) this.matchcutOverlay.classList.remove('active');
        if (this.dataCanvas.canvas) this.dataCanvas.canvas.classList.remove('active');
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
        this.flashOverlay.style.opacity = '1';
        setTimeout(() => {
            this.flashOverlay.style.transition = 'opacity 0.1s ease-out';
            this.flashOverlay.style.opacity = '0';
        }, 50);
    }

    loadModels() {
        const loader = new GLTFLoader();
        const modelNames = ['distance_sensor_-_dummy.glb', 'pir_sensor.glb', 'pulse.glb'];
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
        this.dataCanvas.update();
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }
}

new Presentation();

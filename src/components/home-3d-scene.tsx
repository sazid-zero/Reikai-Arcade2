'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Home3dSceneProps {
  scrollProgress: number; // 0 to 1 across the hero scroll journey
  activeStage: number;    // 0: Reikai Arcade, 1: Power Your Game, 2: Digital Wallet, 3: Play Beyond
  stageProgress: number;  // 0 to 1 within active stage
  reducedMotion?: boolean;
}

export function Home3dScene({
  scrollProgress,
  activeStage,
  stageProgress,
  reducedMotion = false,
}: Home3dSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Store mutable refs for animation loop
  const progressRef = useRef(scrollProgress);
  const stageRef = useRef(activeStage);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    progressRef.current = scrollProgress;
    stageRef.current = activeStage;
  }, [scrollProgress, activeStage]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL check
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // ── SCENE & RENDERER SETUP ──────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06020e, 0.075);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(1.4, 1.8, 5.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = false; // lightweight high fps
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // ── LIGHTING (Iridescent Logo Palette) ──────────────────────────────
    // Ambient light - Deep cosmic purple
    const ambientLight = new THREE.AmbientLight(0x2d124d, 1.4);
    scene.add(ambientLight);

    // Key directional light - Electric cyan highlight
    const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.2);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    // Rim/Accent light - Neon violet & magenta
    const rimLight = new THREE.DirectionalLight(0xa855f7, 2.8);
    rimLight.position.set(-5, 4, -3);
    scene.add(rimLight);

    // Underglow point light (illuminates the bottom of pedestal)
    const underLight = new THREE.PointLight(0x00f0ff, 3.0, 8, 1.8);
    underLight.position.set(0, -0.6, 0);
    scene.add(underLight);

    // Core top point light (cyan core glow)
    const coreLight = new THREE.PointLight(0x38bdf8, 2.5, 6, 1.5);
    coreLight.position.set(0, 0.6, 0);
    scene.add(coreLight);

    // ── 3D OBJECT: FUTURISTIC CONSOLE PLATFORM ─────────────────────────
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const platformGroup = new THREE.Group();
    rootGroup.add(platformGroup);

    // 1. Lower chassis / pedestal base (dark obsidian metallic)
    const baseGeo = new THREE.BoxGeometry(2.8, 0.45, 1.75);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x090614,
      metalness: 0.88,
      roughness: 0.22,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.22;
    platformGroup.add(baseMesh);

    // 2. Middle glowing neon bevel border (Electric Violet #a855f7)
    const trimGeo = new THREE.BoxGeometry(2.84, 0.08, 1.79);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.y = -0.04;
    platformGroup.add(trimMesh);

    // 3. Top glowing interactive illuminated pad (Electric Turquoise / Cyan #00f0ff)
    const padGeo = new THREE.BoxGeometry(2.5, 0.06, 1.45);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 2.5,
      roughness: 0.1,
      metalness: 0.2,
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.y = 0.04;
    platformGroup.add(padMesh);

    // 4. Subtle holographic surface grid / inner rim
    const innerRimGeo = new THREE.BoxGeometry(2.3, 0.02, 1.25);
    const innerRimMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xec4899,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const innerRimMesh = new THREE.Mesh(innerRimGeo, innerRimMat);
    innerRimMesh.position.y = 0.08;
    platformGroup.add(innerRimMesh);

    // ── FLOATING HOLOGRAPHIC REIKAI LOGO EMBLEM ───────────────────────
    // Load the logo texture from /videos/reikai_logo.jpeg
    const textureLoader = new THREE.TextureLoader();
    let logoMesh: THREE.Mesh | null = null;
    textureLoader.load('/videos/reikai_logo.jpeg', (texture) => {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      const logoGeo = new THREE.PlaneGeometry(1.05, 1.05);
      const logoMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.94,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      logoMesh = new THREE.Mesh(logoGeo, logoMat);
      logoMesh.position.set(0, 0.78, 0);
      platformGroup.add(logoMesh);
    });

    // Outer subtle holographic ring around the emblem
    const ringGeo = new THREE.TorusGeometry(0.72, 0.014, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.45;
    platformGroup.add(ringMesh);

    // ── ORBITING ENERGY SPHERES (10 Golden / Iridescent Orbs) ─────────
    const SPHERE_COUNT = 10;
    const spheres: {
      mesh: THREE.Mesh;
      baseAngle: number;
      speed: number;
      radius: number;
      heightOffset: number;
      verticalAmp: number;
    }[] = [];

    const sphereGeo = new THREE.SphereGeometry(0.09, 32, 32);
    for (let i = 0; i < SPHERE_COUNT; i++) {
      const isAlt = i % 2 === 0;
      const sphereMat = new THREE.MeshStandardMaterial({
        color: isAlt ? 0xfcd34d : 0x00f0ff,
        emissive: isAlt ? 0xf59e0b : 0x06b6d4,
        emissiveIntensity: 1.5,
        metalness: 0.9,
        roughness: 0.15,
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      const baseAngle = (i / SPHERE_COUNT) * Math.PI * 2;
      const radius = 1.7 + (i % 3) * 0.22;
      const heightOffset = 0.15 + (i % 4) * 0.08;
      const verticalAmp = 0.08 + (i % 2) * 0.06;
      platformGroup.add(mesh);
      spheres.push({
        mesh,
        baseAngle,
        speed: 0.75,
        radius,
        heightOffset,
        verticalAmp,
      });
    }

    // ── VOLUMETRIC SPOTLIGHT BEAMS (Cut through dark space) ───────────
    // Created as smooth translucent gradient cones
    const beamGeo = new THREE.CylinderGeometry(0.08, 1.8, 8.5, 32, 1, true);
    beamGeo.translate(0, -4.25, 0);

    const createBeam = (colorHex: number) => {
      const beamMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      return new THREE.Mesh(beamGeo, beamMat);
    };

    const beamLeft = createBeam(0x9333ea); // Violet
    beamLeft.position.set(-3.8, 5.6, 1.2);
    beamLeft.rotation.z = -0.55;
    beamLeft.rotation.x = 0.25;
    scene.add(beamLeft);

    const beamRight = createBeam(0x00f0ff); // Cyan
    beamRight.position.set(3.8, 5.6, -1.2);
    beamRight.rotation.z = 0.55;
    beamRight.rotation.x = -0.25;
    scene.add(beamRight);

    // ── AURORA RIBBONS (Curved glowing ambient streaks) ───────────────
    const createCurvedRibbon = (points: THREE.Vector3[], color: number) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.06, 12, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Mesh(tubeGeo, tubeMat);
    };

    const ribbon1 = createCurvedRibbon(
      [
        new THREE.Vector3(-6, -2, -3),
        new THREE.Vector3(-2, 1.5, -2),
        new THREE.Vector3(2, -1.2, -1),
        new THREE.Vector3(6, 2, -2),
      ],
      0xa855f7 // Violet
    );
    scene.add(ribbon1);

    const ribbon2 = createCurvedRibbon(
      [
        new THREE.Vector3(-5, 2.5, -2),
        new THREE.Vector3(-1, -1.8, -1),
        new THREE.Vector3(3, 1.2, -2),
        new THREE.Vector3(7, -1.5, -3),
      ],
      0x00f0ff // Cyan
    );
    scene.add(ribbon2);

    // ── STAR / STARDUST FIELD ─────────────────────────────────────────
    const starCount = 350;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 22;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xc4b5fd,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // ── MOUSE PARALLAX TRACKING ───────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.45;
      mouseRef.current.targetY = y * 0.35;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ── RESIZE HANDLER ────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── ANIMATION & RENDER LOOP ───────────────────────────────────────
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const scroll = progressRef.current;
      const isMobile = window.innerWidth <= 768;

      // Mouse smoothing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      const mx = reducedMotion ? 0 : mouseRef.current.x;
      const my = reducedMotion ? 0 : mouseRef.current.y;

      // ── CAMERA & PLATFORM STAGE POSES (matching the video) ───────────
      // In video:
      // Stage 0 (0.00 - 0.25): Hero view - platform is slightly to the right, isometric tilt
      // Stage 1 (0.25 - 0.50): "Power Your Game" - platform rotates, centers, spotlights sweep
      // Stage 2 (0.50 - 0.75): "Digital Wallet" - platform tilts forward, energy core pulses
      // Stage 3 (0.75 - 1.00): "Play Beyond" - platform completes 360 spin, wide view
      const targetPlatformRotY = scroll * (Math.PI * 3.2); // Accumulated rotation on scroll
      const targetPlatformRotX = 0.38 + Math.sin(scroll * Math.PI * 2) * 0.18 + my * 0.25;
      const targetPlatformRotZ = -0.1 + Math.cos(scroll * Math.PI * 1.5) * 0.12 + mx * 0.25;

      // Desktop vs Mobile horizontal placement
      // On desktop in Hero, object sits in the right-center (x ~ 1.0), on mobile it's centered (x = 0)
      const targetPlatformX = isMobile
        ? 0
        : (1 - scroll * 1.5) * 0.85; // Shifts from right-center slightly towards center
      const targetPlatformY = isMobile
        ? -0.25 + Math.sin(elapsedTime * 1.2) * 0.05
        : 0.0 + Math.sin(elapsedTime * 1.2) * 0.06;

      platformGroup.rotation.y = THREE.MathUtils.lerp(platformGroup.rotation.y, targetPlatformRotY, 0.08);
      platformGroup.rotation.x = THREE.MathUtils.lerp(platformGroup.rotation.x, targetPlatformRotX, 0.08);
      platformGroup.rotation.z = THREE.MathUtils.lerp(platformGroup.rotation.z, targetPlatformRotZ, 0.08);

      platformGroup.position.x = THREE.MathUtils.lerp(platformGroup.position.x, targetPlatformX, 0.08);
      platformGroup.position.y = THREE.MathUtils.lerp(platformGroup.position.y, targetPlatformY, 0.08);

      // Camera distance and look target
      const baseDistance = isMobile ? 6.2 : 5.1;
      const camY = isMobile ? 1.9 : 1.7;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, baseDistance + scroll * 0.8, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY - scroll * 0.3 + my * 0.4, 0.08);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mx * 0.6, 0.08);
      camera.lookAt(targetPlatformX * 0.4, targetPlatformY * 0.5, 0);

      // ── SPHERES ORBITING ANIMATION ──────────────────────────────────
      const orbitSpeedMult = 1.0 + scroll * 1.5;
      spheres.forEach((s, idx) => {
        const angle = s.baseAngle + elapsedTime * s.speed * orbitSpeedMult;
        const currentRadius = s.radius + Math.sin(elapsedTime * 2 + idx) * 0.08;
        s.mesh.position.x = Math.cos(angle) * currentRadius;
        s.mesh.position.z = Math.sin(angle) * currentRadius;
        s.mesh.position.y = s.heightOffset + Math.sin(angle * 2 + elapsedTime) * s.verticalAmp;

        // Spheres pulse emissive intensity
        const mat = s.mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.2 + Math.sin(elapsedTime * 3 + idx) * 0.8;
      });

      // ── HOLOGRAPHIC LOGO BOBBING & TURNING ──��───────────────────────
      if (logoMesh) {
        logoMesh.position.y = 0.76 + Math.sin(elapsedTime * 2.2) * 0.06;
        logoMesh.rotation.y = Math.sin(elapsedTime * 0.8) * 0.35;
      }

      // Torus ring pulse
      ringMesh.rotation.z = elapsedTime * 0.6;
      const ringScale = 1.0 + Math.sin(elapsedTime * 2.5) * 0.05;
      ringMesh.scale.set(ringScale, ringScale, ringScale);

      // ── VOLUMETRIC SPOTLIGHT BEAMS SWEEP ────────────────────────────
      // In video: As user scrolls into Stage 1 & 2, spotlights intensify and sweep across the platform!
      const spotlightIntensity = Math.min(0.45, 0.12 + Math.sin(scroll * Math.PI) * 0.32);
      (beamLeft.material as THREE.MeshBasicMaterial).opacity = spotlightIntensity;
      (beamRight.material as THREE.MeshBasicMaterial).opacity = spotlightIntensity;

      beamLeft.rotation.z = -0.55 + Math.sin(elapsedTime * 0.9 + scroll * 3) * 0.12;
      beamRight.rotation.z = 0.55 - Math.sin(elapsedTime * 0.8 + scroll * 3) * 0.12;

      // Aurora ribbons gentle rotation
      ribbon1.rotation.y = Math.sin(elapsedTime * 0.25) * 0.1;
      ribbon2.rotation.y = -Math.cos(elapsedTime * 0.22) * 0.1;

      // Stardust drift
      starPoints.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
      if (container && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  if (!webglSupported) {
    return (
      <div className="home-3d-fallback flex items-center justify-center p-8">
        <img
          src="/videos/reikai_logo.jpeg"
          alt="Reikai Arcade 3D Emblem"
          className="w-64 h-64 object-contain filter drop-shadow-lg animate-pulse"
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="home-3d-canvas-container absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-label="Interactive 3D Reikai Platform and Orbiting Energy Spheres"
    />
  );
}

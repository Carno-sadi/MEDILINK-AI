"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const BASE_PAIRS = 100;
const HELIX_RADIUS = 3.2;
const HELIX_HEIGHT = 56;
const TWIST = Math.PI * 5.5;

interface NucleotideDetail {
  name: string;
  symbol: string;
  type: "Purine" | "Pyrimidine";
  pairedWith: string;
  bonds: string;
  formula: string;
  functionDesc: string;
  medicalNote: string;
  color: string;
}

const NUCLEOTIDE_DATA: Record<string, NucleotideDetail> = {
  Adenine: {
    name: "Adenine",
    symbol: "A",
    type: "Purine",
    pairedWith: "Thymine (A = T)",
    bonds: "2 Hydrogen Bonds",
    formula: "C₅H₅N₅",
    functionDesc:
      "Core nucleotide driving genetic translation and the primary adenosine triphosphate (ATP) cellular energy currency.",
    medicalNote: "Critical cofactor in NAD+/FAD metabolic oxidation and RNA messenger synthesis.",
    color: "#17786F",
  },
  Thymine: {
    name: "Thymine",
    symbol: "T",
    type: "Pyrimidine",
    pairedWith: "Adenine (T = A)",
    bonds: "2 Hydrogen Bonds",
    formula: "C₅H₆N₂O₂",
    functionDesc:
      "Grants DNA elevated enzymatic stability over RNA, shielding the genetic sequence against photochemical deterioration.",
    medicalNote: "UV-induced thymine dimers serve as major clinical targets in dermatology and DNA damage repair.",
    color: "#2BA89B",
  },
  Cytosine: {
    name: "Cytosine",
    symbol: "C",
    type: "Pyrimidine",
    pairedWith: "Guanine (C ≡ G)",
    bonds: "3 Hydrogen Bonds",
    formula: "C₄H₅N₃O",
    functionDesc:
      "Forms triple-bonded stabilization and acts as the prime carrier for DNA methylation and epigenetic regulation.",
    medicalNote: "CpG island hypermethylation patterns are recognized clinical biomarkers in early cancer screening.",
    color: "#7C3AED",
  },
  Guanine: {
    name: "Guanine",
    symbol: "G",
    type: "Purine",
    pairedWith: "Cytosine (G ≡ C)",
    bonds: "3 Hydrogen Bonds",
    formula: "C₅H₅N₅O",
    functionDesc:
      "High thermal stability nucleotide capable of forming four-stranded G-quadruplex structures safeguarding chromosome ends.",
    medicalNote: "Essential for telomeric integrity and genomic stability; studied extensively in oncology genetics.",
    color: "#D92D20",
  },
};

const basePairNames = ["Adenine", "Thymine", "Cytosine", "Guanine"];

interface BasePairMesh {
  meshA: THREE.Mesh;
  meshB: THREE.Mesh;
  rungMesh: THREE.Mesh;
  midX: number;
  midY: number;
  midZ: number;
  info: NucleotideDetail;
}

export const ThreeDNAHelix: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const animIdRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeInfo, setActiveInfo] = useState<NucleotideDetail | null>(null);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const container = containerRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let dnaGroup: THREE.Group;
    let hoverRing: THREE.Mesh;
    let hoverRingMat: THREE.MeshBasicMaterial;
    let basePairMeshes: BasePairMesh[] = [];

    const initScene = () => {
      if (!container) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        45,
        container.offsetWidth / container.offsetHeight,
        0.1,
        100
      );
      camera.position.set(1.6, 0, 18);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Materials
      const strandAMat = new THREE.MeshPhongMaterial({
        color: 0x17786f,
        transparent: true,
        opacity: 0.85,
        shininess: 70,
      });
      const strandBMat = new THREE.MeshPhongMaterial({
        color: 0x2ba89b,
        transparent: true,
        opacity: 0.85,
        shininess: 70,
      });
      const backboneMat = new THREE.MeshPhongMaterial({
        color: 0x0e3b3a,
        transparent: true,
        opacity: 0.9,
        shininess: 50,
      });
      const rungMat = new THREE.MeshPhongMaterial({
        color: 0xc8e6e2,
        transparent: true,
        opacity: 0.5,
        shininess: 40,
      });

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
      dirLight.position.set(5, 8, 8);
      scene.add(dirLight);

      const tealPointLight = new THREE.PointLight(0x2ba89b, 0.8, 25);
      tealPointLight.position.set(-3, 3, 5);
      scene.add(tealPointLight);

      dnaGroup = new THREE.Group();
      scene.add(dnaGroup);

      basePairMeshes = [];

      for (let i = 0; i < BASE_PAIRS; i++) {
        const t = i / BASE_PAIRS;
        const angle = t * TWIST;
        const y = (t - 0.5) * HELIX_HEIGHT;
        const ax = Math.cos(angle) * HELIX_RADIUS;
        const az = Math.sin(angle) * HELIX_RADIUS;
        const bx = Math.cos(angle + Math.PI) * HELIX_RADIUS;
        const bz = Math.sin(angle + Math.PI) * HELIX_RADIUS;

        const info = NUCLEOTIDE_DATA[basePairNames[i % 4]];

        const nucleoGeo = new THREE.SphereGeometry(0.42, 16, 16);
        const nucleoA = new THREE.Mesh(nucleoGeo, strandAMat.clone());
        nucleoA.position.set(ax, y, az);
        dnaGroup.add(nucleoA);

        const nucleoB = new THREE.Mesh(nucleoGeo, strandBMat.clone());
        nucleoB.position.set(bx, y, bz);
        dnaGroup.add(nucleoB);

        // Backbone tubes
        if (i > 0) {
          const prevT = (i - 1) / BASE_PAIRS;
          const prevAngle = prevT * TWIST;
          const prevY = (prevT - 0.5) * HELIX_HEIGHT;
          const prevAx = Math.cos(prevAngle) * HELIX_RADIUS;
          const prevAz = Math.sin(prevAngle) * HELIX_RADIUS;
          const prevBx = Math.cos(prevAngle + Math.PI) * HELIX_RADIUS;
          const prevBz = Math.sin(prevAngle + Math.PI) * HELIX_RADIUS;

          const pathA = new THREE.LineCurve3(
            new THREE.Vector3(prevAx, prevY, prevAz),
            new THREE.Vector3(ax, y, az)
          );
          dnaGroup.add(
            new THREE.Mesh(new THREE.TubeGeometry(pathA, 4, 0.11, 8, false), backboneMat)
          );

          const pathB = new THREE.LineCurve3(
            new THREE.Vector3(prevBx, prevY, prevBz),
            new THREE.Vector3(bx, y, bz)
          );
          dnaGroup.add(
            new THREE.Mesh(new THREE.TubeGeometry(pathB, 4, 0.11, 8, false), backboneMat)
          );
        }

        // Rungs
        const rungPath = new THREE.LineCurve3(
          new THREE.Vector3(ax, y, az),
          new THREE.Vector3(bx, y, bz)
        );
        const rungMesh = new THREE.Mesh(
          new THREE.TubeGeometry(rungPath, 2, 0.08, 6, false),
          rungMat
        );
        dnaGroup.add(rungMesh);

        basePairMeshes.push({
          meshA: nucleoA,
          meshB: nucleoB,
          rungMesh,
          midX: (ax + bx) / 2,
          midY: y,
          midZ: (az + bz) / 2,
          info,
        });
      }

      // Outer glow sphere
      const glowGeo = new THREE.SphereGeometry(14, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0x2ba89b,
        transparent: true,
        opacity: 0.035,
        side: THREE.BackSide,
      });
      dnaGroup.add(new THREE.Mesh(glowGeo, glowMat));

      // Hover indicator ring
      const ringGeo = new THREE.RingGeometry(4.7, 5.2, 64);
      hoverRingMat = new THREE.MeshBasicMaterial({
        color: 0x17786f,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      hoverRing = new THREE.Mesh(ringGeo, hoverRingMat);
      hoverRing.rotation.x = Math.PI / 2;
      dnaGroup.add(hoverRing);

      startAnimation();
    };

    let targetRotationSpeed = 0.009;
    let currentRotationSpeed = 0.009;
    let isHoveringDNA = false;
    let hoveredIndex = -1;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const updateTooltipPosition = () => {
      const tooltip = tooltipRef.current;
      if (hoveredIndex === -1 || !tooltip) {
        tooltip?.classList.remove("visible");
        return;
      }
      const pair = basePairMeshes[hoveredIndex];
      const vector = new THREE.Vector3(pair.midX, pair.midY, pair.midZ);
      vector.applyMatrix4(dnaGroup.matrixWorld);
      vector.project(camera);

      const rect = container.getBoundingClientRect();
      const rawX = (vector.x * 0.5 + 0.5) * rect.width + rect.left;
      const rawY = (-(vector.y * 0.5) + 0.5) * rect.height + rect.top;

      // Viewport boundary clamp to ensure card is always fully visible
      const cardWidth = 300;
      const cardHeight = 240;
      const clampedX = Math.max(16, Math.min(window.innerWidth - cardWidth - 20, rawX + 24));
      const clampedY = Math.max(80, Math.min(window.innerHeight - cardHeight - 20, rawY - 40));

      tooltip.style.left = `${clampedX}px`;
      tooltip.style.top = `${clampedY}px`;
      tooltip.classList.add("visible");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!renderer) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleMouseEnter = () => {
      isHoveringDNA = true;
      targetRotationSpeed = 0.0015;
    };

    const handleMouseLeave = () => {
      isHoveringDNA = false;
      targetRotationSpeed = 0.009;
      hoveredIndex = -1;
      if (hoverRingMat) hoverRingMat.opacity = 0;
      tooltipRef.current?.classList.remove("visible");
      setActiveInfo(null);
    };

    const startAnimation = () => {
      renderer.domElement.addEventListener("mousemove", handleMouseMove);
      renderer.domElement.addEventListener("mouseenter", handleMouseEnter);
      renderer.domElement.addEventListener("mouseleave", handleMouseLeave);

      const animate = () => {
        animIdRef.current = requestAnimationFrame(animate);

        currentRotationSpeed += (targetRotationSpeed - currentRotationSpeed) * 0.05;
        dnaGroup.rotation.y += currentRotationSpeed;
        dnaGroup.position.y = Math.sin(Date.now() * 0.0008) * 0.35;

        if (isHoveringDNA) {
          raycaster.setFromCamera(mouse, camera);
          let found = false;

          for (let i = 0; i < basePairMeshes.length; i++) {
            const pair = basePairMeshes[i];
            const hits = raycaster.intersectObjects([pair.meshA, pair.meshB, pair.rungMesh]);
            if (hits.length > 0) {
              if (hoveredIndex !== i) {
                hoveredIndex = i;
                setActiveInfo(pair.info);
              }
              found = true;
              hoverRing.position.set(0, pair.midY, 0);
              hoverRingMat.opacity = Math.min(0.3, hoverRingMat.opacity + 0.05);
              break;
            }
          }
          if (!found) {
            hoveredIndex = -1;
            hoverRingMat.opacity = Math.max(0, hoverRingMat.opacity - 0.03);
          }
        } else {
          hoveredIndex = -1;
          if (hoverRingMat) hoverRingMat.opacity = Math.max(0, hoverRingMat.opacity - 0.03);
        }

        updateTooltipPosition();
        renderer.render(scene, camera);
      };

      animate();
    };

    const handleResize = () => {
      if (!container || container.offsetWidth === 0 || !camera || !renderer) return;
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updateTooltipPosition, { passive: true });

    initScene();

    return () => {
      cancelAnimationFrame(animIdRef.current);
      if (renderer) {
        renderer.domElement.removeEventListener("mousemove", handleMouseMove);
        renderer.domElement.removeEventListener("mouseenter", handleMouseEnter);
        renderer.domElement.removeEventListener("mouseleave", handleMouseLeave);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateTooltipPosition);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={containerRef}
        className="absolute right-0 top-0 w-[55%] h-full z-[2] opacity-0 scale-[0.92] animate-[dnaMaterialize_1.2s_cubic-bezier(0.16,1,0.3,1)_0.8s_forwards] pointer-events-auto lg:block hidden cursor-grab active:cursor-grabbing"
      />

      {/* Detailed DNA Tooltip & Interactive Information Card */}
      <div
        ref={tooltipRef}
        className="fixed z-[30] pointer-events-none opacity-0 translate-y-3 scale-95 transition-all duration-300"
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {activeInfo && (
          <div className="w-[300px] bg-white/95 backdrop-blur-2xl border border-brand/25 rounded-2xl p-4 shadow-[0_16px_36px_rgba(23,120,111,0.2)] flex flex-col gap-2.5">
            {/* Header: Name, Symbol, Category */}
            <div className="flex items-center justify-between border-b border-brand/10 pb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                  style={{ background: activeInfo.color }}
                />
                <span className="font-heading font-extrabold text-[16px] text-text-primary">
                  {activeInfo.name}
                </span>
                <span className="font-sans text-[11px] font-bold text-text-muted/70 bg-bg-soft px-1.5 py-0.5 rounded">
                  {activeInfo.formula}
                </span>
              </div>
              <span
                className="font-sans text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: `${activeInfo.color}15`,
                  color: activeInfo.color,
                }}
              >
                {activeInfo.type}
              </span>
            </div>

            {/* Base Pairing Bond */}
            <div className="flex items-center justify-between text-[12px] bg-bg-mint px-2.5 py-1.5 rounded-lg border border-brand/10">
              <span className="font-sans font-semibold text-brand">
                {activeInfo.pairedWith}
              </span>
              <span className="font-sans text-text-muted text-[11px]">
                {activeInfo.bonds}
              </span>
            </div>

            {/* Biological Role */}
            <p className="font-sans text-[12px] text-text-muted leading-relaxed">
              {activeInfo.functionDesc}
            </p>

            {/* Clinical / Medical Insight */}
            <div className="border-t border-brand/10 pt-2 flex items-start gap-1.5 text-[11px] text-brand-dark">
              <span className="font-bold shrink-0 text-brand">⚡ Insight:</span>
              <span className="leading-snug">{activeInfo.medicalNote}</span>
            </div>

            {/* B-DNA Specs Footer */}
            <div className="text-[10px] text-text-muted/70 pt-1 text-center font-mono">
              B-DNA Conformation · 10.5 bp/turn · 3.4 nm pitch
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .visible {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }
      `}</style>
    </>
  );
};

export default ThreeDNAHelix;


"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SensorShowcase() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(12, 10, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x5EDEFF, 2, 20);
    blueLight.position.set(0, 5, 5);
    scene.add(blueLight);

    // Grid Floor
    const grid = new THREE.GridHelper(30, 20, 0x1F66AD, 0x111417);
    grid.position.y = -2;
    scene.add(grid);

    // --- REFINED ESP32 MODEL ---
    const createESP32 = () => {
      const group = new THREE.Group();
      
      // Black PCB
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.15, 6),
        new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.1 })
      );
      group.add(pcb);

      // Gold Pins
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.1 });
      for (let i = -2.7; i <= 2.7; i += 0.4) {
        const pinL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), pinMat);
        pinL.position.set(-1.85, 0.2, i);
        group.add(pinL);
        const pinR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), pinMat);
        pinR.position.set(1.85, 0.2, i);
        group.add(pinR);
      }

      // Main ESP32 Silver Chip with Labeling feel
      const chip = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.3, 2.2),
        new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.05 })
      );
      chip.position.set(0, 0.25, -1);
      group.add(chip);

      // Micro USB Port
      const usb = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.4, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9 })
      );
      usb.position.set(0, 0.2, 2.8);
      group.add(usb);

      // Small Capacitors and ICs
      const compMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
      for (let i = 0; i < 5; i++) {
        const comp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.3), compMat);
        comp.position.set(Math.random() * 1.5 - 0.75, 0.15, Math.random() * 2 + 0.5);
        group.add(comp);
      }

      return group;
    };

    // --- REFINED DHT22 MODEL (White Grid) ---
    const createDHT22 = () => {
      const group = new THREE.Group();
      
      // White Body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.6, 3),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
      );
      group.add(body);

      // Grid Slits
      const gridMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
      for (let i = -1.1; i <= 1.1; i += 0.3) {
        const slit = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.1, 0.1), gridMat);
        slit.position.set(0, 0.31, i);
        group.add(slit);
      }

      // PCB Base (Blue)
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.1, 3.5),
        new THREE.MeshStandardMaterial({ color: 0x1F66AD, metalness: 0.5 })
      );
      base.position.y = -0.35;
      group.add(base);

      // Pins
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 1 });
      for (let i = -0.5; i <= 0.5; i += 0.5) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 0.05), pinMat);
        pin.position.set(i, -0.6, 1.6);
        group.add(pin);
      }

      return group;
    };

    // --- REFINED MQ-2 MODEL (Smoke Sensor) ---
    const createMQ2 = () => {
      const group = new THREE.Group();
      
      // Blue PCB Base
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.1, 3.8),
        new THREE.MeshStandardMaterial({ color: 0x1F66AD, metalness: 0.6 })
      );
      group.add(pcb);

      // Sensor Body (Silver Cylinder)
      const sensor = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.1, 1.4, 32),
        new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.1 })
      );
      sensor.position.y = 0.75;
      group.add(sensor);

      // Top Mesh Screen (Darker)
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1.15, 1.15, 0.15, 32),
        new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 1 })
      );
      mesh.position.y = 1.45;
      group.add(mesh);

      // Gold Potentiometer (Adjustment screw)
      const pot = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.4, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x3333ff })
      );
      pot.position.set(1, 0.2, -1.2);
      group.add(pot);
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 8), new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
      screw.position.set(1, 0.45, -1.2);
      group.add(screw);

      return group;
    };

    // Platform Helper
    const createPlatform = (x: number, z: number, color: number, name: string) => {
      const group = new THREE.Group();
      group.position.set(x, -1.9, z);

      const geo = new THREE.BoxGeometry(6, 0.2, 6);
      const mat = new THREE.MeshStandardMaterial({ color: 0x0a0c0e, metalness: 0.9 });
      const plat = new THREE.Mesh(geo, mat);
      group.add(plat);

      // Hexagonal Glow Ring (Matching Image Style)
      const ringGeo = new THREE.TorusGeometry(3.6, 0.08, 6, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: color });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.1;
      group.add(ring);

      // Label Sprite
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 26px Space Grotesk';
        ctx.textAlign = 'center';
        ctx.fillText(name, 128, 40);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
      sprite.position.set(0, 1.2, 4);
      sprite.scale.set(4, 1, 1);
      group.add(sprite);

      scene.add(group);
      return group;
    };

    const esp32 = createESP32();
    esp32.position.set(0, -1, -5);
    scene.add(esp32);
    createPlatform(0, -5, 0x22c55e, "ESP32 (Controller)");

    const dht22 = createDHT22();
    dht22.position.set(-7, -1, 2);
    dht22.rotation.y = Math.PI / 6;
    scene.add(dht22);
    createPlatform(-7, 2, 0x5EDEFF, "DHT22 (Sensors)");

    const mq2 = createMQ2();
    mq2.position.set(7, -1, 2);
    mq2.rotation.y = -Math.PI / 6;
    scene.add(mq2);
    createPlatform(7, 2, 0xeab308, "MQ-2 (Smoke)");

    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Subtle hardware animation
      esp32.rotation.y = Math.sin(time * 0.4) * 0.05;
      esp32.position.y = -1 + Math.sin(time * 1.2) * 0.12;

      dht22.rotation.y = Math.PI / 6 + Math.sin(time * 0.5) * 0.08;
      dht22.position.y = -1 + Math.sin(time * 0.9) * 0.15;

      mq2.rotation.y = -Math.PI / 6 + Math.sin(time * 0.3) * 0.06;
      mq2.position.y = -1 + Math.sin(time * 1.1) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}

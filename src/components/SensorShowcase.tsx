
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

    // --- ESP32 MODEL ---
    const createESP32 = () => {
      const group = new THREE.Group();
      // PCB
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.1, 6),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5, roughness: 0.2 })
      );
      group.add(pcb);

      // Pins (Gold)
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1 });
      for (let i = -2.5; i <= 2.5; i += 0.5) {
        const pinL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), pinMat);
        pinL.position.set(-1.8, 0.2, i);
        group.add(pinL);
        const pinR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), pinMat);
        pinR.position.set(1.8, 0.2, i);
        group.add(pinR);
      }

      // Silver Chip (ESP32)
      const chip = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.3, 2),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.1 })
      );
      chip.position.set(0, 0.2, -1);
      group.add(chip);

      // USB Port
      const usb = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.4, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 })
      );
      usb.position.set(0, 0.2, 2.8);
      group.add(usb);

      return group;
    };

    // --- DHT22 MODEL (Temp/Humid) ---
    const createDHT22 = () => {
      const group = new THREE.Group();
      // Body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5, 3),
        new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.8 })
      );
      group.add(body);

      // Grid Pattern (Slight indentations)
      const gridMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
      for (let i = -1.2; i <= 1.2; i += 0.4) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.1), gridMat);
        line.position.set(0, 0.26, i);
        group.add(line);
      }

      // PCB Base (Blue)
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.1, 3.5),
        new THREE.MeshStandardMaterial({ color: 0x1F66AD })
      );
      base.position.y = -0.3;
      group.add(base);

      return group;
    };

    // --- MQ-2 MODEL (Smoke/Gas) ---
    const createMQ2 = () => {
      const group = new THREE.Group();
      // PCB Base (Blue)
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.1, 3.5),
        new THREE.MeshStandardMaterial({ color: 0x1F66AD })
      );
      group.add(pcb);

      // Silver Cylinder (Sensor)
      const sensor = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 1.2, 32),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 })
      );
      sensor.position.y = 0.6;
      group.add(sensor);

      // Mesh Pattern on Top
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1.05, 1.05, 0.1, 32),
        new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 })
      );
      mesh.position.y = 1.2;
      group.add(mesh);

      return group;
    };

    // Platforms
    const createPlatform = (x: number, z: number, color: number) => {
      const geo = new THREE.BoxGeometry(6, 0.2, 6);
      const mat = new THREE.MeshStandardMaterial({ color: 0x0a0c0e, metalness: 0.9 });
      const plat = new THREE.Mesh(geo, mat);
      plat.position.set(x, -1.9, z);
      scene.add(plat);

      // Glow Ring
      const ringGeo = new THREE.TorusGeometry(3.5, 0.05, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: color });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(x, -1.8, z);
      scene.add(ring);

      // Label
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = 'bold 24px Space Grotesk';
        ctx.textAlign = 'center';
        let name = "ESP32";
        if (x < 0) name = "DHT22";
        if (x > 0 && z === 0) name = "MQ-2";
        ctx.fillText(name, 128, 40);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
      sprite.position.set(x, -1, z + 4);
      sprite.scale.set(4, 1, 1);
      scene.add(sprite);
    };

    const esp32 = createESP32();
    esp32.position.set(0, -1, -5);
    scene.add(esp32);
    createPlatform(0, -5, 0x22c55e); // Green for controller

    const dht22 = createDHT22();
    dht22.position.set(-7, -1, 2);
    dht22.rotation.y = Math.PI / 4;
    scene.add(dht22);
    createPlatform(-7, 2, 0x5EDEFF); // Blue for temp

    const mq2 = createMQ2();
    mq2.position.set(7, -1, 2);
    mq2.rotation.y = -Math.PI / 4;
    scene.add(mq2);
    createPlatform(7, 2, 0xeab308); // Yellow for smoke/gas

    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Gentle floating/rotation
      esp32.rotation.y = Math.sin(time * 0.5) * 0.1;
      esp32.position.y = -1 + Math.sin(time) * 0.1;

      dht22.rotation.y = Math.PI / 4 + Math.sin(time * 0.6) * 0.1;
      dht22.position.y = -1 + Math.sin(time * 1.1) * 0.1;

      mq2.rotation.y = -Math.PI / 4 + Math.sin(time * 0.4) * 0.1;
      mq2.position.y = -1 + Math.sin(time * 0.9) * 0.1;

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

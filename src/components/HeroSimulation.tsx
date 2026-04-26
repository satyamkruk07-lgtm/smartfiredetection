
"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function HeroSimulation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0); // 0: Idle, 1: Fire, 2: Path, 3: Drone Move

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x5EDEFF, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Grid
    const gridHelper = new THREE.GridHelper(15, 15, 0x1F66AD, 0x111417);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Rooms
    const rooms: THREE.Mesh[] = [];
    const roomPositions: [number, number, number][] = [
      [-2, 0, -2], [0, 0, -2], [2, 0, -2],
      [-2, 0, 0], [0, 0, 0], [2, 0, 0],
      [-2, 0, 2], [0, 0, 2], [2, 0, 2]
    ];

    const roomGeometry = new THREE.BoxGeometry(1.8, 1, 1.8);
    roomPositions.forEach((pos, i) => {
      const material = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.3,
        emissive: 0x22c55e,
        emissiveIntensity: 0.1
      });
      const room = new THREE.Mesh(roomGeometry, material);
      room.position.set(...pos);
      room.userData = { id: i, originalColor: 0x22c55e };
      scene.add(room);
      rooms.push(room);

      // Edges
      const edges = new THREE.EdgesGeometry(roomGeometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent: true }));
      line.position.set(...pos);
      scene.add(line);
    });

    // Drone
    const droneGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const droneMaterial = new THREE.MeshStandardMaterial({ color: 0x5EDEFF, emissive: 0x5EDEFF, emissiveIntensity: 2 });
    const drone = new THREE.Mesh(droneGeometry, droneMaterial);
    drone.position.set(5, 4, 5);
    scene.add(drone);

    // Path Line
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0x5EDEFF, transparent: true, opacity: 0 });
    let pathLine: THREE.Line | null = null;

    const simulationLoop = () => {
      // Logic for stages
      setStage(s => (s + 1) % 4);
    };

    const interval = setInterval(simulationLoop, 3000);

    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.y += 0.001;

      // Update room colors based on stage
      rooms.forEach((room, i) => {
        const mat = room.material as THREE.MeshStandardMaterial;
        if (stage >= 1 && i === 4) { // Room 4 (Center) catches fire
          mat.color.set(0xff0000);
          mat.emissive.set(0xff0000);
          mat.emissiveIntensity = 1 + Math.sin(Date.now() * 0.01) * 0.5;
        } else {
          mat.color.set(0x22c55e);
          mat.emissive.set(0x22c55e);
          mat.emissiveIntensity = 0.1;
        }
      });

      // Path Visibility
      if (stage >= 2) {
        if (!pathLine) {
          const points = [
            new THREE.Vector3(5, 4, 5),
            new THREE.Vector3(0, 1.5, 0),
            new THREE.Vector3(-5, 0, -5)
          ];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          pathLine = new THREE.Line(geometry, pathMaterial);
          scene.add(pathLine);
        }
        pathMaterial.opacity = Math.min(pathMaterial.opacity + 0.05, 0.8);
      } else {
        pathMaterial.opacity = Math.max(pathMaterial.opacity - 0.05, 0);
      }

      // Drone Movement
      if (stage === 3) {
        const t = (Date.now() % 3000) / 3000;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(5, 4, 5),
          new THREE.Vector3(0, 1.5, 0),
          new THREE.Vector3(-5, 0, -5)
        ]);
        const pos = curve.getPointAt(t);
        drone.position.copy(pos);
      } else if (stage === 0) {
        drone.position.lerp(new THREE.Vector3(5, 4, 5), 0.1);
      }

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
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [stage]);

  return <div ref={mountRef} className="w-full h-full" />;
}

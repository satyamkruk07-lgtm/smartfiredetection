
"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DroneBay() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 10, 5);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x5EDEFF, 2, 20);
    blueLight.position.set(0, 5, 0);
    scene.add(blueLight);

    // Grid Floor
    const grid = new THREE.GridHelper(30, 20, 0x1F66AD, 0x111417);
    scene.add(grid);

    // Drone Group Construction
    const createDrone = (id: number, status: string) => {
      const droneGroup = new THREE.Group();
      
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.1 });
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
      
      // Core
      const core = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), bodyMat);
      droneGroup.add(core);

      // Arms
      const arm1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.1), frameMat);
      arm1.rotation.y = Math.PI / 4;
      droneGroup.add(arm1);
      const arm2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.1), frameMat);
      arm2.rotation.y = -Math.PI / 4;
      droneGroup.add(arm2);

      // Rotors
      const rotors: THREE.Mesh[] = [];
      const rotorPos = [[0.6, 0.1, 0.6], [-0.6, 0.1, 0.6], [0.6, 0.1, -0.6], [-0.6, 0.1, -0.6]];
      rotorPos.forEach(pos => {
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.15, 8), frameMat);
        motor.position.set(pos[0], 0, pos[2]);
        droneGroup.add(motor);

        const rotor = new THREE.Mesh(
          new THREE.BoxGeometry(1, 0.01, 0.1),
          new THREE.MeshBasicMaterial({ color: 0x5EDEFF, transparent: true, opacity: 0.5 })
        );
        rotor.position.set(pos[0], 0.1, pos[2]);
        droneGroup.add(rotor);
        rotors.push(rotor);
      });

      // Status Light
      let lightColor = 0x5EDEFF; // Active/Blue
      if (status === 'Charging') lightColor = 0xeab308; // Yellow
      if (status === 'Standby') lightColor = 0x22c55e; // Green
      
      const sLight = new THREE.PointLight(lightColor, 2, 5);
      sLight.position.set(0, -0.2, 0);
      droneGroup.add(sLight);

      // Dock Platform
      const dockGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.2, 32);
      const dockMat = new THREE.MeshStandardMaterial({ color: 0x1a1d23, metalness: 0.8 });
      const dock = new THREE.Mesh(dockGeo, dockMat);
      dock.position.y = -2;
      droneGroup.add(dock);

      // Dock Glow Ring
      const ringGeo = new THREE.TorusGeometry(1.3, 0.05, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: lightColor });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.89;
      droneGroup.add(ring);

      return { droneGroup, rotors, status };
    };

    const droneData = [
      { id: 1, status: 'Active', x: -5 },
      { id: 2, status: 'Charging', x: 0 },
      { id: 3, status: 'Standby', x: 5 }
    ];

    const drones = droneData.map(d => {
      const { droneGroup, rotors } = createDrone(d.id, d.status);
      droneGroup.position.set(d.x, 2, 0);
      scene.add(droneGroup);
      return { group: droneGroup, rotors, status: d.status, baseY: 2, x: d.x };
    });

    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      drones.forEach((d, i) => {
        // Rotor spin only for active or pulsing for charging
        const spinSpeed = d.status === 'Active' ? 0.5 : d.status === 'Charging' ? 0.05 : 0;
        d.rotors.forEach(r => r.rotation.y += spinSpeed);

        // Hover animation
        const hoverAmp = d.status === 'Active' ? 0.3 : 0.05;
        d.group.position.y = d.baseY + Math.sin(time * 2 + i) * hoverAmp;
        
        // Gentle rotation
        d.group.rotation.y = Math.sin(time * 0.5 + i) * 0.1;
      });

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

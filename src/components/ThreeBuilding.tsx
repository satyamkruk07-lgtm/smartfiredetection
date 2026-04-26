
"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RoomData {
  id: string;
  pos: [number, number, number];
  status: 'safe' | 'smoke' | 'fire';
  label: string;
}

interface ThreeBuildingProps {
  rooms: RoomData[];
  onRoomClick?: (id: string) => void;
  dronePath?: THREE.Vector3[];
}

export default function ThreeBuilding({ rooms, onRoomClick, dronePath }: ThreeBuildingProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(12, 10, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x5EDEFF, 2);
    pointLight.position.set(5, 10, 5);
    scene.add(pointLight);

    // Create Floor Grid with tech feel
    const gridHelper = new THREE.GridHelper(30, 30, 0x1F66AD, 0x111417);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Rooms logic
    const roomMeshes: THREE.Mesh[] = [];
    const fireLights: THREE.PointLight[] = [];

    rooms.forEach((room) => {
      const geometry = new THREE.BoxGeometry(2, 1.5, 2);
      let color = 0x22c55e; // green
      let intensity = 0.2;
      
      if (room.status === 'smoke') {
        color = 0xeab308; // yellow
        intensity = 0.5;
      }
      if (room.status === 'fire') {
        color = 0xef4444; // red
        intensity = 2;

        // Add a local light for fire glow
        const fLight = new THREE.PointLight(0xef4444, 2, 5);
        fLight.position.set(room.pos[0], room.pos[1] + 1, room.pos[2]);
        scene.add(fLight);
        fireLights.push(fLight);
      }

      const material = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: room.status === 'fire' ? 0.8 : 0.4,
        emissive: color,
        emissiveIntensity: intensity,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...room.pos);
      mesh.userData = { id: room.id, status: room.status };
      scene.add(mesh);
      roomMeshes.push(mesh);

      // Edge glow for all rooms
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ 
        color: room.status === 'fire' ? 0xff0000 : 0xffffff, 
        opacity: 0.5, 
        transparent: true 
      }));
      line.position.set(...room.pos);
      scene.add(line);
    });

    // Exit Sign (Glowing Gate)
    const exitGeo = new THREE.BoxGeometry(1, 3, 0.2);
    const exitMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 2 });
    const exitSign = new THREE.Mesh(exitGeo, exitMat);
    exitSign.position.set(8, 0.75, 0);
    scene.add(exitSign);

    // Drone (THE HERO)
    const droneGroup = new THREE.Group();
    const droneBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x5EDEFF, emissive: 0x5EDEFF, emissiveIntensity: 3 })
    );
    droneGroup.add(droneBody);
    
    // Drone Light
    const dLight = new THREE.PointLight(0x5EDEFF, 2, 8);
    droneGroup.add(dLight);
    
    // Rotors (Visual only)
    for(let i=0; i<4; i++) {
        const rotor = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.05, 0.1),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        rotor.position.set(Math.cos(i * Math.PI/2) * 0.5, 0.2, Math.sin(i * Math.PI/2) * 0.5);
        droneGroup.add(rotor);
    }

    droneGroup.position.set(0, 5, 0);
    scene.add(droneGroup);

    // Glowing Path Line
    let pathLine: THREE.Line | null = null;
    if (dronePath && dronePath.length > 1) {
      const curve = new THREE.CatmullRomCurve3(dronePath);
      const points = curve.getPoints(100);
      const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
      pathLine = new THREE.Line(pathGeometry, new THREE.LineBasicMaterial({ 
        color: 0x5EDEFF, 
        transparent: true, 
        opacity: 0.8,
        linewidth: 2 
      }));
      scene.add(pathLine);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;

      // Rotate building slowly
      scene.rotation.y += 0.001;

      // Flickering Fire Effect
      roomMeshes.forEach((mesh, index) => {
        if (mesh.userData.status === 'fire') {
          const flicker = 1.5 + Math.sin(time * 10) * 0.5 + Math.random() * 0.2;
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = flicker;
          
          // Subtle pulse scale
          const pulse = 1 + Math.sin(time * 5) * 0.02;
          mesh.scale.set(pulse, pulse, pulse);
        }
      });

      fireLights.forEach(light => {
          light.intensity = 2 + Math.sin(time * 15) * 1 + Math.random() * 0.5;
      });

      // Drone Movement & Rotation
      if (dronePath && dronePath.length > 0) {
        const loopTime = 8; // seconds
        const t = (time % loopTime) / loopTime;
        const curve = new THREE.CatmullRomCurve3(dronePath);
        const position = curve.getPointAt(t);
        droneGroup.position.copy(position);
        
        // Bobbing motion
        droneGroup.position.y += Math.sin(time * 4) * 0.1;
        
        // Tilt based on movement (simple mock)
        droneGroup.rotation.z = Math.sin(time * 2) * 0.1;
        droneGroup.rotation.x = Math.cos(time * 2) * 0.1;
      }

      // Path pulsing
      if (pathLine) {
          pathLine.material.opacity = 0.4 + Math.sin(time * 3) * 0.3;
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
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [rooms, dronePath]);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}

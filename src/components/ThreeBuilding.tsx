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
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x5EDEFF, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create Floor Grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x1F66AD, 0x111417);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Rooms logic
    const roomMeshes: THREE.Mesh[] = [];
    rooms.forEach((room) => {
      const geometry = new THREE.BoxGeometry(2, 1.5, 2);
      let color = 0x00ff00; // green
      if (room.status === 'smoke') color = 0xffff00; // yellow
      if (room.status === 'fire') color = 0xff0000; // red

      const material = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: 0.6,
        emissive: color,
        emissiveIntensity: room.status === 'fire' ? 1.5 : 0.2,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...room.pos);
      mesh.userData = { id: room.id };
      scene.add(mesh);
      roomMeshes.push(mesh);

      // Edge glow
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true }));
      line.position.set(...room.pos);
      scene.add(line);
    });

    // Exit Sign (Pseudo)
    const exitGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
    const exitMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const exitMesh = new THREE.Mesh(exitGeometry, exitMaterial);
    exitMesh.position.set(8, 0, 0);
    scene.add(exitMesh);

    // Drone (Pseudo)
    const droneGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const droneMaterial = new THREE.MeshStandardMaterial({ color: 0x5EDEFF, emissive: 0x5EDEFF, emissiveIntensity: 2 });
    const drone = new THREE.Mesh(droneGeometry, droneMaterial);
    drone.position.set(0, 3, 0);
    scene.add(drone);

    // Path Line
    if (dronePath && dronePath.length > 1) {
      const curve = new THREE.CatmullRomCurve3(dronePath);
      const points = curve.getPoints(50);
      const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const pathLine = new THREE.Line(pathGeometry, new THREE.LineBasicMaterial({ color: 0x5EDEFF }));
      scene.add(pathLine);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate building slowly
      scene.rotation.y += 0.002;

      // Pulse fire rooms
      roomMeshes.forEach((mesh, index) => {
        const room = rooms[index];
        if (room.status === 'fire') {
          const intensity = 1 + Math.sin(Date.now() * 0.01) * 0.5;
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
        }
      });

      // Animate Drone along path if exists
      if (dronePath && dronePath.length > 0) {
        const time = Date.now() * 0.0005;
        const loopTime = 10; // seconds
        const t = (time % loopTime) / loopTime;
        const curve = new THREE.CatmullRomCurve3(dronePath);
        const position = curve.getPointAt(t);
        drone.position.copy(position);
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

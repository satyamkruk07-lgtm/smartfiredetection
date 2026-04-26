
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

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(15, 12, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Realistic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Floor Grid
    const gridHelper = new THREE.GridHelper(40, 40, 0x1F66AD, 0x0a0c0e);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Create a realistic room function
    const createRoom = (room: RoomData) => {
      const roomGroup = new THREE.Group();
      roomGroup.position.set(...room.pos);

      const roomWidth = 3.5;
      const roomHeight = 2;
      const roomDepth = 3.5;
      const wallThickness = 0.15;

      // Floor
      const floorGeo = new THREE.BoxGeometry(roomWidth, 0.05, roomDepth);
      const floorMat = new THREE.MeshStandardMaterial({ 
        color: 0x1a1c1e,
        roughness: 0.8,
        metalness: 0.2
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.receiveShadow = true;
      roomGroup.add(floor);

      // Walls
      const wallMat = new THREE.MeshStandardMaterial({ 
        color: 0x2a2c2e, 
        transparent: true, 
        opacity: 0.8,
        roughness: 0.9 
      });

      // Status overlay glow
      let statusColor = 0x22c55e;
      let glowIntensity = 0.1;
      if (room.status === 'smoke') { statusColor = 0xeab308; glowIntensity = 0.4; }
      if (room.status === 'fire') { statusColor = 0xef4444; glowIntensity = 1.2; }

      const statusMat = new THREE.MeshStandardMaterial({
        color: statusColor,
        emissive: statusColor,
        emissiveIntensity: glowIntensity,
        transparent: true,
        opacity: 0.2
      });

      const glowBox = new THREE.Mesh(new THREE.BoxGeometry(roomWidth - 0.2, roomHeight, roomDepth - 0.2), statusMat);
      glowBox.position.y = roomHeight / 2;
      roomGroup.add(glowBox);

      // Back Wall
      const wallB = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness), wallMat);
      wallB.position.set(0, roomHeight / 2, -roomDepth / 2);
      roomGroup.add(wallB);

      // Left Wall
      const wallL = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth), wallMat);
      wallL.position.set(-roomWidth / 2, roomHeight / 2, 0);
      roomGroup.add(wallL);

      // Labels (Canvas Sprites)
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0,0,256,128);
        context.font = 'bold 40px Space Grotesk';
        context.textAlign = 'center';
        context.fillStyle = 'white';
        context.fillText(room.label, 128, 64);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(3, 1.5, 1);
      sprite.position.y = roomHeight + 0.5;
      roomGroup.add(sprite);

      if (room.status === 'fire') {
        const fireLight = new THREE.PointLight(0xef4444, 2, 6);
        fireLight.position.set(0, 1, 0);
        roomGroup.add(fireLight);
        roomGroup.userData.fireLight = fireLight;
      }

      scene.add(roomGroup);
      return roomGroup;
    };

    const roomGroups = rooms.map(createRoom);

    // Detailed Drone Model
    const createDrone = () => {
      const drone = new THREE.Group();

      // Main Body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.2, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 })
      );
      body.castShadow = true;
      drone.add(body);

      // Arms
      const armGeo = new THREE.BoxGeometry(1.2, 0.05, 0.05);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
      
      const arm1 = new THREE.Mesh(armGeo, armMat);
      arm1.rotation.y = Math.PI / 4;
      drone.add(arm1);
      
      const arm2 = new THREE.Mesh(armGeo, armMat);
      arm2.rotation.y = -Math.PI / 4;
      drone.add(arm2);

      // Rotors
      const rotors: THREE.Mesh[] = [];
      const rotorPositions = [[0.6, 0.1, 0.6], [-0.6, 0.1, 0.6], [0.6, 0.1, -0.6], [-0.6, 0.1, -0.6]];
      rotorPositions.forEach(pos => {
        const rotor = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.01, 0.04),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
        );
        rotor.position.set(pos[0], pos[1], pos[2]);
        drone.add(rotor);
        rotors.push(rotor);
      });

      // Status Light
      const dLight = new THREE.PointLight(0x5EDEFF, 2, 5);
      dLight.position.set(0, -0.2, 0);
      drone.add(dLight);

      const bottomLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x5EDEFF })
      );
      bottomLight.position.set(0, -0.15, 0);
      drone.add(bottomLight);

      return { drone, rotors };
    };

    const { drone, rotors } = createDrone();
    scene.add(drone);

    // Exit Sign
    const exitGroup = new THREE.Group();
    exitGroup.position.set(8, 0, 0);
    const exitGeo = new THREE.BoxGeometry(1.5, 0.2, 3);
    const exitMat = new THREE.MeshStandardMaterial({ 
      color: 0x22c55e, 
      emissive: 0x22c55e, 
      emissiveIntensity: 2 
    });
    const exitSign = new THREE.Mesh(exitGeo, exitMat);
    exitGroup.add(exitSign);
    
    // EXIT Text
    const exitCanvas = document.createElement('canvas');
    exitCanvas.width = 128;
    exitCanvas.height = 64;
    const exitCtx = exitCanvas.getContext('2d');
    if (exitCtx) {
      exitCtx.fillStyle = '#22c55e';
      exitCtx.fillRect(0,0,128,64);
      exitCtx.font = 'bold 30px Space Grotesk';
      exitCtx.fillStyle = 'white';
      exitCtx.textAlign = 'center';
      exitCtx.fillText('EXIT', 64, 45);
    }
    const exitTex = new THREE.CanvasTexture(exitCanvas);
    const exitLabel = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshBasicMaterial({ map: exitTex }));
    exitLabel.rotation.x = -Math.PI / 2;
    exitLabel.position.y = 0.11;
    exitGroup.add(exitLabel);
    scene.add(exitGroup);

    // Glowing Path
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

      // Rotate rotors
      rotors.forEach(r => r.rotation.y += 0.5);

      // Flickering Fire
      roomGroups.forEach((group, index) => {
        if (rooms[index].status === 'fire' && group.userData.fireLight) {
          group.userData.fireLight.intensity = 2 + Math.sin(time * 15) * 1 + Math.random() * 0.5;
        }
      });

      // Drone Movement
      if (dronePath && dronePath.length > 0) {
        const t = (time % 10) / 10;
        const curve = new THREE.CatmullRomCurve3(dronePath);
        const position = curve.getPointAt(t);
        drone.position.copy(position);
        drone.position.y += Math.sin(time * 3) * 0.15; // Hover
        
        // Dynamic Tilt
        drone.rotation.z = Math.sin(time * 2) * 0.1;
        drone.rotation.x = Math.cos(time * 2) * 0.1;
      }

      // Path pulse
      if (pathLine) {
        pathLine.material.opacity = 0.4 + Math.sin(time * 4) * 0.4;
      }

      scene.rotation.y = Math.PI / 8 + Math.sin(time * 0.2) * 0.05;

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

  return <div ref={mountRef} className="w-full h-full cursor-crosshair" />;
}


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

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(18, 15, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Boosted Realistic Lighting for Visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(15, 25, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    scene.add(sunLight);

    // Subtle blue rim light for tech feel
    const rimLight = new THREE.PointLight(0x1F66AD, 0.8, 50);
    rimLight.position.set(-15, 10, -15);
    scene.add(rimLight);

    // Floor Grid
    const gridHelper = new THREE.GridHelper(50, 50, 0x1F66AD, 0x1a1d23);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // Architectural Room Builder
    const createRoom = (room: RoomData) => {
      const roomGroup = new THREE.Group();
      roomGroup.position.set(...room.pos);

      const w = 4; // Width
      const h = 2.2; // Height
      const d = 4; // Depth
      const t = 0.15; // Wall thickness

      // Floor
      const floorGeo = new THREE.BoxGeometry(w, 0.1, d);
      const floorMat = new THREE.MeshStandardMaterial({ 
        color: 0x1a1d23,
        roughness: 0.7,
        metalness: 0.1
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.receiveShadow = true;
      roomGroup.add(floor);

      // Brighter Walls Material
      const wallMat = new THREE.MeshStandardMaterial({ 
        color: 0x3a3f47, 
        transparent: true, 
        opacity: 0.85,
        roughness: 0.9 
      });

      // Status Glow Indicator (Interior Floor Glow)
      let statusColor = 0x22c55e;
      let glowIntensity = 0.1;
      if (room.status === 'smoke') { statusColor = 0xeab308; glowIntensity = 0.5; }
      if (room.status === 'fire') { statusColor = 0xef4444; glowIntensity = 1.5; }

      const glowMat = new THREE.MeshStandardMaterial({
        color: statusColor,
        emissive: statusColor,
        emissiveIntensity: glowIntensity,
        transparent: true,
        opacity: 0.2
      });
      const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.2, d - 0.2), glowMat);
      glowPlane.rotation.x = -Math.PI / 2;
      glowPlane.position.y = 0.06;
      roomGroup.add(glowPlane);

      // Walls (Constructing with thickness and doorways)
      // Back Wall
      const wallBack = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), wallMat);
      wallBack.position.set(0, h/2, -d/2);
      wallBack.castShadow = true;
      roomGroup.add(wallBack);

      // Side Walls
      const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(t, h, d), wallMat);
      wallLeft.position.set(-w/2, h/2, 0);
      wallLeft.castShadow = true;
      roomGroup.add(wallLeft);

      const wallRight = new THREE.Mesh(new THREE.BoxGeometry(t, h, d), wallMat);
      wallRight.position.set(w/2, h/2, 0);
      wallRight.castShadow = true;
      roomGroup.add(wallRight);

      // Label Sprite
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Space Grotesk';
        ctx.textAlign = 'center';
        ctx.fillText(room.label, 128, 64);
      }
      const labelTex = new THREE.CanvasTexture(canvas);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex, transparent: true }));
      sprite.scale.set(3, 1.5, 1);
      sprite.position.y = h + 0.6;
      roomGroup.add(sprite);

      // Fire Animation Elements
      if (room.status === 'fire') {
        const fireLight = new THREE.PointLight(0xef4444, 3, 10);
        fireLight.position.set(0, 1, 0);
        roomGroup.add(fireLight);
        roomGroup.userData.fireLight = fireLight;

        // Particle group for fire simulation
        const particleCount = 12;
        const particles: THREE.Mesh[] = [];
        const partGeo = new THREE.SphereGeometry(0.25, 8, 8);
        for (let i = 0; i < particleCount; i++) {
          const partMat = new THREE.MeshBasicMaterial({ 
            color: 0xef4444, 
            transparent: true, 
            opacity: 0.8 
          });
          const part = new THREE.Mesh(partGeo, partMat);
          part.position.set(
            (Math.random() - 0.5) * 1.5,
            Math.random() * 2,
            (Math.random() - 0.5) * 1.5
          );
          roomGroup.add(part);
          particles.push(part);
        }
        roomGroup.userData.fireParticles = particles;
      }

      scene.add(roomGroup);
      return roomGroup;
    };

    const roomGroups = rooms.map(createRoom);

    // Quadcopter Drone Model
    const createDrone = () => {
      const droneGroup = new THREE.Group();
      
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.1 });
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 });
      
      // Main Core - WHITE as requested
      const core = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.5), bodyMat);
      core.castShadow = true;
      droneGroup.add(core);

      // Arms (Cross configuration)
      const armLength = 1.0;
      const arm1 = new THREE.Mesh(new THREE.BoxGeometry(armLength, 0.05, 0.05), frameMat);
      arm1.rotation.y = Math.PI / 4;
      droneGroup.add(arm1);

      const arm2 = new THREE.Mesh(new THREE.BoxGeometry(armLength, 0.05, 0.05), frameMat);
      arm2.rotation.y = -Math.PI / 4;
      droneGroup.add(arm2);

      // Propellers
      const rotors: THREE.Mesh[] = [];
      const rotorPos = [[0.4, 0.08, 0.4], [-0.4, 0.08, 0.4], [0.4, 0.08, -0.4], [-0.4, 0.08, -0.4]];
      rotorPos.forEach(pos => {
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 8), frameMat);
        motor.position.set(pos[0], pos[1] - 0.04, pos[2]);
        droneGroup.add(motor);

        const rotor = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.01, 0.05),
          new THREE.MeshBasicMaterial({ color: 0x5EDEFF, transparent: true, opacity: 0.6 })
        );
        rotor.position.set(pos[0], pos[1], pos[2]);
        droneGroup.add(rotor);
        rotors.push(rotor);
      });

      // Tactical Light
      const dLight = new THREE.PointLight(0x5EDEFF, 2.5, 10);
      dLight.position.set(0, -0.2, 0);
      droneGroup.add(dLight);

      const lens = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x5EDEFF })
      );
      lens.position.set(0, -0.1, 0);
      droneGroup.add(lens);

      // Shadow Mesh
      const shadowGeo = new THREE.CircleGeometry(0.6, 32);
      const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -3.5; 
      scene.add(shadow);

      return { droneGroup, rotors, shadow };
    };

    const { droneGroup, rotors, shadow } = createDrone();
    scene.add(droneGroup);

    // Glowing EXIT Sign
    const exitPos = new THREE.Vector3(10, 0, 0);
    const exitSign = new THREE.Group();
    exitSign.position.copy(exitPos);
    
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 3), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    exitSign.add(frame);

    const canvasExit = document.createElement('canvas');
    canvasExit.width = 128;
    canvasExit.height = 64;
    const ctxExit = canvasExit.getContext('2d');
    if (ctxExit) {
      ctxExit.fillStyle = '#22c55e';
      ctxExit.fillRect(0,0,128,64);
      ctxExit.font = 'bold 36px Space Grotesk';
      ctxExit.fillStyle = 'white';
      ctxExit.textAlign = 'center';
      ctxExit.fillText('EXIT', 64, 45);
    }
    const exitLabelMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvasExit) });
    const labelPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), exitLabelMat);
    labelPlane.rotation.x = -Math.PI / 2;
    labelPlane.position.y = 0.06;
    exitSign.add(labelPlane);

    const exitGlow = new THREE.PointLight(0x22c55e, 2, 8);
    exitGlow.position.y = 1;
    exitSign.add(exitGlow);
    scene.add(exitSign);

    // Dotted Evacuation Path
    let pathObj: THREE.Line | null = null;
    if (dronePath && dronePath.length > 1) {
      const curve = new THREE.CatmullRomCurve3(dronePath);
      const points = curve.getPoints(100);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      pathObj = new THREE.Line(geometry, new THREE.LineDashedMaterial({ 
        color: 0x5EDEFF, 
        dashSize: 0.5, 
        gapSize: 0.2,
        transparent: true,
        opacity: 0.9
      }));
      pathObj.computeLineDistances();
      scene.add(pathObj);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Rotor Animation
      rotors.forEach(r => r.rotation.y += 0.5);

      // Fire & Light Flickering
      roomGroups.forEach((group, i) => {
        if (rooms[i].status === 'fire') {
          if (group.userData.fireLight) {
            group.userData.fireLight.intensity = 3 + Math.sin(time * 15) * 1.0 + Math.random() * 0.5;
          }
          if (group.userData.fireParticles) {
            group.userData.fireParticles.forEach((p: THREE.Mesh, pi: number) => {
              p.position.y = (Math.sin(time * 3 + pi) + 1.5);
              p.scale.setScalar(0.9 + Math.sin(time * 6 + pi) * 0.3);
              const mat = p.material as THREE.MeshBasicMaterial;
              mat.opacity = 0.4 + Math.sin(time * 4 + pi) * 0.4;
            });
          }
        }
      });

      // Drone Flight Logic
      if (dronePath && dronePath.length > 0) {
        const cycle = 12; // seconds for full path
        const t = (time % cycle) / cycle;
        const curve = new THREE.CatmullRomCurve3(dronePath);
        const targetPos = curve.getPointAt(t);
        
        droneGroup.position.copy(targetPos);
        droneGroup.position.y = 3.5 + Math.sin(time * 4) * 0.15; // Hover
        
        // Dynamic Banking/Tilt
        droneGroup.rotation.z = Math.sin(time * 2.5) * 0.1;
        droneGroup.rotation.x = Math.cos(time * 2.5) * 0.05;

        // Shadow follows on grid
        shadow.position.set(targetPos.x, -0.01, targetPos.z);
        shadow.scale.setScalar(1 + (droneGroup.position.y - 3.5) * 0.5);
      }

      // Path Pulse
      if (pathObj) {
        (pathObj.material as THREE.LineDashedMaterial).opacity = 0.5 + Math.sin(time * 5) * 0.4;
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

  return <div ref={mountRef} className="w-full h-full cursor-crosshair" />;
}

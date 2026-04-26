
"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(20, 18, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // --- INTERACTION ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2.1; // Limit tilt to stay above floor

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(15, 25, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const floorLight = new THREE.PointLight(0x1F66AD, 0.5, 50);
    floorLight.position.set(0, 10, 0);
    scene.add(floorLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(50, 40, 0x1F66AD, 0x1a1d23);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // --- ROOM LABEL CREATOR ---
    const createRoomLabel = (text: string) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 128;

      if (ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 48px Space Grotesk';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Glow effect for text
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#5EDEFF';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(8, 2, 1);
      return sprite;
    };

    // --- ICON GENERATORS ---
    const createFireIcon = () => {
      const group = new THREE.Group();
      const fireMat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.9 });
      for (let i = 0; i < 3; i++) {
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 8), fireMat);
        flame.position.set((i - 1) * 0.2, 0.4, 0);
        flame.rotation.z = (Math.random() - 0.5) * 0.5;
        group.add(flame);
      }
      return group;
    };

    const createWarningIcon = () => {
      const group = new THREE.Group();
      const triGeo = new THREE.ConeGeometry(0.5, 0.8, 3);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
      const triangle = new THREE.Mesh(triGeo, mat);
      triangle.rotation.x = Math.PI;
      triangle.position.y = 0.5;
      group.add(triangle);
      return group;
    };

    const createCheckIcon = () => {
      const group = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
      const part1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.15), mat);
      part1.rotation.z = -Math.PI / 4;
      part1.position.set(-0.15, 0.3, 0);
      group.add(part1);
      const part2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.7, 0.15), mat);
      part2.rotation.z = Math.PI / 4;
      part2.position.set(0.1, 0.4, 0);
      group.add(part2);
      return group;
    };

    // --- ROOM BUILDER ---
    const createRoom = (room: RoomData) => {
      const roomGroup = new THREE.Group();
      roomGroup.position.set(...room.pos);

      const w = 4.5;
      const h = 2.5;
      const d = 4.5;
      const wallT = 0.25;

      const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a1d23, roughness: 0.8 });
      const floor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), floorMat);
      floor.receiveShadow = true;
      roomGroup.add(floor);

      const wallMat = new THREE.MeshStandardMaterial({ color: 0x333a45, metalness: 0.2, roughness: 0.9 });
      
      const walls = [
        { size: [w, h, wallT], pos: [0, h/2, -d/2] }, // back
        { size: [wallT, h, d], pos: [-w/2, h/2, 0] }, // left
        { size: [wallT, h, d], pos: [w/2, h/2, 0] }, // right
      ];

      walls.forEach(config => {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(...config.size as [number, number, number]), wallMat);
        wall.position.set(...config.pos as [number, number, number]);
        wall.castShadow = true;
        roomGroup.add(wall);
      });

      // Status Colors
      let statusColor = 0x22c55e;
      if (room.status === 'smoke') statusColor = 0xffcc00;
      if (room.status === 'fire') statusColor = 0xff4400;

      const glowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(w - 0.4, d - 0.4),
        new THREE.MeshStandardMaterial({
          color: statusColor,
          emissive: statusColor,
          emissiveIntensity: 0.8,
          transparent: true,
          opacity: 0.2
        })
      );
      glowPlane.rotation.x = -Math.PI / 2;
      glowPlane.position.y = 0.06;
      roomGroup.add(glowPlane);

      // Label
      const labelSprite = createRoomLabel(room.label);
      labelSprite.position.y = h + 1.2;
      roomGroup.add(labelSprite);

      // Status Icon
      let icon;
      if (room.status === 'fire') icon = createFireIcon();
      else if (room.status === 'smoke') icon = createWarningIcon();
      else icon = createCheckIcon();
      
      icon.position.y = h + 0.2;
      roomGroup.add(icon);
      roomGroup.userData.icon = icon;

      // Status Light
      const sLight = new THREE.PointLight(statusColor, 1.5, 8);
      sLight.position.set(0, 1.5, 0);
      roomGroup.add(sLight);
      roomGroup.userData.light = sLight;

      scene.add(roomGroup);
      return roomGroup;
    };

    const roomGroups = rooms.map(createRoom);

    // Drone
    const createDrone = () => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.6), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      g.add(body);
      const rotors: THREE.Mesh[] = [];
      const rotorPos = [[0.4, 0.1, 0.4], [-0.4, 0.1, 0.4], [0.4, 0.1, -0.4], [-0.4, 0.1, -0.4]];
      rotorPos.forEach(p => {
        const rotor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.01, 0.05), new THREE.MeshBasicMaterial({ color: 0x5EDEFF, transparent: true, opacity: 0.7 }));
        rotor.position.set(p[0], p[1], p[2]);
        g.add(rotor);
        rotors.push(rotor);
      });
      const dLight = new THREE.PointLight(0x5EDEFF, 2, 8);
      dLight.position.y = -0.5;
      g.add(dLight);
      return { g, rotors };
    };

    const { g: drone, rotors } = createDrone();
    scene.add(drone);

    // Exit
    const exitGroup = new THREE.Group();
    exitGroup.position.set(10, 0, 0);
    const exitPlate = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 3), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1 }));
    exitGroup.add(exitPlate);
    const exitLabel = createRoomLabel("EXIT");
    exitLabel.position.y = 3;
    exitGroup.add(exitLabel);
    scene.add(exitGroup);

    // Path
    let pathLine: THREE.Line | null = null;
    if (dronePath) {
      const curve = new THREE.CatmullRomCurve3(dronePath);
      const points = curve.getPoints(100);
      pathLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineDashedMaterial({ color: 0x5EDEFF, dashSize: 0.5, gapSize: 0.3, transparent: true, opacity: 0.8 }));
      pathLine.computeLineDistances();
      scene.add(pathLine);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      controls.update();

      rotors.forEach(r => r.rotation.y += 0.5);

      roomGroups.forEach((rg, i) => {
        const icon = rg.userData.icon;
        const light = rg.userData.light;
        if (icon) {
          icon.position.y = 2.7 + Math.sin(time * 3 + i) * 0.1;
          icon.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.05);
        }
        if (light && rooms[i].status === 'fire') {
          light.intensity = 2 + Math.sin(time * 20) * 0.5;
        }
      });

      if (dronePath) {
        const cycle = 15;
        const t = (time % cycle) / cycle;
        const curve = new THREE.CatmullRomCurve3(dronePath);
        const pos = curve.getPointAt(t);
        drone.position.copy(pos);
        drone.position.y = 3.5 + Math.sin(time * 4) * 0.2;
        drone.rotation.z = Math.sin(time * 3) * 0.1;
      }

      if (pathLine) {
        (pathLine.material as THREE.LineDashedMaterial).opacity = 0.4 + Math.sin(time * 5) * 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [rooms, dronePath]);

  return <div ref={mountRef} className="w-full h-full cursor-move" />;
}

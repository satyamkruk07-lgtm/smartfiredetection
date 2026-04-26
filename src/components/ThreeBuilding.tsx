
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
    camera.position.set(22, 20, 22);
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
    controls.screenSpacePanning = true;
    controls.minDistance = 10;
    controls.maxDistance = 60;
    controls.enableRotate = true; // Ensure 360 degree rotation
    controls.update();

    // --- LIGHTING ---
    // Significant brightness increase
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(20, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const floorLight = new THREE.PointLight(0x5EDEFF, 0.8, 60);
    floorLight.position.set(0, 15, 0);
    scene.add(floorLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(50, 40, 0x1F66AD, 0x333a45);
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
        ctx.font = 'bold 54px Space Grotesk';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Solid white with shadow for visibility
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#5EDEFF';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(10, 2.5, 1);
      return sprite;
    };

    // --- ICON GENERATORS ---
    const createFireIcon = () => {
      const group = new THREE.Group();
      const fireMat = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.9 });
      for (let i = 0; i < 4; i++) {
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1, 8), fireMat);
        flame.position.set((i - 1.5) * 0.3, 0.5, 0);
        flame.rotation.z = (Math.random() - 0.5) * 0.6;
        group.add(flame);
      }
      return group;
    };

    const createWarningIcon = () => {
      const group = new THREE.Group();
      const triGeo = new THREE.ConeGeometry(0.6, 1, 3);
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
      const part1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), mat);
      part1.rotation.z = -Math.PI / 4;
      part1.position.set(-0.2, 0.35, 0);
      group.add(part1);
      const part2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.9, 0.2), mat);
      part2.rotation.z = Math.PI / 4;
      part2.position.set(0.15, 0.45, 0);
      group.add(part2);
      return group;
    };

    // --- ROOM BUILDER ---
    const createRoom = (room: RoomData) => {
      const roomGroup = new THREE.Group();
      roomGroup.position.set(...room.pos);

      const w = 4.8;
      const h = 2.8;
      const d = 4.8;
      const wallT = 0.3;

      const floorMat = new THREE.MeshStandardMaterial({ color: 0x242933, roughness: 0.8 });
      const floor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), floorMat);
      floor.receiveShadow = true;
      roomGroup.add(floor);

      // Lightened wall material for visibility
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.2, roughness: 0.9 });
      
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
        new THREE.PlaneGeometry(w - 0.5, d - 0.5),
        new THREE.MeshStandardMaterial({
          color: statusColor,
          emissive: statusColor,
          emissiveIntensity: 1.0,
          transparent: true,
          opacity: 0.3
        })
      );
      glowPlane.rotation.x = -Math.PI / 2;
      glowPlane.position.y = 0.08;
      roomGroup.add(glowPlane);

      // RESTORE ROOM LABEL
      const labelSprite = createRoomLabel(room.label);
      labelSprite.position.y = h + 1.8;
      roomGroup.add(labelSprite);

      // Status Icon
      let icon;
      if (room.status === 'fire') icon = createFireIcon();
      else if (room.status === 'smoke') icon = createWarningIcon();
      else icon = createCheckIcon();
      
      icon.position.y = h + 0.4;
      roomGroup.add(icon);
      roomGroup.userData.icon = icon;

      // Status Light
      const sLight = new THREE.PointLight(statusColor, 2, 10);
      sLight.position.set(0, 2, 0);
      roomGroup.add(sLight);
      roomGroup.userData.light = sLight;

      scene.add(roomGroup);
      return roomGroup;
    };

    const roomGroups = rooms.map(createRoom);

    // Drone
    const createDrone = () => {
      const g = new THREE.Group();
      // WHITE CORE
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.25, 0.7), 
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.5 })
      );
      g.add(body);
      const rotors: THREE.Mesh[] = [];
      const rotorPos = [[0.5, 0.15, 0.5], [-0.5, 0.15, 0.5], [0.5, 0.15, -0.5], [-0.5, 0.15, -0.5]];
      rotorPos.forEach(p => {
        const rotor = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.01, 0.08), 
          new THREE.MeshBasicMaterial({ color: 0x5EDEFF, transparent: true, opacity: 0.8 })
        );
        rotor.position.set(p[0], p[1], p[2]);
        g.add(rotor);
        rotors.push(rotor);
      });
      const dLight = new THREE.PointLight(0x5EDEFF, 3, 12);
      dLight.position.y = -0.5;
      g.add(dLight);
      return { g, rotors };
    };

    const { g: drone, rotors } = createDrone();
    scene.add(drone);

    // Exit
    const exitGroup = new THREE.Group();
    exitGroup.position.set(12, 0, 0);
    const exitPlate = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.15, 3.5), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 2 }));
    exitGroup.add(exitPlate);
    const exitLabel = createRoomLabel("EXIT");
    exitLabel.position.y = 3.5;
    exitGroup.add(exitLabel);
    scene.add(exitGroup);

    // Path
    let pathLine: THREE.Line | null = null;
    if (dronePath) {
      const curve = new THREE.CatmullRomCurve3(dronePath);
      const points = curve.getPoints(200);
      pathLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points), 
        new THREE.LineDashedMaterial({ color: 0x5EDEFF, dashSize: 0.8, gapSize: 0.5, transparent: true, opacity: 0.9, depthWrite: false })
      );
      pathLine.computeLineDistances();
      scene.add(pathLine);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      controls.update();

      rotors.forEach(r => r.rotation.y += 0.6);

      roomGroups.forEach((rg, i) => {
        const icon = rg.userData.icon;
        const light = rg.userData.light;
        if (icon) {
          icon.position.y = 3.2 + Math.sin(time * 3 + i) * 0.15;
          icon.scale.setScalar(1 + Math.sin(time * 2.5 + i) * 0.08);
          icon.rotation.y += 0.01;
        }
        if (light && rooms[i].status === 'fire') {
          light.intensity = 3 + Math.sin(time * 25) * 1.0;
        }
      });

      if (dronePath) {
        const cycle = 18;
        const t = (time % cycle) / cycle;
        const curve = new THREE.CatmullRomCurve3(dronePath);
        const pos = curve.getPointAt(t);
        drone.position.copy(pos);
        drone.position.y = 4.2 + Math.sin(time * 5) * 0.25;
        drone.rotation.z = Math.sin(time * 3.5) * 0.15;
      }

      if (pathLine) {
        (pathLine.material as THREE.LineDashedMaterial).opacity = 0.5 + Math.sin(time * 6) * 0.4;
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

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}

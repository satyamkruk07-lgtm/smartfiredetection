# **App Name**: Aegis Prime

## Core Features:

- 3D Interactive Building Visualization: A Three.js powered dashboard displaying the building layout with color-coded rooms (Green=Safe, Yellow=Smoke, Red=Fire with glowing + flickering effect) and a dynamic EXIT sign.
- Real-time Sensor Data Visualization: Display live readings for Temperature, Smoke Level, and Gas Level for each room, updating in real-time based on simulated sensor data.
- Dynamic Fire Alert System: A prominent, red glowing alert card and blinking system status (FIRE ALERT) that triggers when fire conditions are detected.
- Automated Drone Deployment & Animation: Visualize a 3D drone model automatically moving from a docking station to the affected room, following glowing path lines, and displaying its status (battery, location).
- Intelligent Emergency Path Guidance Tool: An AI-powered tool that dynamically calculates and visualizes the optimal glowing blue exit path from a fire-affected room to safety, adapting to the simulated hazard.
- Intuitive Workflow Progression Display: An animated four-step visual guide outlining the system's operational flow: Fire Detection, Dashboard Update, Drone Activation, and Safe Guidance, with animated arrows.
- Responsive & Futuristic UI Layout: An adaptable, full-screen layout with a left sidebar for navigation, a top header for system status, a central 3D view, and a right panel for alerts and status, incorporating Glassmorphism and glowing effects.

## Style Guidelines:

- Primary interactive color: A vibrant 'tech blue' (#1F66AD) for active elements, buttons, and focused states.
- Background: A very deep, near-black navy blue (#111417) to create a dark, control-room aesthetic.
- Accent color: A brilliant, glowing cyan (#5EDEFF) used for highlights, drone trails, interactive path lines, and subtle UI glows to enhance the futuristic feel.
- Status and alert colors: Bright red for fire warnings, vivid green for safe statuses, and bright yellow for smoke detection or specific highlights, all designed with neon glow effects.
- Headlines and Body text font: 'Space Grotesk' (sans-serif) for a modern, techy, and futuristic appearance across all text elements.
- Utilize minimalist, outline-style vector icons that feature subtle glowing effects or neon borders, maintaining a consistent professional, high-tech aesthetic.
- Full-screen homepage with a hero section, and a dashboard divided into a left sidebar, top header, central 3D panel, and right informational panel, all designed with Glassmorphism frosted glass effects.
- Employ GSAP for smooth, performant animations throughout the application, including dynamic background particle effects, animated 3D object movements (building, drone, fire), UI transitions, and glowing element pulsations.
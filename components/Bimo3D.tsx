import React, { useMemo } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { WebView } from "react-native-webview";

// ─── TYPES (Matched to your provided code) ──────────────────────────────────

type SkinId = "silver" | "gold" | "onyx" | "rose" | "cyan" | "purple" | "emerald" | "crimson";
type EyeId  = "blue" | "green" | "red" | "purple" | "orange" | "white";
type SuitId = "none" | "tuxedo" | "space" | "knight" | "ninja" | "lab";
type AccId  = "none" | "tophat" | "cap" | "halo" | "crown" | "glasses" | "shades";
type AntId  = "ball" | "star" | "heart" | "diamond" | "none";
type ExprId = "happy" | "excited" | "cool" | "shy";

interface RobotConfig {
  skin: SkinId;
  eyes: EyeId;
  suit: SuitId;
  accessory: AccId;
  antenna: AntId;
  expression: ExprId;
}

// ─── HTML/THREE.JS GENERATOR ─────────────────────────────────────────────────

function generateBimoHtml(config: RobotConfig): string {
  // We pass the config as a JSON string to the WebView's JS context
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body { margin: 0; background: transparent; overflow: hidden; }
    canvas { width: 100vw; height: 100vh; display: block; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    const config = ${JSON.stringify(config)};
    
    // Mapping Data (Matched to your UI colors)
    const SKINS = {
      silver: { body: "#A5ABB6", plate: "#D1D6DE", accent: "#7D8491" },
      gold: { body: "#C8A84B", plate: "#E8CF7A", accent: "#A08030" },
      onyx: { body: "#2A2D35", plate: "#3D4150", accent: "#1A1D24" },
      rose: { body: "#C87B8A", plate: "#E8A0B0", accent: "#A05060" },
      cyan: { body: "#4A9BAA", plate: "#6ABFCC", accent: "#307A88" },
      purple: { body: "#7B5AAA", plate: "#9B7ACA", accent: "#5A3A88" },
      emerald: { body: "#3A9A6A", plate: "#5ABA8A", accent: "#207850" },
      crimson: { body: "#AA3A4A", plate: "#CA5A6A", accent: "#881828" }
    };

    const EYES = {
      blue: "#00BAFF", green: "#4AE87A", red: "#FF4A4A", 
      purple: "#9A4AE8", orange: "#E8994A", white: "#FFFFFF"
    };

    (function() {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0.5, 7);

      const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      // Lighting
      const amb = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(amb);
      const sun = new THREE.DirectionalLight(0xffffff, 1);
      sun.position.set(5, 10, 5);
      scene.add(sun);

      const skin = SKINS[config.skin] || SKINS.silver;
      const eyeColor = EYES[config.eyes] || EYES.blue;

      // Materials
      const matBody = new THREE.MeshStandardMaterial({ color: skin.body, metalness: 0.5, roughness: 0.4 });
      const matPlate = new THREE.MeshStandardMaterial({ color: skin.plate, metalness: 0.7, roughness: 0.2 });
      const matGlow = new THREE.MeshStandardMaterial({ color: eyeColor, emissive: eyeColor, emissiveIntensity: 1.2 });
      const matJoint = new THREE.MeshStandardMaterial({ color: skin.accent });

      const bimo = new THREE.Group();
      scene.add(bimo);

      // ─── HEAD ───
      const headGroup = new THREE.Group();
      headGroup.position.y = 1.3;
      bimo.add(headGroup);

      // Rounded Box approximation
      const head = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 1.6), matBody);
      headGroup.add(head);

      // Ears (Side cylinders with glow)
      [-1.25, 1.25].forEach(x => {
         const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32), matBody);
         ear.rotation.z = Math.PI / 2;
         ear.position.x = x;
         headGroup.add(ear);
         
         const earGlow = new THREE.Mesh(new THREE.CircleGeometry(0.25, 32), matGlow);
         earGlow.position.set(x > 0 ? 0.16 : -0.16, 0, 0);
         earGlow.rotation.y = x > 0 ? Math.PI/2 : -Math.PI/2;
         ear.add(earGlow);
      });

      // Eyes
      [-0.6, 0.6].forEach(x => {
        const iris = new THREE.Mesh(new THREE.CircleGeometry(0.4, 32), matGlow);
        iris.position.set(x, 0.1, 0.81);
        headGroup.add(iris);
        
        const shine = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
        shine.position.set(x + 0.15, 0.25, 0.85);
        headGroup.add(shine);
      });

      // Mouth
      if (config.expression !== 'shy') {
        const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 8, 16, Math.PI), new THREE.MeshBasicMaterial({color: 0x333333}));
        mouth.rotation.x = Math.PI;
        mouth.position.set(0, -0.4, 0.81);
        headGroup.add(mouth);
      }

      // ─── ANTENNA ───
      if (config.antenna !== 'none') {
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 0.6), matBody);
        stem.position.y = 1.1;
        headGroup.add(stem);
        
        const tipGeom = config.antenna === 'star' ? new THREE.OctahedronGeometry(0.25) : new THREE.SphereGeometry(0.22, 16, 16);
        const tip = new THREE.Mesh(tipGeom, matGlow);
        tip.position.y = 1.45;
        headGroup.add(tip);
      }

      // ─── BODY ───
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 1.2), matBody);
      bimo.add(body);

      const plate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.1), matPlate);
      plate.position.set(0, 0, 0.6);
      bimo.add(plate);

      // Glowing Joint Dots
      const addJointGlow = (parent, pos) => {
        const g = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), matGlow);
        g.position.copy(pos);
        parent.add(g);
      };

      // Arms
      [-1.1, 1.1].forEach(x => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), matBody);
        arm.position.set(x, 0, 0);
        arm.rotation.z = x > 0 ? -0.2 : 0.2;
        bimo.add(arm);
        addJointGlow(bimo, new THREE.Vector3(x, 0.35, 0.3)); // Shoulder glow
      });

      // Legs
      [-0.45, 0.45].forEach(x => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.8), matBody);
        leg.position.set(x, -1.2, 0);
        bimo.add(leg);
        
        const foot = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI*2, 0, Math.PI/2), matBody);
        foot.position.set(x, -1.6, 0.1);
        bimo.add(foot);
        addJointGlow(bimo, new THREE.Vector3(x, -0.8, 0.3)); // Knee glow
      });

      // Animation
      let clock = 0;
      function animate() {
        requestAnimationFrame(animate);
        clock += 0.02;
        bimo.rotation.y = Math.sin(clock * 0.5) * 0.4;
        bimo.position.y = Math.sin(clock * 1.5) * 0.1;
        renderer.render(scene, camera);
      }
      animate();
    })();
  </script>
</body>
</html>
  `;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

interface Props {
  config: RobotConfig;
  size?: number;
  style?: ViewStyle;
}

export function Bimo3D({ config, size = 300, style }: Props) {
  const html = useMemo(() => generateBimoHtml(config), [config]);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ backgroundColor: "transparent" }}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    overflow: "hidden",
  },
});
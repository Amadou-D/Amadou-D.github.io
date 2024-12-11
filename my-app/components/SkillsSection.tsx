'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SkillsSectionProps {
  onClose: () => void;
}

const skills = [
  'JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Three.js', 'C#', 'TypeScript', 'Python', 'Docker', 'Java', 'Next.js', 'SQL', 'MongoDB', 'Firebase'
];

const SkillsSection: React.FC<SkillsSectionProps> = ({ onClose }) => {
  const threeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!threeRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeRef.current.appendChild(renderer.domElement);

    // Create a wavy background with gradient
    const planeGeometry = new THREE.PlaneGeometry(40, 40, 32, 32);
    const planeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#FF4B2B') },
        color2: { value: new THREE.Color('#FF416C') },
        color3: { value: new THREE.Color('#00C9FF') },
        color4: { value: new THREE.Color('#92FE9D') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec3 color4;
        varying vec2 vUv;
        void main() {
          vec3 color = mix(color1, color2, sin(time + vUv.y * 3.14));
          color = mix(color, color3, sin(time + vUv.x * 3.14));
          color = mix(color, color4, sin(time + vUv.y * 3.14) * sin(time + vUv.x * 3.14));
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    const animate = () => {
      requestAnimationFrame(animate);
      planeMaterial.uniforms.time.value += 0.01;
      const position = plane.geometry.attributes.position;
      const count = position.count;
      for (let i = 0; i < count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = Math.sin(x * 0.5 + planeMaterial.uniforms.time.value) * Math.cos(y * 0.5 + planeMaterial.uniforms.time.value);
        position.setZ(i, z);
      }
      position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      threeRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
      <div ref={threeRef} className="absolute inset-0"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8">My Skills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
              {skill}
            </div>
          ))}
        </div>
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SkillsSection;
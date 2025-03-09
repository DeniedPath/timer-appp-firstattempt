import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface SolarSystemBackgroundProps {
  planetFocus?: string;
}

// Planet names for theme selection
export const PLANET_OPTIONS = [
  'Overview',
  'Mercury', 
  'Venus', 
  'Earth', 
  'Mars', 
  'Jupiter', 
  'Saturn', 
  'Uranus', 
  'Neptune'
];

// Define a type for the planet object
interface Planet {
  planet: THREE.Mesh;
  orbit: THREE.Mesh;
  orbitalSpeed: number;
  rotationSpeed: number;
  orbitalPosition: number;
  orbitalDistance: number;
}

interface CameraTarget {
  x: number;
  y: number;
  z: number;
  targetObject?: THREE.Mesh;
}

const SolarSystemBackground: React.FC<SolarSystemBackgroundProps> = ({ planetFocus = 'Overview' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    planets: Planet[];
    sun: THREE.Mesh;
    currentFocus: Planet | null;
    isTransitioning: boolean;
    cameraTarget: CameraTarget;
    requestID?: number;
  }>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up function for unmounting
    const cleanup = () => {
      if (sceneRef.current) {
        if (sceneRef.current.requestID) {
          cancelAnimationFrame(sceneRef.current.requestID);
        }
        sceneRef.current.renderer.dispose();
        sceneRef.current.scene.clear();
        if (containerRef.current?.contains(sceneRef.current.renderer.domElement)) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };

    // Clean up any existing scene
    cleanup();

    // Initialize Three.js scene
    const systemScale = 3;
    const planetScale = 2.5;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    // Optimize renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Set clear color with alpha=0 for transparency
    containerRef.current.appendChild(renderer.domElement);

    // Set up camera position and controls
    camera.position.z = 150 * systemScale;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false; // Disable zoom for background
    controls.enablePan = false; // Disable panning for background
    controls.rotateSpeed = 0.1; // Slow down rotation for subtle background effect
    controls.enableRotate = false; // Disable rotation for background (we'll handle it manually)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Add sun light
    const sunLight = new THREE.PointLight(0xffffff, 5, 2000 * systemScale);
    scene.add(sunLight);

    // Create sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Add a directional light to simulate sun rays
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 0); // Position at the sun
    scene.add(directionalLight);

    // Add hemisphere light for more natural lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    scene.add(hemisphereLight);

    // Initialize camera animation variables
    let cameraTarget: CameraTarget = { x: 0, y: 0, z: 50 };
    let currentFocus: Planet | null = null;
    let isTransitioning = false;

    // Helper function to create planets
    function createPlanet(radius: number, texturePath: string, position: number, tilt = 0) {
      const scaledRadius = radius * planetScale;
      const scaledPosition = position * systemScale;
      
      // Create a placeholder material since we can't load textures immediately
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.2,
        emissive: 0x444444,
        emissiveIntensity: 0.2
      });
      
      // Load the texture asynchronously
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(texturePath, (texture: THREE.Texture) => {
        material.map = texture;
        material.needsUpdate = true;
      });
      
      const geometry = new THREE.SphereGeometry(scaledRadius, 32, 32);
      const planet = new THREE.Mesh(geometry, material);
      planet.position.x = scaledPosition;
      
      // Apply axial tilt
      planet.rotation.z = tilt * Math.PI / 180;
      
      // Create orbit path
      const orbitGeometry = new THREE.RingGeometry(scaledPosition - 0.1, scaledPosition + 0.1, 128);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3 // Increased from 0.1 for better visibility
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      
      scene.add(planet);
      scene.add(orbit);
      
      return {
        planet,
        orbit,
        orbitalSpeed: 1 / Math.sqrt(scaledPosition),
        rotationSpeed: Math.random() * 0.01 + 0.005,
        orbitalPosition: Math.random() * Math.PI * 2,
        orbitalDistance: scaledPosition
      };
    }

    // Add glow effect
    function addGlowEffect(planet: THREE.Mesh, radius: number, color: number) {
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          c: { value: 0.2 },
          p: { value: 4.0 },
          glowColor: { value: new THREE.Color(color) },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          uniform float c;
          uniform float p;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
            gl_FragColor = vec4(glowColor, intensity);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      
      const glowMesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.2, 32, 32),
        glowMaterial
      );
      planet.add(glowMesh);
    }

    // Create stars
    function createStarfield() {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.3,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: false // Disable size attenuation for better performance
      });
      
      const starsVertices = new Float32Array(3000 * 3); // Reduce star count and use typed array
      for (let i = 0; i < 3000; i++) {
        const i3 = i * 3;
        starsVertices[i3] = (Math.random() - 0.5) * 5000;
        starsVertices[i3 + 1] = (Math.random() - 0.5) * 5000;
        starsVertices[i3 + 2] = (Math.random() - 0.5) * 5000;
      }
      
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsVertices, 3));
      
      const starField = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(starField);
      
      return starField;
    }

    // Create planets (with public URLs assuming you'll place textures in your public folder)
    const planets = [
      createPlanet(0.8, '/textures/mercury.jpg', 10, 0.03),
      createPlanet(1.2, '/textures/venus.jpg', 15, 177.3),
      createPlanet(1.5, '/textures/earth.jpg', 20, 23.4),
      createPlanet(1.1, '/textures/mars.jpg', 25, 25.2),
      createPlanet(3.5, '/textures/jupiter.jpg', 35, 3.1),
      createPlanet(3.0, '/textures/saturn.jpg', 45, 26.7),
      createPlanet(2.0, '/textures/uranus.jpg', 55, 97.8),
      createPlanet(2.0, '/textures/neptune.jpg', 65, 28.3)
    ];

    // Add Earth glow
    addGlowEffect(planets[2].planet, planets[2].planet.geometry.parameters.radius, 0x0055ff);
    
    // Create stars
    createStarfield();

    // Function to transition to a planet
    function transitionToPlanet(planetIndex: number) {
      if (planetIndex < 0 || planetIndex >= planets.length) {
        return transitionToOverview();
      }
      
      const planet = planets[planetIndex];
      isTransitioning = true;
      currentFocus = planet;
      
      // Calculate camera position relative to planet's current position
      const distance = planet.planet.geometry.parameters.radius * 10; // Distance based on planet size
      const offsetX = planet.planet.position.x;
      const offsetZ = planet.planet.position.z + distance; // Position camera behind planet
      
      // Set camera target with slight elevation
      cameraTarget = {
        x: offsetX,
        y: planet.planet.position.y + distance * 0.2, // Slight elevation relative to planet
        z: offsetZ,
        targetObject: planet.planet
      };
      
      // Disable controls during transition
      controls.enabled = false;
    }

    // Function to transition to overview
    function transitionToOverview() {
      isTransitioning = true;
      currentFocus = null;
      
      // Set camera to a nice overview position
      cameraTarget = { 
        x: 0, 
        y: 20 * systemScale, 
        z: 80 * systemScale 
      };
      
      // Disable controls during transition
      controls.enabled = false;
    }

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Animation loop
    function animate() {
      const requestID = requestAnimationFrame(animate);
      if (sceneRef.current) {
        sceneRef.current.requestID = requestID;
      }
      
      // Throttle updates during transitions
      const updateSpeed = isTransitioning ? 0.01 : 0.02;
      
      // Update planet positions and rotations
      planets.forEach(planet => {
        planet.orbitalPosition += planet.orbitalSpeed * updateSpeed;
        
        // Calculate new position based on orbit
        planet.planet.position.x = Math.cos(planet.orbitalPosition) * planet.orbitalDistance;
        planet.planet.position.z = Math.sin(planet.orbitalPosition) * planet.orbitalDistance;
        
        // Rotate planet on its axis (slower for background)
        planet.planet.rotation.y += planet.rotationSpeed * 0.5;
      });
      
      // Handle camera transitions
      if (isTransitioning) {
        camera.position.x += (cameraTarget.x - camera.position.x) * 0.05;
        camera.position.y += (cameraTarget.y - camera.position.y) * 0.05;
        camera.position.z += (cameraTarget.z - camera.position.z) * 0.05;
        
        // Look at the sun for overview or the planet for planet view
        if (currentFocus) {
          camera.lookAt(currentFocus.planet.position);
        } else {
          camera.lookAt(sun.position);
        }
        
        // Check if we've reached target position
        const distanceToTarget = new THREE.Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z)
          .distanceTo(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
        
        if (distanceToTarget < 0.5) {
          isTransitioning = false;
          // Don't re-enable controls for background
          controls.enabled = false;
        }
      } else if (currentFocus) {
        // Get current planet position
        const planet = currentFocus.planet;
        const geometry = planet.geometry as THREE.SphereGeometry;
        const distance = geometry.parameters.radius * 10;
        
        // Update camera position to keep view on planet
        camera.position.x = planet.position.x;
        camera.position.y = planet.position.y + distance * 0.2;
        camera.position.z = planet.position.z + distance;
        
        // Always look at the planet
        camera.lookAt(planet.position);
      } else {
        // In overview mode, slowly rotate camera around the sun
        const time = Date.now() * 0.0001;
        camera.position.x = Math.sin(time) * 80 * systemScale;
        camera.position.z = Math.cos(time) * 80 * systemScale;
        camera.position.y = 20 * systemScale;
        camera.lookAt(sun.position);
      }
      
      controls.update();
      renderer.render(scene, camera);
    }

    // Store scene objects in ref for cleanup
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      planets,
      sun,
      currentFocus,
      isTransitioning,
      cameraTarget,
    };
    
    // Start animation
    animate();

    // Handle planet focusing based on prop
    if (planetFocus !== 'Overview') {
      const planetIndex = PLANET_OPTIONS.indexOf(planetFocus) - 1; // -1 because Overview is at index 0
      if (planetIndex >= 0) {
        transitionToPlanet(planetIndex);
      } else {
        transitionToOverview();
      }
    } else {
      transitionToOverview();
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup();
    };
  }, [planetFocus]); // Re-initialize when planetFocus changes

  return (
    <div ref={containerRef} className="absolute inset-0 z-0" />
  );
};

export default SolarSystemBackground;
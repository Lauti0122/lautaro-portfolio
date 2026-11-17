"use client";

import { Environment, Float, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

// Logos 3D extruidos que flotan, siguen al mouse y giran al pasar por encima.
// Los usan "Con qué construyo" y los contactos del footer.

export type LogoItem = {
  name: string;
  path: string;
  color: string;
  // Metálico para las marcas negras, que si no desaparecen sobre el fondo
  metal?: boolean;
  at: [number, number, number];
  size: number;
  // Posición y tamaño en pantallas angostas, si cambian
  atNarrow?: [number, number, number];
  sizeNarrow?: number;
  href?: string;
};

function buildGeometry(path: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${path}"/></svg>`;
  const data = new SVGLoader().parse(svg);
  const shapes = data.paths.flatMap((item) => item.toShapes());
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 2.6,
    bevelEnabled: true,
    bevelThickness: 0.45,
    bevelSize: 0.22,
    bevelSegments: 4,
    curveSegments: 18,
  });
  geometry.center();
  geometry.scale(1 / 24, 1 / 24, 1 / 24);
  return geometry;
}

function Logo({
  item,
  index,
  narrow,
  onHover,
}: {
  item: LogoItem;
  index: number;
  narrow: boolean;
  onHover: (item: LogoItem | null) => void;
}) {
  const geometry = useMemo(() => buildGeometry(item.path), [item.path]);
  const mesh = useRef<THREE.Mesh>(null);
  const hover = useRef(0);
  const isHovered = useRef(false);
  const spin = useRef(0);
  const size = narrow ? (item.sizeNarrow ?? item.size) : item.size;
  const at = narrow ? (item.atNarrow ?? item.at) : item.at;

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const node = mesh.current;
    if (!node) return;
    hover.current +=
      ((isHovered.current ? 1 : 0) - hover.current) * Math.min(delta * 8, 1);
    node.scale.setScalar(size * (1 + hover.current * 0.18));
    // Se balancean de frente para que se lean; con el mouse encima giran
    spin.current += delta * hover.current * 6;
    node.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.45 + spin.current;
  });

  const open = () => {
    if (!item.href) return;
    if (item.href.startsWith("http")) window.open(item.href, "_blank", "noopener");
    else window.location.href = item.href;
  };

  return (
    <Float
      speed={1.2 + (index % 4) * 0.25}
      rotationIntensity={0.3}
      floatIntensity={0.9}
      position={at}
    >
      <mesh
        ref={mesh}
        geometry={geometry}
        // El SVG tiene la Y hacia abajo: medio giro en X lo endereza
        rotation-x={Math.PI}
        raycast={() => null}
      >
        <meshPhysicalMaterial
          color={item.metal ? "#d6d6d2" : item.color}
          metalness={item.metal ? 0.9 : 0.15}
          roughness={item.metal ? 0.18 : 0.3}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </mesh>
      {/* Zona de clic fija e invisible: el logo gira al pasar el mouse y de
          canto no se lo puede tocar */}
      <mesh
        scale={size * 1.2}
        onPointerOver={(event) => {
          event.stopPropagation();
          isHovered.current = true;
          onHover(item);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          isHovered.current = false;
          onHover(null);
          document.body.style.cursor = "";
        }}
        onClick={(event) => {
          event.stopPropagation();
          open();
        }}
      >
        <planeGeometry />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </Float>
  );
}

function Cloud({
  items,
  scaleFor,
  onHover,
}: {
  items: LogoItem[];
  scaleFor: (width: number) => number;
  onHover: (item: LogoItem | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const width = useThree((state) => state.size.width);
  const narrow = width < 640;

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;
    const ease = Math.min(delta * 3, 1);
    node.rotation.y += (state.pointer.x * 0.35 - node.rotation.y) * ease;
    node.rotation.x += (-state.pointer.y * 0.2 - node.rotation.x) * ease;
  });

  return (
    <group ref={group} scale={scaleFor(width)}>
      {items.map((item, index) => (
        <Logo
          key={item.name}
          item={item}
          index={index}
          narrow={narrow}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

export default function LogoScene({
  items,
  running,
  onHover,
  scaleFor = () => 1,
  accentLight = true,
}: {
  items: LogoItem[];
  running: boolean;
  onHover: (item: LogoItem | null) => void;
  scaleFor?: (width: number) => number;
  // Reflejo naranja de Claude; los contactos van sin él para quedar neutros
  accentLight?: boolean;
}) {
  return (
    <Canvas
      frameloop={running ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0, 0, 11] }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 8]} intensity={1.4} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 6]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-6, 0, 3]} rotation-y={Math.PI / 3} scale={[6, 8, 1]} />
        {accentLight && (
          <Lightformer form="ring" intensity={2} color="#d97757" position={[6, -2, 4]} scale={3} />
        )}
      </Environment>
      <Cloud items={items} scaleFor={scaleFor} onHover={onHover} />
    </Canvas>
  );
}

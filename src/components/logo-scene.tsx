"use client";

import { Environment, Float, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { useTouch } from "./use-touch";

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

// Cuánto dura el giro y la etiqueta después de tocar un logo
const TAP_MS = 1800;

function Logo({
  item,
  index,
  narrow,
  onHover,
}: {
  item: LogoItem;
  index: number;
  narrow: boolean;
  onHover: (item: LogoItem, active: boolean) => void;
}) {
  const geometry = useMemo(() => buildGeometry(item.path), [item.path]);
  const mesh = useRef<THREE.Mesh>(null);
  const hover = useRef(0);
  const isHovered = useRef(false);
  // Hasta cuándo sigue activo por un toque (en pantallas táctiles no hay hover)
  const tappedUntil = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const spin = useRef(0);
  const size = narrow ? (item.sizeNarrow ?? item.size) : item.size;
  const at = narrow ? (item.atNarrow ?? item.at) : item.at;

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => clearTimeout(tapTimer.current), []);

  useFrame((state, delta) => {
    const node = mesh.current;
    if (!node) return;
    const active =
      isHovered.current || performance.now() < tappedUntil.current;
    hover.current += ((active ? 1 : 0) - hover.current) * Math.min(delta * 8, 1);
    node.scale.setScalar(size * (1 + hover.current * 0.28));
    // Se balancean de frente para que se lean; con el mouse encima giran
    spin.current += delta * hover.current * 6;
    node.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.45 + spin.current;
  });

  const tap = () => {
    tappedUntil.current = performance.now() + TAP_MS;
    onHover(item, true);
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => onHover(item, false), TAP_MS);
  };

  const open = () => {
    if (!item.href) return tap();
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
          if (event.pointerType !== "mouse") return;
          isHovered.current = true;
          onHover(item, true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event) => {
          if (event.pointerType !== "mouse") return;
          isHovered.current = false;
          onHover(item, false);
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
  touch,
}: {
  items: LogoItem[];
  scaleFor: (width: number) => number;
  onHover: (item: LogoItem, active: boolean) => void;
  touch: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const width = useThree((state) => state.size.width);
  const element = useThree((state) => state.gl.domElement);
  const narrow = width < 640;
  // Giro que suma el dedo al arrastrar en horizontal
  const drag = useRef({ on: false, x: 0, offset: 0 });

  useEffect(() => {
    if (!touch) return;
    const down = (event: PointerEvent) => {
      drag.current.on = true;
      drag.current.x = event.clientX;
    };
    const move = (event: PointerEvent) => {
      const d = drag.current;
      if (!d.on) return;
      d.offset = Math.max(
        -1.2,
        Math.min(1.2, d.offset + ((event.clientX - d.x) / width) * 2.4),
      );
      d.x = event.clientX;
    };
    const up = () => {
      drag.current.on = false;
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
    };
  }, [touch, element, width]);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;
    const ease = Math.min(delta * 3, 1);
    let y = state.pointer.x * 0.35;
    let x = -state.pointer.y * 0.2;
    if (touch) {
      // Sin mouse: la nube se mece sola y el dedo la gira; al soltar vuelve
      const d = drag.current;
      if (!d.on) d.offset *= 1 - Math.min(delta * 1.2, 1);
      const t = state.clock.elapsedTime;
      y = Math.sin(t * 0.35) * 0.4 + d.offset;
      x = Math.sin(t * 0.27) * 0.12;
    }
    node.rotation.y += (y - node.rotation.y) * ease;
    node.rotation.x += (x - node.rotation.x) * ease;
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
  onHover: (item: LogoItem, active: boolean) => void;
  scaleFor?: (width: number) => number;
  // Reflejo naranja de Claude; los contactos van sin él para quedar neutros
  accentLight?: boolean;
}) {
  const touch = useTouch();
  return (
    <Canvas
      frameloop={running ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0, 0, 11] }}
      gl={{ antialias: true, alpha: true }}
      // El scroll vertical sigue siendo de la página; el horizontal gira la nube
      style={{ touchAction: "pan-y" }}
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
      <Cloud items={items} scaleFor={scaleFor} onHover={onHover} touch={touch} />
    </Canvas>
  );
}

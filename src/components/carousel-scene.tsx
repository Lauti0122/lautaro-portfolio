"use client";

// three.js trabaja mutando uniforms, texturas y refs en cada cuadro, que es
// justo lo que esta regla del React Compiler prohíbe.
/* eslint-disable react-hooks/immutability */

import { useProgress, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { projects } from "../content";
import {
  CARD_COUNT,
  SLOT,
  clamp,
  type CarouselControl,
  type HoverKind,
} from "./carousel-config";

const RADIUS = 8;
const ARC = 0.5;
const WIDTH = RADIUS * ARC;
const HEIGHT = WIDTH / 1.6;
const FLOOR_Y = -HEIGHT / 2 - 0.55;
const CAMERA_Z = 2.6;

// La entrada de las tarjetas se ve una sola vez por visita, aunque el
// canvas se vuelva a montar (al volver de otra sección, por ejemplo)
let introPlayed = false;

const cardVertex = /* glsl */ `
  uniform float uBend;
  uniform float uHover;
  uniform float uFocus;
  uniform float uIntro;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    vec2 radial = normalize(p.xz);
    float arch = sin(uv.x * 3.14159);
    // La tarjeta activa avanza hacia la cámara; al moverse, todas se arquean
    p.xz -= radial * (uFocus * 0.9 + uHover * 0.25 + uBend * arch);
    p.y -= (1.0 - uIntro) * 1.6;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const cardFragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uHover;
  uniform float uFocus;
  uniform float uIntro;
  uniform float uReflect;
  uniform vec2 uSize;
  varying vec2 vUv;

  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // Visto desde adentro del cilindro la imagen queda espejada
    vec2 uv = vec2(1.0 - vUv.x, vUv.y);
    vec2 p = (uv - 0.5) * uSize;
    float d = roundedBox(p, uSize * 0.5, 0.14);
    float alpha = 1.0 - smoothstep(-0.006, 0.006, d);

    vec3 color = texture2D(uTex, uv).rgb;
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    float lit = clamp(uFocus + uHover * 0.6, 0.0, 1.0);
    color = mix(vec3(gray) * 0.35, color, 0.2 + lit * 0.8);
    // Brillo que barre la tarjeta activa
    float sheen = smoothstep(0.35, 0.0, abs(uv.x + uv.y * 0.4 - 0.9)) * 0.08 * uFocus;
    color += sheen;

    // La copia espejada bajo el piso se desvanece al alejarse del borde
    float mirror = mix(1.0, 0.2 * (1.0 - smoothstep(0.0, 0.55, vUv.y)), uReflect);
    gl_FragColor = vec4(color, alpha * uIntro * mirror);
    #include <colorspace_fragment>
  }
`;

const gridVertex = /* glsl */ `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gridFragment = /* glsl */ `
  varying vec2 vPos;
  void main() {
    // Una cruz chica en cada punto de una grilla de 1 unidad
    vec2 cell = abs(fract(vPos) - 0.5);
    float w = fwidth(vPos.x) * 1.2 + 0.008;
    float arm = 0.07;
    float cross =
      (1.0 - smoothstep(0.0, w, cell.x)) * step(cell.y, arm) +
      (1.0 - smoothstep(0.0, w, cell.y)) * step(cell.x, arm);
    float fade = smoothstep(14.0, 2.0, length(vPos - vec2(0.0, 6.0)));
    gl_FragColor = vec4(vec3(0.93), min(cross, 1.0) * 0.22 * fade);
  }
`;

type CardProps = {
  index: number;
  texture: THREE.Texture;
  hovered: RefObject<number>;
  onCardClick: (index: number) => void;
};

function Card({ index, texture, hovered, onCardClick }: CardProps) {
  const geometry = useMemo(
    () =>
      new THREE.CylinderGeometry(
        RADIUS,
        RADIUS,
        HEIGHT,
        64,
        1,
        true,
        -ARC / 2,
        ARC,
      ),
    [],
  );
  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uBend: { value: 0 },
      uHover: { value: 0 },
      uFocus: { value: 0 },
      uIntro: { value: 0 },
      uSize: { value: new THREE.Vector2(WIDTH, HEIGHT) },
    }),
    [texture],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  const material = (reflect: boolean) => (
    <shaderMaterial
      vertexShader={cardVertex}
      fragmentShader={cardFragment}
      uniforms={{ ...uniforms, uReflect: { value: reflect ? 1 : 0 } }}
      // Doble cara: la copia espejada invierte el sentido de las caras
      side={THREE.DoubleSide}
      transparent
      depthWrite={false}
    />
  );

  return (
    // La rotación de cada tarjeta se calcula en cada cuadro (ver Arc)
    <group>
      <mesh
        geometry={geometry}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          hovered.current = index;
        }}
        onPointerOut={() => {
          if (hovered.current === index) hovered.current = -1;
        }}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          onCardClick(index);
        }}
      >
        {material(false)}
      </mesh>
      <mesh
        geometry={geometry}
        position-y={2 * FLOOR_Y}
        scale-y={-1}
        raycast={() => null}
      >
        {material(true)}
      </mesh>
    </group>
  );
}

function Floor() {
  const uniforms = useMemo(() => ({}), []);
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={FLOOR_Y}>
      <planeGeometry args={[40, 40]} />
      <shaderMaterial
        vertexShader={gridVertex}
        fragmentShader={gridFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export type SceneProps = {
  control: RefObject<CarouselControl>;
  reduceMotion: boolean;
  onSelect: (index: number) => void;
  onGoTo: (index: number) => void;
  onHover: (kind: HoverKind) => void;
};

function Arc({ control, reduceMotion, onSelect, onGoTo, onHover }: SceneProps) {
  const textures = useTexture(projects.map((project) => project.cover));
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(-1);
  const current = useRef(control.current.progress);
  const lastHover = useRef<HoverKind>(null);
  const start = useRef<number | null>(null);
  const size = useThree((state) => state.size);
  const getState = useThree((state) => state.get);

  // Sube las seis portadas a la GPU de entrada, para que al recorrer el
  // arco ninguna tarjeta aparezca vacía mientras se carga
  useEffect(() => {
    const { gl } = getState();
    for (const texture of textures) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
      gl.initTexture(texture);
    }
  }, [textures, getState]);

  // En pantallas angostas se abre el campo visual para que entre la tarjeta
  useEffect(() => {
    const camera = getState().camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const fromWidth = THREE.MathUtils.radToDeg(2 * Math.atan(0.26 / aspect));
    camera.fov = Math.max(34, fromWidth);
    camera.updateProjectionMatrix();
  }, [getState, size]);

  useFrame((state, delta) => {
    const arc = group.current;
    if (!arc) return;
    // Dos cuadros con el mismo tiempo darían delta 0 y una velocidad NaN que
    // deforma las tarjetas para siempre: se acota el paso en ambos sentidos
    const dt = clamp(delta, 1 / 240, 1 / 30);
    if (start.current === null) start.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - start.current;
    const ease = 1 - Math.pow(0.004, dt);

    const previous = current.current;
    current.current += (control.current.progress - current.current) * ease;
    const speed = (current.current - previous) / dt;

    const skipIntro = reduceMotion || introPlayed;
    const intro = skipIntro ? 1 : clamp((elapsed - 0.1) / 1.6, 0, 1);
    const introEase = 1 - Math.pow(1 - intro, 3);

    const camera = state.camera;
    const px = reduceMotion ? 0 : state.pointer.x * 0.4;
    const py = reduceMotion ? 0 : state.pointer.y * 0.2;
    camera.position.x += (px - camera.position.x) * ease;
    camera.position.y += (0.3 + py - camera.position.y) * ease;
    camera.position.z = CAMERA_Z + (1 - introEase) * 3;
    // Mirar un poco por debajo del centro sube las tarjetas en pantalla y
    // deja lugar abajo para el título del proyecto
    camera.lookAt(0, -0.55, -RADIUS);

    const front = Math.round(current.current);
    const kind: HoverKind =
      hovered.current < 0 ? null : hovered.current === front ? "front" : "side";
    if (kind !== lastHover.current) {
      lastHover.current = kind;
      onHover(kind);
    }

    if (!introPlayed && elapsed > 0.2 + CARD_COUNT * 0.08 + 0.9) {
      introPlayed = true;
    }

    const bend =
      reduceMotion || !Number.isFinite(speed)
        ? 0
        : clamp(Math.abs(speed) * 0.18, 0, 0.7);
    arc.children.forEach((card, index) => {
      // El arco da la vuelta: cada tarjeta se ubica a la distancia más corta
      // del proyecto activo, así siempre hay tarjetas a ambos lados. El salto
      // de un lado al otro pasa a ±3 lugares, fuera de cámara.
      const offset =
        ((((index - current.current + CARD_COUNT / 2) % CARD_COUNT) +
          CARD_COUNT) %
          CARD_COUNT) -
        CARD_COUNT / 2;
      // El proyecto siguiente queda a la derecha
      card.rotation.y = Math.PI - offset * SLOT;
      const focus = 1 - clamp(Math.abs(offset), 0, 1);
      const isHover = hovered.current === index ? 1 : 0;
      const cardIntro = skipIntro
        ? 1
        : clamp((elapsed - 0.2 - index * 0.08) / 0.9, 0, 1);
      for (const child of card.children) {
        // R3F copia los uniforms al material: hay que leerlos desde ahí
        const material = (child as THREE.Mesh).material as THREE.ShaderMaterial;
        const u = material.uniforms;
        u.uFocus.value = focus * focus * (3 - 2 * focus);
        u.uHover.value += (isHover - u.uHover.value) * ease;
        u.uBend.value += (bend - u.uBend.value) * ease;
        u.uIntro.value = 1 - Math.pow(1 - cardIntro, 3);
      }
    });
  });

  const handleCardClick = (index: number) => {
    // Un arrastre que termina sobre una tarjeta no cuenta como clic
    if (control.current.moved > 6) return;
    if (index === Math.round(current.current)) onSelect(index);
    else onGoTo(index);
  };

  return (
    <>
      <group ref={group}>
        {Array.from({ length: CARD_COUNT }, (_, index) => (
          <Card
            key={index}
            index={index}
            texture={textures[index]}
            hovered={hovered}
            onCardClick={handleCardClick}
          />
        ))}
      </group>
      <Floor />
    </>
  );
}

function Progress({ onProgress }: { onProgress: (value: number) => void }) {
  const { progress } = useProgress();
  useEffect(() => onProgress(progress), [progress, onProgress]);
  return null;
}

export default function CarouselScene(
  props: SceneProps & {
    running: boolean;
    onProgress: (value: number) => void;
    onContextLost: () => void;
  },
) {
  const { running, onProgress, onContextLost, ...arc } = props;
  return (
    <Canvas
      frameloop={running ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: 34, position: [0, 0.3, CAMERA_Z + 3], near: 0.1, far: 80 }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000");
        // Si el navegador reinicia la GPU, el hero arma un canvas nuevo
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          onContextLost();
        });
      }}
    >
      <Progress onProgress={onProgress} />
      <Suspense fallback={null}>
        <Arc {...arc} />
      </Suspense>
    </Canvas>
  );
}

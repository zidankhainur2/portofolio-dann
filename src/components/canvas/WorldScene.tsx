import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type Group, type Mesh, type Material } from "three";
import { Planet } from "@/components/canvas/Planet";
import { ExplorationCapsule } from "@/components/canvas/ExplorationCapsule";
import { ProjectShowcase3D } from "@/components/canvas/ProjectShowcase3D";
import { useMotionRef } from "@/components/providers/PortfolioProvider";

export function WorldScene({ onReady, onFailure, projectAccent }: { onReady: () => void; onFailure: () => void; projectAccent: string }) {
  const { gl, invalidate, size } = useThree();
  const motionRef = useMotionRef();
  const planet = useRef<Group>(null);
  const capsule = useRef<Group>(null);
  const showcase = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const anchors = useRef<(HTMLElement | null)[]>([]);
  const objects = useRef([
    { id: "planet", ref: planet, width: 2.5, height: 2.5 },
    { id: "capsule", ref: capsule, width: 1.4, height: 2.8 },
    { id: "showcase", ref: showcase, width: 2.8, height: 2.5 },
  ]);

  useEffect(() => {
    const motion = motionRef.current;
    anchors.current = objects.current.map(({ id }) => document.querySelector<HTMLElement>(`[data-scene="${id}"]`));
    const redraw = () => {
      if (document.hidden) return;
      const entering = anchors.current.some((anchor) => {
        const rect = anchor?.getBoundingClientRect();
        return rect && rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
      });
      if (entering || objects.current.some(({ ref }) => ref.current?.visible)) invalidate();
    };
    motion.invalidate = redraw;
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current = { x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 };
      if (objects.current.some(({ ref }) => ref.current?.visible)) redraw();
    };
    const onLost = (event: Event) => { event.preventDefault(); onFailure(); };
    const observer = new ResizeObserver(redraw);
    const main = document.getElementById("main");
    if (main) observer.observe(main);
    gl.domElement.addEventListener("webglcontextlost", onLost);
    window.addEventListener("scroll", redraw, { passive: true });
    window.addEventListener("resize", redraw);
    document.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", redraw);
    redraw();
    onReady();
    return () => {
      if (motion.invalidate === redraw) motion.invalidate = null;
      observer.disconnect();
      gl.domElement.removeEventListener("webglcontextlost", onLost);
      window.removeEventListener("scroll", redraw);
      window.removeEventListener("resize", redraw);
      document.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", redraw);
    };
  }, [gl, invalidate, motionRef, objects, onReady, onFailure]);

  useFrame((_, delta) => {
    if (document.hidden) return;
    let settling = false;
    for (let index = 0; index < objects.current.length; index++) {
      const object = objects.current[index];
      const group = object.ref.current;
      const anchor = anchors.current[index];
      if (!group || !anchor) continue;
      const rect = anchor.getBoundingClientRect();
      group.visible = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < size.height && rect.right > 0 && rect.left < size.width;
      if (!group.visible) continue;
      group.position.set(rect.left + rect.width / 2 - size.width / 2, size.height / 2 - rect.top - rect.height / 2, 0);
      group.scale.setScalar(Math.min(rect.width / object.width, rect.height / object.height));
      const narrative = group.children[0] as Group;
      const progress = motionRef.current.zones[object.id === "planet" ? "home" : "projects"] ?? MathUtils.clamp(1 - rect.top / size.height, 0, 1);
      const atmosphere = motionRef.current.connectors.atmosphere ?? MathUtils.clamp(1 - rect.top / size.height, 0, 1);
      const departure = MathUtils.smoothstep(progress, 0.55, 1);
      const targetX = object.id === "showcase" ? 0.12 : pointer.current.y * 0.12;
      const targetY = (object.id === "planet" ? progress * 0.6 + departure * 0.35 : object.id === "capsule" ? -0.25 + atmosphere * 0.3 : -0.25 + motionRef.current.projectProgress * 0.3) + pointer.current.x * 0.16;
      const targetScale = object.id === "planet" ? 1 - departure * 0.15 : object.id === "showcase" ? 0.85 + 0.15 * MathUtils.smoothstep(progress, 0, 0.15) - 0.15 * MathUtils.smoothstep(progress, 0.85, 1) : 1;
      narrative.rotation.x = MathUtils.damp(narrative.rotation.x, targetX, 9, Math.min(delta, 0.05));
      narrative.rotation.y = MathUtils.damp(narrative.rotation.y, targetY, 9, Math.min(delta, 0.05));
      narrative.rotation.z = object.id === "capsule" ? -0.2 + atmosphere * 0.15 : 0.04;
      narrative.scale.setScalar(MathUtils.damp(narrative.scale.x, targetScale, 9, Math.min(delta, 0.05)));
      if (object.id === "capsule") {
        const opacity = MathUtils.smoothstep(atmosphere, 0, 0.2) * (1 - MathUtils.smoothstep(atmosphere, 0.8, 1));
        narrative.traverse((child) => {
          if (!(child as Mesh).isMesh) return;
          const material = (child as Mesh).material as Material;
          material.transparent = true;
          material.opacity = opacity;
        });
      }
      settling ||= Math.abs(narrative.rotation.x - targetX) + Math.abs(narrative.rotation.y - targetY) + Math.abs(narrative.scale.x - targetScale) > 0.001;
    }
    if (settling) invalidate();
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <hemisphereLight args={["#e3d6f8", "#131225", 1]} />
      <directionalLight position={[-500, 600, 1000]} intensity={2.5} />
      <directionalLight position={[400, -100, 500]} intensity={0.8} color="#9ebbd5" />
      <group ref={planet} visible={false} name="planet"><group><Planet /></group></group>
      <group ref={capsule} visible={false} name="capsule"><group><ExplorationCapsule /></group></group>
      <group ref={showcase} visible={false} name="showcase"><group><ProjectShowcase3D accent={projectAccent} /></group></group>
    </>
  );
}

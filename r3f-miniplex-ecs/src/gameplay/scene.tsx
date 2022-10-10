import { ECS } from "./state";
import { DestroyAfterSystem } from "./systems/DestroyAfterSystem";
import { AgeSystem } from "./systems/AgeSystem";
import { ECSFlushSystem } from "./systems/FlushSystem";
import Player from "./models/Player";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Tag } from "miniplex";
import { PlayerAutomaticSystem } from "./systems/PlayerAutomaticSystem";
import { useEffect } from "react";
import { Plane } from "@react-three/drei";
import { spawnBall } from "./entities/balls";
import { SpawnerSystem } from "./systems/SpawnerSystem";
import { PlayerSystem } from "./systems/PlayerSystem";

// https://github.com/hmans/composer-suite/blob/main/apps/spacerage/src/scenes/gameplay/Bullets.tsx
// export const Bullets = () => (
//   <InstancedParticles capacity={200}>
//     <planeGeometry args={[0.1, 0.8]} />
//     <meshBasicMaterial color={new Color("yellow").multiplyScalar(2)} />
//
//     <ECS.ArchetypeEntities archetype={["bullet"]}>
//       {({ bullet }) => bullet}
//     </ECS.ArchetypeEntities>
//   </InstancedParticles>
// )

const Balls = () => {
  useEffect(() => {
    const n = 20;
    for (let i = 0; i < n; i++) {
      const x = i - n / 2;
      const y = 3;
      const z = 0;
      const r = Math.random() * 0.25 + 0.5;
      spawnBall({ position: [x, y, z], radius: r });
    }
  }, []);


  return (<ECS.ArchetypeEntities archetype={"sphere"}>
    {(entity) => <ECS.Entity entity={entity}>{entity.jsx}</ECS.Entity>}
  </ECS.ArchetypeEntities>);
};

const Bullets = () => {
  return (<ECS.ArchetypeEntities archetype={"bullet"}>
    {(entity) => <ECS.Entity entity={entity}>{entity.bullet}</ECS.Entity>}
  </ECS.ArchetypeEntities>);
};

const Player2 = () => (
  <ECS.Entity>
    <ECS.Component name="player" data={Tag} />
    <ECS.Component name="rigidBody">
      <RigidBody colliders={false} type={"kinematicPosition"}>
        <CapsuleCollider args={[0.2, 0.8]} position={[0, 1, 0]} />
        <Player scale={4} rotation={[0, Math.PI / 2, 0]} />
      </RigidBody>
    </ECS.Component>
  </ECS.Entity>
);

const Floor = () => (<RigidBody>
  <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]}>
    <meshStandardMaterial color={"hotpink"} />
  </Plane>
</RigidBody>);

export function Scene() {

  return <>
    <Player2 />
    <Balls />
    <Bullets />
    <Floor />

    <AgeSystem />
    <DestroyAfterSystem />
    <PlayerAutomaticSystem />

    <SpawnerSystem />
    <PlayerSystem />
    <ECSFlushSystem />
  </>;
}

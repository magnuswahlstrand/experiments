import { ECS } from "./state";
import { DestroyAfterSystem } from "./systems/DestroyAfterSystem";
import { AgeSystem } from "./systems/AgeSystem";
import { TestSystem } from "./systems/TestSystem";
import { SpawnerSystem } from "./systems/SpawnerSystem";
import { ECSFlushSystem } from "./systems/FlushSystem";
import Player from "./models/Player";

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



const EnemyShips = () => (
  <ECS.ArchetypeEntities archetype={"sphere"}>
    {(entity) => {
      return <ECS.Entity entity={entity}>
        <ECS.Component name="three">
          <mesh position={entity.initialPosition ?? [3*(Math.random()-0.5),3*(Math.random()-0.5),0]}>
            <sphereGeometry args={[entity.radius ??  0.5]} />
            <meshStandardMaterial color={entity.color} />
          </mesh>
        </ECS.Component>
      </ECS.Entity>
    }}
  </ECS.ArchetypeEntities>
)

const Player2 = () => (
  <ECS.Entity>
    <ECS.Component name="position" data={{ x: 2, y: 2, z: 0 }} />
    <ECS.Component name="health" data={100} />
    <ECS.Component name="three">
      <Player/>
    </ECS.Component>
  </ECS.Entity>
);

export function Scene() {
  return <>
    <Player2 />
    <EnemyShips/>
    <AgeSystem />
    <DestroyAfterSystem />
    <TestSystem />

    <SpawnerSystem />
    <ECSFlushSystem/>
  </>;
}

import { Color } from "three";
import { ECS } from "../state";
import { InstancedRigidBodies, RigidBody } from "@react-three/rapier";
import Tree from "../models/TreeModel";

// export const Bullets = () => (
//   <InstancedRigidBodies>
//     <planeGeometry args={[0.1, 0.8]} />
//     <meshBasicMaterial color={new Color("yellow").multiplyScalar(2)} />
//
//     <ECS.ArchetypeEntities archetype="bullet">
//       {({ bullet }) => bullet}
//     </ECS.ArchetypeEntities>
//   </InstancedRigidBodies>
// );

export const spawnBullet = (x: number, y: number) =>
  ECS.world.createEntity({
    jsx: (
      <>
        <RigidBody position={[x, 0, y]}>
          <Tree />
        </RigidBody>
      </>
    )
  });

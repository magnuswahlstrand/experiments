import { Color, Quaternion, Vector3 } from "three";
import { ECS } from "../state";
import { InstancedRigidBodies, RigidBody } from "@react-three/rapier";
import { Sphere } from "@react-three/drei";

export const Bullets = () => (
  <InstancedRigidBodies>
    <planeGeometry args={[0.1, 0.8]} />
    <meshBasicMaterial color={new Color("yellow").multiplyScalar(2)} />

    <ECS.ArchetypeEntities archetype="bullet">
      {({ bullet }) => bullet}
    </ECS.ArchetypeEntities>
  </InstancedRigidBodies>
)

export const spawnBullet = (
  position: Vector3,
  quaternion: Quaternion,
  velocity: [number, number, number]
) =>
  ECS.world.createEntity({
    age: 0,
    destroyAfter: 1,

    bullet: (
      <>
        <RigidBody colliders="ball" position={position} linearVelocity={velocity}>
          <Sphere args={[0.1, 32, 32]} >
            <meshBasicMaterial color={new Color("yellow").multiplyScalar(2)} />
          </Sphere>
        </RigidBody>
      </>
    )
  })

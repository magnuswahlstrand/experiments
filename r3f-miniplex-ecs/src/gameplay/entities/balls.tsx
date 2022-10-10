import { RigidBody } from "@react-three/rapier";
import { ECS } from "../state";
import Rock from "../models/Rock";
import { Tag } from "miniplex";
interface ballProps {
  position: [number, number, number],
  radius: number
}

export const Ball = ({ position, radius }: ballProps) => {
  return (
    <RigidBody position={position} colliders={"ball"}>
      <Rock scale={radius * 0.5} />
      {/*<mesh>*/}
      {/*  <sphereGeometry args={[0.6 * radius, 32, 32]} />*/}
      {/*  <meshStandardMaterial color={"green"}/>*/}
      {/*</mesh>*/}
    </RigidBody>
  );
};

export const spawnBall = (props: ballProps) => {
  ECS.world.createEntity({
    sphere: Tag,
    jsx: <>
      <Ball position={props.position} radius={props.radius} />
    </>
  });
};

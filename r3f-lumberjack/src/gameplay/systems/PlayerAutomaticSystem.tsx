import { useFrame } from "@react-three/fiber";
import { ECS } from "../state";
import { RenderPriority } from "./render";
import { Quaternion, Vector3 } from "three";

const R = 7;

const pos = new Vector3();
const rotation = new Quaternion();
const yAxis = new Vector3(0,1,0)
export const PlayerAutomaticSystem = () => {
  const entities = ECS.world.archetype("player");


  useFrame(({ clock }) => {
    const [player] = entities.entities;


    if (!player.rigidBody) return;

    const t = 2*clock.getElapsedTime()/2;
    const x = R*Math.cos(t);
    const z = R*Math.sin(t);

    pos.setX(x)
    pos.setZ(z)
    rotation.setFromAxisAngle(yAxis, -t)

    player.rigidBody.setNextKinematicTranslation(pos);
    player.rigidBody.setNextKinematicRotation(rotation);

  });


  return null;
};

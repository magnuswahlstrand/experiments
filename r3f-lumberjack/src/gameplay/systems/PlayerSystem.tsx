import { useFrame } from "@react-three/fiber";
import { ECS } from "../state";
import { RenderPriority } from "./render";
import { Quaternion, Vector3 } from "three";
import { spawnBall } from "../entities/balls";
import { spawnBullet } from "../entities/bullet";

const R = 5;

const pos = new Vector3();
const rotation = new Quaternion();
const yAxis = new Vector3(0,1,0)
export const PlayerSystem = () => {
  const entities = ECS.world.archetype("player");

  useFrame(({ clock }) => {
    if (entities.entities.length === 0) return;
    const { rigidBody } = entities.entities[0];

    if (!rigidBody) return;

    rotation.copy(rigidBody.raw().rotation())

    rigidBody.translation().copy(pos)

    const v = new Vector3(1,1,0)
    spawnBullet(v ,rotation, [1,0,0])
  });

  useFrame(() => {

  }, RenderPriority);

  return null;
};

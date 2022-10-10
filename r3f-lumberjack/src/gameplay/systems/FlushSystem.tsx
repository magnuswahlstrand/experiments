import { useFrame } from "@react-three/fiber";
import { ECS } from "../state";

export const ECSFlushSystem = () => {
  useFrame(() => {
    ECS.world.queue.flush();
  }, 0);

  return null;
};

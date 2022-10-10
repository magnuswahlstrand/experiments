import { useFrame } from "@react-three/fiber";
import { ECS } from "../state";
import { RenderPriority } from "./render";

export const TestSystem = () => {
  const entities = ECS.world.archetype("three");

  useFrame(() => {
    for (const entity of entities) {
    }
  }, RenderPriority);

  return null;
};

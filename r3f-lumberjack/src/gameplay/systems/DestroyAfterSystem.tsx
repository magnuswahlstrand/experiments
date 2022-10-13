import { useFrame } from "@react-three/fiber";
import { ECS } from "../state";
import { RenderPriority } from "./render";

// export const DestroyAfterSystem = () => {
//   const entities = ECS.world.archetype("age", "destroyAfter");
//
//   useFrame(() => {
//     for (const entity of entities) {
//       if (entity.age >= entity.destroyAfter) {
//         ECS.world.queue.destroyEntity(entity);
//       }
//     }
//   }, RenderPriority);
//
//   return null;
// };

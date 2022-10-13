import { useFrame } from "@react-three/fiber";
import { ECS } from "../state";
import { RenderPriority } from "./render";
//
// export const AgeSystem = () => {
//   const entities = ECS.world.archetype("age");
//
//   useFrame((_, dt) => {
//     for (const entity of entities) {
//       entity.age += dt;
//     }
//   }, RenderPriority);
//
//   return null;
// };

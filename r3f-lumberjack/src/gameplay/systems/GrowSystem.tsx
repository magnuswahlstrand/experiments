import {useFrame} from "@react-three/fiber";
import {ECS} from "../state";
import {RenderPriority} from "./render";

export const GrowSystem = () => {
    const entities = ECS.world.archetype("growing", "sceneObject");

    useFrame((_, dt) => {
        for (const entity of entities) {
            let {current, max, change} = entity.growing
            current += change * dt
            if (current >= max) {
                current = max
                ECS.world.queue.removeComponent(entity, "growing");
            }

            // entity.growing.current += entity.growing?.change * dt;
            // entity.growing.current = Math.min(entity.growing.current + 0.001, 1);
            entity.growing.current = current
            entity.sceneObject.scale.setScalar(entity.growing.current);
        }
    }, RenderPriority);

    return null;
};

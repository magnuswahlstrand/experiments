import {useFrame} from "@react-three/fiber";
import {ECS} from "../state";
import {growRate} from "../Tree";



const collided = ECS.world.archetype("collided");
export const PickupSystem = () => {

    useFrame(({}) => {
        for (let i = collided.entities.length; i > 0; i--) {
            const entity = collided.entities[i - 1]
            ECS.world.destroyEntity(entity)
        }
    });


    return null;
};

import {ECS} from "./state";
import {interactionGroups, RigidBody} from "@react-three/rapier";
import TreeModel from "./models/TreeModel";
import * as collisionGroups from "./common/collisionGroups";

export const Trees = () => {
    return (<ECS.ArchetypeEntities archetype={"jsx"}>
        {(entity) => <ECS.Entity entity={entity}>{entity.jsx}</ECS.Entity>}
    </ECS.ArchetypeEntities>);
};


export const growRate = {
    current: 0.1,
    max: 0.7,
    change: 0.4
}

export const spawnTree = (x: number, y: number) => {
    const group = interactionGroups(collisionGroups.TREES, collisionGroups.PLAYER)
    const entity = ECS.world.createEntity({
        growing: {...growRate},
        jsx: (<RigidBody position={[x, 0, y]}
                         enabledTranslations={[false, false, false]}
                         enabledRotations={[false, false, false]}
                         onCollisionEnter={(state) => {
                             console.log("collided")
                             ECS.world.addComponent(entity, "collided", true)
                         }}
                         collisionGroups={group}>
            <ECS.Component name="sceneObject">
                <group scale={0.1}>
                    <TreeModel rotation={[0, 2 * Math.PI * Math.random(), 0]} scale={0.1}/>
                </group>
            </ECS.Component>
        </RigidBody>)
    })
}

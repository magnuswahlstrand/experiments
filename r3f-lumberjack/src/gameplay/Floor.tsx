import {interactionGroups, RigidBody} from "@react-three/rapier";
import {OTHER} from "./common/collisionGroups";
import {Plane} from "@react-three/drei";

export const Floor = () => (<RigidBody collisionGroups={interactionGroups(OTHER, [])}>
    <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color={"darkgreen"}/>
    </Plane>
</RigidBody>);

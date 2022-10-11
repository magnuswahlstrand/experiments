import {interactionGroups, RigidBody} from "@react-three/rapier";
import {useEffect} from "react";
import {GrowSystem} from "./systems/GrowSystem";
import {KeyboardControls, Plane} from "@react-three/drei";
import {spawnTree, Trees} from "./Tree";
import {PlayerAutomaticSystem} from "./systems/PlayerAutomaticSystem";
import {Player} from "./entities/player";
import {PickupSystem} from "./systems/PickupSystem";
import {OTHER} from "./common/collisionGroups";
import {PlayerControlsSystem} from "./systems/PlayerControlsSystem";

const Floor = () => (<RigidBody collisionGroups={interactionGroups(OTHER, [])}>
    <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color={"darkgreen"} />
    </Plane>
</RigidBody>);

function spawnTrees() {
    const distance = 1
    const n=20
    for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
            spawnTree(distance * x - n/2, distance * y - n/2);
        }
    }
}


export function Scene() {

    useEffect(() => {
        spawnTrees();
    }, []);

    return <>
        <Trees/>
        <Floor/>
        <Player/>
        {/*<group>*/}
        {/*    <CarModel/>*/}
        {/*</group>*/}

        <GrowSystem/>
        <PickupSystem/>
        {/*<PlayerAutomaticSystem />*/}
        <KeyboardControls
            onChange={() => null}
            map={[
                { name: 'up', keys: ['ArrowUp', 'w', 'W'] },
                { name: 'down', keys: ['ArrowDown', 's', 'S'] },
                { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
                { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
                { name: 'jump', keys: ['Space'] },
            ]}>
            <PlayerControlsSystem />
        </KeyboardControls>

    </>;
}

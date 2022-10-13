import {useEffect} from "react";
import {GrowSystem} from "./systems/GrowSystem";
import {KeyboardControls} from "@react-three/drei";
import {spawnTrees, Trees} from "./Tree";
import {Player} from "./Player";
import {DestroySystem} from "./systems/DestroySystem";
import {PlayerControlsSystem} from "./systems/PlayerControlsSystem";
import {Floor} from "./Floor";


export function Scene() {
    useEffect(() => {
        spawnTrees();
    }, []);

    return <>
        <Trees/>
        <Floor/>
        <Player/>

        <GrowSystem/>
        <DestroySystem/>
        <KeyboardControls
            onChange={() => null}
            map={[
                {name: 'up', keys: ['ArrowUp', 'w', 'W']},
                {name: 'down', keys: ['ArrowDown', 's', 'S']},
                {name: 'left', keys: ['ArrowLeft', 'a', 'A']},
                {name: 'right', keys: ['ArrowRight', 'd', 'D']},
            ]}>
            <PlayerControlsSystem/>
        </KeyboardControls>

    </>;
}

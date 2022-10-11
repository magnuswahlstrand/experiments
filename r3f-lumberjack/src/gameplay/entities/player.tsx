import {ECS} from "../state";
import {Tag} from "miniplex";
import {RigidBody} from "@react-three/rapier";
import CarModel from "../models/CarModel";

export const Player = () => (
    <ECS.Entity>
        <ECS.Component name="player" data={Tag}/>
        <ECS.Component name="rigidBody">
            {/*<RigidBody type={"kinematicPosition"}>*/}
            <RigidBody type={"kinematicVelocity"}>
                <group>
                    <CarModel position={[0, 0.6, 0]} rotation={[0,Math.PI/2,0]}/>
                </group>
            </RigidBody>
        </ECS.Component>
    </ECS.Entity>
);

import {Canvas} from "@react-three/fiber";

import {Decal, Float, OrbitControls, PresentationControls, Stage, useTexture} from "@react-three/drei";
import {Model as Shirt2} from "./Scene2";
import Bunny from "./Bunny";
// import {Model as Shirt2} from "./BlackShirt";
// import { OrbitControls, AxisHelper } from 'three-stdlib'
// extend({ AxisHelper, OrbitControls })


function Lights() {
    return <>
        <ambientLight intensity={0.25}/>
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
        <pointLight position={[-10, -5, -10]}/>
    </>;
}

function DecalComponent() {
    const texture = useTexture('./texture.jpg')

    return <mesh>
        <boxGeometry/>
        <meshStandardMaterial/>
        <Decal
            debug // Makes "bounding box" of the decal visible
            position={[0, 0, 0]} // Position of the decal
            rotation={[0, 0, 0]} // Rotation of the decal (can be a vector or a degree in radians)
            // scale={0.4} // Scale of the decal
        >
            <meshBasicMaterial
                // color="red"
            />
        </Decal>
    </mesh>;
}

function App() {
    return (
        <Canvas camera={{position: [3, 3, 3], fov: 45}} shadows>
            {/*<color attach="background" args={['white']}/>*/}
            <Lights/>
            {/*<Backdrop*/}
            {/*    floor={0.25} // Stretches the floor segment, 0.25 by default*/}
            {/*    segments={20} // Mesh-resolution, 20 by default*/}
            {/*    receiveShadow={true}*/}
            {/*    scale={[50, 5, 5]}*/}
            {/*    position={[0, -0.5, 0]}*/}
            {/*>*/}
            {/*    <meshStandardMaterial color="white"/>*/}
            {/*</Backdrop>*/}
            <PresentationControls
                global snap
            >

                <Stage intensity={0.2} environment="city" preset="rembrandt">
                <Float floatingRange={[0.05, 0.1]} speed={3}>
                {/*<DecalComponent/>*/}

                <Shirt2/>
                {/*<Bunny/>*/}
                {/*<Shirt scale={0.002}/>*/}
                </Float>
                </Stage>
            </PresentationControls>
            <axesHelper/>
        </Canvas>
    )
}

export default App

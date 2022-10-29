import {Canvas} from "@react-three/fiber";

import {Decal, Float, Stage, useTexture} from "@react-three/drei";
import {Model as Shirt2} from "./Scene2";
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
        <>
            <Canvas camera={{position: [4, 4, 4], fov: 45}} shadows>
                {/*<color attach="background" args={['pink']}/>*/}
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
                {/*<PresentationControls*/}
                {/*    global snap*/}
                {/*>*/}

                <Stage intensity={0.2} environment="city" preset="rembrandt">
                    <Float floatingRange={[0.05, 0.06]} speed={10} rotationIntensity={0.1}>
                        <Shirt2/>
                    </Float>
                </Stage>
                {/*</PresentationControls>*/}
                {/*<axesHelper/>*/}
            </Canvas>
            <div className={"bg-red-500 fixed b-0"}>
                aa
            </div>

            <div className="flex flex-col h-screen w-screen fixed">
                <div className="bg-green-500 flex-grow">content</div>
                <div className={"w-96 " +
                    "border-2 border-black mx-auto"}>
                    aaa
                    <img
                        className={"w-24"}
                        src={'./texture.jpg'} alt=""/>
                </div>
            </div>
        </>
    )
}

export default App

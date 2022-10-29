import {Canvas} from "@react-three/fiber";

import {Backdrop, Stage} from "@react-three/drei";
import {Model as Shirt2} from "./Scene2";
import {useState} from "react";
import * as THREE from "three";


function Lights() {
    return <>
        <ambientLight intensity={0.25}/>
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
        <pointLight position={[-10, -5, -10]}/>
    </>;
}

function ColorPicker(props: { colorIndex: number, setColorIndex: (number) => void }) {
    return <div>
        {colors.map((color, index) => (
            <div key={index}
                 className={`w-16 h-16 rounded bg-black inline-block mr-2 border-2 border-gray-900 ${index === props.colorIndex ? "border-blue-700" : ""}`}
                 style={{backgroundColor: color.name}}
                 onClick={() => props.setColorIndex(index)}/>
        ))}
    </div>;
}

function ArtworkPicker(props: { textureIndex: number, setTextureIndex: (number) => void }) {
    return <div>
        {textureNames.map((textureName, index) => (
            <img key={index}
                 alt={textureName}
                 src={`/textures/${textureName}`}
                 className={`w-16 h-16 rounded bg-white inline-block mr-2 border-2 border-gray-900 ${index === props.textureIndex ? "border-blue-700" : ""}`}
                 // style={{backgroundImage: `url('/textures/${textureName}')`}}
                 onClick={() => props.setTextureIndex(index)}/>
        ))}
    </div>;
}


function SceneBackdrop() {
    return <Backdrop
        floor={0.25} // Stretches the floor segment, 0.25 by default
        segments={20} // Mesh-resolution, 20 by default
        receiveShadow={true}
        scale={[50, 5, 5]}
        position={[0, -0.5, 0]}
    >
        <meshStandardMaterial color="white"/>
    </Backdrop>;
}

const colors = [
    {name: "#f0f0f0", obj: new THREE.Color("#f0f0f0")},
    {name: "#303030", obj: new THREE.Color("#303030")},
    {name: "#0f0f0f", obj: new THREE.Color("#0f0f0f")},
    {name: "#e3248b", obj: new THREE.Color("#e3248b")},
    {name: "#1983a3", obj: new THREE.Color("#1983a3")},
]

const textureNames = [
    "pink-logo.png",
    "boards.jpg",
]


function App() {
    const [colorIndex, setColorIndex] = useState(0);
    const [textureIndex, setTextureIndex] = useState(1);
    const color = colors[colorIndex];
    // const textureName = textures[textureIndex];

    return (
        <>
            <Canvas camera={{position: [4, 4, 4], fov: 45}} shadows>
                {/*<color attach="background" args={['pink']}/>*/}
                <Lights/>
                <SceneBackdrop/>

                <Stage intensity={0.2} environment="city" preset="rembrandt">
                    {/*<Float floatingRange={[0.05, 0.06]} speed={10} rotationIntensity={0.1}>*/}
                    {/* TODO: Avoid allocating a new color per rended*/}
                    <Shirt2 color={color.obj} textureIndex={textureIndex}/>
                    {/*</Float>*/}
                </Stage>
            </Canvas>

            <div className="absolute bottom-0 left-0 right-0">
                <div className="w-96 mx-auto bg-white p-3 pb-1 z-100 border-black rounded-t-xl flex flex-col space-y-2">
                    <ArtworkPicker textureIndex={textureIndex} setTextureIndex={setTextureIndex}/>
                    <ColorPicker colorIndex={colorIndex} setColorIndex={setColorIndex}/>
                </div>
            </div>
        </>
    )
}

export default App

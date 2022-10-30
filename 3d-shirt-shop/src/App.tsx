import {Canvas} from "@react-three/fiber";

import {Backdrop, Loader, OrbitControls, Stage, useTexture} from "@react-three/drei";
import {Model as Shirt2} from "./Shirt1";
import {useRef, useState} from "react";
import * as THREE from "three";


function Lights() {
    return <>
        <ambientLight intensity={0.25}/>
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
        <pointLight position={[-10, -5, -10]}/>
    </>;
}

function ColorPicker(props: { selected: number, onChange: (number) => void }) {
    return <div>
            <div className="font-bold text-xl mb-1">Color</div>
            {colors.map((color, index) => (
                <div key={index}
                     className={`w-16 h-16 rounded bg-black inline-block mr-2 border-2 border-gray-900 ${index === props.selected ? "border-blue-700" : ""}`}
                     style={{backgroundColor: color}}
                     onClick={() => props.onChange(index)}/>
            ))}
        </div>
}

function ArtworkPicker(props: { selected: number, onChange: (number) => void }) {
    return <div>
            <div className="font-bold text-xl mb-1">Artwork</div>
            {textureNames.map((textureName, index) => (
                <img key={index}
                     alt={textureName}
                     src={`/textures/${textureName}`}
                     className={`w-16 h-16 rounded bg-white inline-block mr-2 border-2 border-gray-900 ${index === props.selected ? "border-blue-700" : ""}`}
                    // style={{backgroundImage: `url('/textures/${textureName}')`}}
                     onClick={() => props.onChange(index)}/>
            ))}
        </div>
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
    "#f0f0f0",
    "#303030",
    "#0f0f0f",
    "#e3248b",
    "#1983a3",
]

const textureNames = [
    "pink-logo.png",
    "boards.jpg",
]


function App() {
    const [colorIndex, setColorIndex] = useState(0);
    const [textureIndex, setTextureIndex] = useState(0);
    // const textureName = textures[textureIndex];

    const shirtRef = useRef<THREE.Mesh>(null);

    // useEffect(() => {
    //     if (!shirtRef.current) return;
    //     // console.log(shirtRef.mesh)
    //     shirtRef.current.material.color = new THREE.Color(colors[colorIndex]);
    //     shirtRef.current.material.mustUpdate = true
    //     shirtRef.current.material.must_update = true;
    //     console.log(shirtRef.current.material.color)
    // }, [colorIndex]);

    const setTexture = (index: number) => {
        console.log("setColor", colors[index])
        shirtRef.current.material.color = new THREE.Color(colors[index]);
        shirtRef.current.material.needsUpdate = true
        setTextureIndex(index);
    }

    const setColor = (index: number) => {
        console.log("setColor", colors[index])
        shirtRef.current.material.color = new THREE.Color(colors[index]);
        shirtRef.current.material.needsUpdate = true
        setColorIndex(index);
    }

    return (
        <>
            <Canvas camera={{position: [0, 0, 1], fov: 45}} shadows>
                <color attach="background" args={['pink']}/>
                <Lights/>
                {/*<SceneBackdrop/>*/}
                {/*<PresentationControls*/}
                {/*    cursor={true} // Whether to toggle cursor style on drag*/}
                {/*    global*/}
                {/*    snap={true} // Snap-back to center (can also be a spring config)*/}
                {/*    speed={1} // Speed factor*/}
                {/*    polar={[-Math.PI / 12, Math.PI / 12]} // Vertical limits*/}
                {/*    azimuth={[-Infinity, Infinity]} // Horizontal limits*/}
                {/*    // config={{ mass: 1, tension: 170, friction: 26 }} // Spring config*/}
                {/*    enabled={false}*/}
                {/*>*/}
                {/*<Float floatingRange={[-0.5, -0.48]} speed={10} rotationIntensity={0.1}>*/}
                <Stage intensity={0.2} environment="city" preset="rembrandt" position={[0, -2, 0]}>
                    {/*<Center position={[0,0,0]}>*/}

                    <Shirt2 ref={shirtRef}/>
                    {/*textureIndex={textureIndex} color={colors[colorIndex]}/>*/}
                    {/*</Center>*/}
                </Stage>
                {/*</Float>*/}
                {/*</PresentationControls>*/}
                <OrbitControls/>
                <axesHelper/>
            </Canvas>
            <Loader/>

            <div className="absolute bottom-0 left-0 right-0">
                <div className="w-96 mx-auto bg-white p-3 pb-1 z-100 border-black rounded-t-xl flex flex-col space-y-2">
                    <ArtworkPicker selected={textureIndex} onChange={setTexture}/>
                    <ColorPicker selected={colorIndex} onChange={setColor}/>
                </div>
            </div>
        </>
    )
}


export default App

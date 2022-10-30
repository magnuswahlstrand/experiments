import {Canvas} from "@react-three/fiber";

import {Backdrop, Loader, PresentationControls, Stage, useTexture} from "@react-three/drei";
import {Model as Shirt2} from "./Shirt1";
import {useState} from "react";


function Lights() {
    return <>
        <ambientLight intensity={0.25}/>
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
        <pointLight position={[-10, -5, -10]}/>
    </>;
}

function ColorPicker(props: { currentColor: string, onChange: (number) => void }) {
    return <div>
        <div className="font-bold text-xl mb-1">Color</div>
        {colors.map((color, index) => {
                const selected = color === props.currentColor;
                return <div key={index}
                            className={`w-16 h-16 rounded bg-black inline-block mr-2 border-2 border-gray-900 ${selected ? "border-blue-700" : ""}`}
                            style={{backgroundColor: color}}
                            onClick={() => props.onChange(color)}/>
            }
        )}
    </div>
}

function ArtworkPicker(props: { currentUrl: string, onChange: (url: string) => void }) {
    return <div>
        <div className="font-bold text-xl mb-1">Artwork</div>
        {textureUrls.map((url, index) => {
                const selected = url === props.currentUrl;
                return (<img key={index}
                             alt={url}
                             src={url}
                             className={`w-16 h-16 rounded bg-white inline-block mr-2 border-2 border-gray-900 ${selected ? "border-blue-700" : ""}`}
                             onClick={() => {
                                 props.onChange(url)
                             }}/>)
            }
        )}
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

const textureUrls = [
    "/textures/pink-logo.png",
    "/textures/boards.jpg",
    "/textures/corgi.png",
    "/textures/3d.png",
    "/textures/space.png",
]

for (const textureUrl of textureUrls) {
    useTexture.preload(textureUrl)
}

function App() {
    const [color, setColor] = useState(colors[0]);
    const [artworkUrl, setArtworkUrl] = useState("textures/pink-logo.png");

    return (
        <>
            <Canvas camera={{position: [0, 0, 1], fov: 45}} shadows>
                <color attach="background" args={['pink']}/>
                <Lights/>
                <SceneBackdrop/>
                <PresentationControls
                    cursor global snap
                    polar={[-Math.PI / 12, Math.PI / 12]} // Vertical limits
                >
                    {/*<Float floatingRange={[-0.5, -0.48]} speed={10} rotationIntensity={0.1}>*/}
                    <Stage intensity={0.2} environment="city" preset="rembrandt" position={[0, -2, 0]}>
                        <Shirt2 artworkUrl={artworkUrl} color={color}/>
                    </Stage>
                    {/*</Float>*/}
                </PresentationControls>
                {/*<axesHelper/>*/}
            </Canvas>
            <Loader/>

            <div className="absolute bottom-0 left-0 right-0">
                <div className="w-96 mx-auto bg-white p-3 pb-1 z-100 border-black rounded-t-xl flex flex-col space-y-2">
                    <ArtworkPicker currentUrl={artworkUrl} onChange={setArtworkUrl}/>
                    <ColorPicker currentColor={color} onChange={setColor}/>
                </div>
            </div>
        </>
    )
}


export default App

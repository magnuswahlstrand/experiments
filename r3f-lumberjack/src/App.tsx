/* r3f-stage provides a global stylesheet. Please import it in your application and remove any other global styles you may have defined. */
import "r3f-stage/styles.css";
import {Canvas} from "@react-three/fiber";
import {Scene} from "./gameplay/scene";
import {Debug, Physics} from "@react-three/rapier";
import {OrbitControls} from "@react-three/drei";


function App() {
    return (
        // <Canvas camera={{ position: [5*5, 7*5, 5*5] }}>
        <Canvas camera={{position: [5*5, 7 * 5, 5*5], zoom: 50}} orthographic shadows>
            <ambientLight/>
            {/*<directionalLight position={[10, 10, 5]} intensity={1.5}*/}
            {/*                  castShadow*/}
            {/*                  shadow-mapSize-width={2048}*/}
            {/*                  shadow-mapSize-height={2048}*/}
            {/*/>*/}
            <pointLight position={[-100, 100, -5]} castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
            />
            <Physics>
                {/*<Debug/>*/}
                <Scene/>
            </Physics>
            <OrbitControls/>
            {/*<axesHelper args={[10]}/>*/}
        </Canvas>
    );
}

export default App;

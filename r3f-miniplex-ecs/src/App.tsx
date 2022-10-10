/* r3f-stage provides a global stylesheet. Please import it in your application and remove any other global styles you may have defined. */
import "r3f-stage/styles.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./gameplay/scene";
import { Debug, Physics } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";


function App() {
  return (
    <Canvas camera={{ position: [5, 7, 5] }}>
      <ambientLight />
      <directionalLight position={[10, 10, 5]} />
      <pointLight position={[-10, 10, -5]} />
      <Physics>
        {/*<Debug />*/}
        <Scene />
      </Physics>
      <OrbitControls />
      <axesHelper args={[5]} />
    </Canvas>
  );
}

export default App;

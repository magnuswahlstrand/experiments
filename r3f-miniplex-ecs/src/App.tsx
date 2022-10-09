/* r3f-stage provides a global stylesheet. Please import it in your application and remove any other global styles you may have defined. */
import "r3f-stage/styles.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./gameplay/scene";


function App() {
  return (
    <Canvas>
      <ambientLight />
      <directionalLight position={[10, 10, 5]} />
      <Scene />
    </Canvas>
  );
}

export default App;

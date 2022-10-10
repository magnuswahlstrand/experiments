import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";
import { Plane } from "@react-three/drei";
import { spawnTree, Trees } from "./Tree";

const Floor = () => (<RigidBody>
  <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]}>
    <meshStandardMaterial color={"hotpink"} />
  </Plane>
</RigidBody>);

function spawnTrees() {
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 3; y++) {
      spawnTree(3*x, 3*y);
    }
  }
}

export function Scene() {

  useEffect(() => {
    spawnTrees();
  }, []);

  return <>
    <Trees />
    <Floor />

    {/*<AgeSystem />*/}
    {/*<DestroyAfterSystem />*/}
    {/*<PlayerAutomaticSystem />*/}

    {/*<SpawnerSystem />*/}
    {/*<PlayerSystem />*/}
    {/*<ECSFlushSystem />*/}
  </>;
}

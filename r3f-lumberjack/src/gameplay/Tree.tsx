import { ECS } from "./state";
import { RigidBody } from "@react-three/rapier";
import TreeModel from "./models/TreeModel";

export const Trees = () => {
  return (<ECS.ArchetypeEntities archetype={"jsx"}>
    {(entity) => <ECS.Entity entity={entity}>{entity.jsx}</ECS.Entity>}
  </ECS.ArchetypeEntities>);
};


export const spawnTree = (x: number, y: number) =>
  ECS.world.createEntity({
    jsx: (
      <>
        <RigidBody position={[x, 0, y]} type={"fixed"}>
          <TreeModel scale={0.2}/>
        </RigidBody>
      </>
    )
  });

import { ECS } from "../state";
import { useEffect } from "react";
import { Tag } from "miniplex";

export const SpawnerSystem = () => {

  useEffect(() => {
    const interval = setInterval(() => {
      const entity = ECS.world.createEntity({
        position: { x: Math.random(), y: Math.random(), z: Math.random() },
        age: 0,
        destroyAfter: 2.5,
        sphere: Tag,
      });
      console.log(ECS.world.entities.length)
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
};

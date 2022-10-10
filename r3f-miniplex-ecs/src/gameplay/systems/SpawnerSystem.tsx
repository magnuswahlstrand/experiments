import { ECS } from "../state";
import { useEffect } from "react";
import { Tag } from "miniplex";
import { useFrame } from "@react-three/fiber";

export const SpawnerSystem = () => {

  useEffect(() => {
    const interval = setInterval(() => {
      ECS.world.createEntity({
        age: 0,
        destroyAfter: 2.5,
        sphere: Tag,
        color: "red",
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  useFrame(({mouse}, dt) => {
    ECS.world.createEntity({
      age: 0,
      destroyAfter: 0.3,
      sphere: Tag,
      color: "aqua",
      initialPosition: [mouse.x * 10, mouse.y * 10, 0],
      radius: 0.3,
    });
  })

  return null;
};

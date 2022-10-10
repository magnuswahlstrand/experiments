import { useEffect } from "react";
import { spawnBall } from "../entities/balls";

export const SpawnerSystem = () => {

  useEffect(() => {
    const interval = setInterval(() => {
      const x = Math.random() * 10 - 5;
      const z = Math.random() * 10 - 5;

      spawnBall({ position: [x, 6, z], radius: Math.random() * 0.5 + 0.5 });
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  return null;
};

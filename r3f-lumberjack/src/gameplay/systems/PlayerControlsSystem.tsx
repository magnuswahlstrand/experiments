import { useFrame } from "@react-three/fiber";
import { ECS } from "../state";
import { RenderPriority } from "./render";
import { Vector3 } from "three";
import { useKeyboardControls } from "@react-three/drei";

const acc = 2;
const angularVelocity = 2;
const vMax = 5;

export const PlayerControlsSystem = () => {
  const entities = ECS.world.archetype("player");

  const state = useKeyboardControls(state => state);


  useFrame(({ clock }) => {
    if (entities.entities.length === 0) return;
    const player = entities.entities[0];

    if (!player.rigidBody) return;

    let dAV = 0;
    let dV = 0;
    // const up = true
    // const down = false
    // const left = false
    // const right = false
    const { up, down, left, right } = state
    console.log()

    dV += up ? acc : 0;
    dV += down ? -acc : 0;
    dAV += left ? angularVelocity : 0;
    dAV += right ? -angularVelocity : 0;

    // TODO: Reuse vector v
    const dAVV = new Vector3(0, dAV, 0);
    player.rigidBody.setAngvel(dAVV);
    // TODO: refactor?
    const v = player.rigidBody.linvel();
    const vy = v.y;
    v.y = 0;

    // Add dV
    const dVV = new Vector3(dV, 0, 0).applyQuaternion(player.rigidBody.rotation());
    v.add(dVV);
    v.clampLength(0, vMax);

    // Return vy
    v.y = vy;
    player.rigidBody.setLinvel(v);
  });

  useFrame(() => {

  }, RenderPriority);

  return null;
};

import { createECS } from "miniplex-react";
import type {Object3D} from "three";
import {RigidBodyApi} from "@react-three/rapier";
import {Tag} from "miniplex";

type Entity = {
  player?: Tag
  rigidBody?: RigidBodyApi

  jsx?: JSX.Element
  growing?: {
    change: number
    current: number
    max: number
  },
  collided?: boolean
  sceneObject?: Object3D
}

export const ECS = createECS<Entity>();

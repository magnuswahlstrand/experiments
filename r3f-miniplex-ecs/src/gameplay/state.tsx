import { createECS } from "miniplex-react";
import { Mesh } from "three";

import { Tag } from "miniplex"
import { RigidBodyApi } from "@react-three/rapier";

type Entity = {
  three?: Mesh
  rigidBody?: RigidBodyApi

  jsx?: JSX.Element
  sphere?: Tag
  player?: Tag
  bullet?: JSX.Element

  age?: number
  destroyAfter?: number

  color?: string
  initialPosition?: [number, number, number]
  radius?: number
}

export const ECS = createECS<Entity>();

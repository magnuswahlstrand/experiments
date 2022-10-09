import { createECS } from "miniplex-react";
import { Mesh } from "three";

import { Tag } from "miniplex"

type Entity = {
  position: { x: number; y: number; z: number }
  velocity?: { x: number; y: number; z: number }
  health?: number

  three?: Mesh
  sphere?: Tag

  age?: number
  destroyAfter?: number
}

export const ECS = createECS<Entity>();

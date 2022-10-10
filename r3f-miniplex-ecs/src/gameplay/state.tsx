import { createECS } from "miniplex-react";
import { Mesh } from "three";

import { Tag } from "miniplex"

type Entity = {
  three?: Mesh
  sphere?: Tag

  age?: number
  destroyAfter?: number

  color?: string
  initialPosition?: [number, number, number]
  radius?: number
}

export const ECS = createECS<Entity>();

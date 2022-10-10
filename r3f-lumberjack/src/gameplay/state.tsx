import { createECS } from "miniplex-react";

type Entity = {
  jsx?: JSX.Element
  growing?: {
    current: number
  }
}

export const ECS = createECS<Entity>();

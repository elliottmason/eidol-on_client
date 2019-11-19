import { List } from "immutable";

import { IBoardPosition, ICombatant, IMove } from "./interfaces";

export const nullBoardPosition: IBoardPosition = {
  id: "0",
  x: 0,
  y: 0,
};

export const nullCombatant: ICombatant = {
  availability: "knocked_out",
  id: "0",
  isFriendly: true,
  isSelectedForDeployment: false,
  maximumHealth: 0,
  moves: List(),
  name: "",
  remainingHealth: 0,
};

export const nullMove: IMove = {
  id: "0",
  name: "",
};

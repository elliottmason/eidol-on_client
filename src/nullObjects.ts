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
  maximumEnergy: 0,
  maximumHealth: 0,
  moves: List(),
  name: "",
  remainingEnergy: 0,
  remainingHealth: 0,
};

export const nullMove: IMove = {
  id: "0",
  name: "",
};

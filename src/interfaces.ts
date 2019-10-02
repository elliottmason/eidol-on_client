import { List } from "immutable";

export type Id = string;
type MatchEventCategory = "damage" | "relocation";
type MatchEventProperty = "normal";
type PlayerTeam = 1 | 2;

export type Action =
  | IActionDecrementCombatantHealth
  | IActionSelectMove
  | IActionSubmitMoveSelections
  | IActionSyncMatch
  | IActionTargetBoardPosition;

export interface IAction {
  type: string;
}

export interface IActionDecrementCombatantHealth {
  type: "DECREMENT_COMBATANT_HEALTH";
}

export interface IActionSelectMove extends IAction {
  moveId: Id;
  type: "SELECT_MOVE";
}

export interface IActionSubmitMoveSelections extends IAction {
  type: "SUBMIT_MOVE_SELECTIONS";
}

export interface IActionSyncMatch extends IAction {
  match: IMatchJSON;
  type: "SYNC_MATCH";
}

export interface IActionTargetBoardPosition extends IAction {
  boardPositionId: Id;
  type: "TARGET_BOARD_POSITION";
}

export interface IAppState {
  match: IMatch;
}

export interface IMoveSelection {
  boardPositionId?: Id;
  combatantId: Id;
  moveId: Id;
}

type Board = IBoardPosition[];

export interface IBoardPosition {
  id: Id;
  x: number;
  y: number;
}

export interface IBoardProps {
  isReversed: boolean;
  positions: Board;
}

interface IMatchCombatant {
  boardPositionId?: Id;
  id: Id;
  name: string;
}

export interface ICombatant extends IMatchCombatant {
  isFriendly: true;
  isQueued: boolean;
  maximumHealth: number;
  moves: IMove[];
  remainingHealth: number;
}

export interface IMove {
  id: string;
  name: string;
}

interface IBenchedCombatantPlacement {
  combatantId: Id;
  kind: "benchedCombatantPlacement";
}

interface IBenchedCombatantSelection {
  kind: "benchedCombatantSelection";
}

interface IDeployedCombatantMoveSelection {
  combatantId: Id;
  kind: "deployedCombatantMoveSelection";
}

export interface IDeployedCombatantMoveTargeting {
  combatantId: Id;
  kind: "deployedCombatantMoveTargeting";
  moveId: Id;
}

interface IMatchNotLoaded {
  kind: "matchNotLoaded";
}

export interface IMatchUpdatePending {
  kind: "matchUpdatePending";
}

interface IMoveSelectionConfirmation {
  kind: "moveSelectionConfirmation";
}

interface ITurnResolution {
  kind: "turnResolution";
}

export type MatchContext =
  | IBenchedCombatantPlacement
  | IBenchedCombatantSelection
  | IDeployedCombatantMoveSelection
  | IDeployedCombatantMoveTargeting
  | IMatchNotLoaded
  | IMoveSelectionConfirmation
  | IMatchUpdatePending
  | ITurnResolution;

export interface IMatch {
  boardPositions: Board;
  combatants: List<ICombatant>;
  context: MatchContext;
  events: IMatchEvent[];
  id: Id;
  moveSelections: List<IMoveSelection>;
  players: IPlayer[];
  turn: number;
}

export interface IMatchEvent {
  amount: number;
  boardPositionId?: Id;
  category: MatchEventCategory;
  createdAt: Date;
  description: string;
  id: Id;
  matchCombatantId?: Id;
  property: MatchEventProperty;
  turn: number;
}

export interface IMatchesChannelJSON {
  kind: "initial" | "update";
  match: IMatchJSON;
}

export interface IMatchJSON {
  boardPositions?: Board;
  combatants?: ICombatant[];
  events?: IMatchEvent[];
  id?: Id;
  players?: IPlayer[];
  turn?: number;
}

export interface IPlayer {
  id: Id;
  isLocalPlayer: boolean;
  name: string;
  team: PlayerTeam;
}

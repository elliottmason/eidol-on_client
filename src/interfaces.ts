import { List } from "immutable";

export type Id = string;
type MatchEventCategory = "damage" | "relocation";
type MatchEventProperty = "normal";
type PlayerTeam = 1 | 2;

export type Action =
  | IActionSelectMove
  | IActionSubmitSelectedMoves
  | IActionSyncMatch
  | IActionTargetBoardPosition;

export interface IAction {
  type: string;
}

export interface IActionSelectMove extends IAction {
  moveId: Id;
  type: "SELECT_MOVE";
}

export interface IActionSubmitSelectedMoves extends IAction {
  type: "SUBMIT_SELECTED_MOVES";
}

export interface IActionSyncMatch extends IAction {
  match: IMatch;
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

export interface IBoard {
  positions: IBoardPosition[];
}

export interface IBoardPosition {
  id: Id;
  x: number;
  y: number;
}

export interface IBoardProps {
  board: IBoard;
  isReversed: boolean;
}

export type ICombatant = IEnemyCombatant | IFriendlyCombatant;

interface IMatchCombatant {
  boardPositionId?: Id;
  id: Id;
  name: string;
}

export interface IFriendlyCombatant extends IMatchCombatant {
  isFriendly: true;
  isQueued: boolean;
  maximumHealth: number;
  moves: IMove[];
  remainingHealth: number;
}

export interface IEnemyCombatant extends IMatchCombatant {
  isFriendly: false;
  remainingHealthPercentage: number;
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
  board: IBoard;
  combatants: List<ICombatant>;
  context: MatchContext;
  events: IMatchEvent[];
  id: Id;
  players: IPlayer[];
  selectedMoves: List<IMoveSelection>;
  turn: number;
}

interface IMatchEvent {
  boardPositionId?: Id;
  category: MatchEventCategory;
  createdAt: Date;
  description: string;
  id: Id;
  matchCombatantId?: Id;
  property: MatchEventProperty;
  turn: number;
}

interface IPlayer {
  id: Id;
  isLocalPlayer: boolean;
  name: string;
  team: PlayerTeam;
}

export interface IMatchProps {
  context?: MatchContext;
  match: IMatch;
}

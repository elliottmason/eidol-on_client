import { List } from "immutable";

export type Id = string;

type CombatantAvailability = "available" | "benched" | "knocked_out";

type MatchEventProperty = "normal";

type PlayerTeam = 1 | 2;

export type Action =
  | IActionCancelCombatantDeployments
  | IActionDeployBenchedCombatant
  | IActionPlayMatchEvent
  | IActionSelectCombatantForDeployment
  | IActionSelectMove
  | IActionSubmitCombatantDeployments
  | IActionSubmitMoveSelections
  | IActionSyncMatch
  | IActionTargetBoardPosition;

export interface IAction {
  type: string;
}

export interface IActionCancelCombatantDeployments extends IAction {
  type: "CANCEL_COMBATANT_DEPLOYMENTS";
}

export interface IActionDeployBenchedCombatant extends IAction {
  boardPositionId: Id;
  type: "DEPLOY_BENCHED_COMBATANT";
}

export interface IActionPlayMatchEvent extends IAction {
  event: IMatchEvent;
  type: "PLAY_MATCH_EVENT";
}

export interface IActionSelectCombatantForDeployment extends IAction {
  combatantId: Id;
  type: "SELECT_COMBATANT_FOR_DEPLOYMENT";
}

export interface IActionSelectMove extends IAction {
  moveId: Id;
  type: "SELECT_MOVE";
}

export interface IActionSubmitCombatantDeployments extends IAction {
  type: "SUBMIT_COMBATANT_DEPLOYMENTS";
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

export interface ICombatant {
  availability: CombatantAvailability;
  boardPositionId?: Id;
  defense?: number;
  id: Id;
  isFriendly: true;
  isQueued: boolean;
  isSelectedForDeployment: boolean;
  maximumHealth: number;
  moves: IMove[];
  name: string;
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

interface ICombatantDeploymentConfirmation {
  kind: "combatantDeploymentConfirmation";
}

export interface IDeployedCombatantMoveSelection {
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
  | ICombatantDeploymentConfirmation
  | IDeployedCombatantMoveSelection
  | IDeployedCombatantMoveTargeting
  | IMatchNotLoaded
  | IMoveSelectionConfirmation
  | IMatchUpdatePending
  | ITurnResolution;

export interface IMatch {
  boardPositions: Board;
  combatantDeployments: List<ICombatantDeployment>;
  combatants: List<ICombatant>;
  context: MatchContext;
  events: IMatchEvent[];
  id: Id;
  moveSelections: List<IMoveSelection>;
  players: IPlayer[];
  turn: number;
}

export interface ICombatantDeployment {
  boardPositionId: Id;
  combatantId: Id;
}

export interface IMatchEvent {
  amount?: number;
  boardPositionId?: Id;
  category: string;
  createdAt: Date;
  description: string;
  id: Id;
  matchCombatantId?: Id;
  property: MatchEventProperty;
  turn: number;
}

export interface IMatchEventDamage extends IMatchEvent {
  amount: number;
  category: "damage";
  matchCombatantId: Id;
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

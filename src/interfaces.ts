type Board = IBoardPosition[];
export type Id = string;
type MatchEventCategory = "damage" | "relocation";
type MatchEventProperty = "normal";
type PlayerTeam = 1 | 2;

interface IAction {
  type: string;
}

export interface IActionSyncMatch extends IAction {
  match: IMatch;
}

export interface IAppState {
  match: IMatch;
}

export interface IBoardPosition {
  id: Id;
  x: number;
  y: number;
}

export interface IBoardProps {
  board: Board;
  isReversed: boolean;
}

export type ICombatant = IEnemyCombatant | IFriendlyCombatant;

interface IMatchCombatant {
  boardPositionId?: Id;
  id: Id;
  isFriendly: boolean;
  name: string;
}

export interface IFriendlyCombatant extends IMatchCombatant {
  maximumHealth: number;
  moves: [];
  remainingHealth: number;
}

export interface IEnemyCombatant extends IMatchCombatant {
  remainingHealthPercentage: number;
}

export interface IMatch {
  board: Board;
  combatants: ICombatant[];
  events: IMatchEvent[];
  id: Id;
  players: IPlayer[];
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
  match: IMatch;
}

export type MatchContext = CombatantDeployment | "in_progress";
type CombatantDeployment = "combatant_selection" | "combatant_placement";

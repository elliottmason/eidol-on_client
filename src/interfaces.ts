export interface ICombatant {
  name: string;
  onBoard?: boolean;
}

export type MatchContext = CombatantDeployment | "in_progress";
type CombatantDeployment = "combatant_selection" | "combatant_placement";

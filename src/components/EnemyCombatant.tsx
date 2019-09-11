import React from "react";

import { IEnemyCombatant } from "../interfaces";

import { HealthBar } from "./HealthBar";

interface IEnemyCombatantProps {
  combatant: IEnemyCombatant;
}

export class EnemyCombatant extends React.Component<IEnemyCombatantProps> {
  private readonly combatant: IEnemyCombatant = this.props.combatant;
  private readonly name: string = this.combatant.name;
  private readonly remainingHealthPercentage: number =
    this.combatant.remainingHealthPercentage;

  public render(): JSX.Element {
    return (
      <div className="EnemyCombatant" style={{ height: "100%" }}>
        <HealthBar
          remainingHealthPercentage={this.remainingHealthPercentage}
        />
        {this.name}
      </div>
    );
  }

}

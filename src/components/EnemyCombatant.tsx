import React from "react";

import { IEnemyCombatant } from "../interfaces";

import { HealthBar } from "./HealthBar";

interface IEnemyCombatantProps extends IEnemyCombatant {

}

export class EnemyCombatant extends React.Component<IEnemyCombatantProps> {
  public render(): JSX.Element {
    return (
      <div>
        <HealthBar
          remainingHealthPercentage={this.props.remainingHealthPercentage}
        />
      </div>
    );
  }
}

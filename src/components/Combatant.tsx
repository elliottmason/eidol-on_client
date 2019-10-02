import React, { CSSProperties } from "react";

import { ICombatant } from "../interfaces";

import { HealthBar } from "./HealthBar";

interface ICombatantProps {
  combatant: ICombatant;
}

export class Combatant
  extends React.Component<ICombatantProps> {
  public render(): JSX.Element {
    return (
      <div style={this.style()} >
        <HealthBar
          isFriendly={this.props.combatant.isFriendly}
          maximumHealth={this.props.combatant.maximumHealth}
          remainingHealth={this.props.combatant.remainingHealth}
        />
        {this.props.combatant.name}
      </div>
    );
  }

  private readonly style = (): CSSProperties => (
    {
      height: "100%",
      textAlign: "center",
    }
  )
}

import React, { CSSProperties } from "react";

import { IBoardPosition, ICombatant } from "../interfaces";

import { HealthBar } from "./HealthBar";

interface ICombatantProps {
  boardPosition: IBoardPosition;
  combatant: ICombatant;
}

export class Combatant
  extends React.Component<ICombatantProps> {
  public render(): JSX.Element {
    return (
      <div style={this.style()}>
        <HealthBar
          isFriendly={this.props.combatant.isFriendly}
          maximumHealth={this.props.combatant.maximumHealth}
          remainingHealth={this.props.combatant.remainingHealth}
        />
        {this.props.combatant.name}
      </div>
    );
  }

  private readonly style = (): CSSProperties => {
    const boardPositionSize: number = 25;
    const { boardPosition } = this.props;
    const left: string = `${boardPosition.x * boardPositionSize}%`;
    const bottom: string = `${boardPosition.y * boardPositionSize}%`;

    return (
      {
        bottom,
        height: `${boardPositionSize}%`,
        left,
        position: "absolute",
        textAlign: "center",
        width: `${boardPositionSize}%`,
      }
    );
  }
}

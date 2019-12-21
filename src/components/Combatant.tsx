import React, { CSSProperties, HTMLProps } from "react";

import { IBoardPosition, ICombatant } from "../interfaces";

import { EnergyBar } from "./EnergyBar";
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
        {this.energyBar()}
        {this.props.combatant.name}
      </div>
    );
  }

  private energyBar(): JSX.Element | undefined {
    if (this.props.combatant.isFriendly) {
      return(
        <EnergyBar
          isFriendly={this.props.combatant.isFriendly}
          maximumEnergy={this.props.combatant.maximumEnergy}
          remainingEnergy={this.props.combatant.remainingEnergy}
        />
      );
    }
  }

  private readonly style = (): CSSProperties => {
    const boardPositionSize: number = 25;
    const { boardPosition } = this.props;
    const left: string = `${boardPosition.x * boardPositionSize}%`;
    const bottom: string = `${boardPosition.y * boardPositionSize}%`;

    return (
      {
        bottom,
        height: `${boardPositionSize}vmin`,
        left,
        position: "absolute",
        textAlign: "center",
        width: `${boardPositionSize}vmin`,
      }
    );
  }
}

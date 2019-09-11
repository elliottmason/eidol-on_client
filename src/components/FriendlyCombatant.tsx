import React from "react";

import { IFriendlyCombatant } from "../interfaces";

import { HealthBar } from "./HealthBar";

interface IFriendlyCombatantProps {
  combatant: IFriendlyCombatant;
}

export class FriendlyCombatant
  extends React.Component<IFriendlyCombatantProps> {
  public render(): JSX.Element {
    return (
      <div className="FriendlyCombatant" style={{ height: "100%" }}>
        <HealthBar
          maximumHealth={this.props.combatant.maximumHealth}
          remainingHealth={this.props.combatant.remainingHealth}
        />
        {this.props.combatant.name}
      </div>
    );
  }
}

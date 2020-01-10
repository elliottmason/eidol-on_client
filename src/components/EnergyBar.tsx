import React from "react";

import { StatBar } from "./StatBar";

interface IEnergyBarProps {
  isFriendly: boolean;
  maximumEnergy: number;
  remainingEnergy: number;
}

export class EnergyBar extends React.Component<IEnergyBarProps> {
  public render(): JSX.Element {
    return(
      <StatBar
        color={"#76d7c4"}
        isFriendly={this.props.isFriendly}
        maximumStat={this.props.maximumEnergy}
        remainingStat={this.props.remainingEnergy}
      />
    );
  }
}

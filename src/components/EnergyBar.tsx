import React, { CSSProperties } from "react";

import { StatBar } from "./StatBar";

interface IEnergyBarProps {
  isFriendly: boolean;
  maximumEnergy: number;
  remainingEnergy: number;
}

const centurn: number = 100;

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

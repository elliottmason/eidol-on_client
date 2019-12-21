import React, { CSSProperties } from "react";

import { StatBar } from "./StatBar";

interface IHealthBarProps {
  isFriendly: boolean;
  maximumHealth: number;
  remainingHealth: number;
}

const centurn: number = 100;

export class HealthBar
  extends React.Component<IHealthBarProps> {

  public render(): JSX.Element {
    return (
      <StatBar
        color={"#229954"}
        isFriendly={this.props.isFriendly}
        maximumStat={this.props.maximumHealth}
        remainingStat={this.props.remainingHealth}
      />
    );
  }
}

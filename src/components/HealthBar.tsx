import React from "react";

type IHealthBarProps = IEnemyHealthBarProps | IFriendlyHealthBarProps;

interface IEnemyHealthBarProps {
  remainingHealthPercentage: number;
}

interface IFriendlyHealthBarProps {
  maximumHealth: number;
  remainingHealth: number;
}

export class HealthBar extends React.Component<IHealthBarProps> {
  public render(): JSX.Element {
    return (
      <div style={{ height: "15%", width: "100%" }}>
        <div style={{ backgroundColor: "green", height: "100%", width: `${this.remainingHealthPercentage()}%` }} />
      </div>
    );
  }

  private remainingHealthPercentage(): number {
    if ("remainingHealthPercentage" in this.props) {
      return this.props.remainingHealthPercentage;
    }

    if ("maximumHealth" in this.props && "remainingHealth" in this.props) {
      const { maximumHealth, remainingHealth }: {
        maximumHealth: number;
        remainingHealth: number;
      } =
        this.props;
      const centurn: number = 100;
      const percentage: number =
        Math.round(maximumHealth / remainingHealth * centurn);

      return percentage;
    }

    return 0;
  }
}
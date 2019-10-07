import React, { CSSProperties } from "react";

interface IHealthBarProps {
  isFriendly: boolean;
  maximumHealth: number;
  remainingHealth: number;
}

interface IHealthBarState {
  maximumHealth: number;
  remainingHealth: number;
}

const centurn: number = 100;

export class HealthBar
  extends React.Component<IHealthBarProps, IHealthBarState> {

  public readonly state: IHealthBarState = {
    maximumHealth: this.props.maximumHealth,
    remainingHealth: this.props.remainingHealth,
  };

  public componentDidUpdate(): void {
    const interval: number = 50;

    if (this.state.remainingHealth > this.props.remainingHealth) {
      setTimeout(
        () => {
          this.setState({ remainingHealth: this.state.remainingHealth - 1 });
        },
        interval,
      );
    } else if (this.state.remainingHealth < this.props.remainingHealth) {
      setTimeout(
        () => {
          this.setState({ remainingHealth: this.state.remainingHealth + 1 });
        },
        interval,
      );
    }
  }

  public render(): JSX.Element {
    return (
      <div
        style={this.containerStyle()}
      >
        <div style={this.healthBarStyle()} />
        <span style={this.healthValuesStyle()} >
          {this.healthValues()}
        </span>
      </div>
    );
  }

  private readonly containerStyle = (): CSSProperties =>
    (
      {
        border: "1px solid #000",
        boxSizing: "border-box",
        height: "11%",
        margin: "4%",
        position: "relative",
        width: "92%",
      }
    )

  private readonly healthBarStyle = (): CSSProperties => (
    {
      backgroundColor: "green",
      color: "white",
      height: "100%",
      width: `${this.remainingHealthPercentage()}%`,
    }
  )

  private healthValues(): string | undefined {
    if (!this.props.isFriendly) { return undefined; }

    if (
      "maximumHealth" in this.props &&
      "remainingHealth" in this.props
    ) {
      const { maximumHealth, remainingHealth }: {
        maximumHealth: number;
        remainingHealth: number;
      } =
        this.state;

      return `${remainingHealth} / ${maximumHealth}`;
    }
  }

  private readonly healthValuesStyle = (): CSSProperties => (
    {
      color: "white",
      display: "block",
      fontSize: "2vh",
      fontWeight: "bold",
      left: 0,
      position: "absolute",
      textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
      top: 0,
      verticalAlign: "middle",
      width: "100%",
    }
  )

  private remainingHealthPercentage(): number {
    return (
      Math.round(
        (this.state.remainingHealth / this.state.maximumHealth) * centurn,
      )
    );
  }
}

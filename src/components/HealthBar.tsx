import React, { CSSProperties } from "react";

interface IHealthBarProps {
  isFriendly: boolean;
  maximumHealth: number;
  remainingHealth: number;
}

interface IHealthBarState {
  displayRemainingHealthPercentage: number;
}

const centurn: number = 100;

export class HealthBar
  extends React.Component<IHealthBarProps, IHealthBarState> {

  public readonly state: IHealthBarState = {
    displayRemainingHealthPercentage:
      Math.ceil(
        this.props.remainingHealth / this.props.maximumHealth *
        centurn,
      ),
  };

  public render(): JSX.Element {
    return (
      <div
        style={this.containerStyle()}
      >
        <div style={this.innerStyle()} >
          {this.healthValues()}
        </div>
      </div>
    );
  }

  private healthValues(): string | undefined {
    if (!this.props.isFriendly) { return undefined; }

    if ("maximumHealth" in this.props && "remainingHealth" in this.props) {
      const { maximumHealth, remainingHealth }: {
        maximumHealth: number;
        remainingHealth: number;
      } =
        this.props;

      return `${remainingHealth} / ${maximumHealth}`;
    }
  }


  private readonly containerStyle = (): CSSProperties =>
    (
      {
        border: "1px solid #000",
        boxSizing: "border-box",
        height: "11%",
        margin: "4%",
        width: "92%",
      }
    )

  private readonly innerStyle = (): CSSProperties => (
    {
      backgroundColor: "green",
      color: "white",
      height: "100%",
      width: `${this.state.displayRemainingHealthPercentage}%`,
    }
  )

  // private remainingHealthPercentage(): number {
  //   if ("remainingHealthPercentage" in this.props) {
  //     return this.props.remainingHealthPercentage;
  //   }

  //   if ("maximumHealth" in this.props && "remainingHealth" in this.props) {
  //     const { maximumHealth, remainingHealth }: {
  //       maximumHealth: number;
  //       remainingHealth: number;
  //     } =
  //       this.props;
  //     const centurn: number = 100;
  //     const percentage: number =
  //       Math.round(maximumHealth / remainingHealth * centurn);

  //     return percentage;
  //   }

  //   return 0;
  // }
}

import React, { CSSProperties } from "react";

interface IStatBarProps {
  color: string;
  isFriendly: boolean;
  maximumStat: number;
  remainingStat: number;
}

interface IStatBarState {
  maximumStat: number;
  remainingStat: number;
}

const centurn: number = 100;

export class StatBar
  extends React.Component<IStatBarProps, IStatBarState> {

  public readonly state: IStatBarState = {
    maximumStat: this.props.maximumStat,
    remainingStat: this.props.remainingStat,
  };

  public componentDidUpdate(): void {
    const interval: number = 50;

    if (this.state.remainingStat > this.props.remainingStat) {
      setTimeout(
        () => {
          this.setState({ remainingStat: this.state.remainingStat - 1 });
        },
        interval,
      );
    } else if (this.state.remainingStat < this.props.remainingStat) {
      setTimeout(
        () => {
          this.setState({ remainingStat: this.state.remainingStat + 1 });
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
      backgroundColor: this.props.color,
      color: "white",
      height: "100%",
      width: `${this.remainingStatPercentage()}%`,
    }
  )

  private healthValues(): string | undefined {
    if (!this.props.isFriendly) { return undefined; }

    if (
      "maximumStat" in this.props &&
      "remainingStat" in this.props
    ) {
      const { maximumStat, remainingStat }: {
        maximumStat: number;
        remainingStat: number;
      } =
        this.state;

      return `${remainingStat} / ${maximumStat}`;
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

  private remainingStatPercentage(): number {
    return (
      Math.round(
        (this.state.remainingStat / this.state.maximumStat) * centurn,
      )
    );
  }
}

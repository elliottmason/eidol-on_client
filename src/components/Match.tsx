import React, { CSSProperties } from "react";

import { IMatchProps } from "../interfaces";

import { Board } from "./Board";

export class Match extends React.Component<IMatchProps> {
  // tslint:disable-next-line: prefer-function-over-method
  public render(): JSX.Element {
    return (
      <div style={this.style()}>
        <Board board={this.props.match.board} />
      </div >
    );
  }

  private readonly style = (): CSSProperties => (
    {
      alignItems: "center",
      display: "flex",
      height: "100%",
      justifyContent: "center",
      position: "relative",
    }
  )
}

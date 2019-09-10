import React from "react";

import { IMatchProps } from "../interfaces";

import { Board } from "./Board";

export class Match extends React.Component<IMatchProps> {
  // tslint:disable-next-line: prefer-function-over-method
  public render(): JSX.Element {
    return (
      <div>
        <Board board={this.props.match.board} />
      </div>
    );
  }
}

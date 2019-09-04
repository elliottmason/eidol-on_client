import React from "react";

import { Board } from "./Board";

export class Match extends React.Component {
  // tslint:disable-next-line: prefer-function-over-method
  public render(): JSX.Element {
    return (
      <div>
        <Board />
      </div>
    );
  }
}

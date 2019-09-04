import React from "react";

interface IBoardProps {
  id: string;
  isReversed: true;
}

export class Board extends React.Component {
  // tslint:disable-next-line: prefer-function-over-method
  public render(): JSX.Element {
    return (
      <div>This would be a board.</div>
    );
  }
}

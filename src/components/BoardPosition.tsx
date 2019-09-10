import React from "react";

interface IBoardPositionProps {
  id: string;
  x: number;
  y: number;
}

export class BoardPosition extends React.Component<IBoardPositionProps> {
  // tslint:disable-next-line: prefer-function-over-method
  public render(): JSX.Element {
    return (
      <div />
    );
  }
}

import React from "react";

interface IIndexProps {
  path: string;
}

export class Index extends React.Component<IIndexProps> {
  public render(): JSX.Element {
    return (
      <div>
        <button>Find A Match</button>
      </div>
    );
  }
}

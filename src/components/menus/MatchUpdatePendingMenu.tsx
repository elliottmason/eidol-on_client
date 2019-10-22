import React from "react";

export class MatchUpdatePendingMenu extends React.Component {
  public readonly render: () => JSX.Element =
    (): JSX.Element => (
      <div>
        <p>Waiting on opponent...</p>
      </div>
    )
}

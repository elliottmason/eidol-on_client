import React from "react";

export class DeploymentConfirmationMenu extends React.Component {
  public render(): JSX.Element {
    return (
      <div>
        <span>Deploy your Eidols to these positions?</span>
        <div>
          <button>Confirm</button>
          <button>Cancel</button>
        </div>
      </div>
    );
  }
}

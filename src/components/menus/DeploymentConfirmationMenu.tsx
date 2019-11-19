import { List } from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
  IActionCancelCombatantDeployments,
  IActionSubmitCombatantDeployments,
  ICombatantDeployment,
  Id,
} from "../../interfaces";

interface IDeploymentConfirmationMenuProps {
  combatantDeployments: List<ICombatantDeployment>;
}

interface IDeploymentConfirmationMenuComponentProps
  extends IDeploymentConfirmationMenuProps {
  dispatch(func: {}): void;
}

interface ICombatantDeploymentJson {
  board_position_id: Id;
  match_combatant_id: Id;
}

const awaitMatchUpdate: () => IActionSubmitCombatantDeployments =
  (): IActionSubmitCombatantDeployments => (
    {
      type: "SUBMIT_COMBATANT_DEPLOYMENTS",
    }
  );

const cancelCombatantDepoyments: () => IActionCancelCombatantDeployments =
  (): IActionCancelCombatantDeployments => ({
    type: "CANCEL_COMBATANT_DEPLOYMENTS",
  });

const submitCombatantDeployments:
  (combatantDeployments: List<ICombatantDeployment>) =>
    Promise<Response> =
  async (combatantDeployments: List<ICombatantDeployment>):
    Promise<Response> => {
    const bodyCollection: List<ICombatantDeploymentJson> =
      combatantDeployments.map(
        (combatantDeployment: ICombatantDeployment) => (
          {
            board_position_id: combatantDeployment.boardPositionId,
            match_combatant_id: combatantDeployment.combatantId,
          }
        ),
      );

    const bodyArray: ICombatantDeploymentJson[] = bodyCollection.toArray();

    const bodyObject: {} = {
      match_combatant_deployments: bodyArray,
    };

    const body: string = JSON.stringify(bodyObject);

    return fetch("http://localhost:4000/match_combatant_deployments", {
      body,
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  };

const confirmCombatantDeployments:
  (combatantDeployments: List<ICombatantDeployment>) =>
    (dispatch: Dispatch) => void =
  (combatantDeployments: List<ICombatantDeployment>):
    (dispatch: Dispatch) => void =>
    (dispatch: Dispatch): void => {
      submitCombatantDeployments(combatantDeployments)
        .catch(() => undefined)
        .then(() => undefined);
      dispatch(awaitMatchUpdate());
    };

class DeploymentConfirmationMenuComponent
  extends React.Component<IDeploymentConfirmationMenuComponentProps> {
  private readonly cancel: () => void = this._cancel.bind(this);
  private readonly confirm: () => void = this._confirm.bind(this);

  public render(): JSX.Element {
    return (
      <div>
        <span>Deploy your Eidols to these positions?</span>
        <div>
          <button onClick={this.confirm}>Confirm</button>
          <button onClick={this.cancel}>Cancel</button>
        </div>
      </div>
    );
  }

  private _cancel(): void {
    const { dispatch } = this.props;

    dispatch(cancelCombatantDepoyments());
  }

  private _confirm(): void {
    const { combatantDeployments, dispatch } = this.props;

    dispatch(confirmCombatantDeployments(combatantDeployments));
  }
}

export const DeploymentConfirmationMenu:
  React.ComponentClass<IDeploymentConfirmationMenuProps> =
  connect()(DeploymentConfirmationMenuComponent);

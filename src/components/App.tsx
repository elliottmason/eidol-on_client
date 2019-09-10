import React from "react";
import { connect, ConnectedComponentClass } from "react-redux";
import { Dispatch } from "redux";

import {
  IActionSyncMatch,
  IAppState,
  IMatch,
  IMatchProps,
} from "./../interfaces";
import "./../stylesheets/App.css";
import { Match } from "./Match";

export interface IAppProps {
  match: IMatch;
  dispatch(func: {}): void;
}

const fetchMatch: (matchId: string) => Promise<Response> =
  (matchId: string): Promise<Response> => (
    fetch(`http://localhost:4000/matches/${matchId}.json`)
  );

const syncMatch: (match: IMatch) => IActionSyncMatch =
  (match: IMatch): IActionSyncMatch => (
    {
      match,
      type: "SYNC_MATCH",
    }
  );

const loadMatch:
  (matchId: string) => (dispatch: Dispatch) => Promise<void> =
  (matchId: string): (dispatch: Dispatch) => Promise<void> => (
    (dispatch: Dispatch): Promise<void> =>
      fetchMatch(matchId)
        .then(
          (response: Response) => {
            response.json()
              .then(
                (json: IMatch) => dispatch(syncMatch(json)),
                // tslint:disable-next-line: no-console
                (error: {}) => console.log(error),
              );
          },
        )
  );

class AppComponent extends React.Component<IAppProps> {
  public componentDidMount(): void {
    const { dispatch } = this.props;

    dispatch(loadMatch("1"));
  }

  public render(): JSX.Element {
    return (
      <Match match={this.props.match} />
    );
  }
}

const mapStateToProps: (state: IAppState) => IMatchProps =
  (state: IAppState): IMatchProps => ({ match: state.match });

export const App:
  ConnectedComponentClass<typeof AppComponent, Pick<IAppProps, never>>
  = connect(mapStateToProps)(AppComponent);

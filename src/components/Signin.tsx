import React, { useState } from "react";
import { connect } from "react-redux";

import {
  IAccount,
  IActionSetAccount,
} from "../interfaces";

interface ISigninProps {
  path: string;
}

interface ISigninComponentProps extends ISigninProps {
  dispatch(func: {}): void;
}

const setAccount: (account: IAccount) => IActionSetAccount =
  (account: IAccount): IActionSetAccount => (
  {
    account,
    type: "SET_ACCOUNT",
  }
);

const SigninComponent: (props: ISigninComponentProps) => JSX.Element =
  (props: ISigninComponentProps): JSX.Element => {
  const [emailAddress, setEmailAddress] = useState("");

  const handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void =
    (e: React.ChangeEvent<HTMLInputElement>): void => {

      setEmailAddress(e.target.value);
    };

  const submit: (e: React.MouseEvent) => void =
  (e: React.MouseEvent): void => {
    e.preventDefault();

    const { dispatch } = props;

    const body: string =
      JSON.stringify({ session: { email_address: emailAddress } });

    const headers: {} = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };

    const method: string = "POST";

    const request: Request = new Request(
      "/sessions", { body, headers, method },
    );

    fetch(request)
      .then(
        (response: Response) => {
          response.json()
          .then(
            (json: { account: IAccount }) => {
              dispatch(setAccount(json.account));
            },
          )
          .catch();
        },
      )
      .catch();
  };

  return(
    <div>
      <form method="post">
        <label>
          Email
          <input
            onChange={handleEmailChange}
            type="email"
            name="email_address"
            value={emailAddress}
          />
        </label>
        <button
          onClick={submit}
          type="submit"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export const Signin: React.ComponentClass<ISigninProps> =
  connect()(SigninComponent);

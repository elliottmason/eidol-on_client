import { navigate } from "@reach/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

import {
  IAccount,
  IActionSetAccount,
} from "../interfaces";

interface ISigninProps {
  path: string;
}

const setAccount: (account: IAccount) => IActionSetAccount =
  (account: IAccount): IActionSetAccount => (
  {
    account,
    type: "SET_ACCOUNT",
  }
);

export const Signin: (props: ISigninProps) => JSX.Element =
    (props: ISigninProps): JSX.Element => {
  const dispatch: Dispatch = useDispatch();

  const [emailAddress, setEmailAddress] = useState("");

  const handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void =
    (e: React.ChangeEvent<HTMLInputElement>): void => {

      setEmailAddress(e.target.value);
    };

  const submit: (e: React.MouseEvent) => void =
  (e: React.MouseEvent): void => {
    e.preventDefault();

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
      .then(async (response: Response) => {
        const unauthorizedStatus: number = 401;
        if (response.status === unauthorizedStatus) {
          throw new Error("Login failed.");
        }

        return response.json();
      })
      .then(
        (json: { account: IAccount }) => {
          dispatch(setAccount(json.account));
          navigate("/");
        },
      )
      .catch();
  };

  return(
    <div>
      <h2>Sign in</h2>
      <p>Enter your email address to sign in.</p>
      <form method="post">
        <label>
          Email
          <input
            onChange={handleEmailChange}
            type="email"
            name="email_address"
            placeholder="you@gmail.com"
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

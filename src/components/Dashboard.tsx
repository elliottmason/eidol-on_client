import { navigate } from "@reach/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { IAccount, IAppState } from "../interfaces";

interface IDashboardProps {
  path: string;
}

export const Dashboard: (props: IDashboardProps) => JSX.Element =
(props: IDashboardProps): JSX.Element => {
  const account: IAccount = useSelector((state: IAppState) => state.account);

  useEffect(() => {
    if (account.id === "0") { navigate("/sign_in"); }
  });

  return(
    <div>
      This would be your dashboard.
    </div>
  );
};

import { CognitoUser } from "amazon-cognito-identity-js";
import { AnyAction } from "redux";
import { ActionType } from "./types";

interface UserState {
  user?: CognitoUser | undefined;
}

export const usersReducer = (
  states: UserState = {},
  action: AnyAction
): UserState => {
  switch (action.type) {
    case ActionType.SetUser:
      return { user: action.user };
    default:
      return states;
  }
};

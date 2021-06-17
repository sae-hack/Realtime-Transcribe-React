import { useContext } from "react";
import UserContext from "./UserContext";
import { CognitoUser } from "amazon-cognito-identity-js";

type CognitoUserTweaked = CognitoUser & {
  username?: string;
  attributes?: {
    email: string;
    email_verified: boolean;
  };
};

export const useUser = (): CognitoUserTweaked | undefined =>
  useContext(UserContext);

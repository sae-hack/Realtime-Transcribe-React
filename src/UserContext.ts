import { createContext } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";

const UserContext = createContext<CognitoUser | undefined>(undefined);

export default UserContext;

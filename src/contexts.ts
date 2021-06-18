import { createContext } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";

export const UserContext = createContext<CognitoUser | undefined>(undefined);

interface SpeakersContextStates {
  speakers: Record<number, string>;
  setSpeakers: (value: Record<number, string>) => void;
}
export const SpeakersContext = createContext<SpeakersContextStates>({
  speakers: {},
  setSpeakers: (_) => null,
});

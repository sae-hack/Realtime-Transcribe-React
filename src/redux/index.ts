import {
  createStore,
  applyMiddleware,
  combineReducers,
  AnyAction,
} from "redux";

import thunk, { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { CognitoUser } from "amazon-cognito-identity-js";
import { usersReducer } from "./user";
import { speakersReducer } from "./speakers";
import { sessionReducer } from "./session";
export { startSession, stopSession } from "./session";
export { ActionType } from "./types";

export const store = createStore(
  combineReducers({
    users: usersReducer,
    speakers: speakersReducer,
    session: sessionReducer,
  }),
  applyMiddleware(thunk)
);

// typescript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// hooks

type CognitoUserTweaked = CognitoUser & {
  username?: string;
  attributes?: {
    email: string;
    email_verified: boolean;
  };
};

export const useUser = (): CognitoUserTweaked | undefined =>
  useAppSelector((states) => states.users.user);

export const useSpeakers = (): Record<string, string> =>
  useAppSelector((states) => states.speakers);

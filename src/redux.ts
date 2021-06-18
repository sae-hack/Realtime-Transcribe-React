import {
  createStore,
  applyMiddleware,
  AnyAction,
  combineReducers,
} from "redux";
import { CognitoUser } from "amazon-cognito-identity-js";
import thunk from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export enum ActionType {
  SetUser,
  OverrideSpeaker,
}

interface UserState {
  user?: CognitoUser | undefined;
}

const usersReducer = (states: UserState = {}, action: AnyAction) => {
  switch (action.type) {
    case ActionType.SetUser:
      return { user: action.user };
    default:
      return states;
  }
};

type SpeakerState = Record<string, string>;

const speakersReducer = (speakers: SpeakerState = {}, action: AnyAction) => {
  switch (action.type) {
    case ActionType.OverrideSpeaker:
      return { ...speakers, [action.speakerId]: action.speakerName };
    default:
      return speakers;
  }
};

export const store = createStore(
  combineReducers({ users: usersReducer, speakers: speakersReducer }),
  applyMiddleware(thunk)
);

// typescript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

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

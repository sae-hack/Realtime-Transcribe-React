import { AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { makeRequest } from "../utils";
import { ActionType } from "./types";

interface SessionState {
  fetchingCredential?: boolean;
  recording?: boolean;
  error?: Error;
}

export const sessionReducer = (
  states: SessionState = {},
  action: AnyAction
): SessionState => {
  switch (action.type) {
    case ActionType.StartSessionRequest:
      return { fetchingCredential: true };
    case ActionType.StartSessionSuccess:
      return { recording: true };
    case ActionType.StartSessionFailure:
      return { error: action.error };
    case ActionType.StopSession:
      return { recording: false };
    default:
      return states;
  }
};

export const startSession = (
  region: string,
  handleEventStreamMessage: (messageJson: any) => void
): ThunkAction<void, any, any, AnyAction> => {
  return (dispatch: Dispatch) => {
    dispatch({ type: ActionType.StartSessionRequest });
    makeRequest("/start-session")
      .then((data: any) => {
        const { credentials } = data;
        (window as any).handleEventStreamMessage = handleEventStreamMessage;
        (window as any).region = region;
        (window as any).access_id = credentials.AccessKeyId;
        (window as any).secret_key = credentials.SecretAccessKey;
        (window as any).session_token = credentials.SessionToken;
        (window as any).startTranscribe();
        dispatch({ type: ActionType.StartSessionSuccess });
      })
      .catch((error) => {
        dispatch({ type: ActionType.StartSessionFailure, error });
      });
  };
};

export const stopSession = (): ThunkAction<void, any, any, AnyAction> => {
  return (dispatch: Dispatch) => {
    (window as any).closeSocket();
    dispatch({ type: ActionType.StopSession });
  };
};

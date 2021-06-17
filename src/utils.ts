import { API, Auth } from "aws-amplify";
import { Dialog } from "./types";

export const makeRequest = <T>(path: string): Promise<T> => {
  return Auth.currentSession().then((session) => {
    const jwtToken = session.getIdToken().getJwtToken();
    return API.get("SAMAPI", path, {
      headers: { Authorization: "Bearer " + jwtToken },
    });
  });
};

export const makePostRequest = <T>(
  path: string,
  payload: Record<string, string>
): Promise<T> => {
  return Auth.currentSession().then((session) => {
    const jwtToken = session.getIdToken().getJwtToken();
    return API.post("SAMAPI", path, {
      body: payload,
      headers: { Authorization: "Bearer " + jwtToken },
    });
  });
};

export const makeMarkdown = (
  dialogs: Dialog[],
  speakers: Record<number, string>
): string => {
  const strings = ["# Transcribe"];

  for (const dialog of dialogs) {
    strings.push(
      `(${dialog.startTime.toFixed(2)}-${dialog.endTime.toFixed(2)}) **${
        speakers[dialog.speaker] || dialog.speaker
      }** ${dialog.words}`
    );
  }

  return strings.join("\n\n");
};

import { AnyAction } from "redux";
import { ActionType } from "./types";

type SpeakerState = Record<string, string>;

export const speakersReducer = (
  speakers: SpeakerState = {},
  action: AnyAction
): SpeakerState => {
  switch (action.type) {
    case ActionType.OverrideSpeaker:
      return { ...speakers, [action.speakerId]: action.speakerName };
    default:
      return speakers;
  }
};

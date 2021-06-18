import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { Container, Col, Row } from "react-bootstrap";
import BottomBar from "./BottomBar";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useTranscribe } from "./hooks";
import DialogView from "./DialogView";
import distinctColors from "distinct-colors";
import SpeakerList from "./SpeakerList";
import { Dialog } from "./types";
import { makeMarkdown, makePostRequest } from "./utils";
import { ActionType, useAppDispatch, useSpeakers, useUser } from "./redux";

const customSpeakerIds: number[] = [];
const generateNewSpeakerId = (): number => {
  if (customSpeakerIds.length === 0) {
    customSpeakerIds.push(10000);
    return 10000;
  } else {
    const newId = customSpeakerIds[customSpeakerIds.length - 1] + 1;
    customSpeakerIds.push(newId);
    return newId;
  }
};

const DEFAULT_SPEAKER_COUNT = 6; // if there are more speakers, we recreate the colors object
const DEFAULT_COLORS = distinctColors({
  count: DEFAULT_SPEAKER_COUNT,
  lightMin: 80,
}).map((color) => color.hex());

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === AuthState.SignedIn) {
        dispatch({ type: ActionType.SetUser, user: authData as CognitoUser });
      } else {
        dispatch({ type: ActionType.SetUser, user: undefined });
      }
    });
  }, [dispatch]);
  const user = useUser();

  const { transcription, setTranscription, partial, handleEventStreamMessage } =
    useTranscribe();

  const [unallocatedSpeakerNames, allocateSpeakerNames] = useState<string[]>(
    []
  );

  const speakers = useSpeakers();

  const allSpeakers = [
    ...new Set(
      transcription.map(({ speaker }) => speakers[speaker] || String(speaker))
    ),
  ].sort();

  useEffect(() => {
    allocateSpeakerNames((unallocated) => {
      const allocated = unallocated.filter((name) =>
        allSpeakers.includes(name)
      );

      if (allocated.length > 0) {
        return unallocated.filter((name) => !allSpeakers.includes(name));
      }
      return unallocated;
    });
  }, [allSpeakers]);

  const colors = useMemo(
    () =>
      allSpeakers.length > DEFAULT_SPEAKER_COUNT
        ? distinctColors({ count: allSpeakers.length }).map((color) =>
            color.hex()
          )
        : DEFAULT_COLORS,
    [allSpeakers.length]
  );

  const handleSpeakerNameChange = useCallback(
    (from: string, to: string) => {
      // find old speaker id
      let speakerId = null;
      for (const id in speakers) {
        if (speakers[id] === from) {
          speakerId = id;
          break;
        }
      }

      if (speakerId === null && allSpeakers.includes(from)) {
        // it is a speaker number
        speakerId = parseInt(from);
      } else {
        console.error("Cannot find speaker with existing name ", from);
      }

      dispatch({
        type: ActionType.OverrideSpeaker,
        speakerId,
        speakerName: to,
      });
    },
    [speakers, allSpeakers, dispatch]
  );

  const handleCreateNewSpeaker = useCallback(
    (name: string) => {
      if (
        allSpeakers.includes(name) ||
        unallocatedSpeakerNames.includes(name)
      ) {
        alert(`${name} already exists`);
      } else {
        allocateSpeakerNames((s) => [...s, name]);
      }
    },
    [unallocatedSpeakerNames, allSpeakers]
  );

  const speakerOptions = useMemo(
    () => [...allSpeakers, ...unallocatedSpeakerNames],
    [allSpeakers, unallocatedSpeakerNames]
  );

  const handleSetSpeaker = useCallback(
    (dialog: Dialog, name: string) => {
      // set to unallocated speaker
      let newId: number;
      if (unallocatedSpeakerNames.includes(name)) {
        newId = generateNewSpeakerId();
      } else {
        // find old speaker id
        let speakerId = null;
        for (const id in speakers) {
          if (speakers[id] === name) {
            speakerId = id;
            break;
          }
        }

        if (speakerId === null && allSpeakers.includes(name)) {
          // it is a speaker number
          speakerId = parseInt(name);
        } else {
          console.error("Cannot find speaker with existing name ", name);
        }
        newId = speakerId as unknown as number;
      }
      dispatch({
        type: ActionType.OverrideSpeaker,
        speakerId: newId,
        speakerName: name,
      });
      setTranscription((t: Dialog[]) => {
        const indexToReplace = t.indexOf(dialog);
        return [
          ...t.slice(0, indexToReplace),
          { ...dialog, speaker: newId },
          ...t.slice(indexToReplace + 1),
        ];
      });
    },
    [allSpeakers, setTranscription, speakers, unallocatedSpeakerNames, dispatch]
  );

  const handleSaveToQuip = useCallback(
    (documentUrl: string) => {
      const markdown = makeMarkdown(transcription, speakers);

      makePostRequest("/putDocument", {
        content: markdown,
        documentUrl,
      })
        .then(() => {
          window.open(documentUrl);
        })
        .catch((error) => alert(error));
    },
    [transcription, speakers]
  );
  const updateDialog = useCallback(
    (dialogId: string, content: string) => {
      setTranscription((t: Dialog[]) => {
        const updated: Dialog[] = [];
        for (const d of t) {
          if (d.dialogId !== dialogId) {
            updated.push(d);
            continue;
          }
          const nd = {
            ...d,
            words: content,
          };
          updated.push(nd);
        }
        return updated;
      });
    },
    [setTranscription]
  );

  const handleMergeUpDialog = useCallback(
    (dialogId: string) => {
      setTranscription((t) => {
        const index = t.map(({ dialogId }) => dialogId).indexOf(dialogId);

        const previousDialog = t[index - 1];
        const dialog = t[index];

        const mergedDialog: Dialog = {
          ...previousDialog,
          endTime: dialog.endTime,
          words: previousDialog.words + " " + dialog.words,
        };

        return [...t.slice(0, index - 1), mergedDialog, ...t.slice(index + 1)];
      });
    },
    [setTranscription]
  );

  const handleDeleteDialog = useCallback(
    (dialogId: string) => {
      setTranscription((t) => {
        const index = t.map(({ dialogId }) => dialogId).indexOf(dialogId);

        return [...t.slice(0, index), ...t.slice(index + 1)];
      });
    },
    [setTranscription]
  );

  return (
    <AmplifyAuthenticator>
      {user && (
        <div>
          <div>
            <Container fluid style={{ marginBottom: "5rem" }}>
              <Row>
                <Col xs={9}>
                  <h3>Conversation</h3>
                  {transcription.map((dialog, i) => (
                    <DialogView
                      key={i}
                      dialog={dialog}
                      color={
                        colors[
                          allSpeakers.indexOf(
                            speakers[dialog.speaker] || String(dialog.speaker)
                          )
                        ]
                      }
                      speakerOptions={speakerOptions}
                      onSetSpeaker={handleSetSpeaker}
                      updateDialog={updateDialog}
                      onMergeUpDialog={i > 0 ? handleMergeUpDialog : undefined}
                      onDeleteDialog={handleDeleteDialog}
                    />
                  ))}
                  {partial && (
                    <DialogView
                      partial={partial}
                      speakerOptions={speakerOptions}
                      onSetSpeaker={handleSetSpeaker}
                    />
                  )}
                </Col>
                <Col>
                  <SpeakerList
                    speakerNames={allSpeakers}
                    onNameChange={handleSpeakerNameChange}
                    unallocatedSpeakerNames={unallocatedSpeakerNames}
                    addNewSpeaker={handleCreateNewSpeaker}
                  />
                </Col>
              </Row>
            </Container>
          </div>
          <BottomBar
            onEventStreamMessage={handleEventStreamMessage}
            saveToQuip={handleSaveToQuip}
          />
        </div>
      )}
    </AmplifyAuthenticator>
  );
};

export default App;

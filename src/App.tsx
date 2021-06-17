import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { Container, Col, Row } from "react-bootstrap";
import BottomBar from "./BottomBar";
import { SpeakersContext, UserContext } from "./contexts";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useTranscribe } from "./hooks";
import DialogView from "./DialogView";
import distinctColors from "distinct-colors";
import SpeakerList from "./SpeakerList";
import { Dialog } from "./types";

const region = "us-west-2";

const DEFAULT_SPEAKER_COUNT = 6; // if there are more speakers, we recreate the colors object
const DEFAULT_COLORS = distinctColors({
  count: DEFAULT_SPEAKER_COUNT,
  lightMin: 80,
}).map((color) => color.hex());

const App: React.FC = () => {
  const [user, setUser] = useState<CognitoUser | undefined>(undefined);

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === AuthState.SignedIn) {
        setUser(authData as CognitoUser);
      } else {
        setUser(undefined);
      }
    });
  }, []);

  const [credential, setCredential] = useState<any>();
  const { transcription, partial, error } = useTranscribe(credential, region);
  const [speakers, setSpeakers] = useState<Record<number, string>>({});

  const [unallocatedSpeakerNames, allocateSpeakerNames] = useState<string[]>(
    []
  );

  const speakerContextValue = useMemo(
    () => ({
      speakers,
      setSpeakers,
    }),
    [speakers]
  );

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

      setSpeakers({ ...speakers, [Number(speakerId)]: to });
    },
    [speakers, allSpeakers]
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
    [speakers, unallocatedSpeakerNames, allSpeakers]
  );

  const speakerOptions = useMemo(
    () => [...allSpeakers, ...unallocatedSpeakerNames],
    [allSpeakers, unallocatedSpeakerNames]
  );

  const handleSetSpeaker = useCallback((dialog: Dialog, name: string) => {
    console.log(dialog, name);
  }, []);

  return (
    <AmplifyAuthenticator>
      {user && (
        <UserContext.Provider value={user}>
          <div>
            <Container fluid style={{ marginBottom: "5rem" }}>
              <Row>
                <Col xs={9}>
                  <SpeakersContext.Provider value={speakerContextValue}>
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
                      />
                    ))}
                    {partial && (
                      <DialogView
                        partial={partial}
                        speakerOptions={speakerOptions}
                        onSetSpeaker={handleSetSpeaker}
                      />
                    )}
                  </SpeakersContext.Provider>
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
          <BottomBar setCredential={setCredential} />
        </UserContext.Provider>
      )}
    </AmplifyAuthenticator>
  );
};

export default App;

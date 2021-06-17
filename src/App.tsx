import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useEffect, useMemo, useState } from "react";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { Container, Col, Row } from "react-bootstrap";
import BottomBar from "./BottomBar";
import { SpeakersContext, UserContext } from "./contexts";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useTranscribe } from "./hooks";
import DialogView from "./DialogView";
import distinctColors from "distinct-colors";

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

  const colors = useMemo(
    () =>
      allSpeakers.length > DEFAULT_SPEAKER_COUNT
        ? distinctColors({ count: allSpeakers.length }).map((color) =>
            color.hex()
          )
        : DEFAULT_COLORS,
    [allSpeakers.length]
  );

  return (
    <AmplifyAuthenticator>
      {user && (
        <UserContext.Provider value={user}>
          <div>
            <Container style={{ marginBottom: "5rem" }}>
              <Row>
                <Col>
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
                      />
                    ))}
                    {partial && <DialogView partial={partial} />}
                  </SpeakersContext.Provider>
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

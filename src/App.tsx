import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { Container, Col, Row } from "react-bootstrap";
import BottomBar from "./BottomBar";
import UserContext from "./UserContext";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useTranscribe } from "./hooks";
import DialogView from "./DialogView";

const region = "us-west-2";

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
  const [stop, setStop] = useState<any>();
  const { transcription, partial, error } = useTranscribe(credential, region, stop);

  return (
    <AmplifyAuthenticator>
      {user && (
        <UserContext.Provider value={user}>
          <div>
            <Container style={{ marginBottom: "5rem" }}>
              <Row>
                <Col>
                  {transcription.map((dialog, i) => (
                    <DialogView key={i} dialog={dialog} />
                  ))}
                  {partial && <DialogView partial={partial} />}
                </Col>
              </Row>
            </Container>
          </div>
          <BottomBar setCredential={setCredential} setStop={setStop} />
        </UserContext.Provider>
      )}
    </AmplifyAuthenticator>
  );
};

export default App;

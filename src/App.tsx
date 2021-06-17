import "./App.css";
import React, { useEffect, useState } from "react";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { Container, Col, Row } from "react-bootstrap";
import BottomBar from "./BottomBar";
import UserContext from "./UserContext";
import { CognitoUser } from "amazon-cognito-identity-js";

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

  return (
    <AmplifyAuthenticator>
      {user && (
        <UserContext.Provider value={user}>
          <div>
            <Container>
              <Row>
                <Col></Col>
              </Row>
            </Container>
          </div>
          <BottomBar />
        </UserContext.Provider>
      )}
    </AmplifyAuthenticator>
  );
};

export default App;

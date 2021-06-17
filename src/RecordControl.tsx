import { AmplifyButton } from "@aws-amplify/ui-react";
import React, { useCallback } from "react";
import styled from "styled-components";
import { useUser } from "./hooks";
import { makeRequest } from "./utils";

const Styles = styled.div`
  width: auto;
`;

const RecordControl: React.FC = () => {
  const user = useUser();

  const handleStartSession = useCallback(() => {
    if (user) {
      makeRequest("/start-session").then((data) => {
        console.log(data);
      });
    }
  }, [user]);

  return (
    <Styles>
      <AmplifyButton disabled={!user} onClick={handleStartSession}>
        Start
      </AmplifyButton>
    </Styles>
  );
};

export default RecordControl;

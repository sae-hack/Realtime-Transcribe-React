import { AmplifyButton } from "@aws-amplify/ui-react";
import React, { useCallback, useState } from "react";
import { ClipLoader } from "react-spinners";
import styled from "styled-components";
import { useUser } from "./redux";
import { makeRequest } from "./utils";

const Styles = styled.div`
  display: flex;
  width: auto;
  align-items: center;
`;

export interface RecordControlProps {
  setCredential: (credential: any) => void;
  setStop: (stop: any) => void;
  saveToQuip: (documentUrl: string) => void;
}

const RecordControl: React.FC<RecordControlProps> = ({
  setCredential,
  setStop,
  saveToQuip,
}) => {
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const handleStartSession = useCallback(() => {
    if (user) {
      setLoading(true);
      setStop(false);
      makeRequest("/start-session")
        .then((data: any) => {
          setCredential(data.credentials);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, setCredential]);

  const handleStopSession = useCallback(() => {
    if (user) {
      setStop(true);
    }
  }, [user, setStop]);

  const handleSaveToQuip = useCallback(() => {
    const url = prompt("Quip document URL:");
    if (url) {
      saveToQuip(url);
    }
  }, [saveToQuip]);

  return (
    <Styles>
      {loading && <ClipLoader color="white" size={20} />}
      <AmplifyButton disabled={!user} onClick={handleSaveToQuip}>
        Save to Quip
      </AmplifyButton>
      <AmplifyButton disabled={!user} onClick={handleStartSession}>
        Start
      </AmplifyButton>
      <AmplifyButton disabled={!user} onClick={handleStopSession}>
        Stop
      </AmplifyButton>
    </Styles>
  );
};

export default RecordControl;

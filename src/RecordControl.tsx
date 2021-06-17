import { AmplifyButton } from "@aws-amplify/ui-react";
import React, { useCallback, useState } from "react";
import { ClipLoader } from "react-spinners";
import styled from "styled-components";
import { useUser, useTranscribe } from "./hooks";
import { makeRequest } from "./utils";

const Styles = styled.div`
  display: flex;
  width: auto;
  align-items: center;
`;

const region = "us-west-2";

const RecordControl: React.FC = () => {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [credential, setCredential] = useState<any>();

  const handleStartSession = useCallback(() => {
    if (user) {
      setLoading(true);
      makeRequest("/start-session")
        .then((data: any) => {
          setCredential(data.credentials);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const { transcription, partial, error } = useTranscribe(credential, region);
  console.log("data", transcription, partial, error);

  return (
    <Styles>
      {loading && <ClipLoader color="white" size={20} />}
      <AmplifyButton disabled={!user} onClick={handleStartSession}>
        Start
      </AmplifyButton>
    </Styles>
  );
};

export default RecordControl;

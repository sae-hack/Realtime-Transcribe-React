import { AmplifyButton } from "@aws-amplify/ui-react";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback } from "react";
import { ClipLoader, ScaleLoader } from "react-spinners";
import styled from "styled-components";
import {
  startSession,
  stopSession,
  useAppDispatch,
  useAppSelector,
  useUser,
} from "./redux";

const Styles = styled.div`
  display: flex;
  width: auto;
  align-items: center;

  .status-icon {
    padding-right: 5px;
  }
`;

export interface RecordControlProps {
  saveToQuip: (documentUrl: string) => void;
  onEventStreamMessage: (messageJson: any) => void;
}

const RecordControl: React.FC<RecordControlProps> = ({
  onEventStreamMessage,
  saveToQuip,
}) => {
  const user = useUser();

  const { fetchingCredential, recording } = useAppSelector(
    (states) => states.session
  );

  const dispatch = useAppDispatch();
  const handleStartSession = useCallback(() => {
    if (user) {
      dispatch(startSession("us-west-2", onEventStreamMessage));
    }
  }, [dispatch, user, onEventStreamMessage]);

  const handleStopSession = useCallback(() => {
    if (user) {
      dispatch(stopSession());
    }
  }, [dispatch, user]);

  const handleSaveToQuip = useCallback(() => {
    const url = prompt("Quip document URL:");
    if (url) {
      saveToQuip(url);
    }
  }, [saveToQuip]);

  return (
    <Styles>
      <div className="status-icon">
        {fetchingCredential && <ClipLoader color="white" size={20} />}
        {recording && <ScaleLoader color="white" height={20} />}
      </div>
      <AmplifyButton disabled={!user} onClick={handleSaveToQuip}>
        Save to Quip
      </AmplifyButton>
      {/* somehow we cannot conditional render these buttons. The style will be off once we do that. Using style.display to control them */}
      <AmplifyButton
        disabled={!user}
        onClick={handleStartSession}
        style={{ display: recording ? "none" : "unset" }}
      >
        <FontAwesomeIcon icon={faPlay} />
      </AmplifyButton>
      <AmplifyButton
        disabled={!user}
        onClick={handleStopSession}
        style={{ display: recording ? "unset" : "none" }}
      >
        <FontAwesomeIcon icon={faStop} />
      </AmplifyButton>
    </Styles>
  );
};

export default RecordControl;

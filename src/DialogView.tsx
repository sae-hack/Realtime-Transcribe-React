import React from "react";
import styled from "styled-components";
import { Dialog } from "./hooks";

const Styles = styled.div`
  display: flex;
  border: solid 1px black;

  .timestamp {
    width: 5rem;
  }

  .speaker {
    width: 5rem;
  }

  .content {
  }
`;

const DialogView: React.FC<Dialog> = ({ startTime, speaker, words }) => (
  <Styles>
    <div className="timestamp">{startTime.toFixed(2)}</div>
    <div className="speaker">{speaker}</div>
    <div className="content">{words.join(" ")}</div>
  </Styles>
);

export default React.memo(DialogView);

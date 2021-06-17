import { faClock, faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { BeatLoader } from "react-spinners";
import styled from "styled-components";
import { Dialog } from "./types";

const Styles = styled.div`
  display: flex;
  border: solid 1px black;
  border-radius: 5px;
  margin: 1rem;

  .meta {
    flex-shrink: 0;
    width: 5rem;
    position: relative;
    text-align: center;
    min-height: 50px;

    .speaking {
      margin-top: 5px;
    }

    .timestamp {
      font-size: 0.8rem;
    }

    .speaker {
      width: 80px;
      height: 80px;

      .speaker-icon {
        font-size: 30px;
      }

      .speaker-label {
        font-weight: bold;
      }
    }
  }

  .content {
  }
`;

interface Props {
  dialog?: Dialog;
  partial?: string;
}

const DialogView: React.FC<Props> = ({ dialog, partial }) => (
  <Styles>
    <div className="meta">
      {dialog && (
        <>
          <div className="speaker">
            <div className="speaker-icon">
              <FontAwesomeIcon icon={faUserAstronaut} />
            </div>
            <div className="speaker-label">{dialog.speaker}</div>
          </div>
          <div className="timestamp">
            <FontAwesomeIcon icon={faClock} /> {dialog.startTime.toFixed(2)}s
          </div>
        </>
      )}
      {partial && (
        <div className="speaking">
          <BeatLoader />
        </div>
      )}
    </div>
    <div className="content">{dialog ? dialog.words : partial}</div>
  </Styles>
);

export default React.memo(DialogView);

import { faClock, faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { BeatLoader } from "react-spinners";
import styled from "styled-components";
import { SpeakersContext } from "./contexts";
import { Dialog } from "./types";
import Color from "color";

const Styles = styled.div`
  display: flex;
  border: solid 1px;
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
    padding: 5px;
    flex-grow: 1;
  }
`;

interface Props {
  dialog?: Dialog;
  partial?: string;
  color?: string;
}

const DialogView: React.FC<Props> = ({ dialog, partial, color = "#fff" }) => {
  const { speakers } = useContext(SpeakersContext);
  const _color = Color(color);

  return (
    <Styles style={{ borderColor: color }}>
      <div className="meta" style={{ backgroundColor: color }}>
        {dialog && (
          <>
            <div className="speaker">
              <div className="speaker-icon">
                <FontAwesomeIcon icon={faUserAstronaut} />
              </div>
              <div className="speaker-label">
                {speakers[dialog.speaker] || dialog.speaker}
              </div>
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
      <div
        className="content"
        style={{ backgroundColor: _color.lighten(0.2).hex() }}
      >
        {dialog ? dialog.words : partial}
      </div>
    </Styles>
  );
};

export default React.memo(DialogView);

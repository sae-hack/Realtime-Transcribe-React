import { faClock, faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import styled from "styled-components";
import { SpeakersContext } from "./contexts";
import { Dialog } from "./types";
import Color from "color";
import { Dropdown } from "react-bootstrap";

const Styles = styled.div`
  display: flex;
  border: solid 1px;
  border-radius: 5px;
  margin: 1rem;

  .meta {
    flex-shrink: 0;
    width: 120px;
    padding: 5px;
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
      width: 120px;
      height: 80px;

      .speaker-icon {
        font-size: 30px;
      }

      .speaker-label {
        font-weight: bold;
        cursor: pointer;

        .btn {
          /* erase the styles brought by react-bootstrap */
          background-color: unset !important;
          border: unset !important;
          color: black;
        }
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
  speakerOptions: string[];
  onSetSpeaker: (dialog: Dialog, name: string) => void;
}

const DialogView: React.FC<Props> = ({
  dialog,
  partial,
  color = "#fff",
  speakerOptions,
  onSetSpeaker,
}) => {
  const { speakers, setSpeakers } = useContext(SpeakersContext);
  const [editing, setEditing] = useState(false);

  const _color = Color(color);

  const speakerName =
    dialog && (speakers[dialog.speaker] || String(dialog.speaker));

  return (
    <Styles style={{ borderColor: color }}>
      <div className="meta" style={{ backgroundColor: color }}>
        {dialog && (
          <>
            <div className="speaker">
              <div className="speaker-icon">
                <FontAwesomeIcon icon={faUserAstronaut} />
              </div>
              <div className="speaker-label" onClick={() => setEditing(true)}>
                <Dropdown>
                  <Dropdown.Toggle>{speakerName}</Dropdown.Toggle>

                  <Dropdown.Menu show={editing}>
                    {speakerOptions.map((name) => (
                      <Dropdown.Item
                        key={name}
                        href="#"
                        onClick={() => onSetSpeaker(dialog, name)}
                      >
                        {name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
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

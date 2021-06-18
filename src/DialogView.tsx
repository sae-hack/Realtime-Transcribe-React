import { faClock, faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import styled from "styled-components";
import { SpeakersContext } from "./contexts";
import { Dialog } from "./types";
import Color from "color";
import { Dropdown, Form } from "react-bootstrap";

const Styles = styled.div`
  display: flex;
  border: solid 1px;
  border-radius: 5px;
  margin: 1rem;

  .meta {
    flex-shrink: 0;
    width: 120px;
    position: relative;
    text-align: center;
    min-height: 50px;

    .speaking {
      margin-top: 5px;
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
        font-size: 1rem;

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
    position: relative;

    .form-control {
      background-color: transparent !important;
    }

    .timestamp {
      position: absolute;
      font-size: 0.6rem;
      bottom: 5px;
      left: 10px;
    }
  }
`;

interface Props {
  dialog?: Dialog;
  partial?: string;
  color?: string;
  speakerOptions: string[];
  onSetSpeaker: (dialog: Dialog, name: string) => void;
  updateDialog?: (diaglogId: string, dialog: string) => void;
}

const DialogView: React.FC<Props> = ({
  dialog,
  partial,
  color = "#fff",
  speakerOptions,
  onSetSpeaker,
  updateDialog,
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
        contentEditable={true}
      >
        <Form.Control
          value={dialog ? dialog.words : partial}
          onChange={(e) => {
            if (updateDialog && dialog) {
              updateDialog(dialog.dialogId, e.target.value);
            }
          }}
        />
        {dialog && (
          <div className="timestamp">
            <FontAwesomeIcon icon={faClock} /> {dialog.startTime.toFixed(2)}s
          </div>
        )}
      </div>
    </Styles>
  );
};

export default React.memo(DialogView);

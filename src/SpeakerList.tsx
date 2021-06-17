import React, { useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import styled from "styled-components";
import EditableSpan from "./EditableSpan";

const Styles = styled.div`
  position: fixed;
  right: 0;
  padding: 5px;
  width: 25%;
`;

interface Props {
  speakerNames: string[];
  unallocatedSpeakerNames: string[];
  onNameChange: (from: string, to: string) => void;
  addNewSpeaker: (name: string) => void;
}

const SpeakerList: React.FC<Props> = ({
  speakerNames,
  onNameChange,
  unallocatedSpeakerNames,
  addNewSpeaker,
}) => {
  const [newSpeakerName, setNewSpeakerName] = useState("");

  return (
    <Styles>
      <h3>Speakers</h3>
      <ListGroup>
        {speakerNames.map((name) => (
          <ListGroup.Item key={name}>
            <EditableSpan onChange={(newValue) => onNameChange(name, newValue)}>
              {name}
            </EditableSpan>
          </ListGroup.Item>
        ))}
        {unallocatedSpeakerNames.map((name) => (
          <ListGroup.Item key={name} style={{ background: "#ccc" }}>
            <EditableSpan onChange={(newValue) => onNameChange(name, newValue)}>
              {name}
            </EditableSpan>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Form.Control
        value={newSpeakerName}
        onChange={(e) => setNewSpeakerName(e.target.value)}
      />
      <Button
        disabled={!newSpeakerName}
        onClick={() => {
          newSpeakerName && addNewSpeaker(newSpeakerName);
          setNewSpeakerName("");
        }}
      >
        Add Speaker
      </Button>
    </Styles>
  );
};

export default SpeakerList;

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import styled from "styled-components";

const Span = styled.span`
  cursor: pointer;
`;

interface Props {
  children: string;
  onChange: (newValue: string) => void;
}

const EditableSpan: React.FC<Props> = ({ children, onChange }) => {
  const [value, setValue] = useState(children);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setValue(children);
  }, [children]);

  return editing ? (
    <div>
      <Form.Control value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        onClick={() => {
          setValue(children);
          setEditing(false);
        }}
      >
        Cancel
      </Button>{" "}
      <Button
        onClick={() => {
          onChange(value);
          setEditing(false);
        }}
      >
        Save
      </Button>
    </div>
  ) : (
    <Span onClick={() => setEditing(true)}>
      <FontAwesomeIcon icon={faEdit} /> {value}
    </Span>
  );
};

export default EditableSpan;

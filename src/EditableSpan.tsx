import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

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
    <span onClick={() => setEditing(true)}>{value}</span>
  );
};

export default EditableSpan;

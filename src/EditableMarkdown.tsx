import React, { useState } from "react";
import MarkdownEditor, { MarkdownEditorProps } from "./MarkdownEditor";
import ReactMarkdown from "react-markdown";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const EditorContainer = styled.div`
  padding-bottom: 10px;
`;

const SpanContainer = styled.div`
  min-height: 60px;
  cursor: pointer;

  svg {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
`;

const EditableMarkdown: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
}) => {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <EditorContainer>
      <MarkdownEditor
        value={value}
        onChange={onChange}
        onBlur={() => setEditing(false)}
      />
    </EditorContainer>
  ) : (
    <SpanContainer onClick={() => setEditing(true)}>
      <span>
        <ReactMarkdown>{value}</ReactMarkdown>
      </span>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="edit-tooltip">
            Click the text to edit, highlight text to style it.
          </Tooltip>
        }
      >
        <FontAwesomeIcon icon={faEdit} />
      </OverlayTrigger>
    </SpanContainer>
  );
};

export default EditableMarkdown;

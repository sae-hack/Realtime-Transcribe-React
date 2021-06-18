import React, { useState } from "react";
import MarkdownEditor, { MarkdownEditorProps } from "./MarkdownEditor";
import ReactMarkdown from "react-markdown";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

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
      <FontAwesomeIcon icon={faEdit} />
    </SpanContainer>
  );
};

export default EditableMarkdown;

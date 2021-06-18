import React, { useState } from "react";
import MarkdownEditor, { MarkdownEditorProps } from "./MarkdownEditor";
import ReactMarkdown from "react-markdown";

const EditableMarkdown: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
}) => {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <MarkdownEditor value={value} onChange={onChange} />
  ) : (
    <span onClick={() => setEditing(true)}>
      <ReactMarkdown>{value}</ReactMarkdown>
    </span>
  );
};

export default EditableMarkdown;

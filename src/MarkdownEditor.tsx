import React, { useCallback, useMemo, useState } from "react";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createInlineToolbarPlugin from "@draft-js-plugins/inline-toolbar";
import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";

export interface MarkdownEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps & { onBlur: () => void }> =
  ({ value, onChange, onBlur }) => {
    const [plugins, InlineToolbar] = useMemo(() => {
      const inlineToolbarPlugin = createInlineToolbarPlugin();
      return [[inlineToolbarPlugin], inlineToolbarPlugin.InlineToolbar];
    }, []);

    const [editorState, setEditorState] = useState(() =>
      EditorState.createWithContent(convertFromRaw(markdownToDraft(value)))
    );

    const handleChange = useCallback(
      (newState: EditorState) => {
        setEditorState(newState);

        const markdown = draftToMarkdown(
          convertToRaw(newState.getCurrentContent()),
          {
            styleItems: {
              UNDERLINE: {
                open: function open() {
                  return "<u>";
                },

                close: function close() {
                  return "</u>";
                },
              },
            },
          }
        );
        onChange(markdown);
      },
      [onChange]
    );

    return (
      <div>
        <Editor
          editorState={editorState}
          onChange={handleChange}
          onBlur={onBlur}
          plugins={plugins}
        />
        <InlineToolbar />
      </div>
    );
  };

export default MarkdownEditor;

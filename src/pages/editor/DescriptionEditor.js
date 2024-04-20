import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

const DescriptionEditor = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    if (value) {
      const contentState = EditorState.createWithText(value).getCurrentContent();
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [value]);

  useEffect(() => {
    if (selection) {
      const newSelection = selection.merge({
        anchorKey: selection.getEndKey(),
        anchorOffset: selection.getEndOffset(),
        focusKey: selection.getEndKey(),
        focusOffset: selection.getEndOffset(),
      });
      setEditorState(EditorState.forceSelection(editorState, newSelection));
    }
  }, [selection, editorState]);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    onChange(plainText);
    setSelection(newEditorState.getSelection());
    setEditorState(newEditorState);
  };

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  return (
    <div>
      <div>
        <button onClick={() => toggleInlineStyle('BOLD')}>B</button>
        <button onClick={() => toggleInlineStyle('ITALIC')}>I</button>
        <button onClick={() => toggleBlockType('header-one')}>H1</button>
        <button onClick={() => toggleBlockType('header-two')}>H2</button>
      </div>
      <div style={{ border: '1px solid #ccc', minHeight: '100px', padding: '10px' }}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default DescriptionEditor;

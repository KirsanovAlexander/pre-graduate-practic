import React, {useState, useEffect} from 'react';
import {Editor, EditorState, RichUtils, Modifier} from 'draft-js';
import 'draft-js/dist/Draft.css';

const DescriptionEditor = ({value, onChange}) => {
  const [editorState, setEditorState] = useState(() => {
    if (value) {
      const contentState = EditorState.createWithText(value).getCurrentContent();
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  useEffect(() => {
    if (value && editorState.getCurrentContent().getPlainText() !== value) {
      const contentState = EditorState.createWithText(value).getCurrentContent();
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [value, editorState]);

  const handleChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    onChange(plainText);
    setEditorState(newEditorState);
  };

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const addLink = () => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
      url: 'https://ant.design/components/menu',
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const contentStateWithLink = Modifier.applyEntity(contentStateWithEntity, selection, entityKey);
    const newEditorState = EditorState.push(editorState, contentStateWithLink, 'apply-entity');
    setEditorState(EditorState.forceSelection(newEditorState, selection));
  };

  const addNumberedList = () => {
    setEditorState(RichUtils.toggleBlockType(editorState, 'ordered-list-item'));
  };

  return (
    <div>
      <div>
        <button onClick={() => toggleInlineStyle('BOLD')}>B</button>
        <button onClick={() => toggleInlineStyle('ITALIC')}>I</button>
        <button onClick={() => toggleBlockType('header-one')}>H1</button>
        <button onClick={() => toggleBlockType('header-two')}>H2</button>
        <button onClick={addLink}>Add Link</button>
        <button onClick={addNumberedList}>Numbered List</button>
      </div>
      <div style={{border: '1px solid #ccc', minHeight: '100px', padding: '10px'}}>
        <Editor editorState={editorState} onChange={handleChange} />
      </div>
    </div>
  );
};

export default DescriptionEditor;

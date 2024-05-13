import React, {useState, useRef, useEffect} from 'react';
import {
  convertToRaw,
  CompositeDecorator,
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  getDefaultKeyBinding,
  KeyBindingUtil,
  convertFromHTML,
  ContentState
} from 'draft-js';
import jsonBeautify from 'json-beautify';
import {convertToHTML} from 'draft-convert';

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={{color: '#3b5998', textDecoration: 'underline'}}>
      {props.children}
    </a>
  );
};

const DescriptionEditor = ({defaultValue, onChange}) => {
  const html = convertFromHTML(defaultValue ?? '')
  const state = ContentState.createFromBlockArray(html)
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(state, new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]))
  );
  const [showURLInput, setShowURLInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const editorRef = useRef(null);

  const handleChange = (editorState) => {
    setEditorState(editorState);
    const html = convertToHTML({
      entityToHTML: (entity, originalText) => {
        if (entity.type === 'LINK') {
          return <a href={entity.data.url}>{originalText}</a>;
        }
        return originalText;
      }
    })(editorState.getCurrentContent());
    onChange(html)
  }

  const onURLChange = (e) => setUrlValue(e.target.value);

  const promptForLink = (e) => {
    e.preventDefault();
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      setShowURLInput(true);
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }
      setUrlValue(url);
    }
  };

  const confirmLink = (e) => {
    e.preventDefault();
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: urlValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    let nextEditorState = EditorState.set(editorState, 
      {currentContent: contentStateWithEntity}
    );

    const newContentState = Modifier.setBlockType(
      contentStateWithEntity,
      nextEditorState.getSelection(),
      'code-block'
    );

    nextEditorState = EditorState.push(
      nextEditorState,
      newContentState,
      'change-block-type'
    );

    nextEditorState = RichUtils.toggleLink( nextEditorState, 
      nextEditorState.getSelection(), entityKey 
    );

    handleChange(nextEditorState);
    setShowURLInput(false);
    setUrlValue('');
  };

  const onLinkInputKeyDown = (e) => {
    if (e.which === 13) {
      confirmLink(e);
    }
  };

  const removeLink = (e) => {
    e.preventDefault();
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      handleChange(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const keyBindingFn = (e) => {
    if (KeyBindingUtil.hasCommandModifier(e) && e.key === 'k') {
      return 'add-link';
    }
    return getDefaultKeyBinding(e);
  };

  useEffect(() => {
    if (showURLInput && editorRef.current) {
      editorRef.current.focus();
    }
  }, [showURLInput]);

  const contentState = editorState.getCurrentContent();
  const raw = convertToRaw(contentState);
  const rawStr = jsonBeautify(raw, null, 2, 50);

  const toggleInlineStyle = (inlineStyle) => {
    handleChange(
      RichUtils.toggleInlineStyle(editorState, inlineStyle)
    );
  };

  const toggleHeader = (headerType) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    let newBlockType = '';
    if (blockType.startsWith('header')) {
      newBlockType = 'unstyled';
    } else {
      newBlockType = headerType;
    }
    const newContentState = Modifier.setBlockType(
      currentContent,
      selection,
      newBlockType
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'change-block-type'
    );
    handleChange(EditorState.forceSelection(newEditorState, selection));
  };

  const toggleNumberedList = () => {
    handleChange(
      RichUtils.toggleBlockType(editorState, 'ordered-list-item')
    );
  };

  return (
    <div style={styles.root}>
      <div style={{marginBottom: 10}}>
      Выделите какой-нибудь текст, затем с помощью кнопок добавьте или удалите ссылки
на выделенный текст.
      </div>
      <div style={styles.buttons}>
        <button onMouseDown={() => toggleInlineStyle('BOLD')}>Жирный</button>
        <button onMouseDown={() => toggleInlineStyle('ITALIC')}>Курсивный</button>
        <button onMouseDown={() => toggleHeader('header-one')}>H1</button>
        <button onMouseDown={() => toggleHeader('header-two')}>H2</button>
        <button onMouseDown={toggleNumberedList}>Нумерованный список</button>
        <button onMouseDown={promptForLink}>Добавить ссылку</button>
        <button onMouseDown={removeLink}>Удалить ссылку</button>
      </div>
      {showURLInput &&
        <div style={styles.urlInputContainer}>
          <input
            onChange={onURLChange}
            ref={editorRef}
            style={styles.urlInput}
            type="text"
            value={urlValue}
            onKeyDown={onLinkInputKeyDown}
          />
          <button onMouseDown={confirmLink}> Подтвердить </button> 
        </div>}
      <div style={styles.editor}>
        <Editor
          editorState={editorState}
          onChange={handleChange}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFn}
          placeholder="Введите текст..."
        />
      </div>
      <div>
        <pre>
          <code>{rawStr}</code>
        </pre>
      </div>


      <Editor
        editorState={editorState}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFn}
        placeholder="Введите текст..."
        readOnly
      />
    </div>
  );
};

const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    width: 400,
  },
  buttons: {
    marginBottom: 10,
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
};

export default DescriptionEditor;


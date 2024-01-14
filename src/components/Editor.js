import React, { useEffect } from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  ContentState,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  ContentBlock,
  convertFromRaw,
  SelectionState,
} from "draft-js";
import "draft-js/dist/Draft.css";

const { hasCommandModifier } = KeyBindingUtil;

const CustomEditor = () => {

  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );



  const handleEditorState = (editorState) => {
    const currentContent = editorState.getCurrentContent();
    const blocks = convertToRaw(currentContent).blocks;
    const newBlocks = []
    blocks.forEach(block => {
      // console.log(element.text,'text')
      if(block.text.startsWith('# ')){
        console.log('starts with hash and space')
        block.text=''
        block.type = 'header-one';
      }
      newBlocks.push(block)
    });
    const newRawContent = { ...convertToRaw(currentContent), blocks: newBlocks };
    const newContentState = convertFromRaw(newRawContent);
    const newEditorState = EditorState.push(editorState, newContentState, 'change-block-type');
    // this.editor.update(newEditorState);
    setEditorState(newEditorState);
    // console.log(newEditorState,)
    // setEditorState(editorState);
    // console.log(blocks) 
    
  };

  const handleButtonClick = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState).blocks;

    const selection = editorState.getSelection();
    let currentText = contentState
      .getBlockForKey(editorState.getSelection().getAnchorKey())
      .getText();
    console.log(
      editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType(),
      "content state"
    );

    console.log(rawContent, "raw");
    // rawContent.forEach(element => {
    //   console.log(element.text)
    // });

    // const plainText = ContentState.getPlainText();
    // console.log(plainText);

    // Toggle the inline style to 'header-one-style'
    // setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'))
    // setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'))
  };

  // useEffect(() => {
  //   // Function to load editor content
  //   const rawContent = localStorage.getItem("draftContent");

  //   if (rawContent) {
  //     const contentState = JSON.parse(rawContent);
  //     const editorState = EditorState.createWithContent(contentState);
  //     setEditorState(editorState);
  //   }
  // }, []);

  return (
    <div className="border w-full p-4">
      <button onClick={handleButtonClick}>CHECK</button>
      <Editor
        editorState={editorState}
        onChange={handleEditorState}
      />
    </div>
  );
};

export default CustomEditor;

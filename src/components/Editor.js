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
const modifyBlockWithType = (newContentState) => {
    const currentBlocks = newContentState.getBlockMap().toArray();
    const blockIndexToModify = currentBlocks.findIndex((block) => block.getText().startsWith('# '));

    if (blockIndexToModify !== -1) {
      const blockToModify = currentBlocks[blockIndexToModify];

      // Use ContentBlock's merge method to create a modified block
      const modifiedBlock = blockToModify.merge({
        type: 'header-one', // Set the new type to header-one
      });

      // console.log(modifiedBlock,'BLOCK.')
      const newBlocks = currentBlocks.slice(); // Create a shallow copy
      newBlocks[blockIndexToModify] = modifiedBlock;
      
      // console.log(newBlocks,'new bll')
      const newContentState = ContentState.createFromBlockArray(
        newBlocks
      );
    
      console.log(newContentState,'newCOntent')
      // setEditorState(EditorState.push(editorState, newContentState, 'change-block'),);
     return newContentState;
    }
    return null;


  };

  const handleEditorState = (editorState) => {
    const newContentState = editorState.getCurrentContent();
    const newBlock = modifyBlockWithType(newContentState);
    console.log(newBlock,'content block')
    if(newBlock){
      const newEditorState = EditorState.push(editorState, newBlock, 'change-block-type');

      console.log('newEditorState:', newEditorState.toJS());
  
      setEditorState(newEditorState);
      // setEditorState(EditorState.push(editorState, newContentState, 'change-block-type'));
    }else{
      setEditorState(editorState);
    }
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState).blocks;

    console.log(rawContent,'raw')

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

  useEffect(() => {
    // Function to load editor content
    const rawContent = localStorage.getItem("draftContent");

    if (rawContent) {
      const contentState = JSON.parse(rawContent);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, []);

  return (
    <div className="border w-full p-4">
      <button onClick={handleButtonClick}>CHECK</button>
      <Editor editorState={editorState} onChange={handleEditorState} />
    </div>
  );
};

export default CustomEditor;

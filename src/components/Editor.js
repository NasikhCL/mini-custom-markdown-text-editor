import React, { useEffect, useState } from "react";
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


  const [headerOneArr, setHeaderOneArr] =useState([])
  const [boldArr, setBoldArr] =useState([])
  const handleEditorState = (editorState) => {

    const currentContent = editorState.getCurrentContent();
    const blocks = convertToRaw(currentContent).blocks;
    const newBlocks = []
    blocks.forEach(block => {
      
      const isHeaderOne = headerOneArr.includes(block.key)
      if(!isHeaderOne && block.text === ''){
        block.type ='unstyled'
        newBlocks.push(block);
      }else if(isHeaderOne && block.text === ' '){
        block.style = 'unstyled'
        block.text= ''
        setHeaderOneArr(prev=> prev.filter(prev=> prev !== block.key))
        newBlocks.push(block)
      }else if(isHeaderOne){
        block.style = 'header-one'
        newBlocks.push(block)
      }
      else if(block.text.startsWith('# ')){
        setHeaderOneArr(prev=> [...prev, block.key]) 
        block.type = 'header-one'
        block.text = block.text.substring(2); // Remove '# ' from the text
        newBlocks.push(block);
      }else if(block.text.startsWith('* ')|| boldArr.includes(block.key)){
        if(!boldArr.includes(block.key)){
          setBoldArr(prev=> [...prev, block.key])
        }
        block.inlineStyleRanges = [{ offset: 0, length: block.text.length, style: 'BOLD' }];
        block.text = block.text.startsWith('* ') ? block.text.substring(2) : block.text // Remove '* ' from the text
        newBlocks.push(block);
      }else{
          block.type = 'unstyled'  
          block.inlineStyleRanges = [];
          newBlocks.push(block)

        }
    });
    const newRawContent = { ...convertToRaw(currentContent), blocks: newBlocks };
    const newContentState = convertFromRaw(newRawContent);
    const newEditorState = EditorState.push(editorState, newContentState, 'change-block');
    const selectionState = editorState.getSelection();
    const newEditorStateWithHandleCursor = EditorState.forceSelection(newEditorState, selectionState);
    setEditorState(newEditorStateWithHandleCursor);
    console.log(blocks) 
    
  };
  

 

    

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
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

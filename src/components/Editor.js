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
// console.log('com re render')
  const handleEditorState = (editorState,char) => {

    const currentContent = editorState.getCurrentContent();
    const blocks = convertToRaw(currentContent).blocks;
    // console.log(char,'char')
    const newBlocks = []
    blocks.forEach(block => {
      // console.log(headerOneArr,'array')
      // console.log(element.text,'text')
      const isHeaderOne = headerOneArr.includes(block.key)
      console.log(isHeaderOne)
      if(!isHeaderOne && block.text === ''){
        block.type ='unstyled'
        newBlocks.push(block);
      }else if(isHeaderOne){
        block.style = 'header-one'
        newBlocks.push(block)
      }
      else if(block.text.startsWith('# ')){
        setHeaderOneArr(prev=> [...prev, block.key])
        block.type = 'header-one'
        block.text = ''
        newBlocks.push(block);
        console.log('pushed', headerOneArr)
      }else{
          block.type = 'unstyled'  
          newBlocks.push(block)
        }
      


      // if(!isHeaderOne && block.text === ''){
      //     block.type = 'unstyled'
      //     newBlocks.push(block)
      //     console.log('reached here//////////')
      // }
      // else if(block.text === ' '){
      //   block.type = 'unstyled'
      //   newBlocks.push(block);
      //   if(isHeaderOne){
      //     headerOneArr.splice(headerOneArr.indexOf(block.key),1)
      //   }
      // }
      // else if(block.type === 'header-one'){
      //   newBlocks.push(block)
      //   if(!isHeaderOne){
      //     headerOneArr.push(block.key);
      //   }
      // }
      // else if(block.text.startsWith('# ')){
      //   if(!isHeaderOne){
      //     headerOneArr.push(block.key);
      //     console.log('pushed',headerOneArr)

      //   }
      //   console.log('starts with hash and space')
      //   block.text=''
      //   block.type = 'header-one';
      //   newBlocks.push(block) 
      // }else{
      //   block.type = 'unstyled'  
      //   newBlocks.push(block)
      // }
    });
    const newRawContent = { ...convertToRaw(currentContent), blocks: newBlocks };
    const newContentState = convertFromRaw(newRawContent);
    const newEditorState = EditorState.push(editorState, newContentState, 'change-block');
    const selectionState = editorState.getSelection();
    const newEditorStateWithHandleCursor = EditorState.forceSelection(newEditorState, selectionState);
    setEditorState(newEditorStateWithHandleCursor);
    
    // console.log(newEditorState,)
    // setEditorState(editorState);
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
        // handleBeforeInput={handleKeyDown}
        // preserveSelectionOnBlur={true} 
        // keyBindingFn={myKeyBindingFn}
        // handleReturn={handleReturn}
      />
    </div>
  );
};

export default CustomEditor;

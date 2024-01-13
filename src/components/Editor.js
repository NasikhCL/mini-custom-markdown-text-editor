import React, { useEffect } from 'react'
import {Editor, EditorState, convertToRaw, ContentState, RichUtils , getDefaultKeyBinding, KeyBindingUtil, Modifier, ContentBlock, convertFromRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';

const {hasCommandModifier} = KeyBindingUtil;

const CustomEditor = () => {

    const [editorState, setEditorState] = React.useState(
      () => EditorState.createEmpty(),
    );
    const handleEditorState = (editorState)=>{

        // console.log(editorState.getCurrentContent(),'this is editor state')
        setEditorState(editorState);
        const contentState = editorState?.getCurrentContent();

      let currentText = contentState?.getBlockForKey(editorState.getSelection().getAnchorKey()).getText();
        if (currentText?.startsWith('# ')) {
          const currentBlockType = RichUtils.getCurrentBlockType(editorState);
          console.log(currentBlockType, ' this is the type')
          if(currentBlockType !== 'header-one'){
            setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'))
            console.log('reached here')
          }
        }
    }

    const handleBeforeChange = (newEditorState) => {
      const contentState = editorState.getCurrentContent();
      // const selectionState = editorState.getSelection();
      // const currentBlock = contentState.getBlockForKey(selectionState.getStartKey());
      let currentText = contentState.getBlockForKey(editorState.getSelection().getAnchorKey()).getText();
      // Check if the current block starts with '# ' and the typed character is a space
      if (currentText.startsWith('# ')) {
        setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'))
      }
  
      // Return the new editor state
      return newEditorState;
    };

  
    // const myKeyBindingFn = (event) => {
    //   const { key } = event;
    // console.log(event)
      // const currentContent = editorState.getCurrentContent();
      // const currentString = currentContent.getPlainText();
      // console.log(currentString);
    // };

    const handleButtonClick = () => {
        const contentState = editorState.getCurrentContent();

        const selection = editorState.getSelection();
        let currentText = contentState.getBlockForKey(editorState.getSelection().getAnchorKey()).getText();
        console.log(editorState
          .getCurrentContent()
          .getBlockForKey(selection.getStartKey())
          .getType(), 'content state')

        const rawContent = convertToRaw(contentState).blocks;
        console.log(rawContent,'raw');
        // rawContent.forEach(element => {
        //   console.log(element.text)
        // });
        
        // const plainText = ContentState.getPlainText();
        // console.log(plainText);

          // Toggle the inline style to 'header-one-style'
          // setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'))
          // setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'))
      };

    useEffect(()=>{
        // Function to load editor content
        const rawContent = localStorage.getItem('draftContent');
    
        if (rawContent) {
        const contentState = JSON.parse(rawContent);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState)
        }

    },[])


  return (
    <div className='border w-full p-4'>
        <button onClick={handleButtonClick}>CHECK</button>
        <Editor editorState={editorState} onChange={handleEditorState}  handleBeforeInput={handleBeforeChange}/>
    </div>
  )
}

export default CustomEditor
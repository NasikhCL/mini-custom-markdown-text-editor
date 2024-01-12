import React, { useEffect } from 'react'
import {Editor, EditorState, convertToRaw, ContentState, RichUtils , getDefaultKeyBinding, KeyBindingUtil, Modifier, ContentBlock} from 'draft-js';
import 'draft-js/dist/Draft.css';

const {hasCommandModifier} = KeyBindingUtil;

const CustomEditor = () => {

    const [editorState, setEditorState] = React.useState(
      () => EditorState.createEmpty(),
    );
    const handleEditorState = (editorState)=>{

        // console.log(editorState.getCurrentContent(),'this is editor state')
        setEditorState(editorState);
    }

    const handleBeforeInput = (char) => {
      console.log(char, ' this is the char')
      const currentContentState = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const currentBlock = currentContentState.getBlockForKey(
        selection.getStartKey()
      );
      const blockText = currentBlock.getText();
      if (char === '#' && selection.getStartOffset() === 0) {
        console.log('inside # at first')
      }
      if(char === ' ' && blockText.trim() === '#'){
        console.log('---inside the # and space')
       // Replace the space with an empty string
    };
  }
    // const myKeyBindingFn = (event) => {
    //   const { key } = event;
    // console.log(event)
      // const currentContent = editorState.getCurrentContent();
      // const currentString = currentContent.getPlainText();
      // console.log(currentString);
    // };

    const handleButtonClick = () => {
        const contentState = editorState.getCurrentContent();
        const rawContent = convertToRaw(contentState).blocks;
        console.log(rawContent,'raw');
        rawContent.forEach(element => {
          console.log(element.text)
        });
        
        // const plainText = ContentState.getPlainText();
        // console.log(plainText);

          // Toggle the inline style to 'header-one-style'
          setEditorState(RichUtils.toggleInlineStyle(editorState, 'header-one'))
        
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
        <Editor editorState={editorState} onChange={handleEditorState}  handleBeforeInput={handleBeforeInput}/>
    </div>
  )
}

export default CustomEditor
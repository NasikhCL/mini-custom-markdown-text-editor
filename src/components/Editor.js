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
    const myKeyBindingFn = (event) => {
      const { key } = event;
      // const newEditorState = RichUtils.handleKeyCommand(editorState, event);
      // if (newEditorState !== editorState) {
      //   setEditorState(newEditorState);
      //   return;
      // }

      if (key === '#' || key === '*') {
        console.log('reached inside,', key)
        event.preventDefault(); // Prevent default behavior
        // Handle Markdown syntax (explained later)
        const handleMarkdownSyntax = (key, spacePressed = false) => {
          const contentState = editorState.getCurrentContent();
          const selection = editorState.getSelection();
        
          const currentBlock = contentState.getBlockForKey(selection.getStartKey());
          const currentBlockType = currentBlock.getType();
        
          if (currentBlockType !== 'unstyled') {
            return; // Only handle at the beginning of a block
          }
        
          // ... logic for creating blocks based on key and spacePressed (explained below)
          if (key === '#' && spacePressed) {
            const newBlock = ContentBlock.create({
              key: contentState.getLastBlock().getKey() + 1,
              type: 'header-one',
              text: '',
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
            });
          
            const newContentState = Modifier.insertBlock(contentState, selection, newBlock, null);
            setEditorState(EditorState.push(editorState, newContentState, 'split-block'));
          }
        };
        handleMarkdownSyntax();
      }
    };
    const handleButtonClick = () => {
        const contentState = editorState.getCurrentContent();
        const rawContent = convertToRaw(contentState).blocks;
        console.log(rawContent,'raw');
        rawContent.forEach(element => {
          console.log(element.text)
        });
        // const plainText = ContentState.getPlainText();
        // console.log(plainText);
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
        <Editor editorState={editorState} onChange={handleEditorState} keyBindingFn={myKeyBindingFn}/>
    </div>
  )
}

export default CustomEditor
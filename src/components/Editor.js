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
import useHandleClick from "../customHook/useHandleClick";

const CustomEditor = () => {
  
  const [editorState, setEditorState] = React.useState(() =>
  EditorState.createEmpty()
  );
  
  const {triggerClick} = useHandleClick();

  const [headerOneArr, setHeaderOneArr] =useState([])
  const [boldArr, setBoldArr] = useState([])
  const [textRedArr, setTextRedArr] = useState([])
  const [textUnderlineArr, setTextUnderlineArr] = useState([])
  useEffect(() => {
    console.log('trigger rerender')
    if (triggerClick) {
      console.log('inside the trigger')
      saveEditorContent()
    }
  }, [triggerClick]);
  
  const handleEditorState = (editorState) => {

    const currentContent = editorState.getCurrentContent();
    const blocks = convertToRaw(currentContent).blocks;
    const newBlocks = []
    blocks.forEach(block => {

      const isHeaderOne = headerOneArr.includes(block.key)
      const isBold = boldArr.includes(block.key)
      const isUnderline = textUnderlineArr.includes(block.key)
      const isTextRed = textRedArr.includes(block.key);

      if( block.text === ''){
        console.log('inside empty block')
        block.inlineStyleRanges = []
        block.type ='unstyled'
        setHeaderOneArr(prev=> prev.filter(prev=> prev !== block.key))
        setTextUnderlineArr(prev=> prev.filter(prev=> prev !== block.key))
        setTextRedArr(prev=> prev.filter(prev=> prev !== block.key))
        setBoldArr(prev=> prev.filter(prev=> prev !== block.key))

        if(isHeaderOne){
          block.type ='header-one'
          setHeaderOneArr(prev=> [...prev, block.key])
        }
        if(isBold){
          console.log('inside isBold')
          block.inlineStyleRanges =  [ { offset: 0, length: block.text.length, style: 'BOLD' }]
          setBoldArr(prev=> [...prev, block.key])
        }
        if(isTextRed){
          setTextRedArr(prev=> [...prev, block.key])
          console.log('inside isRed')
          block.inlineStyleRanges =  [...block.inlineStyleRanges, { offset: 0, length: block.text.length, style: 'COLOR_RED' }]
        }
        if(isUnderline){   
          setTextUnderlineArr(prev=> [...prev, block.key])
          block.inlineStyleRanges =  [...block.inlineStyleRanges, { offset: 0, length: block.text.length, style: 'UNDERLINE' }]
        }
        newBlocks.push(block);
      }else if((isHeaderOne || isBold || isTextRed || isUnderline) && block.text === ' '){
        block.style = 'unstyled'
        block.inlineStyleRanges = []
        block.text= ''
        setHeaderOneArr(prev=> prev.filter(prev=> prev !== block.key))
        setTextUnderlineArr(prev=> prev.filter(prev=> prev !== block.key))
        setTextRedArr(prev=> prev.filter(prev=> prev !== block.key))
        setBoldArr(prev=> prev.filter(prev=> prev !== block.key))
        newBlocks.push(block)
      }else if(isHeaderOne){
        block.style = 'header-one'
        newBlocks.push(block)
      }
      else if(block.text.startsWith('# ')){
        setHeaderOneArr(prev=> [...prev, block.key]) 
        block.type = 'header-one'
        block.inlineStyleRanges = []
        block.text = block.text.substring(2); // Remove '# ' from the text
        newBlocks.push(block);
      }else if(block.text.startsWith('*** ')|| textUnderlineArr.includes(block.key)){ 
        if(!textUnderlineArr.includes(block.key)){ 
          setTextUnderlineArr(prev=> [...prev, block.key])
        }
        block.inlineStyleRanges = [{ offset: 0, length: block.text.length, style: 'UNDERLINE' }];
        block.text = block.text.startsWith('*** ') ? block.text.substring(4) : block.text // Remove '* ' from the text
        newBlocks.push(block);
        console.log('somthing underline')
      }else if(block.text.startsWith('** ')|| textRedArr.includes(block.key)){ 
        console.log('somthing red')
        if(!textRedArr.includes(block.key)){ 
          setTextRedArr(prev=> [...prev, block.key])
        }
        block.inlineStyleRanges = [ { offset: 0, length: block.text.length, style: 'COLOR_RED' }];
        block.text = block.text.startsWith('** ') ? block.text.substring(3) : block.text // Remove '* ' from the text
        newBlocks.push(block);
      }else if(block.text.startsWith('* ')|| boldArr.includes(block.key)){ 
        if(!boldArr.includes(block.key)){ 
          setBoldArr(prev=> [...prev, block.key])
        }
        block.inlineStyleRanges = [ { offset: 0, length: block.text.length, style: 'BOLD' }];
        block.text = block.text.startsWith('* ') ? block.text.substring(2) : block.text // Remove '* ' from the text
        newBlocks.push(block);
        console.log('somthing bold')
      }else{
        console.log('insided the sels')
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

 

  const saveEditorContent = () => {
    const contentState = EditorState.getCurrentContent();
    const contentStateJSON = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem('draftContent', contentStateJSON);
    localStorage.setItem('draftContentHeaderArr', JSON.stringify(headerOneArr))
    localStorage.setItem('draftContentTextUnderlineArr', JSON.stringify(textUnderlineArr))
    localStorage.setItem('draftContentTextRedArr', JSON.stringify(textRedArr))
    localStorage.setItem('draftContentTextBoldArr', JSON.stringify(boldArr))
    console.log(headerOneArr, ' ',boldArr, ' ', textRedArr, ' ', textUnderlineArr)
    
    console.log('saved to local')
    console.log(convertToRaw(contentState).blocks,'block///////////')
  };
    
  const handleKeyCommand = (command, editorState) => {
    if (command === 'split-block') {
      const contentState = Modifier.splitBlock(
        editorState.getCurrentContent(),
        editorState.getSelection()
      );
      const newEditorState = EditorState.push(
        editorState,
        contentState,
        'split-block'
      );
      setEditorState(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };  

  
  useEffect(() => {
    const storedContentStateJSON = localStorage.getItem('draftContent');
    if (storedContentStateJSON) {
      const contentState = convertFromRaw(JSON.parse(storedContentStateJSON));
      const modifiedEditorState = EditorState.createWithContent(contentState);
      const newEditorState = EditorState.push(modifiedEditorState, contentState, 'insert-characters');
      const selectionState = editorState.getSelection();
      const newEditorStateWithHandleCursor = EditorState.forceSelection(newEditorState, selectionState);
      setEditorState(newEditorStateWithHandleCursor);
      
      setHeaderOneArr(JSON.parse(localStorage.getItem('draftContentHeaderArr')))
      setTextUnderlineArr(JSON.parse(localStorage.getItem('draftContentTextUnderlineArr')))
      setTextRedArr(JSON.parse(localStorage.getItem('draftContentTextRedArr')))
      setBoldArr(JSON.parse(localStorage.getItem('draftContentTextBoldArr')))
  
    }
  }, []);


  return (
    <div className="border w-full p-4">
      <Editor
        editorState={editorState}
        onChange={handleEditorState}
        customStyleMap={{ 'COLOR_RED': {color: 'red'} }}
      />
    </div>
  );
};

export default CustomEditor;

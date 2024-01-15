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


const { hasCommandModifier } = KeyBindingUtil;

const CustomEditor = () => {

  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );


  const [headerOneArr, setHeaderOneArr] =useState([])
  const [boldArr, setBoldArr] = useState([])
  const [textRedArr, setTextRedArr] = useState([])
  const [textUnderlineArr, setTextUnderlineArr] = useState([])
  
  const handleEditorState = (editorState) => {

    const currentContent = editorState.getCurrentContent();
    const blocks = convertToRaw(currentContent).blocks;
    const newBlocks = []
    let isModfied = false;
    blocks.forEach(block => {

      const isHeaderOne = headerOneArr.includes(block.key)
      const isBold = boldArr.includes(block.key)
      const isUnderline = textUnderlineArr.includes(block.key)
      const isTextRed = textRedArr.includes(block.key);
      // if(isHeaderOne|| block.text.startsWith('# ')){
      //   block.text = block.text.startsWith('# ') ? block.text.substring(2) : block.text // Remove '# ' from the text
      //   block.type = 'header-one'
      //   block.inlineStyleRanges = []
      //   newBlocks.push(block);
      //   if(!isHeaderOne){
      //     setHeaderOneArr(prev=> [...prev, block.key])
      //   }
      //   isModfied = true;
        
      // }
      // if(isBold || block.text.startsWith('* ')){
      //   console.log('inside isblod')
      //   block.text = block.text.startsWith('* ') ? block.text.substring(2) : block.text // Remove '* ' from the text
      //   block.inlineStyleRanges = [...block.inlineStyleRanges, { offset: 0, length: block.text.length, style: 'BOLD' }];
      //   newBlocks.push(block);
      //   if(!isBold){
      //     setBoldArr(prev=> [...prev, block.key])
      //   }
      //   isModfied = true;
      // }
      // if(isTextRed || block.text.startsWith('** ')){
      //   console.log('inside ** red')
      //   block.text = block.text.startsWith('** ') ? block.text.substring(3) : block.text // Remove '** ' from the text
      //   block.inlineStyleRanges = [...block.inlineStyleRanges, { offset: 0, length: block.text.length, style: 'COLOR_RED' }];
      //   if(!isTextRed){
      //     setTextRedArr(prev=> [...prev, block.key])
      //   }
      //   newBlocks.push(block)
      //   isModfied = true;
      // }
      // if(isUnderline || block.text.startsWith('*** ')){
      //   block.text = block.text.startsWith('*** ') ? block.text.substring(4) : block.text // Remove '*** ' from the text
      //   block.inlineStyleRanges = [...block.inlineStyleRanges, { offset: 0, length: block.text.length, style: 'UNDERLINE' }];
      //   if(!isUnderline){
      //     setTextUnderlineArr(prev=> [...prev, block.key])
      //   }
      //   newBlocks.push(block)
      //   isModfied = true;
      // }
      // if(block.text.startsWith(' ')){
      //   block.type = 'unstyled'  
      //   block.inlineStyleRanges = [];
      //   block.text = ''
      //   newBlocks.push(block)
      //   setBoldArr(prev=> prev.filter(key=> key !== block.key))
      //   setTextUnderlineArr(prev=> prev.filter(key=> key !== block.key))
      //   setTextRedArr(prev=> prev.filter(key=> key !== block.key))
      //   isModfied = true;
      // }
      
      // if(!isModfied){
      //   block.type = 'unstyled'  
      //   block.inlineStyleRanges = [];
      //   newBlocks.push(block)
      //   setBoldArr(prev=> prev.filter(key=> key !== block.key))
      //   setTextUnderlineArr(prev=> prev.filter(key=> key !== block.key))
      //   setTextRedArr(prev=> prev.filter(key=> key !== block.key))
        
      // }

      if( block.text === ''){
        if(!isHeaderOne){
          block.type ='unstyled'
        }
        if(!isBold){
          block.inlineStyleRanges = block.inlineStyleRanges.filter(obj=> obj.style !== 'BOLD')
        }
        if(!isTextRed){
          block.inlineStyleRanges = block.inlineStyleRanges.filter(obj=> obj.style !== 'COLOR_RED')
        }
        if(!isUnderline){
          block.inlineStyleRanges = block.inlineStyleRanges.filter(obj=> obj.style !== 'UNDERLINE')
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
        block.text = block.text.substring(2); // Remove '# ' from the text
        newBlocks.push(block);
      }else if(block.text.startsWith('* ')|| boldArr.includes(block.key)){ 
        if(!boldArr.includes(block.key)){ 
          setBoldArr(prev=> [...prev, block.key])
        }
        block.inlineStyleRanges = [...block.inlineStyleRanges, { offset: 0, length: block.text.length, style: 'BOLD' }];
        block.text = block.text.startsWith('* ') ? block.text.substring(2) : block.text // Remove '* ' from the text
        newBlocks.push(block);
      }else if(block.text.startsWith('** ')|| textRedArr.includes(block.key)){ 
        if(!textRedArr.includes(block.key)){ 
          setTextRedArr(prev=> [...prev, block.key])
        }
        block.inlineStyleRanges = [...block.inlineStyleRanges, { offset: 0, length: block.text.length, style: 'COLOR_RED' }];
        block.text = block.text.startsWith('** ') ? block.text.substring(3) : block.text // Remove '* ' from the text
        newBlocks.push(block);
      }else if(block.text.startsWith('*** ')|| textUnderlineArr.includes(block.key)){ 
        if(!textUnderlineArr.includes(block.key)){ 
          setTextUnderlineArr(prev=> [...prev, block.key])
        }
        block.inlineStyleRanges = [...block.inlineStyleRanges, { offset: 0, length: block.text.length, style: 'UNDERLINE' }];
        block.text = block.text.startsWith('*** ') ? block.text.substring(4) : block.text // Remove '* ' from the text
        newBlocks.push(block);
      }
      // else if(block.text !== '' && (headerOneArr.length !== 0 || textUnderlineArr.length !== 0 || textRedArr.length !== 0  || boldArr.length !== 0 ) ){
      //   console.log('indide  thadsfjkl ajfdslkda')
      //   newBlocks.push(block) 
      // }
      else{
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
  

 

    

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
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
  

  const handleButtonClick = () => {
    saveEditorContent();
  };
  const saveEditorContent = () => {
    const contentState = editorState.getCurrentContent();
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
      // console.log(headerOneArr, ' ',boldArr, ' ', textRedArr, ' ', textUnderlineArr)
    }
  }, []);


  // useEffect(() => { 
  //   const storedContent = localStorage.getItem('draftContent');
  //   if (storedContent) {
  //     try {
  //       const parsedContent = JSON.parse(storedContent);
  //       const currentContent = editorState.getCurrentContent();
  //       console.log(parsedContent.blocks)
  //       const newBlocks = parsedContent.blocks.forEach(block=>{
  //         return block
  //       })

  //       setHeaderOneArr(JSON.parse(localStorage.getItem('draftContentHeaderArr')))
  //       setTextUnderlineArr(JSON.parse(localStorage.getItem('draftContentTextUnderlineArr')))
  //       setTextRedArr(JSON.parse(localStorage.getItem('draftContentTextRedArr')))
  //       setBoldArr(JSON.parse(localStorage.getItem('draftContentTextBoldArr')))


  //       const newRawContent = { ...convertToRaw(currentContent), blocks: newBlocks };
  //       const newContentState = convertFromRaw(newRawContent);
  //       const newEditorState = EditorState.push(editorState, newContentState, 'change-block');
  //       const selectionState = editorState.getSelection();
  //       const newEditorStateWithHandleCursor = EditorState.forceSelection(newEditorState, selectionState);
  //       setEditorState(newEditorStateWithHandleCursor);
  
  //     } catch (error) {
  //       console.error('Error parsing stored content:', error);
  //     }
  //   }
  // }, []);

  useEffect(()=>{
    const currentContent = editorState.getCurrentContent();
    const blocks = convertToRaw(currentContent).blocks;
    // console.log(blocks,'new rendered')
    // console.log(headerOneArr, ' ',boldArr, ' ', textRedArr, ' ', textUnderlineArr)

  },[editorState])


  return (
    <div className="border w-full p-4">
      <button className="border px-2 rounded" onClick={handleButtonClick}>CHECK</button>
      <Editor
        editorState={editorState}
        onChange={handleEditorState}
        handleKeyCommand={handleKeyCommand}
        customStyleMap={{ 'COLOR_RED': {color: 'red'} }}
      />
    </div>
  );
};

export default CustomEditor;

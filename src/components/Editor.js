import React from 'react'
import {Editor, EditorState, convertToRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';

const CustomEditor = () => {

    const [editorState, setEditorState] = React.useState(
      () => EditorState.createEmpty(),
    );
    const handleEditorState = (editorState)=>{
        setEditorState(editorState);
    }


  return (
    <div className='border w-full p-4'>
        <Editor editorState={editorState} onChange={handleEditorState} />
    </div>
  )
}

export default CustomEditor
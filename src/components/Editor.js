import React, { useEffect, useState } from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";


const CustomEditor = () => {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const [headerOneArr, setHeaderOneArr] = useState([]);
  const [boldArr, setBoldArr] = useState([]);
  const [textRedArr, setTextRedArr] = useState([]);
  const [textUnderlineArr, setTextUnderlineArr] = useState([]);

  //handle editor changes
  const handleEditorState = (editorState) => {
    //get current content of the editor
    const currentContent = editorState.getCurrentContent();
    //conver to blocks
    const blocks = convertToRaw(currentContent).blocks;
    const newBlocks = [];
    //loop through each of the blocks
    blocks.forEach((block) => {
      const isHeaderOne = headerOneArr.includes(block.key);
      const isBold = boldArr.includes(block.key);
      const isUnderline = textUnderlineArr.includes(block.key);
      const isTextRed = textRedArr.includes(block.key);
      //if the text inside the block is empty
      if (block.text === "") {
        block.inlineStyleRanges = [];
        block.type = "unstyled";
        setHeaderOneArr((prev) => prev.filter((prev) => prev !== block.key));
        setTextUnderlineArr((prev) => prev.filter((prev) => prev !== block.key));
        setTextRedArr((prev) => prev.filter((prev) => prev !== block.key));
        setBoldArr((prev) => prev.filter((prev) => prev !== block.key));
        // if text is empty and already header
        if (isHeaderOne) {
          block.type = "header-one";
          setHeaderOneArr((prev) => [...prev, block.key]);
        }
        //if text is empty and already bold
        if (isBold) {
          block.inlineStyleRanges = [
            { offset: 0, length: block.text.length, style: "BOLD" },
          ];
          setBoldArr((prev) => [...prev, block.key]);
        }
        //if text is empty and already red text
        if (isTextRed) {
          setTextRedArr((prev) => [...prev, block.key]);
          block.inlineStyleRanges = [
            ...block.inlineStyleRanges,
            { offset: 0, length: block.text.length, style: "COLOR_RED" },
          ];
        }
        // if text is empty and already underline
        if (isUnderline) {
          setTextUnderlineArr((prev) => [...prev, block.key]);
          block.inlineStyleRanges = [
            ...block.inlineStyleRanges,
            { offset: 0, length: block.text.length, style: "UNDERLINE" },
          ];
        }
        newBlocks.push(block);
      } else if ( //else if text style is applied and there is a space after that to make it back to normal text
        (isHeaderOne || isBold || isTextRed || isUnderline) &&
        block.text === " "
      ) {
        block.style = "unstyled";
        block.inlineStyleRanges = [];
        block.text = "";
        setHeaderOneArr((prev) => prev.filter((prev) => prev !== block.key));
        setTextUnderlineArr((prev) =>
          prev.filter((prev) => prev !== block.key)
        );
        setTextRedArr((prev) => prev.filter((prev) => prev !== block.key));
        setBoldArr((prev) => prev.filter((prev) => prev !== block.key));
        newBlocks.push(block);
      } else if (isHeaderOne) { //if the text is header then add block style to header one
        block.style = "header-one";
        newBlocks.push(block);
      } else if (block.text.startsWith("# ")) { // if the text starts with '# '
        setHeaderOneArr((prev) => [...prev, block.key]);
        block.type = "header-one";
        block.inlineStyleRanges = [];
        block.text = block.text.substring(2);
        newBlocks.push(block);
      } else if ( // if the text starts with "*** "
        block.text.startsWith("*** ") ||
        textUnderlineArr.includes(block.key)
      ) { 
        if (!textUnderlineArr.includes(block.key)) { //
          setTextUnderlineArr((prev) => [...prev, block.key]);
        }
        block.inlineStyleRanges = [
          { offset: 0, length: block.text.length, style: "UNDERLINE" },
        ];
        block.text = block.text.startsWith("*** ")
          ? block.text.substring(4)
          : block.text; // Remove '* ' from the text
        newBlocks.push(block);
      } else if ( // if the text starts with "** "
        block.text.startsWith("** ") ||
        textRedArr.includes(block.key)
      ) {
        if (!textRedArr.includes(block.key)) {
          setTextRedArr((prev) => [...prev, block.key]);
        }
        block.inlineStyleRanges = [
          { offset: 0, length: block.text.length, style: "COLOR_RED" },
        ];
        block.text = block.text.startsWith("** ")
          ? block.text.substring(3)
          : block.text;
        newBlocks.push(block);
      } else if (block.text.startsWith("* ") || boldArr.includes(block.key)) { // if the text starts with "* "
        if (!boldArr.includes(block.key)) {
          setBoldArr((prev) => [...prev, block.key]);
        }
        block.inlineStyleRanges = [
          { offset: 0, length: block.text.length, style: "BOLD" },
        ];
        block.text = block.text.startsWith("* ")
          ? block.text.substring(2)
          : block.text;
        newBlocks.push(block);
      } else { // if the block is non of this then remove all style if already there
        block.type = "unstyled";
        block.inlineStyleRanges = [];
        newBlocks.push(block);
      }
    });
    // create new raw content 
    const newRawContent = {
      ...convertToRaw(currentContent),
      blocks: newBlocks,
    };
    const newContentState = convertFromRaw(newRawContent);
    // convert it to new editor state
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-block"
    );
    // to handle the cursor jumping here and there
    const selectionState = editorState.getSelection();
    
    // create new editor state along with the handled cursor
    const newEditorStateWithHandleCursor = EditorState.forceSelection(
      newEditorState,
      selectionState
    );
    // update the editor state with new editor state
    setEditorState(newEditorStateWithHandleCursor);
  };

  // to save the content to local storage
  const saveEditorContent = () => {
    const contentState = editorState.getCurrentContent();
    const contentStateJSON = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem("draftContent", contentStateJSON);
    localStorage.setItem("draftContentHeaderArr", JSON.stringify(headerOneArr));
    localStorage.setItem(
      "draftContentTextUnderlineArr",
      JSON.stringify(textUnderlineArr)
    );
    localStorage.setItem("draftContentTextRedArr", JSON.stringify(textRedArr));
    localStorage.setItem("draftContentTextBoldArr", JSON.stringify(boldArr));
  };

  // handle save button
  const handleSaveButton = ()=>{
    saveEditorContent();
  }

  // load saved content from the local storage on load
  useEffect(() => {
    const storedContentStateJSON = localStorage.getItem("draftContent");
    if (storedContentStateJSON) {
      const contentState = convertFromRaw(JSON.parse(storedContentStateJSON));
      const modifiedEditorState = EditorState.createWithContent(contentState);
      const newEditorState = EditorState.push(
        modifiedEditorState,
        contentState,
        "insert-characters"
      );
      const selectionState = editorState.getSelection();
      const newEditorStateWithHandleCursor = EditorState.forceSelection(
        newEditorState,
        selectionState
      );

      setEditorState(newEditorStateWithHandleCursor);

      setHeaderOneArr(
        JSON.parse(localStorage.getItem("draftContentHeaderArr"))
      );
      setTextUnderlineArr(
        JSON.parse(localStorage.getItem("draftContentTextUnderlineArr"))
      );
      setTextRedArr(JSON.parse(localStorage.getItem("draftContentTextRedArr")));
      setBoldArr(JSON.parse(localStorage.getItem("draftContentTextBoldArr")));
    }
  }, []);

  return (
    <>
      <div className="flex justify-between mb-3">
        <h2 className="text-blue-400">portle logo</h2>
        <h2>Demo Editor by Nasikh</h2>
        <button onClick={handleSaveButton} className="border rounded px-4 py-1 hover:bg-black hover:text-white ease-in-out">Save</button>
      </div>
      <div className="border border-blue-500 w-full h-[70vh] p-4">
        <Editor
          placeholder="type here..."
          editorState={editorState}
          onChange={handleEditorState}
          customStyleMap={{ COLOR_RED: { color: "red" } }}
        />
      </div>
    </>
  );
};

export default CustomEditor;

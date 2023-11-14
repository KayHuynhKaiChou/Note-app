import { useEffect, useMemo, useState } from "react"
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from "draftjs-to-html"
import { useLoaderData, useLocation, useSubmit } from "react-router-dom"
import { debounce } from "@mui/material"

export default function Note() {
  const {note} = useLoaderData();
  const submit = useSubmit();
  const location = useLocation();
  const [editorState , setEditorState] = useState(() => {
    return EditorState.createEmpty(); //trả về một đối tượng EditorState đại diện cho một trình soạn thảo văn bản rỗng. 
  });
  const [rawHTML , setRawHTML] = useState(note.content);
  //rawHTML sẽ save data đã đc convert từ rich-text editor (chữ đen trong word á) thành html

  // useEffect này đc use để convert từ HTML sang rich text deitor và hiển thị nó lên trình soạn thỏa VB
  useEffect(() => {
    const blocksFromHTML = convertFromHTML(note.content);
    const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
    )
    setEditorState(EditorState.createWithContent(state))
  },[note.id])

  //use debounce để gửi data tới server với data này đc return sau 1 giây
  // nếu ko use debounce thì cứ gõ 1 kí tự là kí tự đó đc send tới server
  useEffect(() => {
    console.log('debounced');
    debouncedMemorized(rawHTML, note, location.pathname);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawHTML, location.pathname]);

  const debouncedMemorized = useMemo(() => {
    return debounce((rawHTML, note, pathname) => {
      if (rawHTML === note.content) return;

      submit({...note, content: rawHTML}, {
        method: 'post',
        action: pathname
      })
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    setRawHTML(note.content);
  },[note.content])

  const handleOnChange = (e) => {
    setEditorState(e);
    setRawHTML(draftToHtml(convertToRaw(e.getCurrentContent())))
  }

  return (
    <Editor
        editorState={editorState}
        onEditorStateChange={handleOnChange}
        placeholder="Write something..."
    />
  )
}

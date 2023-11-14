import { graphQL_Request } from "./request";

export const notesLoader = async ({params : {folderId}}) => {
    const query = `
        query Folder($folderId: String!) {
            folder(folderId: $folderId) {
                id
                name
                notes {
                    id
                    content
                    updatedAt
                }
            }
        }
    `

    const data = await graphQL_Request({
        query,
        variables : {
            folderId,
        } 
    })
    return data;    

    // const res = await fetch('http://localhost:4000/graphql',{
    //     method: 'POST',
    //     headers: {
    //         'Content-type' : 'application/json',
    //         Accept: 'application/json',
    //         Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    //     },
    //     body: JSON.stringify({
    //         query,
    //         variables : {
    //             folderId,
    //         } 
    //     })
    // })

    // const {data} = await res.json();
    // return data
}

export const noteLoader = async ({params : {noteId}}) => {
    const query = `
        query Note($noteId: String) {
            note(noteId: $noteId) {
                id
                content
            }
        }
    `
    const data = await graphQL_Request({
        query,
        variables : {
            noteId,
        } 
    })
    return data;

    // const res = await fetch('http://localhost:4000/graphql',{
    //     method: 'POST',
    //     headers: {
    //         'Content-type' : 'application/json',
    //         Accept: 'application/json',
    //         Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    //     },
    //     body: JSON.stringify({
    //         query,
    //         variables : {
    //             noteId,
    //         } 
    //     })
    // })

    // const {data} = await res.json();
    // return data
    
}

// eslint-disable-next-line no-unused-vars
export const addNewNote = async ({params , request}) => {
    const newNote = await request.formData(); // nó sẽ là 1 form gồm 2 field là content và folderId ở bên NoteList.jsx
    const formDataObj = {}; 
    newNote.forEach((value,key) => {
        formDataObj[key] = value;
    })

    console.log('NewNote: ',newNote); console.log('formDataObj: ',formDataObj);

    const query = `
        mutation addNewNote($content : String, $folderId : ID!){
            addNote(content: $content, folderId: $folderId) {
                id
                content
            }
        }
    `;

    const {addNote} = await graphQL_Request({
        query,
        variables: formDataObj
    })
    console.log(addNote)
    return addNote;
}

export const updateNote = async({params ,request}) => {
    const updatedNote = await request.formData();
    const formDataObj = {};
    updatedNote.forEach((value,key) => {
        formDataObj[key] = value;
    })

    const query = `
        mutation updateNote($id: String! , $content: String!){
            updateNote(id : $id, content: $content){
                id
                content
            }
        }
    `

    const {updateNote} = await graphQL_Request({
        query,
        variables: formDataObj
    })

    return updateNote
}
export const typeDefs = `#graphql
    scalar Date

    type Folder {
        id : String!,
        name : String,
        createdAt : String,
        author : Author,
        notes : [Note] 
    }

    type Note {
        id : String!,
        content : String,
        updatedAt : Date
    }

    type Author {
        uid : String!,
        name : String
    }

    type Query {
        folders: [Folder],
        folder(folderId : String!) : Folder,
        note(noteId : String) : Note
    }

    type Mutation {
        addFolder(name: String!): Folder,
        addNote(content: String, folderId: ID!): Note,
        updateNote(id: String!, content: String!): Note,
        register(uid: String!, name: String!): Author,
        pushNotification(content: String): Message
    }

    type Message {
        message : String
    }

    type Subscription {
        folderCreated: Message,
        notification: Message
    }
`
// '!' trong name: String! nghĩa là field name là bắt buộc
//type Query : hoạt động cho ~ query từ client mà muốn truy vấn data
//type Mutation : đc use để update , add , delete data
//type Subcription : hoạt động phía client , we update theo kiểu real time hay 1 data thay đổi trong server thì client cx auto change

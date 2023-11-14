import { FolderModel , NoteModel , AuthorModel, NotificationModel } from '../models/index.js';
import {GraphQLScalarType} from 'graphql'
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
// handle và return data cho client theo ~ query mà client send to server    
// args là 1 object gồm những data của client send tới server
export const resolvers = {
    Date: new GraphQLScalarType({
        name : 'Date',
        parseValue(value){ // value sẽ được parse và return về client
            return new Date(value);
        },
        serialize(value){
            return value.toISOString();
        }
    }),
    Query : {
        folders : async (parent,args,context) => await FolderModel.find({ authorId: context.uid}).sort({ updatedAt: 'desc' }),
        folder : async (parent,args) => await FolderModel.findOne({ _id: args.folderId }),
        note : async (parent,args) => await NoteModel.findById(args.noteId)
    },
    // Vì trên chỗ typeRef thì author : Author mà trong index.js của fakeData thì là authorId : 123
    // do đó GraphQL nó mapping ko đc vì author # authorId nên ta hướng dẫn cách graphQL mapping field này
    Folder : {
        //parent chính là folder trong folders 
        author : async (parent,args) => {
            const author = await AuthorModel.findOne({ uid: parent.authorId })
            return author
        },
        notes : async (parent,args) => { // parent sẽ là Folder theo schema của mongoDB
            return await NoteModel.find({ folderId: parent.id }).sort({ updatedAt: 'desc'}) //parent.id là _id của folder
        }
    },
    Mutation : {
        addNote: async (parent, args) => {
            const newNote = new NoteModel(args);
            await newNote.save();
            return newNote;
        },
        updateNote: async (parent, args) => {
            const noteId = args.id;
            const note = await NoteModel.findByIdAndUpdate(noteId, args);
            return note;
        },
        addFolder: async (parent, args , context) => {
            console.log(parent, args)
            const newFolder = new FolderModel({...args, authorId: context.uid});
            pubsub.publish('FOLDER_CREATED',{
                folderCreated:{
                    message: 'A new folder has created'
                }
            })
            await newFolder.save();
            return newFolder
        },
        register: async (parent,args) => {
            const foundUser = await AuthorModel.findOne({ uid: args.uid })
            if(!foundUser){ // true = chưa có account , false = đã có account
                const newUser = new AuthorModel(args);
                await newUser.save();
                return newUser;
            }

            return foundUser;
        },
        pushNotification : async (parent, args) => {
            const newNotification = new NotificationModel(args);

            pubsub.publish('PUSH_NOTIFICATION', {
                notification: {
                    message: args.content,
                },
            });

            await newNotification.save();
            return { message: 'SUCCESS'}
        }
    },
    Subscription: {
        folderCreated:{
            subscribe: () => pubsub.asyncIterator(['FOLDER_CREATED','NOTE_CREATED'])
        },
        notification: {
            subscribe: () => pubsub.asyncIterator(['PUSH_NOTIFICATION'])
        }
    }
};
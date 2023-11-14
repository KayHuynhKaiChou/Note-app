import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import {expressMiddleware} from '@apollo/server/express4'
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config.js'
import './firebaseConfig.js'
import {resolvers} from './resolvers/index.js';
import {typeDefs} from './schemas/index.js'
import { getAuth } from 'firebase-admin/auth'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const app = express();
const httpServer = http.createServer(app);

//Connect to mongoDB
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.edmwjsy.mongodb.net/?retryWrites=true&w=majority`
const port = process.env.PORT || 4000

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Creating the WebSocket server
const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql',
});
  
  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
    // typeDefs,
    // resolvers,
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ]
})

await server.start();

const authorizationJWT = (req,res,next) => {
    console.log('authorization: ', req.headers.authorization);
    const authorizationHeader = req.headers.authorization

    if(authorizationHeader){
        const accessToken = authorizationHeader.split(' ')[1];
        
        getAuth().verifyIdToken(accessToken)
            .then(decodedToken => {
                console.log('kkkkkkkkkkk',decodedToken);
                res.locals.uid = decodedToken.uid; //(1)
                next();
            })
            .catch((err) => {
                return res.status(403).json({message:'Forbidden',error:err})
            })
    }else{
        //return res.status(403).json({message:'Unauthorized'});     
        next();
    }

}

// bất kì request hay response đều phải đi qua 4 midderware như dưới 
app.use(cors(), authorizationJWT ,bodyParser.json() , expressMiddleware(server,{
    context: async ({req,res}) => {
        return {uid : res.locals.uid} // Lấy từ (1) , sau đó truyền qua resolvers thông qua đối số context ở bên đó
    }
}))

mongoose.set('strictQuery', false);
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to DB');
    await new Promise((resolve) => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}`);
});

